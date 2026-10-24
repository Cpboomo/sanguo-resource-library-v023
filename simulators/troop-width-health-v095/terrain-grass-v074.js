/* Navigation coordinates are cell centres on the raster map, not CSS board tiles. */
(() => {
  const rows = [
    ".......", ".......", ".......", ".......", ".......", ".......", ".......", ".......",
    ".......",
    ".......", ".......", ".......", ".......", ".......", ".......", ".......", "......."
  ];
  const columns = 7, clearance = .30;
  // Measured on the user's two-bridge map; staged previews stand on the left bridge.
  const banks = {north:7, south:9, centre:8, previewX:1};
  const walkableCells = [];
  for (let y = 0; y < rows.length; y++) for (let x = 0; x < columns; x++)
    if (rows[y][x] !== "~") walkableCells.push({x, y});

  const waterCells=[];
  for(let row=0;row<rows.length;row++)for(let col=0;col<columns;col++)if(rows[row][col]==="~")waterCells.push({row,col});

  function isWalkable(x, y, radius = clearance) {
    if (!Number.isFinite(x) || !Number.isFinite(y) || x < -.5 + radius || x > columns - .5 - radius || y < -.5 + radius || y > rows.length - .5 - radius) return false;
    // The dry banks are convex. Skip water-cell work when the whole disc is away from the river.
    if(y+radius<7.5||y-radius>8.5)return true;
    for (let row = Math.max(0, Math.floor(y - radius + .5)); row <= Math.min(rows.length - 1, Math.floor(y + radius + .5)); row++)
      for (let col = Math.max(0, Math.floor(x - radius + .5)); col <= Math.min(columns - 1, Math.floor(x + radius + .5)); col++) {
        if (rows[row][col] !== "~") continue;
        const dx = Math.max(Math.abs(x - col) - .5, 0), dy = Math.max(Math.abs(y - row) - .5, 0);
        if (dx * dx + dy * dy <= radius * radius + 1e-9) return false;
      }
    return true;
  }
  function nearest(point) {
    const p = {x: Math.max(-.5 + clearance, Math.min(columns - .5 - clearance, point.x)), y: Math.max(-.5 + clearance, Math.min(rows.length - .5 - clearance, point.y))};
    if (isWalkable(p.x, p.y)) return p;
    let best = walkableCells[0], distance = Infinity;
    for (const cell of walkableCells) {
      const d = (cell.x - p.x) ** 2 + (cell.y - p.y) ** 2;
      if (d < distance) { distance = d; best = cell; }
    }
    return {...best};
  }
  function segmentClear(a, b, radius = clearance) {
    if (!isWalkable(a.x, a.y, radius) || !isWalkable(b.x, b.y, radius)) return false;
    if(Math.max(a.y,b.y)+radius<7.5||Math.min(a.y,b.y)-radius>8.5)return true;
    // Exact segment-to-water distance catches thin forbidden arcs at shore corners.
    // Endpoints and the convex map boundary alone cannot detect those crossings.
    const dx = b.x - a.x, dy = b.y - a.y, length2 = dx * dx + dy * dy;
    const pointDistance = (x, y) => {
      const t = length2 ? Math.max(0, Math.min(1, ((x - a.x) * dx + (y - a.y) * dy) / length2)) : 0;
      return (x - a.x - t * dx) ** 2 + (y - a.y - t * dy) ** 2;
    };
    for (const {row,col} of waterCells) {
      const left = col - .5, right = col + .5, top = row - .5, bottom = row + .5;
      if (Math.max(a.x, b.x) < left - radius || Math.min(a.x, b.x) > right + radius || Math.max(a.y, b.y) < top - radius || Math.min(a.y, b.y) > bottom + radius) continue;
      let low = 0, high = 1;
      for (const [origin, delta, min, max] of [[a.x, dx, left, right], [a.y, dy, top, bottom]]) {
        if (Math.abs(delta) < 1e-12) { if (origin < min || origin > max) { low = 1; high = 0; break; } }
        else { const t1 = (min - origin) / delta, t2 = (max - origin) / delta; low = Math.max(low, Math.min(t1, t2)); high = Math.min(high, Math.max(t1, t2)); }
      }
      if (low <= high) return false;
      const rectangleDistance = p => Math.max(left - p.x, 0, p.x - right) ** 2 + Math.max(top - p.y, 0, p.y - bottom) ** 2;
      const distance2 = Math.min(rectangleDistance(a), rectangleDistance(b), pointDistance(left, top), pointDistance(right, top), pointDistance(left, bottom), pointDistance(right, bottom));
      if (distance2 <= radius * radius + 1e-9) return false;
    }
    return true;
  }
  function advance(a, b) {
    if (segmentClear(a, b)) return {...b};
    let low = 0, high = 1;
    for (let i = 0; i < 24; i++) {
      const middle = (low + high) / 2, point = {x: a.x + (b.x - a.x) * middle, y: a.y + (b.y - a.y) * middle};
      if (segmentClear(a, point)) low = middle; else high = middle;
    }
    const safe = Math.max(0, low - 1e-5);
    return {x: a.x + (b.x - a.x) * safe, y: a.y + (b.y - a.y) * safe};
  }
  function constrain(from, desired) {
    const start = isWalkable(from.x, from.y) ? from : nearest(from);
    return advance(start, desired);
  }
  function findPath(from, to) {
    const start = nearest(from), goal = nearest(to);
    if (segmentClear(start, goal)) return [goal];
    const index = p => Math.round(p.y) * columns + Math.round(p.x);
    const startId = index(start), goalId = index(goal), open = [startId], previous = new Map([[startId, null]]);
    for (let cursor = 0; cursor < open.length && !previous.has(goalId); cursor++) {
      const id = open[cursor], x = id % columns, y = Math.floor(id / columns);
      for (const [dx, dy] of [[0, -1], [1, 0], [0, 1], [-1, 0]]) {
        const nx = x + dx, ny = y + dy, next = ny * columns + nx;
        if (nx < 0 || nx >= columns || ny < 0 || ny >= rows.length || rows[ny][nx] === "~" || previous.has(next)) continue;
        previous.set(next, id); open.push(next);
      }
    }
    if (!previous.has(goalId)) return [];
    const route = [];
    for (let id = goalId; id !== null; id = previous.get(id)) route.push({x: id % columns, y: Math.floor(id / columns)});
    route.reverse(); route.push(goal);
    // Keep a safe turn point rather than cutting diagonally across river corners.
    const smoothed = []; let anchor = start, cursor = 0;
    while (cursor < route.length) {
      let next = cursor;
      for (let i = route.length - 1; i >= cursor; i--) if (segmentClear(anchor, route[i])) { next = i; break; }
      smoothed.push(route[next]); anchor = route[next]; cursor = next + 1;
    }
    return smoothed;
  }
  // Unsimplified four-neighbour route for discrete walking. Fractional spawn or
  // collision positions first rejoin a reachable cell centre, never a water corner.
  const gridRoutes=new Map();
  const neighbourOffsets=[[0,-1],[1,0],[0,1],[-1,0]];
  function gridAnchor(point) {
    // The nearest integer centre is also the nearest possible grid anchor.
    // Half-cell ties use the original row-major ordering (top, then left).
    const x=Math.ceil(point.x-.5),y=Math.ceil(point.y-.5);
    if(y>=0&&y<rows.length&&x>=0&&x<columns&&rows[y][x]!=="~"){
      const cell={x,y};if(segmentClear(point,cell))return cell;
    }
    let best=null,distance=Infinity;
    for(const cell of walkableCells){const d=(cell.x-point.x)**2+(cell.y-point.y)**2;if(d<distance&&segmentClear(point,cell)){best=cell;distance=d;}}
    return best;
  }
  function cachedGridRoute(from, to) {
    const start = gridAnchor(nearest(from)), goal = gridAnchor(nearest(to));
    if (!start || !goal) return null;
    const index = p => p.y * columns + p.x;
    const startId=index(start), goalId=index(goal),key=startId*rows.length*columns+goalId;
    let cached=gridRoutes.get(key);
    if(!cached){
    const open=[startId], previous=new Map([[startId,null]]);
    for (let cursor=0; cursor<open.length && !previous.has(goalId); cursor++) {
      const id=open[cursor], x=id%columns, y=Math.floor(id/columns);
      for (const [dx,dy] of neighbourOffsets) {
        const nx=x+dx, ny=y+dy, next=ny*columns+nx;
        if(nx<0||nx>=columns||ny<0||ny>=rows.length||rows[ny][nx]==="~"||previous.has(next))continue;
        previous.set(next,id);open.push(next);
      }
    }
    if(!previous.has(goalId))return null;
    cached=[];
    for(let id=goalId;id!==null;id=previous.get(id))cached.push({x:id%columns,y:Math.floor(id/columns)});
    cached.reverse();gridRoutes.set(key,cached);
    }
    return {points:cached, extra:Math.hypot(goal.x-to.x,goal.y-to.y)>.001?{x:to.x,y:to.y}:null};
  }
  function findGridPath(from, to) {
    const route=cachedGridRoute(from, to);
    if(!route)return [];
    // Callers may shift this copy. The shared cache stays immutable.
    const copy=route.points.map(cell=>({...cell}));
    if(route.extra)copy.push({...route.extra});
    return copy;
  }
  window.BattleTerrain = {rows, columns, clearance, banks, isWalkable, nearest, segmentClear, constrain, findPath, findGridPath, borrowGridPath:cachedGridRoute};
})();
