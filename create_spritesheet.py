#!/usr/bin/env python3
"""
Create sprite sheets from GIF collections
"""
from PIL import Image, ImageDraw, ImageFont
import os
import sys
from pathlib import Path

def create_sprite_sheet(image_dir, output_path, columns=16, cell_width=32, cell_height=32,
                       add_labels=True, title="Sprite Sheet", padding=2):
    """
    Create a sprite sheet from a directory of images

    Args:
        image_dir: Directory containing images
        output_path: Path to save the sprite sheet
        columns: Number of columns in the grid
        cell_width: Width of each cell
        cell_height: Height of each cell
        add_labels: Whether to add text labels
        title: Title for the sprite sheet
        padding: Padding between cells
    """
    # Get all GIF files
    image_files = sorted([f for f in os.listdir(image_dir) if f.endswith('.gif')])

    if not image_files:
        print(f"No GIF files found in {image_dir}")
        return

    num_images = len(image_files)
    rows = (num_images + columns - 1) // columns  # Ceiling division

    # Calculate dimensions
    label_height = 12 if add_labels else 0
    total_cell_height = cell_height + label_height

    sheet_width = columns * (cell_width + padding) + padding
    sheet_height = 40 + rows * (total_cell_height + padding) + padding  # 40 for title

    # Create the sprite sheet
    sprite_sheet = Image.new('RGB', (sheet_width, sheet_height), color='#2a2a2a')
    draw = ImageDraw.Draw(sprite_sheet)

    # Try to load a font
    try:
        title_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 16)
        label_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 8)
    except:
        title_font = ImageFont.load_default()
        label_font = ImageFont.load_default()

    # Draw title
    title_bbox = draw.textbbox((0, 0), title, font=title_font)
    title_width = title_bbox[2] - title_bbox[0]
    draw.text(((sheet_width - title_width) // 2, 10), title, fill='white', font=title_font)

    # Place images
    for idx, image_file in enumerate(image_files):
        row = idx // columns
        col = idx % columns

        # Load image (get first frame of GIF)
        img_path = os.path.join(image_dir, image_file)
        try:
            img = Image.open(img_path)
            # Convert to RGBA if needed
            if img.mode != 'RGBA':
                img = img.convert('RGBA')

            # Resize to fit cell
            img.thumbnail((cell_width, cell_height), Image.Resampling.NEAREST)

            # Calculate position (centered in cell)
            x = padding + col * (cell_width + padding) + (cell_width - img.width) // 2
            y = 40 + padding + row * (total_cell_height + padding) + (cell_height - img.height) // 2

            # Paste image (handle transparency)
            sprite_sheet.paste(img, (x, y), img if img.mode == 'RGBA' else None)

            # Add label
            if add_labels:
                label = os.path.splitext(image_file)[0]
                # Truncate if too long
                if len(label) > 12:
                    label = label[:10] + '..'

                label_bbox = draw.textbbox((0, 0), label, font=label_font)
                label_width = label_bbox[2] - label_bbox[0]
                label_x = padding + col * (cell_width + padding) + (cell_width - label_width) // 2
                label_y = 40 + padding + row * (total_cell_height + padding) + cell_height + 1

                draw.text((label_x, label_y), label, fill='#cccccc', font=label_font)

        except Exception as e:
            print(f"Error processing {image_file}: {e}")
            continue

    # Save
    sprite_sheet.save(output_path)
    print(f"✅ Created sprite sheet: {output_path}")
    print(f"   Images: {num_images} ({rows} rows × {columns} cols)")
    print(f"   Dimensions: {sheet_width}×{sheet_height}px")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: create_spritesheet.py <input_dir> <output_file> [title]")
        sys.exit(1)

    input_dir = sys.argv[1]
    output_file = sys.argv[2]
    title = sys.argv[3] if len(sys.argv) > 3 else "Sprite Sheet"

    create_sprite_sheet(input_dir, output_file, title=title)
