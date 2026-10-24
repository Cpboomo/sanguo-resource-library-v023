/* v052: calibrate measured body cores, never weapon area or per-pose alpha bounds.
   Rectangles are idle-source measurements in whole-canvas coordinates. A single
   registration is reused for idle, windup and release; source pixels are untouched. */
(()=>{
 const pack=window.DirectionalPack?.units||{};
 // Helmet/head only: exclude plumes, ribbons, hands, bows and shields.
 const heads={
  blade:{up:[.34,.34,.65,.68],down:[.34,.34,.65,.68]},
  spear:{up:[.35,.34,.65,.69],down:[.34,.34,.66,.69]},
  b1Shu:{up:[.34,.34,.66,.69],down:[.20,.20,.83,.69]},
  b1_huangjin:{up:[.34,.34,.66,.69],down:[.24,.20,.79,.62]},
  b1_qun:{up:[.34,.34,.66,.69],down:[.20,.15,.81,.62]},
  b1_wu:{up:[.34,.34,.66,.69],down:[.25,.22,.80,.66]},
  c_wu_firebow:{up:[.34,.34,.66,.69],down:[.24,.11,.79,.63]},
  youJi:{up:[.26,.31,.77,.79],down:[.26,.16,.78,.66]},sheSheng:{up:[.25,.375,.77,.785],down:[.21,.18,.80,.69]},
  daoDun:{up:[.30,.27,.72,.80],down:[.25,.19,.73,.68]},jiBing:{up:[.32,.47,.595,.825],down:[.26,.28,.67,.59]},
  b3_huangjin:{up:[.34,.34,.66,.69],down:[.34,.34,.66,.69]},
  b5_huangjin:{up:[.34,.34,.66,.69],down:[.34,.34,.66,.69]},
  c_huang_guidao:{up:[.34,.34,.66,.69],down:[.34,.34,.66,.69]},
  c_huang_zombie:{up:[.34,.34,.66,.69],down:[.34,.34,.66,.69]},
  b3_qun:{up:[.34,.34,.64,.69],down:[.34,.34,.65,.69]},
  b3_wei:{up:[.34,.34,.66,.69],down:[.34,.34,.66,.69]},
  b5_wei:{up:[.27,.34,.64,.68],down:[.29,.34,.70,.69]},
  c_wei_baowei:{up:[.34,.34,.66,.69],down:[.34,.34,.66,.69]},
  c_wei_huwei:{up:[.34,.34,.66,.69],down:[.34,.34,.66,.69]},
  b5_shu:{up:[.34,.34,.66,.69],down:[.34,.34,.66,.69]},
  c_shu_huben:{up:[.34,.34,.66,.69],down:[.34,.34,.66,.69]},
  b3_wu:{up:[.34,.34,.66,.69],down:[.34,.34,.66,.69]},
  b5_wu:{up:[.34,.34,.66,.69],down:[.34,.34,.66,.69]},
  c_wu_jieying:{up:[.34,.34,.66,.69],down:[.34,.34,.66,.69]}
 };
 const profiles={};
 window.DirectionalRuntime={
  prepare(frames,fits,bounds,calibration){
   let sets=0;
   // No calibration is needed by the direction-only compatibility checks.
   const {sizeFits,groundFits,headFrameFits,presentationFits}=calibration||{};
   // Preserve each idle sprite's complete alpha width before body-core
   // calibration replaces `bounds`. HUD width needs the full visible troop,
   // including weapons, mounts and assembled parts.
   const silhouetteSources={};
   if(calibration)for(const kind of Object.keys(sizeFits)){
    const sourceScale=(fits[kind]?.idle?.width||100)/100;
    silhouetteSources[kind]=(bounds[kind]?.idle?.width||1)/sourceScale;
   }
   const publish=(key,kind,root,sourceRect,scale)=>{
    const [l,t,r,b]=root,w=r-l,h=b-t,cx=(l+r)/2,cy=(t+b)/2;
    const category=sizeFits[kind].category,normal=category==='normal';
    profiles[key]={category,sourceRect,scale,root,coreWidth:w,coreHeight:h};
    bounds[key]=Object.fromEntries(['idle','attack_windup','attack'].map(p=>[p,{width:w,height:h,centerX:cx,centerY:cy,head:normal?[0,0,1,1]:[.24,0,.76,.35]}]));
    headFrameFits[key]={x:.5+(cx-.5)*.88,y:.5+(cy-.5)*.88,size:Math.max(w,h)*.88*1.10};
    presentationFits[key]={width:w*.88,height:h*.88};
   };
   // Legacy-only units use the same core
   // width as new infantry. Keep their existing inter-pose source registrations.
   if(calibration)for(const kind of Object.keys(sizeFits)){
    const idle=bounds[kind].idle,category=sizeFits[kind].category,base={normal:.667,mounted:1.1,flying:1.1,giant:1.78,machine:1}[category];
    const normal=category==='normal',w=normal?idle.width*(idle.head[2]-idle.head[0]):idle.width,h=normal?idle.height*(idle.head[3]-idle.head[1]):idle.height;
    const oldX=normal?.5+((idle.head[0]+idle.head[2])/2-.5)*idle.width:.5,oldBottom=normal?.5+(idle.head[3]-.5)*idle.height:.5+idle.height/2;
    const target=(normal?.60:.78)*base/sizeFits[kind].scale,factor=target/(normal?w:h),bottom=.5+groundFits[kind].height/(2*.88);
    for(const f of Object.values(fits[kind])){f.left=50+(f.left-100*oldX)*factor;f.top=bottom*100+(f.top-100*oldBottom)*factor;f.width*=factor;f.height*=factor;}
    publish(kind,kind,[.5-w*factor/2,bottom-h*factor,.5+w*factor/2,bottom],null,factor);
   }
   for(const [kind,directions] of Object.entries(pack)){
    if(!bounds[kind])continue;
    for(const [direction,entry] of Object.entries(directions)){
     const key=kind+'@'+direction,idle=entry.frames.idle;
     let fit;
     if(calibration){
      const category=sizeFits[kind].category,normal=category==='normal',base={normal:.667,mounted:1.1,flying:1.1,giant:1.78,machine:1}[category];
      const rect=normal?heads[kind][direction]:idle.bounds;
      const [l,t,r,b]=rect,w=r-l,h=b-t;
      const target=(normal?.60:.78)*base/sizeFits[kind].scale,scale=target/(normal?w:h),bottom=.5+groundFits[kind].height/(2*.88);
      fit={width:100*scale,height:100*idle.aspect*scale,left:50-(l+r)*50*scale,top:100*(bottom-b*scale)};
      publish(key,kind,[.5-w*scale/2,bottom-h*scale,.5+w*scale/2,bottom],rect,scale);
     }else{const old=bounds[kind].idle,scale=old.height/(idle.bounds[3]-idle.bounds[1]);fit={width:100*scale,height:100*idle.aspect*scale,left:50-50*scale,top:50-50*scale};}
     frames[key]={};fits[key]={};for(const [pose,asset] of Object.entries(entry.frames)){frames[key][pose]=asset.src;fits[key][pose]={...fit};}sets++;
    }
   }
   // Apply a frozen source-body calibration once, after legacy/directional registration.
   // Do not re-fit alpha bounds per pose: a raised weapon must never shrink its owner.
   if(calibration&&window.TroopCoreMetricsV052){
    const {rects,targets}=window.TroopCoreMetricsV052;
    for(const [key,rect] of Object.entries(rects)){
     const kind=key.split('@')[0],profile=profiles[key];if(!profile)continue;
     const f=fits[key].idle,[l,t,r,b]=rect;
     const left=f.left/100+l*f.width/100,right=f.left/100+r*f.width/100;
     const top=f.top/100+t*f.height/100,foot=f.top/100+b*f.height/100;
     const width=right-left,height=foot-top,cx=(left+right)/2;
     const metric=profile.category==='normal'?width:height;
     const factor=targets[profile.category]/(metric*sizeFits[kind].scale);
     const bottom=.5+groundFits[kind].height/(2*.88);
     for(const pose of Object.values(fits[key])){
      pose.left=50+(pose.left-cx*100)*factor;
      pose.top=bottom*100+(pose.top-foot*100)*factor;
      pose.width*=factor;pose.height*=factor;
     }
     publish(key,kind,[.5-width*factor/2,bottom-height*factor,.5+width*factor/2,bottom],rect,profile.scale*factor);
    }
   }
   // Publish the final on-screen idle silhouette width after every scale
   // calibration. The approved idle pose scale is stable across HUD renderers.
   if(calibration)for(const [key,profile] of Object.entries(profiles)){
    const [kind,direction]=key.split('@'),fit=fits[key]?.idle;
    if(!fit)continue;
    const directionalBounds=direction&&pack[kind]?.[direction]?.frames?.idle?.bounds;
    const sourceWidth=directionalBounds?directionalBounds[2]-directionalBounds[0]:silhouetteSources[kind];
    if(sourceWidth)profile.silhouetteWidth=sourceWidth*fit.width/100*.88;
   }
   return sets;
  },
  directionFromVector(x,y,previous='down'){
   const ax=Math.abs(x),ay=Math.abs(y);
   if(Math.hypot(x,y)<.035)return previous;
   // A small dominant-axis margin prevents diagonal route corrections from
   // alternating between horizontal and vertical art every frame.
   if(ax>ay*1.12)return x<0?'left':'right';
   if(ay>ax*1.12)return y<0?'up':'down';
   if(previous==='left'||previous==='right')return x<0?'left':'right';
   return y<0?'up':'down';
  },
  choose(unit,elapsed,force=false){
   const directions=pack[unit.kind];
   const previous=unit.facingDirection||(unit.team==='blue'?'up':'down');
   const attacking=force||unit.state==='attack_windup'||unit.state==='attack'||unit.state==='recover'||Boolean(unit.sharedStrike)||Boolean(unit.chargeRun);
   const vector=attacking
    ?{x:unit.attackDirX||0,y:unit.attackDirY||0}
    :unit.gridHop
      ?{x:unit.gridHop.dx,y:unit.gridHop.dy}
      :{x:0,y:0};
   const desired=this.directionFromVector(vector.x,vector.y,previous);
   unit.facingDirection=desired;
   unit.directionSource=attacking?'attack':'walk';
   unit.directionMirror=desired==='left';
   // The delivered source contains independent up/down sets. Horizontal world
   // directions use the complete front set and mirror the whole body for left.
   const sourceDirection=desired==='up'?'up':'down';
   unit.artDirection=sourceDirection;
   unit.el.dataset.facingDirection=desired;
   unit.el.dataset.directionSource=unit.directionSource;
   unit.el.classList.toggle('face-left',unit.directionMirror);
   for(const direction of ['up','down','left','right'])unit.el.classList.toggle('facing-'+direction,direction===desired);
   unit.el.classList.toggle('vertical-up',desired==='up');
   unit.el.classList.toggle('vertical-down',desired==='down');
   return directions?.[sourceDirection]?unit.kind+'@'+sourceDirection:unit.kind;
  },
  get profiles(){return profiles;},
  get coverage(){return {units:Object.keys(pack).length,sets:Object.values(pack).reduce((n,v)=>n+Object.keys(v).length,0),missingUp:Object.entries(pack).filter(([,v])=>!v.up).map(([k])=>k)};}
 };
})();
