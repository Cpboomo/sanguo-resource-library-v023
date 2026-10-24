(function(root){
  'use strict';
  function create(kinds,intervalFor=()=>5){
    if(!kinds.length||new Set(kinds).size!==kinds.length||kinds.length>49)throw new Error('Barracks requires 1–49 unique troop kinds');
    // Full rear rows and bridge banks remain empty for BOTH armies.
    const columns=[0,1,2,4,5,6],perTeam=22;
    const cells=['red','blue'].flatMap((team,teamIndex)=>Array.from({length:perTeam},(_,i)=>{
      const depth=i<18?1+Math.floor(i/6)*2:6,x=i<18?columns[i%6]:(i-18)*2;
      const exitDepth=depth===5?4:depth+1;
      const y=team==='red'?depth:16-depth;
      return {id:`camp-${team}-${i}`,team,kind:kinds[(teamIndex*perTeam+i)%kinds.length],hp:360,maxHp:360,alive:true,interval:intervalFor(kinds[(teamIndex*perTeam+i)%kinds.length]),nextAt:intervalFor(kinds[(teamIndex*perTeam+i)%kinds.length]),attempts:0,column:x,row:i<18?Math.floor(i/6):3,x,y,exit:{x,y:team==='red'?exitDepth:16-exitDepth}};
    }));
    let wave=0,total=0;
    const nextTime=()=>Math.min(...cells.filter(c=>c.alive).map(c=>c.nextAt));
    function progress(time,cell=cells.find(c=>c.alive)){return cell?Math.max(0,Math.min(1,1-(cell.nextAt-time)/cell.interval)):0;}
    return {cells,get wave(){return wave;},get total(){return total;},get nextAt(){return nextTime();},progress,
      configure(kind,interval,time){
        for(const cell of cells)if(cell.kind===kind){const remaining=1-progress(time,cell);cell.interval=interval;cell.nextAt=time+remaining*interval;}
      },
      advance(time,emit){
        let due=nextTime();
        while(due<=time+1e-8){
          wave++;
          const first=((wave-1)*7)%cells.length;
          for(let i=0;i<cells.length;i++){
            const cell=cells[(first+i)%cells.length];
            if(cell.alive&&cell.nextAt<=due+1e-8){cell.nextAt+=cell.interval;cell.attempts++;if(emit(cell,wave)!==false)total++;}
          }
          due=nextTime();
        }
      }
    };
  }
  const api={create};if(typeof module!=='undefined')module.exports=api;else root.BarracksStress=api;
})(typeof window==='undefined'?globalThis:window);
