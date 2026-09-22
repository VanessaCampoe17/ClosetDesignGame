import os
import re
import xml.etree.ElementTree as ET

# Canvas configuration matching the team's Fabric.js canvas
TARGET_CANVAS_WIDTH = 500
TARGET_CANVAS_HEIGHT = 800

# Target anchor coordinates matching clothingCatalog.json
ANCHOR_CONFIG = {
    "bottoms": {"x": 250, "y": 350, "target_width": 220},
    "tops": {"x": 250, "y": 215, "target_width": 220},
    "dresses": {"x": 250, "y": 250, "target_width": 220},
    "headwear": {"x": 250, "y": 120, "target_width": 140},
    "shoes": {"x": 250, "y": 550, "target_width": 160},
    "accessories": {"x": 250, "y": 260, "target_width": 180}
}

def get_dimensions(root):
    """Extracts bounding coordinates and dimensions from SVG viewBox or width/height."""
    viewbox = root.attrib.get("viewBox") or root.attrib.get("viewbox")
    if viewbox:
        parts = [float(p) for p in re.split(r"[\s,]+", viewbox.strip()) if p]
        if len(parts) == 4:
            return parts[0], parts[1], parts[2], parts[3]

    w_str = root.attrib.get("width", "100")
    h_str = root.attrib.get("height", "100")
    w = float(re.findall(r"[\d.]+", w_str)[0])
    h = float(re.findall(r"[\d.]+", h_str)[0])
    return 0.0, 0.0, w, h

def normalize_svg(input_path, output_path, category="bottoms"):
    """Scales, centers, and wraps the SVG into the standard 500x800 viewBox."""
    config = ANCHOR_CONFIG.get(category, ANCHOR_CONFIG["bottoms"])

    # Prevent ElementTree from prepending 'ns0:' to tags
    ET.register_namespace("", "http://www.w3.org/2000/svg")

    tree = ET.parse(input_path)
    root = tree.getroot()

    min_x, min_y, raw_w, raw_h = get_dimensions(root)

    # Calculate uniform scaling factor
    scale = config["target_width"] / raw_w
    scaled_w = raw_w * scale

    # Reposition relative to the center horizontal line and anchor Y
    translate_x = config["x"] - (scaled_w / 2.0) - (min_x * scale)
    translate_y = config["y"] - (min_y * scale)

    # Standardized 500x800 canvas root
    new_root = ET.Element("svg", {
        "xmlns": "http://www.w3.org/2000/svg",
        "viewBox": f"0 0 {TARGET_CANVAS_WIDTH} {TARGET_CANVAS_HEIGHT}",
        "width": str(TARGET_CANVAS_WIDTH),
        "height": str(TARGET_CANVAS_HEIGHT)
    })

    # Wrap the original paths into a normalized group layer
    wrapper = ET.SubElement(new_root, "g", {
        "id": "normalized-garment-layer",
        "transform": f"matrix({scale:.4f} 0 0 {scale:.4f} {translate_x:.4f} {translate_y:.4f})"
    })

    for child in list(root):
        wrapper.append(child)

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    ET.ElementTree(new_root).write(output_path, encoding="utf-8", xml_declaration=True)
    print(f"Success! Normalized: {output_path}")

if __name__ == "__main__":
    # Process the test file directly to the exact path in clothingCatalog.json
    raw_file = "raw_assets/harajuku_skirt_raw.svg"
    clean_output = "public/assets/garments/1990s/harajuku_skirt.svg"
    
    if os.path.exists(raw_file):
        normalize_svg(raw_file, clean_output, category="bottoms")
    else:
        print(f"Error: {raw_file} not found.")