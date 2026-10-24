/* The existing target-owned damage numbers keep their values, slots, timing,
   colors and shadows. Only their paint submission is shared in crowded scenes. */
(()=>{
  window.DamageCanvas={create(board){
    const canvas=document.createElement('canvas');canvas.id='damageCanvas';canvas.setAttribute('aria-hidden','true');board.append(canvas);
    const ctx=canvas.getContext('2d'),styles=new Map(),glyphs=new Map();let drawn=0;
    function glyph(el){
      let style=styles.get(el.className);
      if(!style){const css=getComputedStyle(el);style={font:`${css.fontWeight} ${css.fontSize} ${css.fontFamily}`,color:css.color,height:parseFloat(css.lineHeight),shadows:[...css.textShadow.matchAll(/(rgba?\([^)]+\))\s+(-?[\d.]+)px\s+(-?[\d.]+)px\s+([\d.]+)px/g)].map(m=>({color:m[1],x:+m[2],y:+m[3],blur:+m[4]}))};styles.set(el.className,style);}
      const key=el.className+'|'+el.textContent;let g=glyphs.get(key);if(g)return g;
      const image=document.createElement('canvas'),c=image.getContext('2d');c.font=style.font;const metrics=c.measureText(el.textContent),width=metrics.width,pad=4,ratio=4;
      image.width=Math.ceil((width+pad*2)*ratio);image.height=Math.ceil((style.height+pad*2)*ratio);c.scale(ratio,ratio);c.font=style.font;c.textBaseline='alphabetic';
      const ascent=metrics.fontBoundingBoxAscent??12,descent=metrics.fontBoundingBoxDescent??3,baseline=pad+(style.height-ascent-descent)/2+ascent;
      // CSS paints its first text shadow on top of the following shadows.
      for(const shadow of [...style.shadows].reverse()){c.fillStyle=shadow.color;c.fillText(el.textContent,pad+shadow.x,baseline+shadow.y);}
      c.fillStyle=style.color;c.fillText(el.textContent,pad,baseline);
      g={image,width:width+pad*2,height:style.height+pad*2,boxWidth:width,boxHeight:style.height,pad};
      glyphs.set(key,g);if(glyphs.size>512)glyphs.delete(glyphs.keys().next().value);return g;
    }
    return {show(on){canvas.hidden=!on;},get stats(){return{drawn,glyphs:glyphs.size,canvas:[canvas.width,canvas.height]};},draw(numbers,view){
      const {left,top,width,height,dpr}=view,w=Math.ceil(width*dpr),h=Math.ceil(height*dpr);
      if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}
      Object.assign(canvas.style,{left:`${left}px`,top:`${top}px`,width:`${width}px`,height:`${height}px`});
      ctx.setTransform(dpr,0,0,dpr,-left*dpr,-top*dpr);ctx.clearRect(left,top,width,height);drawn=0;
      for(const n of numbers){if(!n.el.isConnected)continue;const g=glyph(n.el),x=Math.trunc(n.el.sharedX*64)/64,y=Math.trunc(n.el.sharedY*64)/64;
        ctx.globalAlpha=n.opacity??1;ctx.drawImage(g.image,x-g.boxWidth/2-g.pad,y-g.boxHeight/2-g.pad-(n.rise||0),g.width,g.height);drawn++;}
      ctx.globalAlpha=1;
    }};
  }};
})();
