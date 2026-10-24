/* Ground-space charge: fixed-heading long dash and swept contacts; short sweep retained for elephant/review. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.CavalryCharge=api;})(typeof window==='object'?window:this,function(){
  const clamp=p=>Math.max(0,Math.min(1,p));
  function progress(p){p=clamp(p);return p*p*(2-p);}
  function distance(t){t=Math.max(0,t);const ramp=.30,p=clamp(t/ramp);return 1.1*t+6.3*(t<ramp?ramp*(p*p*p-p*p*p*p/2):t-ramp/2);}
  function step(t,dt){return distance(t)-distance(Math.max(0,t-dt));}
  function sweep(from,target,travel,enemies,radius){
    const dx=target.x-from.x,dy=target.y-from.y,length=Math.hypot(dx,dy)||1,nx=dx/length,ny=dy/length;
    let amount=Math.min(travel,Math.max(0,length-radius(target)-.015)),hit=target;
    for(const enemy of enemies){const ex=enemy.x-from.x,ey=enemy.y-from.y,along=ex*nx+ey*ny,side=Math.abs(ex*ny-ey*nx),r=radius(enemy)+.015;
      if(along>=0&&side<r){const limit=Math.max(0,along-Math.sqrt(r*r-side*side));if(limit<amount){amount=limit;hit=enemy;}}
    }
    return {x:from.x+nx*amount,y:from.y+ny*amount,hit};
  }
  // Segment/circle contact covers low frame rates without teleporting through victims.
  function contacts(from,to,enemies,radius){
    const dx=to.x-from.x,dy=to.y-from.y,l2=dx*dx+dy*dy;
    return enemies.map(target=>{const p=l2?clamp(((target.x-from.x)*dx+(target.y-from.y)*dy)/l2):0;
      return {target,p,distance:Math.hypot(target.x-from.x-dx*p,target.y-from.y-dy*p)};
    }).filter(hit=>hit.distance<=radius(hit.target)+.015).sort((a,b)=>a.p-b.p);
  }
  return Object.freeze({progress,step,sweep,contacts,length:6.4,windup:.28});
});
