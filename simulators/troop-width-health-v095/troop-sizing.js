/* Stable silhouette-area calibration and centered absolute-percentage controls. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.TroopSizing=api;})(typeof window==='object'?window:this,function(){
  const defaults=Object.freeze({troopScale:1.7,mounted:.8,flying:.65,giant:.55,machine:1.05});
  const min=.5,max=5,step=.05;
  const clamp=v=>Math.max(min,Math.min(max,v));
  function fromPosition(key,position){const center=defaults[key],p=Math.max(0,Math.min(100,Number(position)));return Math.round(clamp(p<=50?min+(center-min)*p/50:center+(max-center)*(p-50)/50)/step)*step;}
  function toPosition(key,value){const center=defaults[key],v=clamp(Number(value));return v<=center?(v-min)/(center-min)*50:50+(v-center)/(max-center)*50;}
  function calibrate(rows){
    const groups={};for(const row of rows)(groups[row.category]??=[]).push(row);
    const result={};
    for(const group of Object.values(groups)){
      const areas=group.map(r=>r.area*r.base*r.base).sort((a,b)=>a-b),middle=areas.length>>1,target=areas.length%2?areas[middle]:(areas[middle-1]+areas[middle])/2;
      for(const row of group)result[row.kind]={category:row.category,area:row.area,target,scale:Math.sqrt(target/row.area)};
    }
    return result;
  }
  function migrate(saved){return {...saved,...(saved?.sizePreset==='screenshot-v048'?{}:defaults)};}
  return Object.freeze({defaults,min,max,step,fromPosition,toPosition,calibrate,migrate});
});
