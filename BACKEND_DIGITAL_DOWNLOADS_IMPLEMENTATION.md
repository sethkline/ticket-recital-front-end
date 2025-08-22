# Strapi Backend Implementation for Digital Downloads

## Overview
This guide outlines the complete backend implementation for handling digital downloads using Backblaze B2 storage with signed URLs for secure, time-limited access.

## Current Status (Updated: Aug 19, 2025)
- ✅ B2 bucket organized with proper folder structure
- ✅ All 38 dance videos uploaded and organized
- ✅ High quality full recital uploaded (3.4GB)
- ✅ Standard quality full recital uploaded (1.9GB)
- ✅ Video metadata configuration created with actual files
- ✅ Frontend updated to handle quality selection

## 1. Install Required Dependencies

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner crypto
```

Note: Backblaze B2 is S3-compatible, so we use AWS SDK with B2 endpoints.

## 2. Environment Variables (.env)

Add these to your Strapi backend `.env` file:

```env
# Backblaze B2 Configuration
B2_KEY_ID=your_key_id_here
B2_APPLICATION_KEY=your_application_key_here
B2_BUCKET_NAME=reverence-2025-recital
B2_REGION=us-west-002  # Check your B2 bucket details
B2_ENDPOINT=https://s3.us-west-002.backblazeb2.com

# Signed URL Configuration
SIGNED_URL_EXPIRY=86400  # 24 hours in seconds
```

## 3. Create Backblaze B2 Service

Create `src/api/services/backblaze-b2.js`:

```javascript
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

class BackblazeB2Service {
  constructor() {
    this.client = new S3Client({
      endpoint: process.env.B2_ENDPOINT,
      region: process.env.B2_REGION,
      credentials: {
        accessKeyId: process.env.B2_KEY_ID,
        secretAccessKey: process.env.B2_APPLICATION_KEY,
      },
    });
    
    this.bucketName = process.env.B2_BUCKET_NAME;
    this.urlExpiry = parseInt(process.env.SIGNED_URL_EXPIRY) || 86400;
  }

  /**
   * Generate a signed URL for a video file
   * @param {string} filePath - Path to file in B2 (e.g., 'recital-2025/full-recital.mp4')
   * @param {number} expirySeconds - Optional custom expiry time
   * @returns {Promise<string>} Signed URL
   */
  async getSignedUrl(filePath, expirySeconds = null) {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: filePath,
      });

      const url = await getSignedUrl(this.client, command, {
        expiresIn: expirySeconds || this.urlExpiry,
      });

      return url;
    } catch (error) {
      console.error('Error generating signed URL:', error);
      throw new Error('Failed to generate download link');
    }
  }

  /**
   * Generate signed URLs for multiple files
   * @param {Array<string>} filePaths - Array of file paths
   * @returns {Promise<Object>} Map of filePath to signed URL
   */
  async getMultipleSignedUrls(filePaths) {
    const urls = {};
    
    for (const path of filePaths) {
      try {
        urls[path] = await this.getSignedUrl(path);
      } catch (error) {
        console.error(`Failed to generate URL for ${path}:`, error);
        urls[path] = null;
      }
    }
    
    return urls;
  }
}

module.exports = new BackblazeB2Service();
```

## 4. Video Metadata Configuration

Create `src/api/config/video-metadata.js`:

**Note:** Use the complete configuration from `config/video-metadata.js` in the frontend repo, which contains all 38 dances with proper titles and categories.

```javascript
// Copy the full file from frontend/config/video-metadata.js
// This is a simplified version showing the structure:

module.exports = {
  recital2025: {
    // Full recital videos with quality options
    fullRecital: {
      highQuality: {
        title: "Full Recital 2025 - High Quality",
        filePath: "recital-2025/full/recital_2025_hq.mp4",
        quality: "1080p",
        fileSize: "3.4GB",
        duration: "2:30:00"
      },
      standardQuality: {
        title: "Full Recital 2025 - Standard Quality",
        filePath: "recital-2025/full/recital_2025_standard.mp4",
        quality: "720p",
        fileSize: "1.9GB",
        duration: "2:30:00"
      }
    },
    
    // Individual dance performances (38 total)
    dances: [
      {
        id: 1,
        title: "Princess Jasmine",
        category: "Acro 1",
        filePath: "recital-2025/dances/acro-1__princess-jasmine.mp4",
        fileSize: "113.5MB",
        performers: "Acro Level 1",
        order: 1
      },
      // ... See frontend/config/video-metadata.js for all 38 dances
    ]
  }
};
```

## 5. Update Order Controller

Add these methods to your existing order controller (`src/api/order/controllers/order.js`):

```javascript
const b2Service = require('../../services/backblaze-b2');
const videoMetadata = require('../../config/video-metadata');

