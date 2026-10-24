/* One paint surface for 200 independent troops. Cache raster art and HUD skins;
   combat, exact HP, poses and foot anchors remain owned by app.js. */
(()=>{
  const makeCanvas=(w,h=w)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c;};
  const image=async src=>{const i=new Image();i.src=src;await i.decode();return i;};
  const round=(c,x,y,w,h,r,color)=>{if(w<=0||h<=0)return;c.fillStyle=color;c.beginPath();c.roundRect(x,y,w,h,Math.min(r,w/2,h/2));c.fill();};
  window.CrowdCanvas={async prepare(frames,fits){
    const art={},teams={};
    // Cache the full visible silhouette at unchanged resolution. Remove only
    // transparent padding, retaining its original registration for all weapons.
    await Promise.all(Object.entries(frames).flatMap(([kind,poses])=>Object.entries(poses).map(async([pose,src])=>{
      const source=await image(src),w=384,h=Math.max(1,Math.round(w*source.naturalHeight/source.naturalWidth)),a=makeCanvas(w,h),b=makeCanvas(w,h),ctx=a.getContext('2d'),out=b.getContext('2d');
      ctx.imageSmoothingQuality='high';out.imageSmoothingQuality='high';ctx.filter='saturate(1.04) contrast(1.03)';ctx.drawImage(source,0,0,w,h);out.filter='saturate(1.06) contrast(1.04)';out.drawImage(a,0,0);
      const pixels=out.getImageData(0,0,w,h).data;let left=w,top=h,right=-1,bottom=-1;
      for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(pixels[(y*w+x)*4+3]){left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);}
      // Bake the quality-color silhouette once per art pose. Registration stays in
      // the original source coordinates, including strokes outside its canvas.
      const radius=1.3/(fits[kind][pose].width/100*50)*w,pad=Math.ceil(radius)+2;
      const mask=makeCanvas(w,h),mc=mask.getContext('2d');mc.drawImage(b,0,0);mc.globalCompositeOperation='source-in';mc.fillStyle=window.TroopOutline.colorOf(kind);mc.fillRect(0,0,w,h);
      const edged=makeCanvas(w+pad*2,h+pad*2),ec=edged.getContext('2d');
      for(let i=0;i<24;i++){const angle=i*Math.PI/12;ec.drawImage(mask,pad+Math.cos(angle)*radius,pad+Math.sin(angle)*radius);}
      ec.drawImage(b,pad,pad);
      // Retain the full stroke and the bilinear filtering boundary.

      left-=pad;top-=pad;right+=pad;bottom+=pad;
      if(right<left||bottom<top){left=top=0;right=w-1;bottom=h-1;}
      const cw=right-left+1,ch=bottom-top+1;
      (art[kind]??={})[pose]={image:await createImageBitmap(edged,left+pad,top+pad,cw,ch),x:left/w,y:top/h,width:cw/w,height:ch/h};
    })));
    for(const [team,src] of Object.entries({blue:'./frame-assets/ally-cyan-blue-v002.webp',red:'./frame-assets/enemy-brick-red-v002.webp'}))teams[team]=await image(src);
    const shadow=makeCanvas(128),sc=shadow.getContext('2d');sc.fillStyle='#171b26';sc.beginPath();sc.arc(64,64,64,0,Math.PI*2);sc.fill();
    return {create(board){
      let canvas=makeCanvas(1);canvas.id='crowdCanvas';canvas.setAttribute('aria-label','独立战斗小兵、血条及等级');canvas.setAttribute('role','img');canvas.hidden=true;board.append(canvas);
      let gpu,c,lastSize='',font='',layout=[];const tinted=new Map(),hudCache=new Map();
      function fallback(){const old=canvas;canvas=old.cloneNode(false);old.replaceWith(canvas);gpu=null;c=canvas.getContext('2d');lastSize='';}
      try{gpu=window.SpriteBatch?.create(canvas);c=gpu||canvas.getContext('2d');}catch(e){console.warn('Batch renderer fallback',e.message);fallback();}
      canvas.addEventListener('webglcontextlost',()=>fallback());
      const staticImages=[...Object.entries(art).filter(([key])=>key.includes('@')||!art[key+'@up']||!art[key+'@down']).flatMap(([,poses])=>Object.values(poses).map(a=>a.image)),...Object.values(teams),shadow];
      try{gpu?.preload(staticImages);}catch(e){console.warn('Atlas preparation fallback',e.message);fallback();}
      function clearPaintCaches(){tinted.clear();hudCache.clear();if(gpu){gpu.reset();gpu.preload(staticImages);}}
      function frame(team,brightness){if(brightness===1)return teams[team];const key=team+':'+brightness;if(tinted.has(key))return tinted.get(key);if(tinted.size>8)clearPaintCaches();const a=makeCanvas(512),p=a.getContext('2d');p.filter=`brightness(${brightness})`;p.drawImage(teams[team],0,0);tinted.set(key,a);return a;}
      function hudSkin(team,width){
        // Only cache the static track/badge. HP fill stays exact and animates.
        const w=Math.round(width*2)/2,key=team+':'+w;
        if(hudCache.has(key))return hudCache.get(key);
        if(hudCache.size>=256)clearPaintCaches();
        const a=makeCanvas(Math.ceil((w+15)*2),24),p=a.getContext('2d');p.scale(2,2);p.translate(13,3);
        round(p,0,1,w,5,2,'#11192366');round(p,0,0,w,5,2,'#293039');
        p.fillStyle=team==='red'?'#ff4960':'#2877ff';p.beginPath();p.arc(-6.5,2.5,5.5,0,Math.PI*2);p.fill();p.strokeStyle='#111923';p.lineWidth=1;p.beginPath();p.arc(-6.5,2.5,5,0,Math.PI*2);p.stroke();
        p.font=`1000 8px ${font}`;p.textAlign='center';p.textBaseline='middle';p.fillStyle='#fff';p.fillText('1',-6.5,2.75);
        const skin={image:a,w};hudCache.set(key,skin);return skin;
      }
      return {get canvas(){return canvas;},get stats(){return gpu?.stats||{backend:'canvas2d'};},get layout(){return layout;},show(on){if(canvas.hidden===on){canvas.hidden=!on;board.classList.toggle('crowd-canvas-mode',on);}},draw(rows,view){
        const {left,top,width,height,dpr,brightness,drawFrames,fontFamily}=view,key=[left,top,width,height,dpr].join(':');
        if(lastSize!==key){lastSize=key;canvas.width=Math.ceil(width*dpr);canvas.height=Math.ceil(height*dpr);Object.assign(canvas.style,{left:left+'px',top:top+'px',width:width+'px',height:height+'px'});font=fontFamily;}
        c.imageSmoothingQuality='high';c.setTransform(dpr,0,0,dpr,-left*dpr,-top*dpr);c.clearRect(left,top,width,height);layout=rows;
        for(const r of rows){const s=r.shadow;c.globalAlpha=s.opacity;c.drawImage(shadow,s.x-s.halfX*s.scale,s.y-s.halfY*s.scale,s.halfX*2*s.scale,s.halfY*2*s.scale);}c.globalAlpha=1;
        for(const r of rows){
          const {x,y,scale,g,m,face,team,hud,frame:f}=r;
          const sx=scale*dpr,tx=(x-g.width*scale/2-left)*dpr,ty=(y-g.height*scale/2-top)*dpr;
          c.setTransform(sx,0,0,sx,tx,ty);
          if(drawFrames)c.drawImage(frame(team,brightness),f.x-f.size/2,f.y-f.size/2,f.size,f.size);
          const angle=m.angle*Math.PI/180,co=Math.cos(angle),si=Math.sin(angle),flip=face?-1:1,k=sx*m.scale;
          c.setTransform(co*k*flip,si*k*flip,-si*k,co*k,tx+(g.left+g.sizeX/2+m.x*g.sizeX/50)*sx,ty+(g.top+g.sizeY/2+m.y*g.sizeX/50)*sx);
          const fit=fits[r.kind][m.pose],a=art[r.kind][m.pose],fw=fit.width/100*g.sizeX,fh=fit.height/100*g.sizeY;
          c.drawImage(a.image,(fit.left/100-.5)*g.sizeX+a.x*fw,(fit.top/100-.5)*g.sizeY+a.y*fh,a.width*fw,a.height*fh);
          c.setTransform(sx,0,0,sx,tx,ty);
          const {x:hx,y:hy,width:w,pixel:p}=hud,skin=hudSkin(team,w/p);
          c.drawImage(skin.image,hx-13*p,hy-3*p,skin.image.width/2*p,12*p);
          round(c,hx+p,hy+p,Math.max(0,w-2*p)*r.hpDisplay,3*p,2*p,team==='red'?'#f56861':'#a7df54');
          c.strokeStyle='#111923';c.lineWidth=p;c.beginPath();c.roundRect(hx+p/2,hy+p/2,Math.max(0,w-p),4*p,1.5*p);c.stroke();
        }
        c.setTransform(1,0,0,1,0,0);gpu?.finish();
      }};
    }};
  }};
})();
