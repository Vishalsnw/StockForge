#!/bin/bash

TARGET_FILE="$1"

if [ -z "$TARGET_FILE" ]; then
    echo "ERROR: No file path provided"
    exit 1
fi

if [ ! -f "$TARGET_FILE" ]; then
    echo "ERROR: File not found: $TARGET_FILE"
    exit 1
fi

echo "Starting smart fix for: $TARGET_FILE"
echo "UTC Time: 2025-06-12 14:12:58"
echo "User: Vishalsnw"

# Create backup
cp "$TARGET_FILE" "${TARGET_FILE}.backup-$(date +%s)"
echo "Backup created"

echo "BEFORE FIX:"
echo "All currentUser lines:"
grep -n "const currentUser =" "$TARGET_FILE"

# Strategy: Remove only OUR duplicate additions, not original code
# Remove lines that contain our specific patterns

echo "Removing our duplicate additions..."

# Remove commented duplicate lines first
sed -i '/\/\/ REMOVED DUPLICATE:.*const currentUser/d' "$TARGET_FILE"
sed -i '/\/\/ REMOVED DUPLICATE:.*const currentDateTimeUTC/d' "$TARGET_FILE"
sed -i '/\/\/ REMOVED DUPLICATE:.*const currentDate/d' "$TARGET_FILE"
sed -i '/\/\/ REMOVED DUPLICATE:.*const currentTime/d' "$TARGET_FILE"

# Remove our specific duplicate blocks (not original code)
# Look for blocks that contain 'Vishalsnw' specifically

# Method 1: Remove blocks with our timestamp patterns
awk '
BEGIN { in_duplicate_block = 0; block_lines = 0; }

/\/\/ ===== CURRENT INFO \(Updated\) =====/ {
    # Start of potential duplicate block
    in_duplicate_block = 1;
    block_lines = 0;
    block_start = NR;
    next;
}

in_duplicate_block == 1 {
    block_lines++;
    if (/const currentUser = .Vishalsnw.;/ || /const currentDateTimeUTC = .2025-/) {
        # This is our duplicate block, skip it
        if (block_lines >= 4) {
            in_duplicate_block = 0;
        }
        next;
    } else if (block_lines >= 6) {
        # Not our block, print previous lines and continue normally
        in_duplicate_block = 0;
        print;
    } else {
        next;
    }
}

{ print; }
' "$TARGET_FILE" > "${TARGET_FILE}.temp"

mv "${TARGET_FILE}.temp" "$TARGET_FILE"

# Method 2: Remove any remaining standalone duplicates with our patterns
# Remove lines that contain exactly our patterns (not the original CURRENT_USER)
sed -i "/const currentUser = 'Vishalsnw';/d" "$TARGET_FILE"
sed -i "/const currentDateTimeUTC = '2025-/d" "$TARGET_FILE"
sed -i "/const currentDate = '2025-/d" "$TARGET_FILE"
sed -i "/const currentTime = '[0-9][0-9]:[0-9][0-9]:[0-9][0-9]';/d" "$TARGET_FILE"

# Remove empty comment blocks
sed -i '/\/\/ ===== CURRENT INFO (Updated) =====/,+1 {
    /\/\/ ===== CURRENT INFO (Updated) =====/d
    /^[[:space:]]*$/d
}' "$TARGET_FILE"

echo "AFTER FIX:"
echo "All currentUser lines:"
grep -n "const currentUser =" "$TARGET_FILE" || echo "No currentUser lines found"

echo "All currentDateTimeUTC lines:"
grep -n "const currentDateTimeUTC =" "$TARGET_FILE" || echo "No currentDateTimeUTC lines found"

# Final verification
USER_COUNT=$(grep -c "const currentUser =" "$TARGET_FILE" || echo "0")
DATETIME_COUNT=$(grep -c "const currentDateTimeUTC =" "$TARGET_FILE" || echo "0")

echo "FINAL COUNTS:"
echo "currentUser declarations: $USER_COUNT"
echo "currentDateTimeUTC declarations: $DATETIME_COUNT"

# Success criteria: should have exactly 1 currentUser (the original)
if [ $USER_COUNT -eq 1 ]; then
    echo "SUCCESS: Correct number of currentUser declarations"
    echo "Remaining currentUser line:"
    grep -n "const currentUser =" "$TARGET_FILE"
    exit 0
else
    echo "WARNING: Unexpected number of currentUser declarations: $USER_COUNT"
    if [ $USER_COUNT -eq 0 ]; then
        echo "ERROR: Removed original currentUser declaration!"
        exit 1
    else
        echo "INFO: May still have duplicates, but proceeding"
        exit 0
    fi
fi
