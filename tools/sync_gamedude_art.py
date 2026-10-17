"""Refresh SMKLab's GameDude vector art from its sibling projects.
Run after capturing the two browser gameplay screens in dist/assets.
"""
from pathlib import Path
import base64,copy,shutil,xml.etree.ElementTree as ET
ROOT=Path(__file__).resolve().parents[1]
WORKSPACE=next(p for p in ROOT.parents if (p/'GameDude-RGB').is_dir())
NS='http://www.w3.org/2000/svg';ET.register_namespace('',NS)
def node(name,**attrs):return ET.Element('{'+NS+'}'+name,{k:str(v) for k,v in attrs.items()})
assets=ROOT/'dist/assets'
for project,folder,logo in [('gamedude','arcade-fm1-smk','gamedude-logo.svg'),('gamedude-color','GameDude-RGB','gamedude-color-logo.svg')]:
 source=WORKSPACE/folder/'web';shutil.copy2(source/logo,assets/(project+'-wordmark.svg'))
 data='data:image/png;base64,'+base64.b64encode((assets/(project+'-screen.png')).read_bytes()).decode()
 def screen(art,model):
  for parent in art.iter():
   for child in list(parent):
    if (child.get('id') or '').endswith('game-screen-brand'):parent.remove(child)
  rect=[200,95,103,93] if model=='fm1' else [137,80,72,65]
  art.append(node('image',x=rect[0],y=rect[1],width=rect[2],height=rect[3],href=data,preserveAspectRatio='xMidYMid meet',style='image-rendering:pixelated'))
 for model in ['fm1','smk-pro','smk-elite']:
  art=ET.parse(source/'artwork'/(model+'.svg')).getroot();screen(art,model)
  art.set('aria-label',project.replace('-',' ').title()+' on '+model.upper()+' with gameplay on the display')
  ET.ElementTree(art).write(assets/(project+'-'+model+'.svg'),encoding='utf-8',xml_declaration=True)
 # The site's three-device hero already carries its current outlined wordmark.
 hero=ET.parse(source/'artwork/gamedude-devices.svg').getroot()
 for child in hero:
  if child.tag=='{'+NS+'}svg':screen(child,'fm1' if child.get('viewBox')=='25 45 590 350' else 'smk-pro')
 ET.ElementTree(hero).write(assets/(project+'-hero.svg'),encoding='utf-8',xml_declaration=True)
 # A larger inset makes the actual tiny keyboard display legible in collection cards.
 card=node('svg',viewBox='0 0 960 500',role='img')
 title=node('title');title.text=project.replace('-',' ').title()+' on SMK-37 Pro, with enlarged gameplay display';card.append(title)
 hardware=ET.parse(assets/(project+'-smk-pro.svg')).getroot();hardware.set('x','0');hardware.set('y','112');hardware.set('width','960');hardware.set('height','378');card.append(hardware)
 card.append(node('path',d='M 175 158 L 175 78 L 741 78',fill='none',stroke='#9eb792' if project=='gamedude' else '#b393eb',**{'stroke-width':'2','stroke-dasharray':'5 5'}))
 card.append(node('rect',x=737,y=3,width=177,height=161,rx=9,fill='#111511',stroke='#6f7c65' if project=='gamedude' else '#9471b8',**{'stroke-width':'3'}))
 card.append(node('image',x=745,y=11,width=161,height=145,href=data,preserveAspectRatio='xMidYMid meet',style='image-rendering:pixelated'))
 ET.ElementTree(card).write(assets/(project+'-hardware-v2.svg'),encoding='utf-8',xml_declaration=True)
shutil.copy2(WORKSPACE/'GameDude-RGB/web/homebrew/licenses/flooder.txt',assets/'licenses/flooder.txt')
shutil.copy2(WORKSPACE/'arcade-fm1-smk/web/homebrew/licenses/gameboy-examples.txt',assets/'licenses/gameboy-examples.txt')
print('Updated both wordmarks, six device screens, two heroes and two enlarged display insets.')
