/* Presentation-only helpers. No combat timing, random values, HP or target mutation. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.TroopMotionFeedback=api;})(typeof window==='object'?window:this,function(){
  'use strict';
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  function weight(def){return def.giant?'elephant':def.machine?'machine':def.mounted||def.charge||def.movingShot?'mounted':'light';}
  const weights={light:{hold:.028,recover:.065,power:1,motion:1},mounted:{hold:.070,recover:.150,power:1.35,motion:1.08},elephant:{hold:.100,recover:.240,power:1.65,motion:1.22},machine:{hold:.048,recover:.110,power:1.20,motion:1.10}};
  function contact(def,feel,rate){const w=weights[weight(def)],speed=Math.max(1,rate);return {weight:weight(def),hold:clamp(w.hold*feel,0,.11),release:clamp(.055/Math.sqrt(speed/3),.042,.070),recover:w.recover/Math.sqrt(speed/2),strength:clamp(feel*w.power,0,2)};}
  function lifetimes(rate){const speed=Math.sqrt(Math.max(1,rate));return {impact:clamp(.23/speed,.075,.17),number:clamp(.65/speed,.23,.52),merge:clamp(.24/speed,.055,.13)};}
  function dimensions(family,sourceSize,targetSize){
    const size=clamp(Math.sqrt(Math.max(1,sourceSize)/32),.6,2.1),target=clamp(Math.sqrt(Math.max(1,targetSize)/32),.6,2.1);
    const bow=family==='bow_shot',base={bow_shot:15,spear_thrust:21,shield_short_strike:21,siege_projectile:29,cast_projectile:20}[family]||25;
    return {projectileWidth:clamp((bow?27:22)*size,bow?16:13,bow?48:44),projectileHeight:clamp((bow?10:22)*size,bow?6:13,bow?18:44),impact:clamp(base*Math.min(size,target),10,54)};
  }
  function launch(family,frame,dx,dy){
    const length=Math.hypot(dx,dy)||1,nx=dx/length,ny=dy/length;
    // A stable weapon-side anchor inside the original three-pose frame envelope.
    const along=family==='siege_projectile'?.32:family==='cast_projectile'?.12:.34;
    const side=family==='bow_shot'?.15:0;
    return {x:frame.x+nx*frame.halfX*along-ny*frame.halfX*side,y:frame.y+ny*frame.halfY*along+nx*frame.halfY*side-frame.halfY*(family==='cast_projectile'?.14:.06)};
  }
  function weighted(sample,def,phase,p,dx,dy){
    const w=weights[weight(def)],r={...sample};
    if(phase!=='idle'){
      const pulse=Math.sin(Math.PI*clamp(p,0,1)),body=weight(def)==='elephant'?(phase==='attack_windup'?-.32:.22):weight(def)==='machine'?(phase==='attack'?-.28:.08):0;
      r.x=r.x*w.motion+dx*body*pulse;r.y=r.y*w.motion+dy*body*pulse;r.angle=clamp(r.angle*w.motion,-2,2);
      const length=Math.hypot(r.x,r.y);if(length>1.6){r.x*=1.6/length;r.y*=1.6/length;}
    }
    return r;
  }
  // Presentation-only continuity across raster-pose, strike-hold and receiver boundaries.
  // Explicit phase inspection (dt=0) stays exact. Pause never advances this filter.
  function present(sample,previous,dt){
    if(!previous||dt<=0)return {...sample};
    const a=1-Math.exp(-Math.min(dt,.1)/.045),r={...sample};
    for(const key of ['x','y','angle','scale'])r[key]=previous[key]+(sample[key]-previous[key])*a;
    return r;
  }
  return Object.freeze({version:'stable-attack-v031',present,weight,contact,lifetimes,dimensions,launch,weighted});
});
