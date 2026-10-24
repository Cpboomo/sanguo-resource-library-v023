(function(root){
  'use strict';
  function create(kinds){
    if(!kinds.length||new Set(kinds).size!==kinds.length||kinds.length>49)throw new Error('Barracks requires 1–49 unique troop kinds');
    const cells=['red','blue'].flatMap(team=>Array.from({length:49},(_,i)=>({id:`camp-${team}-${i}`,team,kind:kinds[i%kinds.length],hp:360,maxHp:360,alive:true,column:i%7,row:Math.floor(i/7),x:i%7,y:team==='red'?6-Math.floor(i/7):10+Math.floor(i/7)})));
    let wave=0,total=0;
    return {cells,get wave(){return wave;},get total(){return total;},get nextAt(){return (wave+1)*5;},progress(time){return Math.max(0,Math.min(1,(time-wave*5)/5));},advance(time,emit){
      const due=Math.floor((time+1e-8)/5);
      while(wave<due){wave++;for(const cell of cells)if(cell.alive){emit(cell,wave);total++;}}
    }};
  }
  const api={create};if(typeof module!=='undefined')module.exports=api;else root.BarracksStress=api;
})(typeof window==='undefined'?globalThis:window);
