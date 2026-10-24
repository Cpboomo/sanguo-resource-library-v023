/* Measured on the windup source canvases, before body-size normalization.
   Each entry marks the loaded stone, bow grip, bolt rail or casting hand.
   Up/down artwork can put the same launcher on opposite sides of its owner. */
(()=>{
 const uv={
  'b4_wei@up':[.50,.57], 'b4_wei@down':[.33,.13],
  'b4_qun@up':[.50,.36], 'b4_qun@down':[.43,.10],
  'b4_shu@up':[.47,.28], 'b4_shu@down':[.51,.48],
  'b4_wu@up':[.50,.30], 'b4_wu@down':[.50,.37],
  'b1Shu@up':[.52,.24], 'b1Shu@down':[.50,.80],
  'youJi@down':[.50,.80], 'sheSheng@down':[.50,.70],
  'b1_huangjin@up':[.50,.30], 'b1_huangjin@down':[.50,.81],
  'b1_qun@up':[.51,.22], 'b1_qun@down':[.51,.75],
  'b1_wu@up':[.50,.26], 'b1_wu@down':[.51,.70],
  'c_wu_firebow@up':[.51,.22], 'c_wu_firebow@down':[.50,.67],
  'c_qun_baima@up':[.50,.20], 'c_qun_baima@down':[.50,.75],
  'c_huang_guidao@up':[.72,.60], 'c_huang_guidao@down':[.30,.44],
  'b5_shu@up':[.32,.43], 'b5_shu@down':[.66,.49],
  'b5_wei@up':[.49,.70], 'b5_wei@down':[.24,.63],
  'b5_wu@up':[.28,.67], 'b5_wu@down':[.69,.45],
  'b5_huangjin@up':[.35,.42], 'b5_huangjin@down':[.68,.54],
  'c_shu_kongming@up':[.62,.72], 'c_shu_kongming@down':[.22,.44],
  // Legacy registrations remain supported, including the two missing up sets.
  b4_wei:[.16,.40], b4_qun:[.14,.69], b4_shu:[.65,.65], b4_wu:[.59,.52],
  b1Shu:[.84,.60], youJi:[.76,.55], sheSheng:[.71,.60],
  b1_huangjin:[.85,.68], b1_qun:[.82,.59], b1_wu:[.87,.47],
  c_wu_firebow:[.74,.47], c_qun_baima:[.79,.50], c_huang_guidao:[.23,.56],
  b5_shu:[.85,.83], b5_wei:[.32,.58], b5_wu:[.75,.63],
  b5_huangjin:[.83,.83], c_shu_kongming:[.46,.78]
 };
 const anchors=Object.freeze(Object.fromEntries(Object.entries(uv).map(([key,value])=>[key,Object.freeze(value)])));
 // UV is in the original raster, not the now-normalized character body bounds.
 function framePoint(key,fit){const point=anchors[key];return point&&fit?{x:fit.left/100+point[0]*fit.width/100,y:fit.top/100+point[1]*fit.height/100}:null;}
 window.ProjectileAnchorsV053=Object.freeze({anchors,framePoint,pose:'attack_windup'});
})();
