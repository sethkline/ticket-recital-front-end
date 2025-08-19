#!/bin/bash

# Complete Backblaze B2 Reorganization Script
# This script handles the entire reorganization process using B2 CLI

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BUCKET_NAME="reverence-2025-recital"
YEAR="2025"

echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}Complete B2 File Reorganization${NC}"
echo -e "${BLUE}================================================${NC}"
echo ""

# Step 1: Check if B2 CLI is installed
echo -e "${YELLOW}Step 1: Checking B2 CLI installation...${NC}"
if ! command -v b2 &> /dev/null; then
    echo -e "${RED}B2 CLI is not installed!${NC}"
    echo "Install it with: pip install --upgrade b2"
    exit 1
fi
echo -e "${GREEN}✓ B2 CLI is installed${NC}"
echo ""

# Step 2: Check B2 authentication
echo -e "${YELLOW}Step 2: Checking B2 authentication...${NC}"
if ! b2 get-account-info &> /dev/null; then
    echo -e "${RED}Not authenticated with B2!${NC}"
    echo "Please run: b2 authorize-account"
    echo "You'll need your Key ID and Application Key from Backblaze"
    exit 1
fi
echo -e "${GREEN}✓ Authenticated with B2${NC}"
echo ""

# Step 3: List current files
echo -e "${YELLOW}Step 3: Listing current files in bucket...${NC}"
echo "Fetching file list from ${BUCKET_NAME}..."

# Get all files in the root of the bucket
CURRENT_FILES=$(b2 ls "b2://${BUCKET_NAME}/" | grep -v "recital-2025/" || true)

if [ -z "$CURRENT_FILES" ]; then
    echo -e "${YELLOW}No files found in bucket root. Already organized?${NC}"
    echo "Checking for organized files..."
    b2 ls "b2://${BUCKET_NAME}/recital-2025/" 2>/dev/null | head -10 || echo "No files found"
    exit 0
fi

echo -e "${GREEN}Found files to reorganize:${NC}"
echo "$CURRENT_FILES" | head -5
echo "..."
echo ""

# Step 4: Create the folder structure and copy files
echo -e "${YELLOW}Step 4: Reorganizing files...${NC}"
echo "This will copy files to the new structure, then delete originals."
echo ""
read -p "Continue? (y/n): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Aborted by user"
    exit 1
fi

# Counter for progress
TOTAL=0
SUCCESS=0
FAILED=0

# Function to copy and delete a file
copy_and_move_file() {
    local source_file=$1
    local dest_path=$2
    local file_name=$(basename "$source_file")
    
    echo -n "  Moving $file_name... "
    
    # Copy the file to new location using b2 file server-side-copy
    if b2 file server-side-copy "b2://${BUCKET_NAME}/$source_file" "b2://${BUCKET_NAME}/$dest_path" &>/dev/null; then
        # Delete the original using b2 rm
        if b2 rm "b2://${BUCKET_NAME}/$source_file" &>/dev/null; then
            echo -e "${GREEN}✓${NC}"
            ((SUCCESS++))
        else
            echo -e "${YELLOW}⚠ Copied but couldn't delete original${NC}"
            ((SUCCESS++))
        fi
    else
        echo -e "${RED}✗ Failed${NC}"
        ((FAILED++))
    fi
    ((TOTAL++))
}

echo -e "${BLUE}Moving full recital files...${NC}"
# Check if files exist before trying to move them
if b2 ls "b2://${BUCKET_NAME}/recital_2025_hq.mp4" &>/dev/null; then
    copy_and_move_file "recital_2025_hq.mp4" "recital-${YEAR}/full/recital_2025_hq.mp4"
else
    echo -e "  recital_2025_hq.mp4... ${YELLOW}⚠ Not found${NC}"
fi

if b2 ls "b2://${BUCKET_NAME}/recital_2025_standard.mp4" &>/dev/null; then
    copy_and_move_file "recital_2025_standard.mp4" "recital-${YEAR}/full/recital_2025_standard.mp4"
else
    echo -e "  recital_2025_standard.mp4... ${YELLOW}⚠ Not found (still uploading?)${NC}"
fi

echo ""
echo -e "${BLUE}Moving individual dance videos...${NC}"

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
    # Check if file exists in root before trying to move
    if b2 ls "b2://${BUCKET_NAME}/$file" &>/dev/null; then
        copy_and_move_file "$file" "recital-${YEAR}/dances/$file"
    else
        echo -e "  $file... ${YELLOW}⚠ Already moved or not found${NC}"
    fi
done

echo ""
echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}Reorganization Complete!${NC}"
echo -e "${BLUE}================================================${NC}"
echo ""
echo -e "Processed: ${TOTAL} files"
echo -e "${GREEN}✓ Success: ${SUCCESS} files${NC}"
if [ $FAILED -gt 0 ]; then
    echo -e "${RED}✗ Failed: ${FAILED} files${NC}"
fi

echo ""
echo -e "${YELLOW}Step 5: Verifying new structure...${NC}"
echo "Files in new structure:"
echo ""
echo "Full Recital videos:"
b2 ls "b2://${BUCKET_NAME}/recital-${YEAR}/full/" | head -5
echo ""
echo "Dance videos (first 5):"
b2 ls "b2://${BUCKET_NAME}/recital-${YEAR}/dances/" | head -5
echo "..."

echo ""
echo -e "${GREEN}✨ All done!${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Update your backend .env file with:"
echo "   B2_BUCKET_NAME=${BUCKET_NAME}"
echo "   B2_KEY_ID=your_key_id"
echo "   B2_APPLICATION_KEY=your_application_key"
echo ""
echo "2. Copy the video-metadata.js to your backend"
echo "3. Test with: node scripts/test-b2-access.js"
echo ""