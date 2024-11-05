#!/bin/bash

OUTPUT_FILE="iconMappings.ts"
NC_ROOT_DIR="../.."

# Create a temporary file to hold the new mappings
TEMP_FILE="$(mktemp)"

added_icons=()
added_count=0
skipped_count=0

to_camel_case() {
    local input="$1"
    input="${input%.*}"
    echo "$input" | sed -E 's/-([a-z])/\U\1/g'
}

# Initialize the TypeScript export statement if the output file doesn't exist yet
if [ ! -f "$OUTPUT_FILE" ]; then
	echo "export default {" > "$TEMP_FILE"
fi

# Find all unique icon imports, excluding *.cy.ts files
all_imports=$(grep --exclude="*.cy.ts" -h -RE '@mdi/svg/svg' $NC_ROOT_DIR/apps/{files,files_sharing}/src/ \
	$NC_ROOT_DIR/apps-external/viewer/src | \
    sed -E 's|.*/([^/]+\.svg).*|\1|' | \
    sort | uniq)


# Iterate over each icon import
while IFS= read -r fileName; do
	iconName=$(to_camel_case "$fileName")
    # Check if the icon already exists in the output file
    if [ -f "$OUTPUT_FILE" ]; then
        if grep -q "	$iconName:" "$OUTPUT_FILE"; then
            ((skipped_count++))
            continue
        fi
    fi

    # Append the icon entry to the temporary file
    echo "	$iconName: { file: '$fileName', fa_icon: null }," >> "$TEMP_FILE"
    ((added_count++))
	added_icons+=("$fileName")
done <<< "$all_imports"


# Display summary
echo -e "\n=== Icon import process completed ==="
echo "Skipped Icons: $skipped_count"
if [ ${#added_icons[@]} -gt 0 ]; then
    echo "New Icons added:"
    for added_icon in "${added_icons[@]}"; do
        echo " - $added_icon"
    done
else
    echo "$added_count new icons added."
fi

# Finalize the TypeScript file if the output file doesn't exist yet
if [ ! -f "$OUTPUT_FILE" ]; then
	echo "};" >> "$TEMP_FILE"
fi

# Replace the output file with the temporary file content if it's not empty
if [ -s "$TEMP_FILE" ]; then
	# Add existing mappings to the TEMP_FILE
	if [ -f "$OUTPUT_FILE" ]; then
		# Append existing mappings if they exist
		cat "$OUTPUT_FILE" >> "$TEMP_FILE"
	fi
	# Move the temporary file to the output file
	mv "$TEMP_FILE" "$OUTPUT_FILE"
	echo "Icon mappings have been updated in $OUTPUT_FILE"
else
	# If TEMP_FILE is empty, remove it
	rm "$TEMP_FILE"
	echo "No new icons found. No changes made to $OUTPUT_FILE."
fi
