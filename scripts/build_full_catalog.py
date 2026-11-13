import json
import os

RAW_DIR = "raw_assets/garments"
CATALOG_PATH = "src/data/clothingCatalog.json"
os.makedirs(RAW_DIR, exist_ok=True)

GARMENTS = [
    # ==================== 1890s — EUROPE ====================
    {
        "id": "1890s-eu-victorian-corset-01",
        "name": "Victorian Tailored Corset Bodice",
        "era": "1890s",
        "region": "Europe",
        "category": "tops",
        "targetFrame": "feminine",
        "raw_file": "victorian_corset_bodice_raw.svg",
        "svgPath": "/assets/garments/1890s/victorian_corset_bodice.svg",
        "defaultZIndex": 25,
        "anchorCoords": {"x": 250, "y": 230},
        "svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 240" width="220" height="240">
  <path d="M74,24 L92,16 L128,16 L146,24 C172,32 186,56 182,84 L158,88 L152,66 L144,126 L154,186 L110,214 L66,186 L76,126 L68,66 L62,88 L38,84 C34,56 48,32 74,24 Z" fill="#ffffff" stroke="#1f2937" stroke-width="2.5" stroke-linejoin="round"/>
  <path d="M90,16 C100,20 120,20 130,16 L133,32 C118,36 102,36 87,32 Z" fill="#f9fafb" stroke="#1f2937" stroke-width="2.2" stroke-linejoin="round"/>
  <path d="M68,66 C86,54 102,62 110,72 C118,62 134,54 152,66" fill="none" stroke="#1f2937" stroke-width="1.8"/>
  <line x1="110" y1="35" x2="110" y2="214" stroke="#1f2937" stroke-width="2"/>
  <circle cx="110" cy="52" r="2.2" fill="#1f2937"/><circle cx="110" cy="76" r="2.2" fill="#1f2937"/><circle cx="110" cy="100" r="2.2" fill="#1f2937"/><circle cx="110" cy="124" r="2.2" fill="#1f2937"/><circle cx="110" cy="148" r="2.2" fill="#1f2937"/><circle cx="110" cy="172" r="2.2" fill="#1f2937"/>
  <path d="M84,62 C88,108 86,152 80,192" fill="none" stroke="#1f2937" stroke-width="1.6"/>
  <path d="M136,62 C132,108 134,152 140,192" fill="none" stroke="#1f2937" stroke-width="1.6"/>
</svg>"""
    },
    {
        "id": "1890s-eu-edwardian-skirt-01",
        "name": "Edwardian Walking Skirt",
        "era": "1890s",
        "region": "Europe",
        "category": "bottoms",
        "targetFrame": "feminine",
        "raw_file": "edwardian_walking_skirt_raw.svg",
        "svgPath": "/assets/garments/1890s/edwardian_walking_skirt.svg",
        "defaultZIndex": 20,
        "anchorCoords": {"x": 250, "y": 350},
        "svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 280" width="220" height="280">
  <path d="M74,14 L146,14 L154,32 C172,110 192,195 204,256 C155,268 65,268 16,256 C28,195 48,110 66,32 Z" fill="#ffffff" stroke="#1f2937" stroke-width="2.5" stroke-linejoin="round"/>
  <path d="M74,14 L146,14 L150,28 C128,32 92,32 70,28 Z" fill="#f9fafb" stroke="#1f2937" stroke-width="2.2" stroke-linejoin="round"/>
  <path d="M94,30 C86,105 74,185 64,262" fill="none" stroke="#1f2937" stroke-width="1.6"/>
  <path d="M126,30 C134,105 146,185 156,262" fill="none" stroke="#1f2937" stroke-width="1.6"/>
  <path d="M22,228 C70,238 150,238 198,228" fill="none" stroke="#1f2937" stroke-width="1.8"/>
  <path d="M19,244 C68,255 152,255 201,244" fill="none" stroke="#4b5563" stroke-width="1.1" stroke-dasharray="3,3"/>
</svg>"""
    },
    {
        "id": "1890s-eu-boater-hat-01",
        "name": "Feather-Trimmed Boater Hat",
        "era": "1890s",
        "region": "Europe",
        "category": "headwear",
        "targetFrame": "feminine",
        "raw_file": "victorian_boater_hat_raw.svg",
        "svgPath": "/assets/garments/1890s/victorian_boater_hat.svg",
        "defaultZIndex": 40,
        "anchorCoords": {"x": 250, "y": 120},
        "svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 110" width="220" height="110">
  <ellipse cx="110" cy="74" rx="98" ry="18" fill="#ffffff" stroke="#1f2937" stroke-width="2.5"/>
  <path d="M54,70 L58,30 C58,23 162,23 162,30 L166,70 C140,76 80,76 54,70 Z" fill="#ffffff" stroke="#1f2937" stroke-width="2.5" stroke-linejoin="round"/>
  <ellipse cx="110" cy="30" rx="52" ry="8" fill="#f9fafb" stroke="#1f2937" stroke-width="2"/>
  <path d="M55,54 C82,60 138,60 165,54 L166,68 C138,74 82,74 54,68 Z" fill="#f3f4f6" stroke="#1f2937" stroke-width="2"/>
  <path d="M148,58 L134,50 L134,68 Z M148,58 L164,49 L164,68 Z" fill="#ffffff" stroke="#1f2937" stroke-width="1.8" stroke-linejoin="round"/>
  <path d="M152,52 C172,30 192,16 206,12 C192,28 176,42 156,55" fill="#ffffff" stroke="#1f2937" stroke-width="1.6" stroke-linejoin="round"/>
</svg>"""
    },

    # ==================== 1890s — NORTH AMERICA ====================
    {
        "id": "1890s-na-gibson-blouse-01",
        "name": "Gibson Girl Puff-Sleeve Blouse",
        "era": "1890s",
        "region": "North America",
        "category": "tops",
        "targetFrame": "feminine",
        "raw_file": "gibson_girl_blouse_raw.svg",
        "svgPath": "/assets/garments/1890s/gibson_girl_blouse.svg",
        "defaultZIndex": 25,
        "anchorCoords": {"x": 250, "y": 225},
        "svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 230" width="250" height="230">
  <path d="M92,20 L158,20 C192,26 218,52 214,94 L188,104 L180,168 L164,168 L166,94 L158,196 L92,196 L84,94 L86,168 L70,168 L62,104 L36,94 C32,52 58,26 92,20 Z" fill="#ffffff" stroke="#1f2937" stroke-width="2.5" stroke-linejoin="round"/>
  <path d="M94,16 L156,16 L158,32 C136,36 114,36 92,32 Z" fill="#f9fafb" stroke="#1f2937" stroke-width="2.2"/>
  <path d="M125,34 L112,48 L125,44 L138,48 Z" fill="#ffffff" stroke="#1f2937" stroke-width="1.8" stroke-linejoin="round"/>
  <path d="M96,35 L96,196 M154,35 L154,196" fill="none" stroke="#4b5563" stroke-width="1.3" stroke-dasharray="4,3"/>
  <path d="M92,182 L158,182" fill="none" stroke="#1f2937" stroke-width="2.2"/>
  <path d="M104,182 C102,190 100,196 98,202 M146,182 C148,190 150,196 152,202" fill="none" stroke="#4b5563" stroke-width="1.3"/>
</svg>"""
    },
    {
        "id": "1890s-na-prairie-skirt-01",
        "name": "Frontier Prairie Tiered Skirt",
        "era": "1890s",
        "region": "North America",
        "category": "bottoms",
        "targetFrame": "feminine",
        "raw_file": "frontier_prairie_skirt_raw.svg",
        "svgPath": "/assets/garments/1890s/frontier_prairie_skirt.svg",
        "defaultZIndex": 20,
        "anchorCoords": {"x": 250, "y": 350},
        "svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 280" width="220" height="280">
  <path d="M76,16 L144,16 L196,254 C146,266 74,266 24,254 Z" fill="#ffffff" stroke="#1f2937" stroke-width="2.5" stroke-linejoin="round"/>
  <rect x="76" y="16" width="68" height="14" fill="#f9fafb" stroke="#1f2937" stroke-width="2.2"/>
  <path d="M56,112 C92,120 128,120 164,112" fill="none" stroke="#1f2937" stroke-width="2"/>
  <path d="M38,194 C86,204 134,204 182,194" fill="none" stroke="#1f2937" stroke-width="2"/>
  <path d="M92,30 L84,114 M110,30 L110,116 M128,30 L136,114" fill="none" stroke="#4b5563" stroke-width="1.2"/>
  <path d="M72,118 L60,196 M110,118 L110,198 M148,118 L160,196" fill="none" stroke="#4b5563" stroke-width="1.2"/>
</svg>"""
    },
    {
        "id": "1890s-na-stetson-hat-01",
        "name": "1890s Campaign Stetson Hat",
        "era": "1890s",
        "region": "North America",
        "category": "headwear",
        "targetFrame": "neutral",
        "raw_file": "campaign_stetson_hat_raw.svg",
        "svgPath": "/assets/garments/1890s/campaign_stetson_hat.svg",
        "defaultZIndex": 40,
        "anchorCoords": {"x": 250, "y": 120},
        "svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 115" width="220" height="115">
  <path d="M16,76 C44,94 176,94 204,76 C184,66 164,66 158,68 L62,68 C56,66 36,66 16,76 Z" fill="#ffffff" stroke="#1f2937" stroke-width="2.5" stroke-linejoin="round"/>
  <path d="M62,68 L72,26 C86,18 98,28 110,28 C122,28 134,18 148,26 L158,68 Z" fill="#ffffff" stroke="#1f2937" stroke-width="2.5" stroke-linejoin="round"/>
  <path d="M64,58 C94,63 126,63 156,58 L158,68 C126,73 94,73 62,68 Z" fill="#f3f4f6" stroke="#1f2937" stroke-width="2"/>
  <rect x="134" y="57" width="8" height="11" rx="1.5" fill="#ffffff" stroke="#1f2937" stroke-width="1.6"/>
</svg>"""
    },

    # ==================== 1890s — EAST ASIA ====================
    {
        "id": "1890s-ea-meiji-haori-01",
        "name": "Meiji Era Crested Haori Jacket",
        "era": "1890s",
        "region": "East Asia",
        "category": "tops",
        "targetFrame": "neutral",
        "raw_file": "meiji_haori_jacket_raw.svg",
        "svgPath": "/assets/garments/1890s/meiji_haori_jacket.svg",
        "defaultZIndex": 30,
        "anchorCoords": {"x": 250, "y": 225},
        "svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 230" width="260" height="230">
  <path d="M84,22 L176,22 L236,42 L236,144 L190,144 L190,104 L184,202 L76,202 L70,104 L70,144 L24,144 L24,42 Z" fill="#ffffff" stroke="#1f2937" stroke-width="2.5" stroke-linejoin="round"/>
  <path d="M98,22 L116,202 M162,22 L144,202" fill="none" stroke="#1f2937" stroke-width="2.2"/>
  <path d="M108,22 L122,202 M152,22 L138,202" fill="none" stroke="#4b5563" stroke-width="1.4"/>
  <path d="M118,112 C126,118 134,118 142,112" fill="none" stroke="#1f2937" stroke-width="2"/>
  <circle cx="94" cy="64" r="6" fill="none" stroke="#1f2937" stroke-width="1.5"/>
  <circle cx="166" cy="64" r="6" fill="none" stroke="#1f2937" stroke-width="1.5"/>
  <line x1="70" y1="36" x2="70" y2="104" stroke="#1f2937" stroke-width="1.8"/>
  <line x1="190" y1="36" x2="190" y2="104" stroke="#1f2937" stroke-width="1.8"/>
</svg>"""
    },
    {
        "id": "1890s-ea-hakama-skirt-01",
        "name": "Meiji Pleated Hakama Trousers",
        "era": "1890s",
        "region": "East Asia",
        "category": "bottoms",
        "targetFrame": "neutral",
        "raw_file": "meiji_hakama_pleats_raw.svg",
        "svgPath": "/assets/garments/1890s/meiji_hakama_pleats.svg",
        "defaultZIndex": 20,
        "anchorCoords": {"x": 250, "y": 350},
        "svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 275" width="220" height="275">
  <path d="M68,18 L152,18 L184,256 L116,256 L110,136 L104,256 L36,256 Z" fill="#ffffff" stroke="#1f2937" stroke-width="2.5" stroke-linejoin="round"/>
  <rect x="66" y="18" width="88" height="18" fill="#f9fafb" stroke="#1f2937" stroke-width="2.2"/>
  <path d="M98,27 L122,27" stroke="#1f2937" stroke-width="2"/>
  <line x1="82" y1="36" x2="62" y2="256" stroke="#1f2937" stroke-width="1.8"/>
  <line x1="96" y1="36" x2="88" y2="256" stroke="#1f2937" stroke-width="1.8"/>
  <line x1="124" y1="36" x2="132" y2="256" stroke="#1f2937" stroke-width="1.8"/>
  <line x1="138" y1="36" x2="158" y2="256" stroke="#1f2937" stroke-width="1.8"/>
</svg>"""
    },
    {
        "id": "1890s-ea-kanzashi-comb-01",
        "name": "Meiji Silk Kanzashi Hairpiece",
        "era": "1890s",
        "region": "East Asia",
        "category": "headwear",
        "targetFrame": "feminine",
        "raw_file": "meiji_kanzashi_hairpiece_raw.svg",
        "svgPath": "/assets/garments/1890s/meiji_kanzashi_hairpiece.svg",
        "defaultZIndex": 40,
        "anchorCoords": {"x": 250, "y": 115},
        "svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 110" width="180" height="110">
  <path d="M46,66 C66,44 114,44 134,66 L128,78 C110,60 70,60 52,78 Z" fill="#ffffff" stroke="#1f2937" stroke-width="2.4" stroke-linejoin="round"/>
  <line x1="26" y1="42" x2="154" y2="74" stroke="#1f2937" stroke-width="2.6" stroke-linecap="round"/>
  <circle cx="66" cy="48" r="14" fill="#ffffff" stroke="#1f2937" stroke-width="2"/>
  <circle cx="66" cy="48" r="5" fill="#f3f4f6" stroke="#1f2937" stroke-width="1.5"/>
  <circle cx="92" cy="42" r="11" fill="#ffffff" stroke="#1f2937" stroke-width="2"/>
  <circle cx="92" cy="42" r="4" fill="#f3f4f6" stroke="#1f2937" stroke-width="1.5"/>
  <path d="M52,60 L44,96 M60,62 L54,100 M68,62 L64,98" fill="none" stroke="#1f2937" stroke-width="1.6" stroke-dasharray="3,2"/>
</svg>"""
    },

    # ==================== 1950s — EUROPE ====================
    {
        "id": "1950s-eu-parisian-bar-jacket-01",
        "name": "Parisian Tailored Bar Jacket",
        "era": "1950s",
        "region": "Europe",
        "category": "tops",
        "targetFrame": "feminine",
        "raw_file": "parisian_bar_jacket_raw.svg",
        "svgPath": "/assets/garments/1950s/parisian_bar_jacket.svg",
        "defaultZIndex": 30,
        "anchorCoords": {"x": 250, "y": 225},
        "svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 230" width="240" height="230">
  <path d="M84,22 L156,22 L212,62 L198,154 L174,150 L166,86 L154,142 L176,196 L64,196 L86,142 L74,86 L66,150 L42,154 L28,62 Z" fill="#ffffff" stroke="#1f2937" stroke-width="2.5" stroke-linejoin="round"/>
  <path d="M96,22 L120,78 L98,74 L84,46 Z" fill="#f9fafb" stroke="#1f2937" stroke-width="2" stroke-linejoin="round"/>
  <path d="M144,22 L120,78 L142,74 L156,46 Z" fill="#f9fafb" stroke="#1f2937" stroke-width="2" stroke-linejoin="round"/>
  <line x1="120" y1="78" x2="120" y2="196" stroke="#1f2937" stroke-width="2"/>
  <circle cx="120" cy="96" r="2.5" fill="#1f2937"/><circle cx="120" cy="118" r="2.5" fill="#1f2937"/><circle cx="120" cy="140" r="2.5" fill="#1f2937"/>
  <path d="M86,142 L154,142" fill="none" stroke="#1f2937" stroke-width="2"/>
  <path d="M98,68 C96,104 92,146 82,194 M142,68 C144,104 148,146 158,194" fill="none" stroke="#4b5563" stroke-width="1.3"/>
</svg>"""
    },
    {
        "id": "1950s-eu-new-look-skirt-01",
        "name": "Parisian New Look Pleated Midi",
        "era": "1950s",
        "region": "Europe",
        "category": "bottoms",
        "targetFrame": "feminine",
        "raw_file": "parisian_new_look_skirt_raw.svg",
        "svgPath": "/assets/garments/1950s/parisian_new_look_skirt.svg",
        "defaultZIndex": 20,
        "anchorCoords": {"x": 250, "y": 350},
        "svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 265" width="240" height="265">
  <path d="M84,18 L156,18 C184,84 208,162 222,238 C164,254 76,254 18,238 C32,162 56,84 84,18 Z" fill="#ffffff" stroke="#1f2937" stroke-width="2.5" stroke-linejoin="round"/>
  <path d="M84,18 L156,18 L160,34 C134,39 106,39 80,34 Z" fill="#f9fafb" stroke="#1f2937" stroke-width="2.2"/>
  <path d="M94,36 L54,244 M108,38 L92,248 M120,38 L120,250 M132,38 L148,248 M146,36 L186,244" fill="none" stroke="#1f2937" stroke-width="1.5"/>
</svg>"""
    },
    {
        "id": "1950s-eu-cartwheel-hat-01",
        "name": "Riviera Wide-Brim Cartwheel Hat",
        "era": "1950s",
        "region": "Europe",
        "category": "headwear",
        "targetFrame": "feminine",
        "raw_file": "riviera_cartwheel_hat_raw.svg",
        "svgPath": "/assets/garments/1950s/riviera_cartwheel_hat.svg",
        "defaultZIndex": 40,
        "anchorCoords": {"x": 250, "y": 115},
        "svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 110" width="240" height="110">
  <ellipse cx="120" cy="68" rx="112" ry="22" fill="#ffffff" stroke="#1f2937" stroke-width="2.5"/>
  <path d="M74,64 C78,34 162,34 166,64 C140,70 100,70 74,64 Z" fill="#ffffff" stroke="#1f2937" stroke-width="2.4" stroke-linejoin="round"/>
  <path d="M75,54 C102,60 138,60 165,54 L166,64 C138,70 102,70 74,64 Z" fill="#f3f4f6" stroke="#1f2937" stroke-width="1.8"/>
  <path d="M158,60 L194,74 L182,80 L154,65 Z" fill="#ffffff" stroke="#1f2937" stroke-width="1.6"/>
</svg>"""
    },

    # ==================== 1950s — NORTH AMERICA ====================
    {
        "id": "1950s-na-greaser-jacket-01",
        "name": "Classic Biker Leather Jacket",
        "era": "1950s",
        "region": "North America",
        "category": "tops",
        "targetFrame": "masculine",
        "raw_file": "classic_biker_leather_jacket_raw.svg",
        "svgPath": "/assets/garments/1950s/classic_biker_leather_jacket.svg",
        "defaultZIndex": 35,
        "anchorCoords": {"x": 250, "y": 215},
        "svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 230" width="260" height="230">
  <path d="M86,24 L174,24 L232,68 L216,174 L190,170 L186,96 L184,196 L76,196 L74,96 L70,170 L44,174 L28,68 Z" fill="#ffffff" stroke="#1f2937" stroke-width="2.5" stroke-linejoin="round"/>
  <path d="M62,42 L88,26 L92,35 L66,50 Z" fill="#f9fafb" stroke="#1f2937" stroke-width="1.8"/>
  <path d="M198,42 L172,26 L168,35 L194,50 Z" fill="#f9fafb" stroke="#1f2937" stroke-width="1.8"/>
  <path d="M96,24 L130,66 L104,92 L82,66 L90,48 L78,44 Z" fill="#f9fafb" stroke="#1f2937" stroke-width="2" stroke-linejoin="round"/>
  <path d="M164,24 L130,66 L156,92 L178,66 L170,48 L182,44 Z" fill="#f9fafb" stroke="#1f2937" stroke-width="2" stroke-linejoin="round"/>
  <line x1="130" y1="66" x2="144" y2="180" stroke="#1f2937" stroke-width="2.2"/>
  <line x1="92" y1="106" x2="118" y2="118" stroke="#1f2937" stroke-width="2"/>
  <line x1="88" y1="142" x2="112" y2="164" stroke="#1f2937" stroke-width="2"/>
  <rect x="76" y="180" width="108" height="16" fill="#f9fafb" stroke="#1f2937" stroke-width="2"/>
  <rect x="122" y="178" width="16" height="20" rx="2" fill="#ffffff" stroke="#1f2937" stroke-width="2.2"/>
</svg>"""
    },
    {
        "id": "1950s-na-poodle-skirt-01",
        "name": "High-Waisted Poodle Skirt",
        "era": "1950s",
        "region": "North America",
        "category": "bottoms",
        "targetFrame": "feminine",
        "raw_file": "poodle_skirt_raw.svg",
        "svgPath": "/assets/garments/1950s/poodle_skirt.svg",
        "defaultZIndex": 20,
        "anchorCoords": {"x": 250, "y": 350},
        "svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 250" width="240" height="250">
  <path d="M84,18 L156,18 C184,78 212,148 226,214 C168,236 72,236 14,214 C28,148 56,78 84,18 Z" fill="#ffffff" stroke="#1f2937" stroke-width="2.5" stroke-linejoin="round"/>
  <path d="M84,18 L156,18 L160,33 C134,38 106,38 80,33 Z" fill="#f9fafb" stroke="#1f2937" stroke-width="2.2" stroke-linejoin="round"/>
  <path d="M96,35 C78,95 62,158 50,222" fill="none" stroke="#1f2937" stroke-width="1.5"/>
  <path d="M120,37 L120,229" fill="none" stroke="#4b5563" stroke-width="1.3"/>
  <path d="M144,35 C162,95 178,158 190,222" fill="none" stroke="#1f2937" stroke-width="1.5"/>
  <g stroke="#1f2937" stroke-width="1.6" fill="#ffffff" stroke-linejoin="round">
    <ellipse cx="164" cy="176" rx="11" ry="7"/><circle cx="155" cy="166" r="6"/><circle cx="176" cy="171" r="3"/>
    <path d="M157,182 L155,193 M161,183 L160,194 M170,182 L171,193 M174,180 L176,191" fill="none"/>
    <path d="M153,162 C142,125 134,82 132,36" fill="none" stroke-width="1.2" stroke-dasharray="4,3"/>
  </g>
</svg>"""
    },
    {
        "id": "1950s-na-pillbox-hat-01",
        "name": "Vintage Veiled Pillbox Hat",
        "era": "1950s",
        "region": "North America",
        "category": "headwear",
        "targetFrame": "feminine",
        "raw_file": "vintage_pillbox_hat_raw.svg",
        "svgPath": "/assets/garments/1950s/vintage_pillbox_hat.svg",
        "defaultZIndex": 40,
        "anchorCoords": {"x": 250, "y": 120},
        "svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 110" width="200" height="110">
  <path d="M40,62 C52,96 148,96 160,62" fill="none" stroke="#1f2937" stroke-width="1.4" stroke-dasharray="3,3"/>
  <path d="M46,28 C82,20 118,20 154,28 L162,62 C122,72 78,72 38,62 Z" fill="#ffffff" stroke="#1f2937" stroke-width="2.5" stroke-linejoin="round"/>
  <ellipse cx="100" cy="28" rx="54" ry="9" fill="#f9fafb" stroke="#1f2937" stroke-width="2"/>
  <path d="M40,53 C78,63 122,63 160,53" fill="none" stroke="#1f2937" stroke-width="1.6"/>
  <path d="M144,44 L128,35 L128,53 Z M144,44 L162,34 L162,54 Z" fill="#ffffff" stroke="#1f2937" stroke-width="1.8" stroke-linejoin="round"/>
</svg>"""
    },

    # ==================== 1950s — EAST ASIA ====================
    {
        "id": "1950s-ea-showa-sailor-top-01",
        "name": "Showa Era Sailor Collar Blouse",
        "era": "1950s",
        "region": "East Asia",
        "category": "tops",
        "targetFrame": "feminine",
        "raw_file": "showa_sailor_blouse_raw.svg",
        "svgPath": "/assets/garments/1950s/showa_sailor_blouse.svg",
        "defaultZIndex": 25,
        "anchorCoords": {"x": 250, "y": 225},
        "svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 220" width="240" height="220">
  <path d="M84,22 L156,22 L214,68 L196,158 L172,154 L166,86 L164,192 L76,192 L74,86 L68,154 L44,158 L26,68 Z" fill="#ffffff" stroke="#1f2937" stroke-width="2.5" stroke-linejoin="round"/>
  <path d="M84,22 L120,86 L156,22 L176,42 L158,64 L120,86 L82,64 L64,42 Z" fill="#f9fafb" stroke="#1f2937" stroke-width="2" stroke-linejoin="round"/>
  <path d="M72,44 L120,76 L168,44" fill="none" stroke="#4b5563" stroke-width="1.3"/>
  <path d="M120,86 L108,134 L120,126 L132,134 Z" fill="#ffffff" stroke="#1f2937" stroke-width="1.8" stroke-linejoin="round"/>
  <rect x="76" y="138" width="26" height="30" rx="2" fill="none" stroke="#1f2937" stroke-width="1.6"/>
</svg>"""
    },
    {
        "id": "1950s-ea-showa-pleated-skirt-01",
        "name": "Showa Box-Pleated Midi Skirt",
        "era": "1950s",
        "region": "East Asia",
        "category": "bottoms",
        "targetFrame": "feminine",
        "raw_file": "showa_pleated_skirt_raw.svg",
        "svgPath": "/assets/garments/1950s/showa_pleated_skirt.svg",
        "defaultZIndex": 20,
        "anchorCoords": {"x": 250, "y": 350},
        "svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 250" width="220" height="250">
  <path d="M74,18 L146,18 L182,226 L38,226 Z" fill="#ffffff" stroke="#1f2937" stroke-width="2.5" stroke-linejoin="round"/>
  <rect x="74" y="18" width="72" height="16" fill="#f9fafb" stroke="#1f2937" stroke-width="2.2"/>
  <line x1="88" y1="34" x2="66" y2="226" stroke="#1f2937" stroke-width="1.8"/>
  <line x1="102" y1="34" x2="92" y2="226" stroke="#1f2937" stroke-width="1.8"/>
  <line x1="118" y1="34" x2="128" y2="226" stroke="#1f2937" stroke-width="1.8"/>
  <line x1="132" y1="34" x2="154" y2="226" stroke="#1f2937" stroke-width="1.8"/>
</svg>"""
    },
    {
        "id": "1950s-ea-ginza-cloche-01",
        "name": "1950s Ginza Ribbon Cloche Hat",
        "era": "1950s",
        "region": "East Asia",
        "category": "headwear",
        "targetFrame": "feminine",
        "raw_file": "ginza_ribbon_cloche_raw.svg",
        "svgPath": "/assets/garments/1950s/ginza_ribbon_cloche.svg",
        "defaultZIndex": 40,
        "anchorCoords": {"x": 250, "y": 115},
        "svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 110" width="200" height="110">
  <path d="M46,66 C46,24 154,24 154,66 L176,84 C132,96 68,96 24,84 Z" fill="#ffffff" stroke="#1f2937" stroke-width="2.5" stroke-linejoin="round"/>
  <path d="M46,58 C78,66 122,66 154,58 L156,69 C122,77 78,77 44,69 Z" fill="#f3f4f6" stroke="#1f2937" stroke-width="2"/>
  <circle cx="144" cy="64" r="9" fill="#ffffff" stroke="#1f2937" stroke-width="1.8"/>
</svg>"""
    },

    # ==================== 1990s — EUROPE ====================
    {
        "id": "1990s-eu-britpop-track-top-01",
        "name": "Britpop Striped Track Jacket",
        "era": "1990s",
        "region": "Europe",
        "category": "tops",
        "targetFrame": "masculine",
        "raw_file": "britpop_track_jacket_raw.svg",
        "svgPath": "/assets/garments/1990s/britpop_track_jacket.svg",
        "defaultZIndex": 30,
        "anchorCoords": {"x": 250, "y": 220},
        "svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 230" width="260" height="230">
  <path d="M94,18 L166,18 L174,34 L234,74 L218,172 L192,168 L188,100 L186,204 L74,204 L72,100 L68,168 L42,172 L26,74 L86,34 Z" fill="#ffffff" stroke="#1f2937" stroke-width="2.5" stroke-linejoin="round"/>
  <path d="M94,18 C112,24 148,24 166,18 L172,36 C148,42 112,42 88,36 Z" fill="#f9fafb" stroke="#1f2937" stroke-width="2.2"/>
  <line x1="130" y1="22" x2="130" y2="204" stroke="#1f2937" stroke-width="2.2"/>
  <path d="M84,38 L36,168 M92,40 L46,170" fill="none" stroke="#1f2937" stroke-width="1.6"/>
  <path d="M176,38 L224,168 M168,40 L214,170" fill="none" stroke="#1f2937" stroke-width="1.6"/>
  <rect x="74" y="190" width="112" height="14" fill="#f9fafb" stroke="#1f2937" stroke-width="2"/>
</svg>"""
    },
    {
        "id": "1990s-eu-tartan-mini-01",
        "name": "London Tartan Pleated Mini Skirt",
        "era": "1990s",
        "region": "Europe",
        "category": "bottoms",
        "targetFrame": "feminine",
        "raw_file": "london_tartan_mini_raw.svg",
        "svgPath": "/assets/garments/1990s/london_tartan_mini.svg",
        "defaultZIndex": 20,
        "anchorCoords": {"x": 250, "y": 350},
        "svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 185" width="220" height="185">
  <path d="M68,20 L152,20 L182,162 L38,162 Z" fill="#ffffff" stroke="#1f2937" stroke-width="2.5" stroke-linejoin="round"/>
  <rect x="68" y="20" width="84" height="16" fill="#f9fafb" stroke="#1f2937" stroke-width="2.2"/>
  <line x1="86" y1="36" x2="72" y2="162" stroke="#1f2937" stroke-width="1.8"/>
  <line x1="110" y1="36" x2="110" y2="162" stroke="#1f2937" stroke-width="1.8"/>
  <line x1="134" y1="36" x2="148" y2="162" stroke="#1f2937" stroke-width="1.8"/>
  <line x1="56" y1="84" x2="164" y2="84" stroke="#4b5563" stroke-width="1.2" stroke-dasharray="4,3"/>
  <line x1="46" y1="126" x2="174" y2="126" stroke="#4b5563" stroke-width="1.2" stroke-dasharray="4,3"/>
</svg>"""
    },
    {
        "id": "1990s-eu-kangol-beret-01",
        "name": "1990s UK Wool Flat Beret",
        "era": "1990s",
        "region": "Europe",
        "category": "headwear",
        "targetFrame": "neutral",
        "raw_file": "uk_wool_beret_raw.svg",
        "svgPath": "/assets/garments/1990s/uk_wool_beret.svg",
        "defaultZIndex": 40,
        "anchorCoords": {"x": 250, "y": 115},
        "svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 105" width="200" height="105">
  <path d="M46,68 C26,42 64,20 118,22 C164,24 182,48 158,68 C134,76 68,76 46,68 Z" fill="#ffffff" stroke="#1f2937" stroke-width="2.5" stroke-linejoin="round"/>
  <path d="M52,66 C82,73 128,73 154,66 L152,76 C126,82 82,82 54,76 Z" fill="#f9fafb" stroke="#1f2937" stroke-width="2"/>
  <path d="M108,22 L112,13" stroke="#1f2937" stroke-width="2.4" stroke-linecap="round"/>
</svg>"""
    },

    # ==================== 1990s — NORTH AMERICA ====================
    {
        "id": "1990s-na-grunge-flannel-01",
        "name": "Seattle Grunge Oversized Flannel",
        "era": "1990s",
        "region": "North America",
        "category": "tops",
        "targetFrame": "masculine",
        "raw_file": "grunge_oversized_flannel_raw.svg",
        "svgPath": "/assets/garments/1990s/grunge_oversized_flannel.svg",
        "defaultZIndex": 30,
        "anchorCoords": {"x": 250, "y": 225},
        "svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 235" width="260" height="235">
  <path d="M90,22 L170,22 L234,68 L218,174 L192,170 L188,96 L188,206 C154,216 106,216 72,206 L72,96 L68,170 L42,174 L26,68 Z" fill="#ffffff" stroke="#1f2937" stroke-width="2.5" stroke-linejoin="round"/>
  <path d="M94,22 L130,44 L106,56 L84,36 Z M166,22 L130,44 L154,56 L176,36 Z" fill="#f9fafb" stroke="#1f2937" stroke-width="2" stroke-linejoin="round"/>
  <line x1="130" y1="44" x2="130" y2="212" stroke="#1f2937" stroke-width="2"/>
  <rect x="86" y="76" width="30" height="34" rx="2" fill="none" stroke="#1f2937" stroke-width="1.8"/>
  <rect x="144" y="76" width="30" height="34" rx="2" fill="none" stroke="#1f2937" stroke-width="1.8"/>
  <line x1="72" y1="136" x2="188" y2="136" stroke="#4b5563" stroke-width="1.1" stroke-dasharray="5,4"/>
  <line x1="72" y1="172" x2="188" y2="172" stroke="#4b5563" stroke-width="1.1" stroke-dasharray="5,4"/>
</svg>"""
    },
    {
        "id": "1990s-na-carpenter-jeans-01",
        "name": "1990s Baggy Carpenter Denim",
        "era": "1990s",
        "region": "North America",
        "category": "bottoms",
        "targetFrame": "masculine",
        "raw_file": "baggy_carpenter_jeans_raw.svg",
        "svgPath": "/assets/garments/1990s/baggy_carpenter_jeans.svg",
        "defaultZIndex": 20,
        "anchorCoords": {"x": 250, "y": 350},
        "svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 210 275" width="210" height="275">
  <path d="M62,18 L148,18 L166,256 L114,256 L105,118 L96,256 L44,256 Z" fill="#ffffff" stroke="#1f2937" stroke-width="2.5" stroke-linejoin="round"/>
  <rect x="62" y="18" width="86" height="16" fill="#f9fafb" stroke="#1f2937" stroke-width="2.2"/>
  <line x1="105" y1="34" x2="105" y2="86" stroke="#1f2937" stroke-width="2"/>
  <path d="M62,56 C78,56 86,46 86,34 M148,56 C132,56 124,46 124,34" fill="none" stroke="#1f2937" stroke-width="1.6"/>
  <rect x="134" y="114" width="20" height="34" rx="2" fill="none" stroke="#1f2937" stroke-width="1.6"/>
  <path d="M52,118 L66,134" fill="none" stroke="#1f2937" stroke-width="2"/>
</svg>"""
    },
    {
        "id": "1990s-na-snapback-cap-01",
        "name": "90s Streetwear Snapback Cap",
        "era": "1990s",
        "region": "North America",
        "category": "headwear",
        "targetFrame": "neutral",
        "raw_file": "streetwear_snapback_cap_raw.svg",
        "svgPath": "/assets/garments/1990s/streetwear_snapback_cap.svg",
        "defaultZIndex": 40,
        "anchorCoords": {"x": 250, "y": 115},
        "svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 210 110" width="210" height="110">
  <path d="M54,68 C54,28 156,28 156,68 Z" fill="#ffffff" stroke="#1f2937" stroke-width="2.5" stroke-linejoin="round"/>
  <circle cx="105" cy="34" r="3" fill="#f9fafb" stroke="#1f2937" stroke-width="1.6"/>
  <path d="M84,38 L78,68 M126,38 L132,68" fill="none" stroke="#4b5563" stroke-width="1.3"/>
  <path d="M44,68 L166,68 C178,78 164,90 105,90 C46,90 32,78 44,68 Z" fill="#f9fafb" stroke="#1f2937" stroke-width="2.5" stroke-linejoin="round"/>
</svg>"""
    },

    # ==================== 1990s — EAST ASIA ====================
    {
        "id": "1990s-ea-windbreaker-01",
        "name": "Oversized Colorblock Windbreaker",
        "era": "1990s",
        "region": "East Asia",
        "category": "tops",
        "targetFrame": "neutral",
        "raw_file": "colorblock_windbreaker_raw.svg",
        "svgPath": "/assets/garments/1990s/colorblock_windbreaker.svg",
        "defaultZIndex": 30,
        "anchorCoords": {"x": 250, "y": 215},
        "svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 230" width="260" height="230">
  <path d="M96,18 L164,18 L174,34 L236,76 L220,168 L194,164 L190,104 L190,206 L70,206 L70,104 L66,164 L40,168 L24,76 L86,34 Z" fill="#ffffff" stroke="#1f2937" stroke-width="2.5" stroke-linejoin="round"/>
  <path d="M96,18 C114,24 146,24 164,18 L170,36 C146,42 114,42 90,36 Z" fill="#f9fafb" stroke="#1f2937" stroke-width="2.2"/>
  <line x1="130" y1="22" x2="130" y2="206" stroke="#1f2937" stroke-width="2"/>
  <path d="M70,86 L130,132 L190,86 M70,106 L130,152 L190,106" fill="none" stroke="#1f2937" stroke-width="2"/>
  <rect x="70" y="192" width="120" height="14" fill="#f9fafb" stroke="#1f2937" stroke-width="2"/>
</svg>"""
    },
    {
        "id": "1990s-ea-harajuku-skirt-01",
        "name": "Decora Tiered Ruffle Mini Skirt",
        "era": "1990s",
        "region": "East Asia",
        "category": "bottoms",
        "targetFrame": "feminine",
        "raw_file": "harajuku_skirt_raw.svg",
        "svgPath": "/assets/garments/1990s/harajuku_skirt.svg",
        "defaultZIndex": 20,
        "anchorCoords": {"x": 250, "y": 350},
        "svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 190" width="220" height="190">
  <path d="M34,118 L186,118 L202,164 C188,172 174,162 160,168 C146,174 132,162 118,168 C110,171 102,168 94,166 C80,162 66,174 52,168 C38,162 24,172 18,164 Z" fill="#ffffff" stroke="#1f2937" stroke-width="2.5" stroke-linejoin="round"/>
  <path d="M48,74 L172,74 L190,124 C164,132 56,132 30,124 Z" fill="#ffffff" stroke="#1f2937" stroke-width="2.5" stroke-linejoin="round"/>
  <path d="M64,22 L156,22 L174,80 C142,88 78,88 46,80 Z" fill="#ffffff" stroke="#1f2937" stroke-width="2.5" stroke-linejoin="round"/>
  <rect x="64" y="22" width="92" height="16" rx="2" fill="#f9fafb" stroke="#1f2937" stroke-width="2.2"/>
  <path d="M110,30 L96,22 L96,38 Z M110,30 L124,22 L124,38 Z" fill="#ffffff" stroke="#1f2937" stroke-width="1.8" stroke-linejoin="round"/>
</svg>"""
    },
    {
        "id": "1990s-ea-bucket-hat-01",
        "name": "Harajuku Street Bucket Hat",
        "era": "1990s",
        "region": "East Asia",
        "category": "headwear",
        "targetFrame": "neutral",
        "raw_file": "harajuku_bucket_hat_raw.svg",
        "svgPath": "/assets/garments/1990s/harajuku_bucket_hat.svg",
        "defaultZIndex": 40,
        "anchorCoords": {"x": 250, "y": 120},
        "svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 210 110" width="210" height="110">
  <path d="M62,24 C84,16 126,16 148,24 L162,64 C128,72 82,72 48,64 Z" fill="#ffffff" stroke="#1f2937" stroke-width="2.5" stroke-linejoin="round"/>
  <ellipse cx="105" cy="24" rx="43" ry="7" fill="#f9fafb" stroke="#1f2937" stroke-width="2"/>
  <path d="M48,64 L162,64 L192,88 C142,102 68,102 18,88 Z" fill="#ffffff" stroke="#1f2937" stroke-width="2.5" stroke-linejoin="round"/>
  <path d="M36,74 C80,84 130,84 174,74" fill="none" stroke="#4b5563" stroke-width="1.2" stroke-dasharray="4,3"/>
</svg>"""
    },
]

# 1. Write all 27 raw SVG files
for item in GARMENTS:
    raw_path = os.path.join(RAW_DIR, item["raw_file"])
    with open(raw_path, "w", encoding="utf-8") as f:
        f.write(item["svg"].strip() + "\n")

# 2. Load existing mannequins block and write updated clothingCatalog.json
with open(CATALOG_PATH, "r", encoding="utf-8") as f:
    catalog = json.load(f)

catalog["version"] = "2.0.0"
catalog["items"] = [
    {k: v for k, v in item.items() if k not in ("raw_file", "svg")}
    for item in GARMENTS
]

with open(CATALOG_PATH, "w", encoding="utf-8") as f:
    json.dump(catalog, f, indent=2)
    f.write("\n")

print(f"Wrote {len(GARMENTS)} colorless raw SVGs and updated {CATALOG_PATH}.")