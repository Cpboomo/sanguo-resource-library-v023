/* Shared troop motion v002: visual offsets only; no combat or HUD mutations.
 * Roster source: ../兵种动作体系分析-v002-20261014/shared-action-roster.json
 * All offsets are pixels in a 50px sprite frame; angles are degrees.
 * Apply to an inner sprite wrapper, never .unit, .unit-action, .unit-frame or HUD.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.SharedTroopMotion = api;
})(typeof window !== 'undefined' ? window : null, function () {
  'use strict';
  const families = Object.freeze([
    {id:'blade_slash', label:'刀斩', representative:'blade', windup:.36, release:.16, recovery:.30, flight:0, effectKind:'blade'},
    {id:'spear_thrust', label:'枪戟直刺', representative:'spear', windup:.32, release:.15, recovery:.28, flight:0, effectKind:'spear'},
    {id:'shield_short_strike', label:'盾后短击', representative:'daoDun', windup:.34, release:.15, recovery:.30, flight:0, effectKind:'daoDun'},
    {id:'bow_shot', label:'拉弓释放', representative:'b1Shu', windup:.42, release:.14, recovery:.32, flight:.34, effectKind:'b1Shu'},
    {id:'mounted_contact', label:'骑乘冲锋', representative:'cavalry', windup:.40, release:.20, recovery:.36, flight:0, effectKind:'cavalry'},
    {id:'siege_projectile', label:'器械后座', representative:'b4_wei', windup:.50, release:.18, recovery:.38, flight:.42, effectKind:'b4_wei'},
    {id:'cast_projectile', label:'单次施放', representative:'b5_shu', windup:.38, release:.16, recovery:.32, flight:.32, effectKind:'b5_shu'}
  ].map(Object.freeze));
  const rows = [{"key":"blade","formalId":"blade","name":"刀兵","baseAction":"blade_slash","carrier":"ground_token"},{"key":"spear","formalId":"spear","name":"枪兵","baseAction":"spear_thrust","carrier":"ground_token"},{"key":"cavalry","formalId":"b2_shu","name":"汉中突骑","baseAction":"mounted_contact","carrier":"horse"},{"key":"daoDun","formalId":"daoDun","name":"刀盾兵","baseAction":"shield_short_strike","carrier":"ground_token"},{"key":"daoDunDog","formalId":"daoDunDog","name":"刀盾狗","baseAction":"shield_short_strike","carrier":"ground_token"},{"key":"b1Shu","formalId":"b1_shu","name":"益州弓手","baseAction":"bow_shot","carrier":"ground_token"},{"key":"jiBing","formalId":"jiBing","name":"戟兵","baseAction":"spear_thrust","carrier":"ground_token"},{"key":"youJi","formalId":"youJi","name":"游击兵","baseAction":"bow_shot","carrier":"ground_token"},{"key":"sheSheng","formalId":"sheSheng","name":"射声兵","baseAction":"bow_shot","carrier":"ground_token"},{"key":"corpsePuppet","formalId":"corpsePuppet","name":"复生傀儡","baseAction":"blade_slash","carrier":"ground_token"},{"key":"heroSpearPuppet","formalId":"heroSpearPuppet","name":"枪兵傀儡","baseAction":"spear_thrust","carrier":"ground_token"},{"key":"c_shu_huben","formalId":"c_shu_huben","name":"虎贲","baseAction":"blade_slash","carrier":"ground_token"},{"key":"c_wei_baowei","formalId":"c_wei_baowei","name":"豹卫军","baseAction":"blade_slash","carrier":"ground_token"},{"key":"c_wu_jieying","formalId":"c_wu_jieying","name":"劫营步兵","baseAction":"blade_slash","carrier":"ground_token"},{"key":"c_wu_firebow","formalId":"c_wu_firebow","name":"火攻弓手","baseAction":"bow_shot","carrier":"ground_token"},{"key":"c_huang_guidao","formalId":"c_huang_guidao","name":"鬼道师","baseAction":"cast_projectile","carrier":"ground_token"},{"key":"c_huang_zombie","formalId":"c_huang_zombie","name":"僵尸兵","baseAction":"blade_slash","carrier":"ground_token"},{"key":"c_shu_kongming","formalId":"c_shu_kongming","name":"孔明灯","baseAction":"cast_projectile","carrier":"lantern"},{"key":"c_wei_huwei","formalId":"c_wei_huwei","name":"虎卫军","baseAction":"shield_short_strike","carrier":"ground_token"},{"key":"c_qun_xiang","formalId":"c_qun_xiang","name":"巨象甲兵","baseAction":"mounted_contact","carrier":"elephant"},{"key":"c_qun_baima","formalId":"c_qun_baima","name":"白马义从","baseAction":"bow_shot","carrier":"horse"},{"key":"b2_wei","formalId":"b2_wei","name":"虎豹骑","baseAction":"mounted_contact","carrier":"horse"},{"key":"b2_huangjin","formalId":"b2_huangjin","name":"黄天骑","baseAction":"mounted_contact","carrier":"horse"},{"key":"b4_shu","formalId":"b4_shu","name":"旋刃车","baseAction":"siege_projectile","carrier":"machine"},{"key":"b5_shu","formalId":"b5_shu","name":"蜀中医士","baseAction":"cast_projectile","carrier":"ground_token"},{"key":"b3_wei","formalId":"b3_wei","name":"虎卫军","baseAction":"shield_short_strike","carrier":"ground_token"},{"key":"b4_wei","formalId":"b4_wei","name":"霹雳车","baseAction":"siege_projectile","carrier":"machine"},{"key":"b5_wei","formalId":"b5_wei","name":"随军医士","baseAction":"cast_projectile","carrier":"ground_token"},{"key":"b1_wu","formalId":"b1_wu","name":"江东弓手","baseAction":"bow_shot","carrier":"ground_token"},{"key":"b3_wu","formalId":"b3_wu","name":"巾帼卫","baseAction":"shield_short_strike","carrier":"ground_token"},{"key":"b4_wu","formalId":"b4_wu","name":"劲弩车","baseAction":"siege_projectile","carrier":"machine"},{"key":"b5_wu","formalId":"b5_wu","name":"江东医士","baseAction":"cast_projectile","carrier":"ground_token"},{"key":"b1_huangjin","formalId":"b1_huangjin","name":"太平弓手","baseAction":"bow_shot","carrier":"ground_token"},{"key":"b3_huangjin","formalId":"b3_huangjin","name":"黄巾力士","baseAction":"shield_short_strike","carrier":"ground_token"},{"key":"b5_huangjin","formalId":"b5_huangjin","name":"太平道士","baseAction":"cast_projectile","carrier":"ground_token"},{"key":"b1_qun","formalId":"b1_qun","name":"河北弓手","baseAction":"bow_shot","carrier":"ground_token"},{"key":"b2_qun","formalId":"b2_qun","name":"金戈铁马","baseAction":"mounted_contact","carrier":"horse"},{"key":"b3_qun","formalId":"b3_qun","name":"金甲勇士","baseAction":"shield_short_strike","carrier":"ground_token"},{"key":"b4_qun","formalId":"b4_qun","name":"强石车","baseAction":"siege_projectile","carrier":"machine"}];
  const roster = Object.freeze(Object.fromEntries(rows.map(row => [row.key, Object.freeze(row)])));
  const byFamily = Object.freeze(Object.fromEntries(families.map(f => [f.id, f])));
  // Accents may decorate the original material/contact only; they never change curves,
  // projectile counts, target selection, damage, healing, DOT, hit timing or movement.
  const overlays = Object.freeze({
    c_wu_firebow: Object.freeze({id:'small_fire_core', label:'箭芯小暖火', scope:'projectile_internal'}),
    c_qun_xiang: Object.freeze({id:'heavy_material', label:'原甲片重质感', scope:'original_material'}),
    corpsePuppet: Object.freeze({id:'puppet_joint', label:'原傀儡接缝轻颤', scope:'original_material'}),
    heroSpearPuppet: Object.freeze({id:'puppet_joint', label:'原傀儡接缝轻颤', scope:'original_material'}),
    c_qun_baima: Object.freeze({id:'white_horse_material', label:'保留白马材质', scope:'original_material'}),
    c_shu_kongming: Object.freeze({id:'oiljar_warm_core', label:'原油罐内小暖火', scope:'projectile_internal'})
  });
  const receiverProfiles = Object.freeze({
    light: Object.freeze({id:'light', label:'轻步兵', peak:.20, distance:1.15, tilt:1.0, squash:.012}),
    shield: Object.freeze({id:'shield', label:'盾甲', peak:.24, distance:.72, tilt:.55, squash:.006}),
    mounted: Object.freeze({id:'mounted', label:'坐骑', peak:.28, distance:.62, tilt:.45, squash:.010}),
    machine: Object.freeze({id:'machine', label:'器械', peak:.18, distance:.48, tilt:.35, squash:.004})
  });
  const LIMITS = Object.freeze({frame:50, scaleMin:.86, scaleMax:.90, displacement:1.6, rotation:2});
  const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
  const finite = (n, fallback) => Number.isFinite(Number(n)) ? Number(n) : fallback;
  const smooth = p => p * p * (3 - 2 * p);
  const out = p => 1 - Math.pow(1 - p, 3);
  const round = n => Math.round(n * 1e6) / 1e6 || 0;
  function rowFor(kind) {
    const row = roster[kind];
    if (!row) throw new RangeError('Unknown shared troop kind: ' + kind);
    return row;
  }
  function familyFor(kind) { return byFamily[rowFor(kind).baseAction]; }
  function direction(x, y, fallbackY) {
    x = finite(x, 0); y = finite(y, fallbackY);
    const length = Math.hypot(x, y);
    return length > 1e-8 ? {x:x/length, y:y/length} : {x:0, y:fallbackY};
  }
  function canonicalPhase(phase) {
    const aliases = {attack_windup:'windup', attack:'release', recover:'recovery'};
    phase = aliases[phase] || phase;
    if (!['idle','windup','release','recovery'].includes(phase)) throw new RangeError('Unknown motion phase: ' + phase);
    return phase;
  }
  // Each tuple is [towards-target, perpendicular, angle, scale]. The entire family
  // uses exactly this curve, including its special variants and carrier materials.
  const idle = Object.freeze([0,0,0,.88]);
  const curves = Object.freeze({
    blade_slash: {windup:[-.75,-.40,-1.8,.870], peak:[.80,.75,1.7,.890], end:[.52,.30,.8,.882], at:.62},
    spear_thrust: {windup:[-1.00,0,-.35,.872], peak:[1.55,0,.35,.890], end:[.92,0,.15,.884], at:.65},
    shield_short_strike: {windup:[-.45,0,.7,.882], peak:[1.05,0,-.7,.894], end:[.42,0,-.2,.886], at:.48},
    bow_shot: {windup:[-.65,0,-.4,.866], peak:[-1.10,0,.75,.898], end:[-.30,0,.2,.883], at:.32},
    mounted_contact: {windup:[-.65,0,0,.860], peak:[1.20,0,0,.896], end:[.35,0,0,.879], at:.65},
    siege_projectile: {windup:[.12,0,0,.882], peak:[-1.45,0,-.4,.872], end:[-.48,0,.15,.881], at:.32},
    cast_projectile: {windup:[-.35,.25,.75,.874], peak:[.60,0,-.75,.890], end:[.20,-.15,-.15,.881], at:.55}
  });
  function mix(a, b, p) { return a.map((value, i) => value + (b[i] - value) * p); }
  function profileFor(kind) {
    const row = rowFor(kind);
    if (row.carrier === 'machine') return receiverProfiles.machine;
    if (row.carrier === 'horse' || row.carrier === 'elephant') return receiverProfiles.mounted;
    if (row.baseAction === 'shield_short_strike') return receiverProfiles.shield;
    return receiverProfiles.light;
  }
  // dx/dy points away from the attacker. The single pulse only moves the artwork.
  // reaction scale is relative; sample() multiplies it into its .86-.90 base scale.
  function reaction(kind, p, dx, dy) {
    const profile = profileFor(kind), d = direction(dx,dy,1);
    p = clamp(finite(p,0),0,1);
    const pulse = p <= profile.peak ? smooth(p/profile.peak) : 1-smooth((p-profile.peak)/(1-profile.peak));
    const hand = Math.abs(d.x) > Math.abs(d.y) ? Math.sign(d.x) : -Math.sign(d.y);
    return {x:round(d.x*profile.distance*pulse), y:round(d.y*profile.distance*pulse), angle:round(profile.tilt*hand*pulse), scale:round(1-profile.squash*pulse)};
  }
  function sample(kind, phase, p, dirX, dirY, reactionInput) {
    const family = familyFor(kind), curve = curves[family.id];
    phase = canonicalPhase(phase); p = clamp(finite(p,0),0,1);
    const d = direction(dirX,dirY,-1), hand = Math.abs(d.x)>Math.abs(d.y) ? Math.sign(d.x) : -Math.sign(d.y);
    let value = idle;
    if (phase === 'windup') value = mix(idle,curve.windup,smooth(p));
    if (phase === 'release') value = p <= curve.at ? mix(curve.windup,curve.peak,out(p/curve.at)) : mix(curve.peak,curve.end,smooth((p-curve.at)/(1-curve.at)));
    if (phase === 'recovery') value = mix(curve.end,idle,smooth(p));
    let x = d.x*value[0]-d.y*value[1], y = d.y*value[0]+d.x*value[1], angle = value[2]*hand, scale = value[3];
    if (reactionInput !== undefined && reactionInput !== null) {
      let r;
      if (typeof reactionInput === 'number') r = reaction(kind,reactionInput,d.x,d.y);
      else if (Number.isFinite(reactionInput.p)) r = reaction(kind,reactionInput.p,reactionInput.dx ?? d.x,reactionInput.dy ?? d.y);
      else r = reactionInput;
      x += finite(r.x,0); y += finite(r.y,0); angle += finite(r.angle,0); scale *= finite(r.scale,1);
    }
    // Fits a fully opaque 50x50 square even at the largest allowed rotation.
    const length = Math.hypot(x,y);
    if (length > LIMITS.displacement) {x *= LIMITS.displacement/length; y *= LIMITS.displacement/length;}
    angle = clamp(angle,-LIMITS.rotation,LIMITS.rotation); scale = clamp(scale,LIMITS.scaleMin,LIMITS.scaleMax);
    const pose = phase === 'windup' ? 'attack_windup' : phase === 'release' ? 'attack' : phase === 'recovery' && p < .62 ? 'attack' : 'idle';
    return {x:round(x),y:round(y),angle:round(angle),scale:round(scale),pose,phase};
  }
  function schedule(kind) {
    const f = familyFor(kind), release = f.windup + f.release*.38;
    return {release,impact:f.flight ? release+f.flight : f.windup+f.release*.68,total:f.windup+f.release+f.recovery};
  }
  function timeline(kind, seconds) {
    const f = familyFor(kind), total = f.windup+f.release+f.recovery, t = clamp(finite(seconds,0),0,total);
    if (t < f.windup) return {phase:'windup',p:t/f.windup,total,done:false};
    if (t < f.windup+f.release) return {phase:'release',p:(t-f.windup)/f.release,total,done:false};
    if (t < total) return {phase:'recovery',p:(t-f.windup-f.release)/f.recovery,total,done:false};
    return {phase:'idle',p:1,total,done:true};
  }
  // A (from,to] scan emits one release and one impact per preview cycle regardless
  // of frame rate. These are visual preview events; do not apply combat damage here.
  function eventsBetween(kind, fromSeconds, toSeconds) {
    const s = schedule(kind), from = finite(fromSeconds,0), to = finite(toSeconds,0), events = [];
    if (to <= from) return events;
    const first = Math.max(0,Math.floor(Math.max(0,from)/s.total));
    const last = Math.min(first+63,Math.max(first,Math.floor(to/s.total)));
    for (let cycle=first;cycle<=last;cycle++) {
      for (const type of ['release','impact']) {
        const time = cycle*s.total+s[type];
        if (time > from+1e-9 && time <= to+1e-9) events.push({type,time,cycle,kind,baseAction:roster[kind].baseAction});
      }
    }
    return events.sort((a,b)=>a.time-b.time);
  }
  return Object.freeze({version:'shared-motion-v002',families,roster,overlays,receiverProfiles,limits:LIMITS,sample,reaction,profileFor,familyFor,timeline,schedule,eventsBetween});
});
