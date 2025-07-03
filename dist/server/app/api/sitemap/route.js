(()=>{var e={};e.id=860,e.ids=[860],e.modules={399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},8893:e=>{"use strict";e.exports=require("buffer")},4770:e=>{"use strict";e.exports=require("crypto")},7702:e=>{"use strict";e.exports=require("events")},2615:e=>{"use strict";e.exports=require("http")},8791:e=>{"use strict";e.exports=require("https")},8216:e=>{"use strict";e.exports=require("net")},8621:e=>{"use strict";e.exports=require("punycode")},6162:e=>{"use strict";e.exports=require("stream")},2452:e=>{"use strict";e.exports=require("tls")},7360:e=>{"use strict";e.exports=require("url")},1568:e=>{"use strict";e.exports=require("zlib")},8359:()=>{},3739:()=>{},4905:(e,t,r)=>{"use strict";r.r(t),r.d(t,{originalPathname:()=>h,patchFetch:()=>g,requestAsyncStorage:()=>l,routeModule:()=>c,serverHooks:()=>m,staticGenerationAsyncStorage:()=>d});var s={};r.r(s),r.d(s,{GET:()=>p});var i=r(9303),a=r(8716),o=r(670),n=r(7070),u=r(5662);async function p(){try{let{data:e}=await u.OQ.from("listings").select("id, updated_at").eq("status","active").order("updated_at",{ascending:!1}),t="http://localhost:3001",r=`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${t}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${t}/search</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${t}/auth/signin</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${t}/auth/signup</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  ${e?.map(e=>`
  <url>
    <loc>${t}/listings/${e.id}</loc>
    <lastmod>${e.updated_at}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join("")||""}
</urlset>`;return new n.NextResponse(r,{headers:{"Content-Type":"application/xml","Cache-Control":"public, max-age=3600, s-maxage=3600"}})}catch(e){return console.error("Error generating sitemap:",e),new n.NextResponse("Error generating sitemap",{status:500})}}let c=new i.AppRouteRouteModule({definition:{kind:a.x.APP_ROUTE,page:"/api/sitemap/route",pathname:"/api/sitemap",filename:"route",bundlePath:"app/api/sitemap/route"},resolvedPagePath:"/Users/sharathchandra/Documents/Make it_2025/sample/UniNest/UniNest/app/api/sitemap/route.ts",nextConfigOutput:"",userland:s}),{requestAsyncStorage:l,staticGenerationAsyncStorage:d,serverHooks:m}=c,h="/api/sitemap/route";function g(){return(0,o.patchFetch)({serverHooks:m,staticGenerationAsyncStorage:d})}},5662:(e,t,r)=>{"use strict";r.d(t,{OQ:()=>s});let s=(0,r(2438).eI)("https://your-project-ref.supabase.co","your_supabase_anon_key_here",{auth:{autoRefreshToken:!0,persistSession:!0,detectSessionInUrl:!0},realtime:{params:{eventsPerSecond:2}}})}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),s=t.X(0,[276,972,438],()=>r(4905));module.exports=s})();