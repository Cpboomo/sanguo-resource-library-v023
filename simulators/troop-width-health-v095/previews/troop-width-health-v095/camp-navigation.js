/* Camp tiles are solid ground obstacles. Water and the approved world scale stay unchanged. */
(()=>{
'use strict';
const terrain=window.BattleTerrain,base={...terrain},columns=terrain.columns,height=terrain.rows.length;
const count=columns*height,blocked=new Map(),trees=new Map();let cells=[],graph=[],revision=0;
const id=(x,y)=>y*columns+x;
function eachCandidate(a,b,r,visit){
  const left=Math.max(0,Math.ceil(Math.min(a.x,b.x)-.5-r)),right=Math.min(columns-1,Math.floor(Math.max(a.x,b.x)+.5+r));
  const top=Math.max(0,Math.ceil(Math.min(a.y,b.y)-.5-r)),bottom=Math.min(height-1,Math.floor(Math.max(a.y,b.y)+.5+r));
  for(let y=top;y<=bottom;y++)for(let x=left;x<=right;x++){const camp=blocked.get(id(x,y));if(camp&&visit(camp)===false)return false;}
  return true;
}
function campSegmentClear(a,b,r){
  return eachCandidate(a,b,r,c=>{
    // Segment against expanded square: conservative corner clearance, no tunnelling on a long dash.
    let lo=0,hi=1;
    for(const [p,d,min,max] of [[a.x,b.x-a.x,c.x-.5-r,c.x+.5+r],[a.y,b.y-a.y,c.y-.5-r,c.y+.5+r]]){
      if(d===0){if(p<min||p>max)return true;}
      else{const t1=(min-p)/d,t2=(max-p)/d;lo=Math.max(lo,Math.min(t1,t2));hi=Math.min(hi,Math.max(t1,t2));if(lo>hi)return true;}
    }
    return false;
  });
}
function isWalkable(x,y,r=base.clearance){return base.isWalkable(x,y,r)&&(!blocked.size||campSegmentClear({x,y},{x,y},r));}
function segmentClear(a,b,r=base.clearance){return base.segmentClear(a,b,r)&&(!blocked.size||campSegmentClear(a,b,r));}
function rebuild(camps){
  blocked.clear();for(const c of camps)if(c.alive)blocked.set(id(c.x,c.y),{id:c.id,x:c.x,y:c.y});
  revision++;trees.clear();cells=[];graph=Array.from({length:count},()=>[]);
  for(let y=0;y<height;y++)for(let x=0;x<columns;x++)if(isWalkable(x,y))cells.push({x,y});
  for(const p of cells)for(const [dx,dy] of [[0,-1],[1,0],[0,1],[-1,0]]){const q={x:p.x+dx,y:p.y+dy};if(isWalkable(q.x,q.y)&&segmentClear(p,q))graph[id(p.x,p.y)].push(id(q.x,q.y));}
}
function nearest(point){
  if(!blocked.size)return base.nearest(point);
  if(isWalkable(point.x,point.y))return{x:point.x,y:point.y};
  let best=null,d=Infinity;for(const c of cells){const v=(c.x-point.x)**2+(c.y-point.y)**2;if(v<d){d=v;best=c;}}
  if(!best)throw new Error('No free camp exit');return{...best};
}
function anchor(point){
  const x=Math.round(point.x),y=Math.round(point.y);if(isWalkable(x,y)&&segmentClear(point,{x,y}))return{x,y};
  let best=null,d=Infinity;for(const c of cells){const v=(c.x-point.x)**2+(c.y-point.y)**2;if(v<d&&segmentClear(point,c)){d=v;best=c;}}return best;
}
function borrowGridPath(from,to){
  if(!blocked.size)return base.borrowGridPath(from,to);
  const startPoint=nearest(from),goalPoint=nearest(to),start=anchor(startPoint),goal=anchor(goalPoint);if(!start||!goal)return null;
  const startId=id(start.x,start.y),goalId=id(goal.x,goal.y);
  let tree=trees.get(goalId);
  if(!tree){
    // Share one reverse BFS across all units pursuing the same cell, including unreachable results.
    tree=new Int32Array(count).fill(-1);tree[goalId]=goalId;const open=[goalId];
    for(let i=0;i<open.length;i++)for(const next of graph[open[i]])if(tree[next]<0){tree[next]=open[i];open.push(next);}
    if(trees.size>=count)trees.delete(trees.keys().next().value);trees.set(goalId,tree);
  }
  if(tree[startId]<0)return null;
  const points=[];for(let i=startId;;i=tree[i]){points.push({x:i%columns,y:Math.floor(i/columns)});if(i===goalId)break;}
  return{points,extra:Math.hypot(goal.x-goalPoint.x,goal.y-goalPoint.y)>.001?goalPoint:null};
}
function findGridPath(from,to){const route=borrowGridPath(from,to);return route?[...route.points.map(p=>({...p})),...(route.extra?[{...route.extra}]:[])]:[];}
function constrain(from,to){
  if(!blocked.size)return base.constrain(from,to);
  const a=isWalkable(from.x,from.y)?from:nearest(from);if(segmentClear(a,to))return{...to};
  let lo=0,hi=1;for(let i=0;i<24;i++){const t=(lo+hi)/2,p={x:a.x+(to.x-a.x)*t,y:a.y+(to.y-a.y)*t};if(segmentClear(a,p))lo=t;else hi=t;}
  const distance=Math.hypot(to.x-a.x,to.y-a.y),t=Math.max(0,lo-1e-5/Math.max(distance,1e-5));return{x:a.x+(to.x-a.x)*t,y:a.y+(to.y-a.y)*t};
}
let passageReport=null;
function validateCampPassages(camps){
  // Validate the actual navigation graph with all camps alive, including enemy obstacles.
  for(const y of [0,7,9,16])for(let x=0;x<columns;x++)if(!isWalkable(x,y))throw new Error(`Reserved passage blocked: ${x},${y}`);
  let checkedRoutes=0;
  for(const camp of camps.filter(c=>c.alive)){
    if(!isWalkable(camp.exit.x,camp.exit.y))throw new Error(`Blocked camp exit: ${camp.id}`);
    const line=camp.team==='red'?16:0,beyond=line+(camp.team==='red'?.15:-.15);
    for(let x=0;x<columns;x++)for(const y of [line,beyond]){
      const path=findGridPath(camp.exit,{x,y}),last=path.at(-1);
      if(!last||Math.hypot(last.x-x,last.y-y)>1e-7)throw new Error(`No through route: ${camp.id} to ${x},${y}`);
      let previous=camp.exit;for(const point of path){if(!segmentClear(previous,point))throw new Error(`Unsafe through route: ${camp.id}`);previous=point;}checkedRoutes++;
    }
  }
  passageReport={checkedRoutes,camps:camps.filter(c=>c.alive).length,rearRows:[0,16],beyondLines:[-.15,16.15],valid:true};return passageReport;
}
Object.assign(terrain,{isWalkable,segmentClear,nearest,constrain,findGridPath,findPath:findGridPath,borrowGridPath,validateCampPassages,setCamps:rebuild});
Object.defineProperties(terrain,{campPassages:{get:()=>passageReport},campRevision:{get:()=>revision},campObstacles:{get:()=>[...blocked.values()].map(c=>({...c}))}});
})();
