/* v058: formal TROOP_DEFS tier snapshot, display colors only.
   Preview aliases cavalry=b2_shu, b1Shu=b1_shu; daoDunDog follows daoDun. */
(()=>{
  const tiers=Object.freeze({
  "blade": "base",
  "spear": "base",
  "cavalry": "B",
  "daoDun": "A",
  "daoDunDog": "A",
  "b1Shu": "B",
  "jiBing": "A",
  "youJi": "A",
  "sheSheng": "A",
  "corpsePuppet": "summon",
  "heroSpearPuppet": "summon",
  "c_shu_huben": "C",
  "c_wei_baowei": "C",
  "c_wu_jieying": "C",
  "c_wu_firebow": "C",
  "c_huang_guidao": "C",
  "c_huang_zombie": "C",
  "c_shu_kongming": "C",
  "c_wei_huwei": "C",
  "c_qun_xiang": "C",
  "c_qun_baima": "C",
  "b2_wei": "B",
  "b2_huangjin": "B",
  "b4_shu": "B",
  "b5_shu": "B",
  "b3_wei": "B",
  "b4_wei": "B",
  "b5_wei": "B",
  "b1_wu": "B",
  "b3_wu": "B",
  "b4_wu": "B",
  "b5_wu": "B",
  "b1_huangjin": "B",
  "b3_huangjin": "B",
  "b5_huangjin": "B",
  "b1_qun": "B",
  "b2_qun": "B",
  "b3_qun": "B",
  "b4_qun": "B"
});
  const colors=Object.freeze({"base": "#ffffff", "A": "#77caff", "B": "#ffdc70", "C": "#ff857e", "summon": "#ffffff"});
  const tierOf=key=>tiers[key.split('@')[0]]||'base';
  const colorOf=key=>colors[tierOf(key)];
  // DOM previews share the exact Canvas palette; create SVG filters once.
  const defs=document.querySelector('svg defs');
  for(const [tier,color] of Object.entries(colors)){
    const template=document.getElementById('troopWhiteOutline').cloneNode(true);
    template.id='troopOutline'+tier;
    template.querySelector('feFlood').setAttribute('flood-color',color);
    defs.append(template);
  }
  window.TroopOutline=Object.freeze({tiers,colors,tierOf,colorOf,
    apply(el,kind){const tier=tierOf(kind);el.dataset.tier=tier;el.style.setProperty('--troop-outline-filter',`url(#troopOutline${tier})`);}
  });
})();
