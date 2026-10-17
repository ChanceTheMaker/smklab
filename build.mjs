import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
const items=JSON.parse(await fs.readFile(path.join(root,'src/firmwares.json'),'utf8'));
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
async function asset(file){
 if(!/^assets\/[a-zA-Z0-9_./-]+$/.test(file)||file.includes('..'))throw Error('Invalid asset path');
 await fs.access(path.join(root,'dist',file));
}
const ids=new Set();
for(const p of items){
 if(!/^[a-z0-9-]+$/.test(p.id)||ids.has(p.id))throw Error('Invalid/duplicate ID');
 ids.add(p.id);
 if(!p.name||!p.description)throw Error('Name and description required');
 for(const field of ['url','source','upstream','studio','simulator','install','games'])if(p[field]&&new URL(p[field]).protocol!=='https:')throw Error('HTTPS required');
 if(!['beta','released','preview','planned'].includes(p.status))throw Error('Unknown status');
 if(p.status!=='planned'&&!p.url)throw Error('Published listings require a website');
 for(const field of ['art','screenshot','hero','logo'])if(p[field])await asset(p[field]);
 for(const shot of p.gallery||[])await asset(shot.file);
}
const active=items.filter(p=>p.status!=='planned');
const link=(url,label,classes='text-link')=>url?`<a class="${classes}" href="${esc(url)}">${esc(label)}</a>`:'';
function wordmark(p){
 if(p.logo)return `<img class="gamedude-wordmark" src="${esc(p.logo)}" width="${p.id==='gamedude-color'?545:342}" height="50" alt="${esc(p.short)}"><span class="gamedude-platform">FM-1 / SMK-37</span>`;
 if(p.id==='doom')return '<img class="doom-wordmark" src="assets/doom-wordmark.svg" width="440" height="126" alt="Doom"><span class="doom-platform">FM-1 / SMK</span>';
 if(p.id==='nesynth')return '<img class="nesynth-wordmark" src="assets/nesynth-logo.svg" width="310" height="86" alt="NESynth"><span class="nesynth-platform">FM-1 / SMK</span>';
 return esc(p.name);
}
const cards=active.map((p,i)=>`<article id="${p.id}" class="firmware-card ${p.id}"><div class="card-top"><span class="mono">${String(i+1).padStart(2,'0')} / ${esc(p.eyebrow||'COMMUNITY PROJECT')}</span><span class="badge">${p.status==='preview'?'BROWSER PREVIEW':p.status==='beta'?'PUBLIC BETA':'RELEASED'}</span></div><a class="card-art" href="${esc(p.url)}" aria-label="Explore ${esc(p.name)}">${p.art?`<img src="${esc(p.art)}" width="960" height="${p.gallery?500:430}" alt="${esc(p.artAlt||'SMK-37 running '+p.name)}" loading="lazy">`:`<span class="next-symbol" aria-hidden="true">${esc(p.short||p.name).slice(0,2)}</span>`}</a><div class="card-copy"><h3 class="${p.id}-name">${wordmark(p)}</h3><p>${esc(p.description)}</p><ul class="tags">${(p.tags||[]).map(t=>'<li>'+esc(t)+'</li>').join('')}</ul><div class="card-actions">${link(p.url,'Explore '+(p.short||p.name)+' ↗','button card-primary')}${link(p.simulator,'Play simulator ↗')}</div><div class="card-links">${link(p.install,'Install firmware ↗','')}${link(p.games,'Add games ↗','')}${link(p.source,'Source code ↗','')}</div></div></article>`).join('');
const planned=items.filter(p=>p.status==='planned').map(p=>'<article class="up-next"><div class="next-symbol" aria-hidden="true">'+esc(p.short||p.name).slice(0,1).toLowerCase()+'<span>♪</span></div><div><p class="eyebrow">COMING TO SMK / PLANNED PORT</p><h3>'+esc(p.name)+'</h3><p>'+esc(p.description)+'</p></div>'+link(p.upstream,'Meet the original project ↗')+'</article>').join('');
const studios=active.filter(p=>p.studio&&p.screenshot).map(p=>'<article class="studio-preview '+p.id+'"><a class="preview-image" href="'+esc(p.studio)+'" aria-label="Open '+esc(p.name)+' Studio"><img src="'+esc(p.screenshot)+'" width="720" height="525" alt="'+esc(p.name)+' browser Studio preview" loading="lazy"><span class="preview-launch" aria-hidden="true">OPEN STUDIO ↗</span></a><div class="studio-links"><h3>'+esc(p.name)+'</h3>'+link(p.studio,'Studio ↗','')+link(p.simulator,'Simulator ↗','')+'</div></article>').join('');
const games=active.filter(p=>p.gallery);
const gamePreviews=games.map(p=>`<article class="game-preview ${p.id}"><div class="game-preview-copy"><p class="eyebrow">${esc(p.game)} / HOMEBREW IN ACTION</p><h3 class="${p.id}-name">${wordmark(p)}</h3><p>${esc(p.previewDescription)}</p>${link(p.simulator,'Play in browser ↗','button card-primary')}</div><a class="game-screenshot" href="${esc(p.simulator)}"><img src="${esc(p.screenshot)}" width="720" height="${p.id==='gamedude-color'?1096:1136}" alt="${esc(p.screenshotAlt)}" loading="lazy"></a><div class="device-gallery">${p.gallery.map(shot=>`<a href="${esc(p.simulator)}" aria-label="Try ${esc(p.short)} on ${esc(shot.label)} controls"><img src="${esc(shot.file)}" width="${shot.label==='FM-1'?590:940}" height="${shot.label==='FM-1'?350:370}" alt="${esc(shot.label)} illustration displaying ${esc(p.game)}" loading="lazy"><span>${esc(shot.label)}</span></a>`).join('')}</div></article>`).join('');
const featured=active.filter(p=>p.art);
const initial=featured.find(p=>p.id==='gamedude-color')||featured[0];
const caption=p=>`${String(active.indexOf(p)+1).padStart(2,'0')} / ${p.short.toUpperCase()}`;
const heroImages=featured.map(p=>`<a class="hardware${p.hero?' hardware-collage':''}${p===initial?' is-active':''}" data-voice="${p.id}" data-caption="${esc(caption(p))}" id="hero-${p.id}" href="${esc(p.url)}"${p===initial?'':' hidden inert aria-hidden="true"'} aria-label="Explore ${esc(p.name)}"><img src="${esc(p.hero||p.art)}" width="${p.hero?840:960}" height="${p.hero?650:430}" alt="${esc(p.heroAlt||p.name+' hardware illustration')}"></a>`).join('');
let html=await fs.readFile(path.join(root,'src/index.template.html'),'utf8');
const replacements={CARDS:cards,PLANNED:planned,STUDIOS:studios,GAME_PREVIEWS:gamePreviews,HERO_IMAGES:heroImages,HERO_VOICE:initial.id,HERO_CAPTION:esc(caption(initial)),SIGNAL:Array.from({length:45},(_,i)=>'<i style="--h:'+Math.round(6+Math.abs(Math.sin(i*.65)*Math.cos(i*.16))*34)+'px;--delay:'+(i*.04)+'s"></i>').join('')};
for(const [key,value] of Object.entries(replacements))html=html.replaceAll('{{'+key+'}}',value);
if(/\{\{[A-Z_]+\}\}/.test(html))throw Error('Unresolved template placeholder');
await fs.writeFile(path.join(root,'dist/index.html'),html);
console.log('Built SMK Lab: '+active.length+' projects, '+(items.length-active.length)+' planned.');
