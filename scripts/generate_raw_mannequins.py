import os

frames = {
    "neutral": {
        "head": "M 250,90 C 235,90 225,108 225,130 C 225,152 235,170 250,170 C 265,170 275,152 275,130 C 275,108 265,90 250,90 Z",
        "neck": "M 242,170 L 258,170 L 260,185 L 240,185 Z",
        "base_torso": "M 240,185 L {sh_l},195 C {sh_l},200 {ch_l},240 {w_l},290 C {w_l},340 {hip_l},370 {hip_l},430 L {crotch_l},450 L 250,450 L {crotch_r},450 L {hip_r},430 C {hip_r},370 {w_r},340 {w_r},290 C {ch_r},240 {sh_r},200 {sh_r},195 L 260,185 Z",
        "arms": "M {sh_l},198 C {sh_l_out},250 {sh_l_out},330 {hand_l},420 C {hand_l_in},420 {sh_l_in},320 {sh_l_in},220 Z M {sh_r},198 C {sh_r_out},250 {sh_r_out},330 {hand_r},420 C {hand_r_in},420 {sh_r_in},320 {sh_r_in},220 Z",
        "legs": "M {crotch_l},450 L {hip_l},430 C {hip_l},510 {knee_l},600 {knee_l},640 L {ankle_l},740 L {ankle_l_in},740 L {knee_l_in},640 C {knee_l_in},600 248,510 248,450 Z M {crotch_r},450 L {hip_r},430 C {hip_r},510 {knee_r},600 {knee_r},640 L {ankle_r},740 L {ankle_r_in},740 L {knee_r_in},640 C {knee_r_in},600 252,510 252,450 Z",
        "coords": {
            "slim":    {"sh": 46, "ch": 38, "w": 30, "hip": 38, "knee": 32, "ankle": 26},
            "average": {"sh": 55, "ch": 45, "w": 36, "hip": 45, "knee": 38, "ankle": 30},
            "broad":   {"sh": 66, "ch": 54, "w": 44, "hip": 54, "knee": 46, "ankle": 36}
        }
    },
    "masculine": {
        "head": "M 250,88 C 234,88 223,106 223,130 C 223,154 234,170 250,170 C 266,170 277,154 277,130 C 277,106 266,88 250,88 Z",
        "neck": "M 240,170 L 260,170 L 263,185 L 237,185 Z",
        "base_torso": "M 237,185 L {sh_l},192 C {sh_l},200 {ch_l},235 {w_l},295 C {w_l},345 {hip_l},375 {hip_l},430 L {crotch_l},450 L 250,450 L {crotch_r},450 L {hip_r},430 C {hip_r},375 {w_r},345 {w_r},295 C {ch_r},235 {sh_r},200 {sh_r},192 L 263,185 Z",
        "arms": "M {sh_l},194 C {sh_l_out},250 {sh_l_out},330 {hand_l},420 C {hand_l_in},420 {sh_l_in},320 {sh_l_in},220 Z M {sh_r},194 C {sh_r_out},250 {sh_r_out},330 {hand_r},420 C {hand_r_in},420 {sh_r_in},320 {sh_r_in},220 Z",
        "legs": "M {crotch_l},450 L {hip_l},430 C {hip_l},510 {knee_l},600 {knee_l},640 L {ankle_l},740 L {ankle_l_in},740 L {knee_l_in},640 C {knee_l_in},600 248,510 248,450 Z M {crotch_r},450 L {hip_r},430 C {hip_r},510 {knee_r},600 {knee_r},640 L {ankle_r},740 L {ankle_r_in},740 L {knee_r_in},640 C {knee_r_in},600 252,510 252,450 Z",
        "coords": {
            "slim":    {"sh": 55, "ch": 44, "w": 32, "hip": 36, "knee": 32, "ankle": 26},
            "average": {"sh": 65, "ch": 52, "w": 38, "hip": 42, "knee": 38, "ankle": 30},
            "broad":   {"sh": 78, "ch": 64, "w": 48, "hip": 50, "knee": 46, "ankle": 36}
        }
    },
    "feminine": {
        "head": "M 250,90 C 236,90 226,108 226,130 C 226,152 236,168 250,168 C 264,168 274,152 274,130 C 274,108 264,90 250,90 Z",
        "neck": "M 243,168 L 257,168 L 258,185 L 242,185 Z",
        "base_torso": "M 242,185 L {sh_l},195 C {sh_l},200 {ch_l},240 {w_l},285 C {w_l},335 {hip_l},370 {hip_l},430 L {crotch_l},450 L 250,450 L {crotch_r},450 L {hip_r},430 C {hip_r},370 {w_r},335 {w_r},285 C {ch_r},240 {sh_r},200 {sh_r},195 L 258,185 Z",
        "arms": "M {sh_l},197 C {sh_l_out},250 {sh_l_out},330 {hand_l},420 C {hand_l_in},420 {sh_l_in},320 {sh_l_in},220 Z M {sh_r},197 C {sh_r_out},250 {sh_r_out},330 {hand_r},420 C {hand_r_in},420 {sh_r_in},320 {sh_r_in},220 Z",
        "legs": "M {crotch_l},450 L {hip_l},430 C {hip_l},510 {knee_l},600 {knee_l},640 L {ankle_l},740 L {ankle_l_in},740 L {knee_l_in},640 C {knee_l_in},600 248,510 248,450 Z M {crotch_r},450 L {hip_r},430 C {hip_r},510 {knee_r},600 {knee_r},640 L {ankle_r},740 L {ankle_r_in},740 L {knee_r_in},640 C {knee_r_in},600 252,510 252,450 Z",
        "coords": {
            "slim":    {"sh": 44, "ch": 36, "w": 24, "hip": 42, "knee": 30, "ankle": 24},
            "average": {"sh": 50, "ch": 42, "w": 30, "hip": 50, "knee": 36, "ankle": 28},
            "broad":   {"sh": 58, "ch": 50, "w": 38, "hip": 60, "knee": 44, "ankle": 34}
        }
    }
}