module.exports = {
  // ... existing controller methods ...

  /**
   * Validate access code and return video URLs
   */
  async validateAccessCode(ctx) {
    try {
      const { accessCode } = ctx.request.body;
      
      if (!accessCode) {
        return ctx.badRequest('Access code is required');
      }

      // Find order with this access code
      const order = await strapi.entityService.findMany('api::order.order', {
        filters: { 
          accessCode: accessCode,
          hasDigital: true 
        },
        populate: ['user'],
      });

      if (!order || order.length === 0) {
        return ctx.unauthorized('Invalid access code');
      }

      const validOrder = order[0];

      // Check if order is fulfilled
      if (validOrder.mediaStatus !== 'fulfilled') {
        return ctx.badRequest('Your digital download is not yet available');
      }

      // Log access attempt
      await strapi.entityService.create('api::access-log.access-log', {
        data: {
          order: validOrder.id,
          accessedAt: new Date(),
          ipAddress: ctx.request.ip,
        },
      });

      return ctx.send({
        valid: true,
        orderId: validOrder.id,
        purchaseDate: validOrder.orderDate,
        recitalType: validOrder.recitalType || 'full',
      });
    } catch (error) {
      console.error('Error validating access code:', error);
      return ctx.internalServerError('Failed to validate access code');
    }
  },

  /**
   * Get signed URLs for video downloads
   */
  async getVideoUrls(ctx) {
    try {
      const { accessCode, videoType = 'full' } = ctx.request.body;
      
      // Validate access code first
      const validation = await this.validateAccessCode(ctx);
      if (!validation.valid) {
        return validation;
      }

      const videos = videoMetadata.recital2025;
      let urlsToGenerate = [];
      let responseData = {};

      if (videoType === 'full') {
        // Generate URLs for both quality options
        const hqUrl = await b2Service.getSignedUrl(
          videos.fullRecital.highQuality.filePath,
          86400 // 24 hour expiry
        );
        const standardUrl = await b2Service.getSignedUrl(
          videos.fullRecital.standardQuality.filePath,
          86400 // 24 hour expiry
        );
        
        responseData = {
          type: 'full',
          fullRecital: {
            highQuality: {
              ...videos.fullRecital.highQuality,
              downloadUrl: hqUrl,
            },
            standardQuality: {
              ...videos.fullRecital.standardQuality,
              downloadUrl: standardUrl,
            },
            expiresAt: new Date(Date.now() + 86400 * 1000).toISOString(),
          }
        };
      } else if (videoType === 'individual') {
        // Generate URLs for all individual dances
        const danceUrls = await Promise.all(
          videos.dances.map(async (dance) => {
            const url = await b2Service.getSignedUrl(
              dance.filePath,
              86400 // 24 hour expiry
            );
            
            return {
              ...dance,
              downloadUrl: url,
            };
          })
        );

        responseData = {
          type: 'individual',
          videos: danceUrls,
          expiresAt: new Date(Date.now() + 86400 * 1000).toISOString(),
        };
      } else if (videoType === 'both') {
        // Generate URLs for everything
        const hqUrl = await b2Service.getSignedUrl(
          videos.fullRecital.highQuality.filePath,
          86400
        );
        const standardUrl = await b2Service.getSignedUrl(
          videos.fullRecital.standardQuality.filePath,
          86400
        );

        const danceUrls = await Promise.all(
          videos.dances.map(async (dance) => {
            const url = await b2Service.getSignedUrl(
              dance.filePath,
              86400
            );
            
            return {
              ...dance,
              downloadUrl: url,
            };
          })
        );

        responseData = {
          type: 'both',
          fullRecital: {
            highQuality: {
              ...videos.fullRecital.highQuality,
              downloadUrl: hqUrl,
            },
            standardQuality: {
              ...videos.fullRecital.standardQuality,
              downloadUrl: standardUrl,
            }
          },
          individualDances: danceUrls,
          expiresAt: new Date(Date.now() + 86400 * 1000).toISOString(),
        };
      }

      return ctx.send(responseData);
    } catch (error) {
      console.error('Error generating video URLs:', error);
      return ctx.internalServerError('Failed to generate download links');
    }
  },

  /**
   * Get download history for an order
   */
  async getDownloadHistory(ctx) {
    try {
      const { accessCode } = ctx.params;
      
      // Find order
      const order = await strapi.entityService.findMany('api::order.order', {
        filters: { accessCode },
        populate: ['accessLogs'],
      });

      if (!order || order.length === 0) {
        return ctx.notFound('Order not found');
      }

      const accessLogs = await strapi.entityService.findMany('api::access-log.access-log', {
        filters: { order: order[0].id },
        sort: { accessedAt: 'desc' },
        limit: 50,
      });

      return ctx.send({
        orderId: order[0].id,
        totalAccesses: accessLogs.length,
        recentAccesses: accessLogs.slice(0, 10),
      });
    } catch (error) {
      console.error('Error fetching download history:', error);
      return ctx.internalServerError('Failed to fetch download history');
    }
  },

  /**
   * Admin: Generate access codes for fulfilled orders
   */
  async generateAccessCodes(ctx) {
    try {
      // Check admin permission
      if (!ctx.state.user || ctx.state.user.role.type !== 'admin') {
        return ctx.forbidden('Admin access required');
      }

      // Find all digital orders without access codes
      const orders = await strapi.entityService.findMany('api::order.order', {
        filters: {
          hasDigital: true,
          accessCode: null,
          mediaStatus: 'fulfilled',
        },
      });

      const updatedOrders = [];

      for (const order of orders) {
        const accessCode = this.generateUniqueAccessCode();
        
        await strapi.entityService.update('api::order.order', order.id, {
          data: { accessCode },
        });

        updatedOrders.push({
          orderId: order.id,
          accessCode,
        });

        // Send email to customer with access code
        if (order.user?.email) {
          await strapi.plugins['email'].services.email.send({
            to: order.user.email,
            subject: 'Your Digital Download is Ready!',
            html: `
              <h2>Your Recital Recording is Available</h2>
              <p>Thank you for your purchase! Your digital download is now ready.</p>
              <p><strong>Access Code:</strong> ${accessCode}</p>
              <p>Visit <a href="${process.env.FRONTEND_URL}/watch-recital">our viewing page</a> and enter your access code to watch or download the recital.</p>
              <p>This access code will remain valid until December 31, 2025.</p>
              <p>If you have any issues, please contact support@reverencestudios.com</p>
            `,
          });
        }
      }

      return ctx.send({
        message: `Generated ${updatedOrders.length} access codes`,
        orders: updatedOrders,
      });
    } catch (error) {
      console.error('Error generating access codes:', error);
      return ctx.internalServerError('Failed to generate access codes');
    }
  },

  /**
   * Helper: Generate unique access code
   */
  generateUniqueAccessCode() {
    const year = new Date().getFullYear();
    const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
    const numberPart = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `DVL-${year}-${randomPart}${numberPart}`;
  },
};
```

## 6. Update Routes

Add these routes to `src/api/order/routes/order.js`:

```javascript
module.exports = {
  routes: [
    // ... existing routes ...
    
    {
      method: 'POST',
      path: '/orders/validate-access-code',
      handler: 'order.validateAccessCode',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/orders/get-video-urls',
      handler: 'order.getVideoUrls',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/orders/download-history/:accessCode',
      handler: 'order.getDownloadHistory',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/orders/admin/generate-access-codes',
      handler: 'order.generateAccessCodes',
      config: {
        policies: ['admin::isAdmin'],
        middlewares: [],
      },
    },
  ],
};
```

## 7. Create Access Log Content Type

Create a new content type for tracking access:

### Via Strapi Admin:
1. Go to Content-Type Builder
2. Create new collection type "AccessLog"
3. Add fields:
   - `order` (Relation to Order)
   - `accessedAt` (DateTime)
   - `ipAddress` (Text)
   - `videoAccessed` (Text, optional)

### Or via code (`src/api/access-log/content-types/access-log/schema.json`):

```json
{
  "kind": "collectionType",
  "collectionName": "access_logs",
  "info": {
    "singularName": "access-log",
    "pluralName": "access-logs",
    "displayName": "Access Log",
    "description": "Track digital download access"
  },
  "options": {
    "draftAndPublish": false
  },
  "attributes": {
    "order": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::order.order"
    },
    "accessedAt": {
      "type": "datetime",
      "required": true
    },
    "ipAddress": {
      "type": "string"
    },
    "videoAccessed": {
      "type": "string"
    }
  }
}
```

## 8. Update Order Model

Add these fields to your Order content type:

```json
{
  "accessCode": {
    "type": "string",
    "unique": true
  },
  "mediaStatus": {
    "type": "enumeration",
    "enum": ["pending", "processing", "fulfilled", "cancelled"],
    "default": "pending"
  },
  "hasDigital": {
    "type": "boolean",
    "default": false
  },
  "digitalDownloadCount": {
    "type": "integer",
    "default": 0
  },
  "recitalType": {
    "type": "enumeration",
    "enum": ["morning", "afternoon", "both"],
    "default": "both"
  }
}
```

## 9. Admin Panel Features

Create an admin component to manage digital downloads:

```javascript
// src/api/admin/controllers/digital-downloads.js

