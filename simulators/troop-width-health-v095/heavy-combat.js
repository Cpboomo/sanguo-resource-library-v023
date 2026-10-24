/* Ground-space combat policies. Presentation and terrain clipping belong to app.js. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.HeavyCombat=api;})(typeof window==='object'?window:this,function(){
  'use strict';
  const stone=kind=>kind==='b4_wei'||kind==='b4_qun';
  // Elephants and stone siege resist cavalry launches, but not ground-area launches.
  function canLaunch(kind,def,type='charge'){return type!=='charge'||!(def.giant||stone(kind));}
  const blocksCharge=()=>false;
  function launchProfile(def,type='charge'){
    const assembly=def.giant||def.machine;
    const distance=type==='charge'?(assembly?.5:def.heavy?1.15:def.charge?1.3:1.55):(assembly?.18:.5);
    return {distance,lift:assembly?.42:1,tilt:assembly?10:30};
  }
  function falloff(distance,radius){return distance>radius?0:1-.55*Math.min(1,Math.max(0,distance)/radius);}
  function resistance(def){return def.giant?.08:def.machine?.12:def.heavy?.55:1;}
  function radial(source,centre,enemies,radius,amount,primary,defFor=t=>t){
    return enemies.filter(t=>t.alive&&t.team!==source.team&&!defFor(t).air).map(target=>{
      const distance=Math.hypot(target.x-centre.x,target.y-centre.y),power=target===primary?1:falloff(distance,radius);
      return {target,distance,amount:Math.max(1,Math.round(amount*power)),power};
    }).filter(hit=>hit.power>0);
  }
  return Object.freeze({stone,canLaunch,blocksCharge,launchProfile,falloff,resistance,radial,blastRadius:1.25,effectLimit:32});
});
