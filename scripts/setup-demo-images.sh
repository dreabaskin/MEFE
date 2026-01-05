#!/bin/bash

# Script to help set up demo wardrobe images
# This script will create the directory structure and provide instructions

DEMO_DIR="public/demo-wardrobe"

echo "Setting up demo wardrobe image directory..."

# Ensure directory exists
mkdir -p "$DEMO_DIR"

# List of required images
declare -a images=(
  "graphic-tee.jpg"
  "beige-boots.jpg"
  "distressed-jeans.jpg"
  "black-tee.jpg"
  "sunglasses.jpg"
  "floral-shirt.jpg"
  "red-sneakers.jpg"
  "cargo-pants.jpg"
  "blue-loafers.jpg"
  "trucker-hat.jpg"
  "denim-jacket.jpg"
  "linen-shirt.jpg"
  "dark-jeans.jpg"
  "baseball-cap.jpg"
)

echo ""
echo "Required images for the demo:"
echo "=============================="
for img in "${images[@]}"; do
  if [ -f "$DEMO_DIR/$img" ]; then
    echo "✓ $img (exists)"
  else
    echo "✗ $img (missing)"
  fi
done

echo ""
echo "To add images:"
echo "1. Save your image files with the exact names listed above"
echo "2. Copy them to: $DEMO_DIR/"
echo "3. Refresh your browser"
echo ""




