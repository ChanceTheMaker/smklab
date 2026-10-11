import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const base=path.join(path.dirname(fileURLToPath(import.meta.url)),'dist');
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.ttf':'font/ttf','.txt':'text/plain; charset=utf-8'};
export const server=http.createServer(async(req,res)=>{try{const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);const file=path.resolve(base,'.'+(pathname.endsWith('/')?pathname+'index.html':pathname));const rel=path.relative(base,file);if(rel.startsWith('..')||path.isAbsolute(rel))throw Error('Invalid path');const data=await fs.readFile(file);res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(data);}catch{res.writeHead(404,{'Content-Type':'text/plain'});res.end('Not found');}});
await new Promise((resolve,reject)=>server.once('error',reject).listen(8788,'127.0.0.1',resolve));
console.log('SMK Lab preview: http://127.0.0.1:8788');
