'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const read=file=>fs.readFileSync(path.join(__dirname,'..',file),'utf8');
const html=read('index.html');
const robots=read('robots.txt');
const sitemap=read('sitemap.xml');
const canonicalMatch=html.match(/<link\s+rel="canonical"\s+href="([^"]+)"\s*\/?\s*>/);
const canonical=canonicalMatch?.[1];

test('site has a single valid absolute HTTPS canonical URL',()=>{
  assert.ok(canonical,'Missing canonical URL');
  assert.match(canonical,/^https:\/\/[^\s]+\/$/);
  assert.equal((html.match(/rel="canonical"/g)||[]).length,1);
  assert.ok(!canonical.includes('github.io'),'GitHub preview is not the canonical website');
});
test('sitemap and robots.txt refer to the current canonical production host',()=>{
  assert.equal((sitemap.match(/<loc>/g)||[]).length,3);
  assert.ok(sitemap.includes('<loc>'+canonical+'</loc>'));
  const sitemapUrl=new URL('sitemap.xml',canonical).href;
  assert.ok(robots.includes('Sitemap: '+sitemapUrl));
  assert.match(robots,/User-agent:\s*\*/);
  assert.match(robots,/Allow:\s*\//);
  assert.doesNotMatch(robots,/Disallow:\s*\//);
});
test('search and social metadata is descriptive and points to one origin',()=>{
  assert.match(html,/<html lang="nb">/);
  assert.match(html,/<meta name="description" content="[^"]+">/);
  assert.match(html,/name="robots" content="index,follow/);
  assert.match(html,/<meta property="og:title"/);
  assert.ok(html.includes('<meta property="og:url" content="'+canonical+'">'));
  assert.match(html,/<h1>.+?<em>.*?<\/em><\/h1>/);
});
test('structured data accurately describes the free, user-supplied calculator',()=>{
  const raw=html.match(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/)?.[1];
  assert.ok(raw,'Missing JSON-LD');
  const data=JSON.parse(raw);
  assert.equal(data['@type'],'WebApplication');
  assert.equal(data.url,canonical);
  assert.equal(data.inLanguage,'nb-NO');
  assert.equal(data.isAccessibleForFree,true);
  assert.equal(data.offers.price,'0');
  assert.match(data.description,/manuelt innlagte banktilbud/);
});

test('the portal savings and guides pages have canonical addresses and helpful descriptions',()=>{
 for(const file of ['sparing.html','guider.html']){
  const page=read(file);
  const url='https://lanesjekk-norge.vercel.app/'+file;
  assert.ok(page.includes('<link rel="canonical" href="'+url+'">'),file+' must have absolute canonical URL');
  assert.ok(sitemap.includes('<loc>'+url+'</loc>'),file+' must be discoverable');
  assert.match(page,/<meta name="description" content="[^"]+"/);
  assert.match(page,/<html lang="nb">/);
 }
});
test('homepage has real navigation to savings, knowledge and existing mortgage calculator',()=>{
 assert.ok(html.includes('href="./sparing.html"'));
 assert.ok(html.includes('href="./guider.html"'));
 assert.ok(html.includes('id="sjekk"'));
 assert.ok(html.includes('id="banker"'));
});
