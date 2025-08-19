#!/bin/bash

# Backblaze B2 File Reorganization Script
# This script helps reorganize your recital videos into a proper folder structure

echo "================================================"
echo "Backblaze B2 Recital File Reorganization"
echo "================================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
BUCKET_NAME="reverence-2025-recital"
YEAR="2025"

echo -e "${YELLOW}Prerequisites:${NC}"
echo "1. Install B2 CLI if not already installed:"
echo "   pip install --upgrade b2"
echo ""
echo "2. Authorize B2 CLI with your credentials:"
echo "   b2 authorize-account YOUR_KEY_ID YOUR_APPLICATION_KEY"
echo ""
echo "Press Enter to continue after completing prerequisites..."
read

echo -e "${GREEN}Starting file reorganization...${NC}"
echo ""

# Create the new folder structure
echo "Creating folder structure..."
echo "├── recital-${YEAR}/"
echo "│   ├── full/"
echo "│   └── dances/"
echo ""

# The B2 CLI doesn't require creating empty folders explicitly
# Files are moved with their full paths, which creates folders automatically

echo -e "${YELLOW}Moving files to new structure...${NC}"
echo ""

# Move full recital files
echo "Moving full recital videos..."
b2 copy-file-by-id $(b2 get-file-info ${BUCKET_NAME} recital_2025_hq.mp4 | grep -o 'id: [^ ]*' | cut -d' ' -f2) ${BUCKET_NAME} recital-${YEAR}/full/recital_2025_hq.mp4
b2 copy-file-by-id $(b2 get-file-info ${BUCKET_NAME} recital_2025_standard.mp4 | grep -o 'id: [^ ]*' | cut -d' ' -f2) ${BUCKET_NAME} recital-${YEAR}/full/recital_2025_standard.mp4

echo ""
echo "Moving individual dance videos..."

# List of all dance files
DANCE_FILES=(
    "acro-1__princess-jasmine.mp4"
    "acro-2__live-like-your-loved.mp4"
    "acro-3__lift-my-eyes.mp4"
    "acro-4__strength-and-power.mp4"
    "ballet-2__goodness-of-god.mp4"
    "ballet-3__light-up-the-sky.mp4"
    "ballet-4__now-still-waters.mp4"
    "ballet-5__white-flowers-take-their-bath.mp4"
    "contemporary-2__how-can-you-not.mp4"
    "contemporary-3__lie-down.mp4"
    "contemporary-4__the-mountain-is-you.mp4"
    "edelwise.mp4"
    "graduating-seniors__the-story-ill-tell.mp4"
    "hip-hop__remix.mp4"
    "homeschool-ballet-1__i-will-go-where-you-go.mp4"
    "homeschool-ballet-2__genesis-1.mp4"
    "homeschool-contemporary-2-3__glory-hour.mp4"
    "jazz-2__perfectly-loved.mp4"
    "jazz-3__voices.mp4"
    "monday-pre-primary-ballet__god-of-all-nations.mp4"
    "monday-primary-tap__lifes-a-happy-song.mp4"
    "pointe-1__fire.mp4"
    "pointe-2__swan-lake-act-1.mp4"
    "saturday-am-tap__sesame-street.mp4"
    "saturday-primary-ballet__rainbow-connection.mp4"
    "student-leaders__made-for-this.mp4"
    "tap-2__breakthrough.mp4"
    "tap-3__holding.mp4"
    "tap3__hit-me-up.mp4"
    "theater-dance__revolting-children.mp4"
    "tuesday-am-ballet__holy-holy-holy.mp4"
    "tuesday-tap-1__lollipop.mp4"
    "wedenesday-am-primary-ballet__spoonful-of-sugar.mp4"
    "wednesday-am-acro-jazz__I-got-a-dream.mp4"
    "wednesday-am-primary-ballet__el-shaddai.mp4"
    "wednesday-pre-primary-ballet__beyond.mp4"
    "wednesday-primary-ballet__story-of-the-cross.mp4"
    "worship-dance__abandoned.mp4"
)

# Move each dance file
for file in "${DANCE_FILES[@]}"; do
    echo "  Moving $file..."
    b2 copy-file-by-id $(b2 get-file-info ${BUCKET_NAME} "$file" | grep -o 'id: [^ ]*' | cut -d' ' -f2) ${BUCKET_NAME} "recital-${YEAR}/dances/$file"
done

echo ""
echo -e "${GREEN}File reorganization complete!${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Verify files are in the correct locations using B2 web interface"
echo "2. Delete the original files from the root (after verification)"
echo "   You can do this through the web interface or using:"
echo "   b2 delete-file-version ${BUCKET_NAME} [filename] [fileId]"
echo ""
echo "3. Update your backend .env file with:"
echo "   B2_BUCKET_NAME=${BUCKET_NAME}"
echo "   B2_KEY_ID=your_key_id"
echo "   B2_APPLICATION_KEY=your_application_key"
echo ""

# Alternative: Manual instructions for web interface
echo "================================================"
echo -e "${YELLOW}Alternative: Manual Reorganization via Web Interface${NC}"
echo "================================================"
echo ""
echo "If you prefer using the Backblaze web interface:"
echo ""
echo "1. Log into Backblaze B2 Console"
echo "2. Navigate to your bucket: ${BUCKET_NAME}"
echo "3. Create folders:"
echo "   - Click 'Create Folder' → Name: 'recital-${YEAR}'"
echo "   - Inside 'recital-${YEAR}', create 'full' and 'dances' folders"
echo ""
echo "4. Move files:"
echo "   - Select recital_2025_hq.mp4 and recital_2025_standard.mp4"
echo "   - Move to: recital-${YEAR}/full/"
echo "   - Select all dance videos (everything else)"
echo "   - Move to: recital-${YEAR}/dances/"
echo ""
echo "5. Verify structure looks like:"
echo "   ${BUCKET_NAME}/"
echo "   └── recital-${YEAR}/"
echo "       ├── full/"
echo "       │   ├── recital_2025_hq.mp4"
echo "       │   └── recital_2025_standard.mp4"
echo "       └── dances/"
echo "           ├── acro-1__princess-jasmine.mp4"
echo "           ├── acro-2__live-like-your-loved.mp4"
echo "           └── ... (38 more dance files)"
echo ""