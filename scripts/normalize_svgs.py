import os
import re
import glob
import json
import xml.etree.ElementTree as ET

TARGET_CANVAS_WIDTH = 500
TARGET_CANVAS_HEIGHT = 800

ANCHOR_CONFIG = {
    "bottoms": {"x": 250, "y": 350, "target_width": 220},
    "tops": {"x": 250, "y": 215, "target_width": 220},
    "dresses": {"x": 250, "y": 250, "target_width": 220},
    "headwear": {"x": 250, "y": 120, "target_width": 140},
    "shoes": {"x": 250, "y": 550, "target_width": 160},
    "accessories": {"x": 250, "y": 260, "target_width": 180},
}


def get_dimensions(root):
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


def normalize_mannequin(input_path, output_path):
    """Standardizes mannequin silhouette viewBox, dimensions, and layer structure."""
    ET.register_namespace("", "http://www.w3.org/2000/svg")
    tree = ET.parse(input_path)
    root = tree.getroot()

    new_root = ET.Element("svg", {
        "viewBox": f"0 0 {TARGET_CANVAS_WIDTH} {TARGET_CANVAS_HEIGHT}",
        "width": str(TARGET_CANVAS_WIDTH),
        "height": str(TARGET_CANVAS_HEIGHT),
    })

    wrapper = ET.SubElement(new_root, "g", {
        "id": "normalized-mannequin-layer",
    })

    for child in list(root):
        wrapper.append(child)

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    ET.ElementTree(new_root).write(output_path, encoding="utf-8", xml_declaration=True)
    print(f"Success! Normalized Mannequin: {output_path}")


def normalize_svg(input_path, output_path, category="bottoms"):
    config = ANCHOR_CONFIG.get(category, ANCHOR_CONFIG["bottoms"])
    ET.register_namespace("", "http://www.w3.org/2000/svg")

    tree = ET.parse(input_path)
    root = tree.getroot()

    min_x, min_y, raw_w, raw_h = get_dimensions(root)
    scale = config["target_width"] / raw_w
    scaled_w = raw_w * scale

    translate_x = config["x"] - (scaled_w / 2.0) - (min_x * scale)
    translate_y = config["y"] - (min_y * scale)

    new_root = ET.Element("svg", {
        "viewBox": f"0 0 {TARGET_CANVAS_WIDTH} {TARGET_CANVAS_HEIGHT}",
        "width": str(TARGET_CANVAS_WIDTH),
        "height": str(TARGET_CANVAS_HEIGHT),
    })

    wrapper = ET.SubElement(new_root, "g", {
        "id": "normalized-garment-layer",
        "transform": f"matrix({scale:.4f} 0 0 {scale:.4f} {translate_x:.4f} {translate_y:.4f})",
    })

    for child in list(root):
        wrapper.append(child)

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    ET.ElementTree(new_root).write(output_path, encoding="utf-8", xml_declaration=True)
    print(f"Success! Normalized Garment: {output_path}")


if __name__ == "__main__":
    catalog_path = "src/data/clothingCatalog.json"
    with open(catalog_path, "r", encoding="utf-8") as f:
        catalog = json.load(f)

    for item in catalog.get("items", []):
        out_rel = item["svgPath"].lstrip("/")
        clean_path = os.path.join("public", out_rel)
        base_name = os.path.splitext(os.path.basename(out_rel))[0]
        raw_path = os.path.join("raw_assets", "garments", f"{base_name}_raw.svg")
        cat = item.get("category", "bottoms")

        if os.path.exists(raw_path):
            normalize_svg(raw_path, clean_path, category=cat)
        else:
            print(f"Skipping missing file: {raw_path}")

    # Process all mannequin assets
    mannequin_files = glob.glob("raw_assets/mannequins/*.svg")
    for m_file in mannequin_files:
        base_name = os.path.basename(m_file)
        dest_path = os.path.join("public/assets/mannequins", base_name)
        normalize_mannequin(m_file, dest_path)