module.exports = {
  async overview(ctx) {
    try {
      const stats = await strapi.db.query('api::order.order').count({
        where: { hasDigital: true }
      });

      const pending = await strapi.db.query('api::order.order').count({
        where: { 
          hasDigital: true,
          mediaStatus: 'pending'
        }
      });

      const fulfilled = await strapi.db.query('api::order.order').count({
        where: { 
          hasDigital: true,
          mediaStatus: 'fulfilled'
        }
      });

      return ctx.send({
        total: stats,
        pending,
        fulfilled,
        needsAccessCode: await strapi.db.query('api::order.order').count({
          where: {
            hasDigital: true,
            accessCode: null,
            mediaStatus: 'fulfilled'
          }
        })
      });
    } catch (error) {
      return ctx.internalServerError('Failed to fetch overview');
    }
  },

  async markAsFulfilled(ctx) {
    try {
      const { orderIds } = ctx.request.body;
      
      const updatedOrders = [];
      
      for (const orderId of orderIds) {
        const accessCode = this.generateUniqueAccessCode();
        
        const order = await strapi.entityService.update('api::order.order', orderId, {
          data: {
            mediaStatus: 'fulfilled',
            accessCode,
          },
          populate: ['user'],
        });

        updatedOrders.push(order);

        // Send notification email
        if (order.user?.email) {
          await strapi.plugins['email'].services.email.send({
            to: order.user.email,
            subject: 'Your Digital Download is Ready!',
            html: `Your access code is: ${accessCode}`,
          });
        }
      }

      return ctx.send({ 
        message: `Fulfilled ${updatedOrders.length} orders`,
        orders: updatedOrders 
      });
    } catch (error) {
      return ctx.internalServerError('Failed to mark as fulfilled');
    }
  }
};
```

## 10. Security Considerations

1. **Rate Limiting**: Add rate limiting to prevent abuse:
```javascript
// In your middleware
const rateLimit = require('koa-ratelimit');

