/* A bounded, single-surface charge cue. Only real ground travel leaves a trail.
   No combat mutation, per-particle DOM, timers, images or full-screen shake. */
(()=>{
  const LIMIT=24,TAIL=.20;
  window.ChargeFeedback={limit:LIMIT,tail:TAIL,create(board){
    const canvas=document.createElement('canvas');canvas.id='chargeFeedback';canvas.setAttribute('aria-hidden','true');canvas.hidden=true;board.append(canvas);
    const c=canvas.getContext('2d'),tracks=new Map();let stamp=0,lastSize='',painted=0;
    function clear(){tracks.clear();c.clearRect(0,0,canvas.width,canvas.height);canvas.hidden=true;painted=0;}
    return {clear,get stats(){return {tracks:tracks.size,points:[...tracks.values()].reduce((n,t)=>n+t.points.length,0),painted,limit:LIMIT};},draw(rows,view,dt){
      stamp+=Math.max(0,dt);const live=new Set(rows.map(r=>r.id));
      for(const r of rows){let t=tracks.get(r.id);if(!t){if(tracks.size>=LIMIT){const oldest=[...tracks].find(([id])=>!live.has(id));if(oldest)tracks.delete(oldest[0]);else continue;}tracks.set(r.id,t={points:[]});}
        const last=t.points.at(-1);if(!last||Math.hypot(r.x-last.x,r.y-last.y)>.5){t.points.push({x:r.x,y:r.y,t:stamp});if(t.points.length>10)t.points.shift();}
        t.row=r;t.at=stamp;
      }
      for(const [id,t] of tracks){while(t.points.length>1&&stamp-t.points[0].t>TAIL)t.points.shift();if(!live.has(id)&&stamp-t.at>=TAIL)tracks.delete(id);}
      if(!tracks.size){if(!canvas.hidden)clear();return;}
      const {left,top,width,height,dpr}=view,key=[left,top,width,height,dpr].join(':');
      if(lastSize!==key){lastSize=key;canvas.width=Math.ceil(width*dpr);canvas.height=Math.ceil(height*dpr);Object.assign(canvas.style,{left:left+'px',top:top+'px',width:width+'px',height:height+'px'});}
      canvas.hidden=false;c.setTransform(dpr,0,0,dpr,-left*dpr,-top*dpr);c.clearRect(left,top,width,height);c.lineCap='round';painted=0;
      for(const t of tracks.values()){
        const r=t.row,fade=Math.max(0,1-(stamp-t.at)/TAIL),span=r.span,px=-r.ny,py=r.nx;
        c.save();c.globalAlpha=fade;
        if(live.has(r.id)&&r.phase==='attack_windup'){
          // Low foot bracing strokes, not another frame around the rider.
          const p=Math.min(1,r.p),offset=span*(.30-.12*p);c.strokeStyle='#fff0b6';c.lineWidth=1.8;
          for(const side of [-1,1]){c.beginPath();c.moveTo(r.x+px*offset*side-r.nx*span*.16,r.y+py*offset*side-r.ny*span*.16);c.lineTo(r.x+px*offset*side-r.nx*span*.42,r.y+py*offset*side-r.ny*span*.42);c.stroke();}
          painted++;c.restore();continue;
        }
        if(t.points.length>1){
          const first=t.points[0],last=t.points.at(-1),length=Math.hypot(last.x-first.x,last.y-first.y);
          if(length>2){
            for(const side of [-1,0,1]){const offset=span*.19*side;c.globalAlpha=fade*(side===0?.60:.84);c.strokeStyle=side===0?'#b99565':'#fff1bc';c.lineWidth=side===0?span*.23:1.7;c.beginPath();for(let i=0;i<t.points.length;i++){const a=t.points[i],x=a.x+px*offset-r.nx*span*.22,y=a.y+py*offset-r.ny*span*.22;i?c.lineTo(x,y):c.moveTo(x,y);}c.stroke();}
            // Three fixed dust puffs follow the measured path and fade quickly.
            for(let i=0;i<3;i++){const a=t.points[Math.floor((t.points.length-1)*i/3)],age=Math.min(1,(stamp-a.t)/TAIL);c.globalAlpha=fade*(1-age)*.52;c.fillStyle='#d7bc89';c.beginPath();c.ellipse(a.x+px*span*.17*(i%2?1:-1),a.y+py*span*.17*(i%2?1:-1),span*(.06+age*.10),span*(.035+age*.05),0,0,Math.PI*2);c.fill();}
            painted++;
          }
        }
        c.restore();
      }
      c.globalAlpha=1;
    }};
  }};
})();
