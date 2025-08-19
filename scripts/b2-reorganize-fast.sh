#!/bin/bash

# Fast B2 Reorganization - Handles large files separately
# This version skips the large HQ file and focuses on smaller files first

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

BUCKET_NAME="reverence-2025-recital"
YEAR="2025"

echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}Fast B2 File Reorganization${NC}"
echo -e "${BLUE}================================================${NC}"
echo ""

# Dance files to move (excluding already moved ones)
DANCE_FILES=(
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

echo -e "${YELLOW}Moving dance files (smaller files first)...${NC}"
echo "This will be much faster than moving the large recital file."
echo ""

SUCCESS=0
FAILED=0
SKIPPED=0

for file in "${DANCE_FILES[@]}"; do
    # Check if file exists in root
    if b2 ls "b2://${BUCKET_NAME}/$file" &>/dev/null; then
        echo -n "  Moving $file... "
        
        # Copy then delete
        if b2 file server-side-copy "b2://${BUCKET_NAME}/$file" "b2://${BUCKET_NAME}/recital-${YEAR}/dances/$file" &>/dev/null; then
            if b2 rm "b2://${BUCKET_NAME}/$file" &>/dev/null; then
                echo -e "${GREEN}✓${NC}"
                ((SUCCESS++))
            else
                echo -e "${YELLOW}⚠ Copied but couldn't delete${NC}"
                ((SUCCESS++))
            fi
        else
            echo -e "${RED}✗ Failed${NC}"
            ((FAILED++))
        fi
    else
        ((SKIPPED++))
    fi
done

echo ""
echo -e "${BLUE}================================================${NC}"
echo -e "${GREEN}✓ Moved: $SUCCESS files${NC}"
echo -e "${YELLOW}⚠ Skipped: $SKIPPED files (already moved)${NC}"
if [ $FAILED -gt 0 ]; then
    echo -e "${RED}✗ Failed: $FAILED files${NC}"
fi
echo -e "${BLUE}================================================${NC}"

echo ""
echo -e "${YELLOW}For the large recital file (3.4GB), run separately:${NC}"
echo "b2 file server-side-copy \"b2://${BUCKET_NAME}/recital_2025_hq.mp4\" \"b2://${BUCKET_NAME}/recital-${YEAR}/full/recital_2025_hq.mp4\""
echo "b2 rm \"b2://${BUCKET_NAME}/recital_2025_hq.mp4\""
echo ""
echo -e "${GREEN}Once all files are moved, your structure will be:${NC}"
echo "  recital-2025/"
echo "    ├── full/"
echo "    │   └── recital_2025_hq.mp4"
echo "    └── dances/"
echo "        └── [38 dance videos]"