module.exports = rateLimit({
  driver: 'memory',
  db: new Map(),
  duration: 60000, // 1 minute
  errorMessage: 'Too many requests',
  id: (ctx) => ctx.ip,
  headers: {
    remaining: 'Rate-Limit-Remaining',
    reset: 'Rate-Limit-Reset',
    total: 'Rate-Limit-Total'
  },
  max: 10, // 10 requests per minute per IP
  disableHeader: false,
});
```

2. **Access Code Validation**: Implement retry limits
3. **IP Whitelisting**: Optional - restrict access by geographic location
4. **Watermarking**: Consider adding user-specific watermarks to videos

## 11. Testing Endpoints

```bash
# Test access code validation
curl -X POST http://localhost:1337/api/orders/validate-access-code \
  -H "Content-Type: application/json" \
  -d '{"accessCode":"DVL-2025-TEST1234"}'

# Get video URLs
curl -X POST http://localhost:1337/api/orders/get-video-urls \
  -H "Content-Type: application/json" \
  -d '{"accessCode":"DVL-2025-TEST1234","videoType":"both"}'
```

## 12. Deployment Checklist

- [ ] Set all environment variables in production
- [ ] Upload all video files to Backblaze B2 in correct folder structure
- [ ] Test signed URL generation with actual files
- [ ] Set up email notifications
- [ ] Configure rate limiting
- [ ] Set up monitoring for failed access attempts
- [ ] Create backup access code generation method
- [ ] Document the upload folder structure for future years
- [ ] Set up automated cleanup of old access logs

## File Upload Structure in Backblaze B2

```
reverence-2025-recital/
├── recital-2025/
│   ├── full/
│   │   ├── recital_2025_hq.mp4 (3.4GB)
│   │   └── recital_2025_standard.mp4 (1.9GB)
│   └── dances/
│       ├── acro-1__princess-jasmine.mp4
│       ├── acro-2__live-like-your-loved.mp4
│       ├── acro-3__lift-my-eyes.mp4
│       └── ... (35 more dance files, 38 total)
└── recital-2026/  (for next year)
```

This implementation provides a complete, secure system for handling digital downloads with Backblaze B2 storage.