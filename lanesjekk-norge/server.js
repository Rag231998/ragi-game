'use strict';
const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const root=__dirname;
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.ico':'image/x-icon','.woff2':'font/woff2','.mp4':'video/mp4','.webm':'video/webm','.txt':'text/plain; charset=utf-8'};
const server=http.createServer(async(req,res)=>{
 try{
  const url=new URL(req.url||'/', 'http://localhost');
  const pathname=decodeURIComponent(url.pathname);
  if(pathname==='/health'){res.writeHead(200,{'Content-Type':'application/json'});return res.end(JSON.stringify({ok:true,service:'lanesjekk-norge'}));}
  if(pathname.startsWith('/api/')){
   if(!/^\/api\/[a-z0-9-]+$/i.test(pathname)){res.writeHead(404);return res.end('Not found');}
   const handlerPath=path.resolve(root,'.'+pathname+'.js');
   if(!handlerPath.startsWith(path.join(root,'api')+path.sep)||!fs.existsSync(handlerPath)){res.writeHead(404);return res.end('Not found');}
   const handler=require(handlerPath);
   const query=Object.fromEntries(url.searchParams);
   const response={
    setHeader:(...a)=>res.setHeader(...a),
    status(code){res.statusCode=code;return this},
    json(payload){if(res.writableEnded)return this;res.setHeader('Content-Type','application/json; charset=utf-8');res.end(JSON.stringify(payload));return this},
    end:(...a)=>res.end(...a),
   };
   await handler({method:req.method,query,headers:req.headers,url:req.url,stream:req},response);
   if(!res.writableEnded)res.end();
   return;
  }
  if(req.method!=='GET'&&req.method!=='HEAD'){res.writeHead(405);return res.end('Method not allowed');}
  const requested=pathname==='/'?'index.html':pathname.replace(/^\//,'');
  const resolved=path.resolve(root,requested);
  if(!resolved.startsWith(root+path.sep)||requested.includes('\\')||/^(api|node_modules|\.git)\//.test(requested)||requested.startsWith('.')){res.writeHead(403);return res.end('Forbidden');}
  fs.stat(resolved,(err,stat)=>{
   if(err||!stat.isFile()){res.writeHead(404);return res.end('Not found');}
   res.writeHead(200,{'Content-Type':mime[path.extname(resolved).toLowerCase()]||'application/octet-stream','Cache-Control':pathname==='/'||path.extname(resolved)==='.html'?'no-cache':'public, max-age=300'});
   if(req.method==='HEAD')return res.end();
   fs.createReadStream(resolved).pipe(res);
  });
 }catch(e){if(!res.headersSent)res.writeHead(500,{'Content-Type':'application/json'});res.end(JSON.stringify({error:'Internal server error'}));}
});
if(require.main===module)server.listen(Number(process.env.PORT)||3000,'0.0.0.0',()=>console.log('Lånesjekk Norge listening'));
module.exports=server;
