# Backend Setup for Digital Downloads

## Prerequisites

1. **Strapi Backend** - Ensure your Strapi backend is set up and running
2. **Backblaze B2 Account** - Active account with bucket created
3. **Node.js** - Version 14 or higher

## Step 1: Get Your Backblaze B2 Credentials

1. Log into [Backblaze B2 Console](https://secure.backblaze.com/b2_buckets.htm)
2. Navigate to **App Keys** section
3. Create a new Application Key:
   - **Name**: `recital-digital-downloads`
   - **Allow access to bucket**: `reverence-2025-recital`
   - **Type of access**: Read only (for security)
   - **File name prefix**: Leave blank (access all files)
   - **Duration**: No expiration
4. Save the credentials shown:
   - `keyID` → Use as `B2_KEY_ID`
   - `applicationKey` → Use as `B2_APPLICATION_KEY` (shown only once!)

## Step 2: Find Your Bucket Details

1. In B2 Console, click on your bucket name
2. Look for **Endpoint** information:
   - Note the S3-compatible endpoint (e.g., `s3.us-west-002.backblazeb2.com`)
   - Note the region (e.g., `us-west-002`)

## Step 3: Configure Backend Environment

1. Copy the example environment file to your backend:
   ```bash
   cp .env.backend.example ../recital-management-backend/.env
   ```

2. Edit the `.env` file with your credentials:
   ```env
   B2_BUCKET_NAME=reverence-2025-recital
   B2_KEY_ID=your_actual_key_id
   B2_APPLICATION_KEY=your_actual_application_key
   B2_REGION=us-west-002
   B2_ENDPOINT=https://s3.us-west-002.backblazeb2.com
   SIGNED_URL_EXPIRY=86400
   FRONTEND_URL=https://yourdomain.com
   ```

## Step 4: Install Backend Dependencies

In your Strapi backend directory:

```bash
cd ../recital-management-backend
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

## Step 5: Add Backend Code

1. **Create B2 Service**: Copy the B2 service from `BACKEND_DIGITAL_DOWNLOADS_IMPLEMENTATION.md` section 3 to:
   ```
   src/api/services/backblaze-b2.js
   ```

2. **Update Video Metadata**: Copy `config/video-metadata.js` to your backend:
   ```bash
   cp ../recital-management-frontend/config/video-metadata.js src/api/config/
   ```

3. **Update Order Controller**: Add the methods from section 5 of the implementation guide to your order controller

4. **Update Routes**: Add the new routes from section 6 to your order routes file

5. **Create Access Log Content Type**: Follow section 7 to create the access log tracking

## Step 6: Test the Connection

Run the test script to verify everything is working:

```bash
node scripts/test-b2-access.js
```

This should:
- Connect to B2
- List files in your bucket
- Generate a test signed URL
- Confirm the configuration is correct

## Step 7: Database Updates

Ensure your Order model has these fields:
- `accessCode` (String, unique)
- `mediaStatus` (Enum: pending, processing, fulfilled, cancelled)
- `hasDigital` (Boolean)
- `digitalDownloadCount` (Integer)

## Step 8: Restart Strapi

```bash
npm run develop
# or
npm run start
```

## Troubleshooting

### "Access Denied" Error
- Check that your B2 Application Key has read access to the bucket
- Verify the bucket name is correct
- Ensure files exist in the specified paths

### "Invalid Endpoint" Error
- Verify the B2_ENDPOINT matches your bucket's region
- Format should be: `https://s3.{region}.backblazeb2.com`

### "File Not Found" Error
- Ensure files are organized in the correct folder structure
- Run the B2 reorganization script if needed
- Check file paths in `video-metadata.js`

### Signed URLs Not Working
- Check that B2_KEY_ID and B2_APPLICATION_KEY are correct
- Verify the bucket is private (not public)
- Test with a shorter expiry time (e.g., 3600 seconds)

## Security Notes

1. **Never commit `.env` files** to version control
2. **Use read-only keys** for production
3. **Set appropriate CORS policies** on your B2 bucket if needed
4. **Monitor access logs** regularly for unusual activity
5. **Implement rate limiting** to prevent abuse

## Next Steps

1. Test access code generation in admin panel
2. Verify customer can access videos with their code
3. Set up email notifications for access codes
4. Configure monitoring and alerts