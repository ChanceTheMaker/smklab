"""Light the existing SMK game artwork using the firmware physical pad mapping."""
from pathlib import Path
import re
import xml.etree.ElementTree as ET
ROOT=Path(__file__).resolve().parents[1]
# Firmware physical indices: top row 0..7, bottom row 8..15.
CONTROLS={1:('Up','#39bdfb'),8:('Left','#39bdfb'),9:('Down','#39bdfb'),10:('Right','#39bdfb'),14:('B','#f05ce9'),15:('A','#f05ce9')}
def illuminate(path):
    raw=path.read_bytes();text=raw.decode('utf8');count=0
    def rect(match):
        nonlocal count
        tag=match.group(0);attrs=ET.fromstring(tag).attrib
        if 'smk-pad' not in attrs.get('class','').split():return tag
        x,y=float(attrs['x']),float(attrs['y'])
        column=round((x-253)/51)
        if y not in (118,161) or not 0<=column<8 or x!=253+51*column:raise ValueError('Unexpected SMK pad geometry')
        pad=column+(8 if y==161 else 0)
        if pad not in CONTROLS:return tag
        name,color=CONTROLS[pad];count+=1
        for key in ('style','data-game-control'):tag=re.sub(r' '+key+r'="[^"]*"','',tag)
        stroke='#b9efff' if pad<14 else '#ffd0fc'
        style=f'fill:{color};stroke:{stroke};stroke-width:1.3;filter:drop-shadow(0 0 4px {color})'
        return tag[:-2]+f' style="{style}" data-game-control="{name}"/>'
    text=re.sub(r'<rect\b[^>]*?/>',rect,text)
    expected=12 if path.name.endswith('-hero.svg') else 6
    if count!=expected:raise ValueError(f'{path.name}: expected {expected} lit pads, got {count}')
    ET.fromstring(text)
    path.write_bytes(text.encode('utf8'))
    print(path.name,count,'lit pads')
def main():
    for project in ('gamedude','gamedude-color'):
        for suffix in ('smk-pro','smk-elite','hero','hardware-v2'):illuminate(ROOT/'dist/assets'/f'{project}-{suffix}.svg')
    illuminate(ROOT/'dist/assets/nesynth-hardware.svg')
if __name__=='__main__':main()
