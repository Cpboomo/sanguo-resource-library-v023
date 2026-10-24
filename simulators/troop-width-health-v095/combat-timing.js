/* Seconds in the combat clock (world speed still affects the entire simulation).
   Attack speed may shorten preparation only to a readable per-family minimum. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.CombatTiming=api;})(typeof window==='object'?window:this,function(){
 const minimum={bow_shot:.60,siege_projectile:.50,cast_projectile:.40,mounted_contact:.38,blade_slash:.30,spear_thrust:.30,shield_short_strike:.32};
 function windup(family,base,speed=1){return Math.max(base/Math.max(.01,speed),minimum[family]||.32);}
 // Reach full draw in the first 65%, then retain a visible full-draw pause.
 function progress(family,p){return family==='bow_shot'?Math.min(1,p/.65):p;}
 return Object.freeze({windup,progress,minimum});
});