os.makedirs("raw_assets/mannequins", exist_ok=True)

for frame_name, f_data in frames.items():
    for b_type, c in f_data["coords"].items():
        sh_l, sh_r = 250 - c["sh"], 250 + c["sh"]
        ch_l, ch_r = 250 - c["ch"], 250 + c["ch"]
        w_l, w_r   = 250 - c["w"],  250 + c["w"]
        hip_l, hip_r = 250 - c["hip"], 250 + c["hip"]
        knee_l, knee_r = 250 - c["knee"], 250 + c["knee"]
        ankle_l, ankle_r = 250 - c["ankle"], 250 + c["ankle"]

        p_torso = f_data["base_torso"].format(
            sh_l=sh_l, sh_r=sh_r, ch_l=ch_l, ch_r=ch_r,
            w_l=w_l, w_r=w_r, hip_l=hip_l, hip_r=hip_r,
            crotch_l=244, crotch_r=256
        )
        p_arms = f_data["arms"].format(
            sh_l=sh_l, sh_r=sh_r,
            sh_l_out=sh_l - 14, sh_r_out=sh_r + 14,
            sh_l_in=sh_l - 4, sh_r_in=sh_r + 4,
            hand_l=sh_l - 10, hand_r=sh_r + 10,
            hand_l_in=sh_l - 2, hand_r_in=sh_r + 2
        )
        p_legs = f_data["legs"].format(
            crotch_l=244, crotch_r=256,
            hip_l=hip_l, hip_r=hip_r,
            knee_l=knee_l, knee_r=knee_r,
            knee_l_in=knee_l - 8, knee_r_in=knee_r + 8,
            ankle_l=ankle_l, ankle_r=ankle_r,
            ankle_l_in=ankle_l - 6, ankle_r_in=ankle_r + 6
        )

        svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 800" width="500" height="800">
  <g id="mannequin" fill="#D3D3D3" stroke="#999999" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">
    <path id="head" d="{f_data['head']}" />
    <path id="neck" d="{f_data['neck']}" />
    <path id="torso" d="{p_torso}" />
    <path id="arms" d="{p_arms}" />
    <path id="legs" d="{p_legs}" />
  </g>
</svg>'''
        filename = f"raw_assets/mannequins/{frame_name}_{b_type}.svg"
        with open(filename, "w", encoding="utf-8") as f:
            f.write(svg_content)
        print(f"Generated: {filename}")