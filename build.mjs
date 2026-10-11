import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
const items=JSON.parse(await fs.readFile(path.join(root,'src/firmwares.json'),'utf8'));
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ids=new Set();
for(const p of items){
 if(!/^[a-z0-9-]+$/.test(p.id)||ids.has(p.id))throw Error('Invalid/duplicate ID');
 ids.add(p.id);
 if(!p.name||!p.description)throw Error('Name and description required');
 for(const field of ['url','source','upstream','studio','simulator','install'])if(p[field]&&new URL(p[field]).protocol!=='https:')throw Error('HTTPS required');
 if(!['beta','released','planned'].includes(p.status))throw Error('Unknown status');
 if(p.status!=='planned'&&!p.url)throw Error('Published listings require a website');
 for(const field of ['art','screenshot'])if(p[field]){if(!/^assets\/[a-zA-Z0-9_./-]+$/.test(p[field])||p[field].includes('..'))throw Error('Invalid asset path');await fs.access(path.join(root,'dist',p[field]));}
}
const active=items.filter(p=>p.status!=='planned');
const link=(url,label,classes='text-link')=>url?'<a class="'+classes+'" href="'+esc(url)+'">'+esc(label)+'</a>':'';
const cards=active.map((p,i)=>'<article class="firmware-card '+p.id+'"><div class="card-top"><span class="mono">'+String(i+1).padStart(2,'0')+' / '+esc(p.eyebrow||'COMMUNITY PROJECT')+'</span><span class="badge">'+(p.status==='beta'?'PUBLIC BETA':'RELEASED')+'</span></div><div class="card-art">'+(p.art?'<img src="'+esc(p.art)+'" width="960" height="430" alt="SMK-37 running '+esc(p.name)+'" loading="lazy">':'<span class="next-symbol" aria-hidden="true">'+esc(p.short||p.name).slice(0,2)+'</span>')+'</div><div class="card-copy"><h3 class="'+p.id+'-name">'+esc(p.name)+'</h3><p>'+esc(p.description)+'</p><ul class="tags">'+(p.tags||[]).map(t=>'<li>'+esc(t)+'</li>').join('')+'</ul><div class="card-actions">'+link(p.url,'Explore '+(p.short||p.name)+' ↗','button card-primary')+link(p.simulator,'Play simulator ↗')+'</div><div class="card-links">'+link(p.install,'Install firmware ↗','')+link(p.source,'Source code ↗','')+'</div></div></article>').join('');
const planned=items.filter(p=>p.status==='planned').map(p=>'<article class="up-next"><div class="next-symbol" aria-hidden="true">'+esc(p.short||p.name).slice(0,1).toLowerCase()+'<span>♪</span></div><div><p class="eyebrow">COMING TO SMK / PLANNED PORT</p><h3>'+esc(p.name)+'</h3><p>'+esc(p.description)+'</p></div>'+link(p.upstream,'Meet the original project ↗')+'</article>').join('');
const studios=active.filter(p=>p.studio&&p.screenshot).map(p=>'<article class="studio-preview '+p.id+'"><a class="preview-image" href="'+esc(p.studio)+'" aria-label="Open '+esc(p.name)+' Studio"><img src="'+esc(p.screenshot)+'" width="720" height="525" alt="'+esc(p.name)+' browser Studio preview" loading="lazy"><span class="preview-launch" aria-hidden="true">OPEN STUDIO ↗</span></a><div class="studio-links"><h3>'+esc(p.name)+'</h3>'+link(p.studio,'Studio ↗','')+link(p.simulator,'Simulator ↗','')+'</div></article>').join('');
let html=await fs.readFile(path.join(root,'src/index.template.html'),'utf8');
html=html.replace('{{CARDS}}',cards).replace('{{PLANNED}}',planned).replace('{{STUDIOS}}',studios).replace('{{SIGNAL}}',Array.from({length:45},(_,i)=>'<i style="--h:'+Math.round(6+Math.abs(Math.sin(i*.65)*Math.cos(i*.16))*34)+'px;--delay:'+(i*.04)+'s"></i>').join(''));
await fs.writeFile(path.join(root,'dist/index.html'),html);
console.log('Built SMK Lab: '+active.length+' projects, '+(items.length-active.length)+' planned.');
