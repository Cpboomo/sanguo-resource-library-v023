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
  const countryColors=Object.freeze({wei:'#ffffff',shu:'#ffffff',wu:'#ffffff',qun:'#ffffff',huangjin:'#ffffff',common:'#ffffff'});
  const aliases={cavalry:'b2_shu',b1Shu:'b1_shu',daoDunDog:'daoDun'};
  function countryOf(key){
    const base=key.split('@')[0],id=aliases[base]||base,head=window.BarracksSkinV063?.heads[id];
    if(head&&countryColors[head.faction])return head.faction;
    return Object.keys(countryColors).find(c=>c!=='common'&&id.includes('_'+(c==='huangjin'?'huang':c)))||'common';
  }
  const countryColorOf=key=>countryColors[countryOf(key)];
  for(const [name,color] of Object.entries(countryColors)){
    const filter=document.getElementById('troopWhiteOutline').cloneNode(true);
    filter.id='troopCountry'+name;filter.querySelector('feMorphology').setAttribute('radius','2.8');filter.querySelector('feFlood').setAttribute('flood-color',color);defs.append(filter);
  }
  const teamColors=Object.freeze({blue:'#248dff',red:'#ff4354'});
  for(const [team,color] of Object.entries(teamColors)){
    const filter=document.getElementById('troopWhiteOutline').cloneNode(true);
    filter.id='troopTeam'+team;filter.querySelector('feMorphology').setAttribute('radius','2.8');filter.querySelector('feFlood').setAttribute('flood-color',color);defs.append(filter);
  }
  window.TroopOutline=Object.freeze({tiers,colors,tierOf,colorOf,countryColors,countryOf,countryColorOf,teamColors,
    apply(el,kind){const tier=tierOf(kind);el.dataset.tier=tier;el.dataset.country=countryOf(kind);el.style.setProperty('--troop-outline-filter',`url(#troopOutline${tier})`);}
  });
})();
