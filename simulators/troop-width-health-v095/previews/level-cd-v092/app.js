(()=>{
  const viewportProof=new URLSearchParams(location.search).get("viewport");
  if(viewportProof==="390x620"||viewportProof==="390x844")document.documentElement.classList.add(`proof-${viewportProof.slice(4)}`);
  const sharedOn=new URLSearchParams(location.search).get("motion")==="shared";
  const sharedMotion=window.SharedTroopMotion,feedback=window.TroopMotionFeedback,chargeMotion=window.CavalryCharge,chargeLaunch=window.ChargeLaunch;
  let sharedReview=false,sharedClock=0,sharedCycle=-1,sharedPhase="loop",sharedKind="blade",sharedFlights=[],sharedHits=0,sharedImpacts=[],sharedNumbers=[],groundBursts=[],fireFields=[];
  let chargePainter=null;
  if(sharedOn)document.body.classList.add("shared-motion-enabled");
  const SHARED_MELEE_RECOIL=.045;
  const HUD_HEALTH_WIDTH_SCALE=1.21;
  const STATES=["idle","attack_windup","attack"];
  const stateLabel={idle:"待机",attack_windup:"蓄力",attack:"攻击"};
  const assets={
    blade:{idle:"./runtime/blade/idle.webp",attack_windup:"./runtime/blade/attack_windup.webp",attack:"./runtime/blade/attack.webp"},
    spear:{idle:"./runtime/spear/idle.webp",attack_windup:"./runtime/spear/attack_windup.webp",attack:"./runtime/spear/attack.webp"},
    cavalry:{idle:"./runtime/cavalry/idle.webp",attack_windup:"./runtime/cavalry/attack_windup.webp",attack:"./runtime/cavalry/attack.webp"},
    daoDun:{idle:"./runtime/dao_dun/idle.webp",attack_windup:"./runtime/dao_dun/attack_windup.webp",attack:"./runtime/dao_dun/attack.webp"},
    daoDunDog:{idle:"./runtime/dao_dun_dog/idle.webp",attack_windup:"./runtime/dao_dun_dog/attack_windup.webp",attack:"./runtime/dao_dun_dog/attack.webp"},
    b1Shu:{idle:"./runtime/b1_shu/idle.webp",attack_windup:"./runtime/b1_shu/attack_windup.webp",attack:"./runtime/b1_shu/attack.webp"},
    jiBing:{idle:"./runtime/ji_bing/idle.webp",attack_windup:"./runtime/ji_bing/attack_windup.webp",attack:"./runtime/ji_bing/attack.webp"},
    youJi:{idle:"./runtime/you_ji/idle.webp",attack_windup:"./runtime/you_ji/attack_windup.webp",attack:"./runtime/you_ji/attack.webp"},
    sheSheng:{idle:"./runtime/she_sheng/idle.webp",attack_windup:"./runtime/she_sheng/attack_windup.webp",attack:"./runtime/she_sheng/attack.webp"},
    corpsePuppet:{idle:"./runtime/corpse_puppet/idle.webp",attack_windup:"./runtime/corpse_puppet/attack_windup.webp",attack:"./runtime/corpse_puppet/attack.webp"},
    heroSpearPuppet:{idle:"./runtime/hero_spear_puppet/idle.webp",attack_windup:"./runtime/hero_spear_puppet/attack_windup.webp",attack:"./runtime/hero_spear_puppet/attack.webp"},
    c_shu_huben:{idle:"./runtime/c_shu_huben/idle.webp",attack_windup:"./runtime/c_shu_huben/attack_windup.webp",attack:"./runtime/c_shu_huben/attack.webp"},
    c_wei_baowei:{idle:"./runtime/c_wei_baowei/idle.webp",attack_windup:"./runtime/c_wei_baowei/attack_windup.webp",attack:"./runtime/c_wei_baowei/attack.webp"},
    c_wu_jieying:{idle:"./runtime/c_wu_jieying/idle.webp",attack_windup:"./runtime/c_wu_jieying/attack_windup.webp",attack:"./runtime/c_wu_jieying/attack.webp"},
    c_wu_firebow:{idle:"./runtime/c_wu_firebow/idle.webp",attack_windup:"./runtime/c_wu_firebow/attack_windup.webp",attack:"./runtime/c_wu_firebow/attack.webp"},
    c_huang_guidao:{idle:"./runtime/c_huang_guidao/idle.webp",attack_windup:"./runtime/c_huang_guidao/attack_windup.webp",attack:"./runtime/c_huang_guidao/attack.webp"},
    c_huang_zombie:{idle:"./runtime/c_huang_zombie/idle.webp",attack_windup:"./runtime/c_huang_zombie/attack_windup.webp",attack:"./runtime/c_huang_zombie/attack.webp"},
    c_shu_kongming:{idle:"./runtime/c_shu_kongming/compact-v036/idle.webp",attack_windup:"./runtime/c_shu_kongming/compact-v036/attack_windup.webp",attack:"./runtime/c_shu_kongming/compact-v036/attack.webp"},
    c_wei_huwei:{idle:"./runtime/c_wei_huwei/idle.webp",attack_windup:"./runtime/c_wei_huwei/attack_windup.webp",attack:"./runtime/c_wei_huwei/attack.webp"},
    c_qun_xiang:{idle:"./runtime/c_qun_xiang/idle.webp",attack_windup:"./runtime/c_qun_xiang/attack_windup.webp",attack:"./runtime/c_qun_xiang/attack.webp"},
    c_qun_baima:{idle:"./runtime/c_qun_baima/idle.webp",attack_windup:"./runtime/c_qun_baima/attack_windup.webp",attack:"./runtime/c_qun_baima/attack.webp"},
    b2_wei:{idle:"./runtime/b2_wei/idle.webp",attack_windup:"./runtime/b2_wei/attack_windup.webp",attack:"./runtime/b2_wei/attack.webp"},
    b2_huangjin:{idle:"./runtime/b2_huangjin/idle.webp",attack_windup:"./runtime/b2_huangjin/attack_windup.webp",attack:"./runtime/b2_huangjin/attack.webp"},
    b4_shu:{idle:"./runtime/b4_shu/idle.webp",attack_windup:"./runtime/b4_shu/attack_windup.webp",attack:"./runtime/b4_shu/attack.webp"},
    b5_shu:{idle:"./runtime/b5_shu/idle.webp",attack_windup:"./runtime/b5_shu/attack_windup.webp",attack:"./runtime/b5_shu/attack.webp"},
    b3_wei:{idle:"./runtime/b3_wei/idle.webp",attack_windup:"./runtime/b3_wei/attack_windup.webp",attack:"./runtime/b3_wei/attack.webp"},
    b4_wei:{idle:"./runtime/b4_wei/idle.webp",attack_windup:"./runtime/b4_wei/attack_windup.webp",attack:"./runtime/b4_wei/attack.webp"},
    b5_wei:{idle:"./runtime/b5_wei/idle.webp",attack_windup:"./runtime/b5_wei/attack_windup.webp",attack:"./runtime/b5_wei/attack.webp"},
    b1_wu:{idle:"./runtime/b1_wu/idle.webp",attack_windup:"./runtime/b1_wu/attack_windup.webp",attack:"./runtime/b1_wu/attack.webp"},
    b3_wu:{idle:"./runtime/b3_wu/idle.webp",attack_windup:"./runtime/b3_wu/attack_windup.webp",attack:"./runtime/b3_wu/attack.webp"},
    b4_wu:{idle:"./runtime/b4_wu/idle.webp",attack_windup:"./runtime/b4_wu/attack_windup.webp",attack:"./runtime/b4_wu/attack.webp"},
    b5_wu:{idle:"./runtime/b5_wu/idle.webp",attack_windup:"./runtime/b5_wu/attack_windup.webp",attack:"./runtime/b5_wu/attack.webp"},
    b1_huangjin:{idle:"./runtime/b1_huangjin/idle.webp",attack_windup:"./runtime/b1_huangjin/attack_windup.webp",attack:"./runtime/b1_huangjin/attack.webp"},
    b3_huangjin:{idle:"./runtime/b3_huangjin/idle.webp",attack_windup:"./runtime/b3_huangjin/attack_windup.webp",attack:"./runtime/b3_huangjin/attack.webp"},
    b5_huangjin:{idle:"./runtime/b5_huangjin/idle.webp",attack_windup:"./runtime/b5_huangjin/attack_windup.webp",attack:"./runtime/b5_huangjin/attack.webp"},
    b1_qun:{idle:"./runtime/b1_qun/idle.webp",attack_windup:"./runtime/b1_qun/attack_windup.webp",attack:"./runtime/b1_qun/attack.webp"},
    b2_qun:{idle:"./runtime/b2_qun/idle.webp",attack_windup:"./runtime/b2_qun/attack_windup.webp",attack:"./runtime/b2_qun/attack.webp"},
    b3_qun:{idle:"./runtime/b3_qun/idle.webp",attack_windup:"./runtime/b3_qun/attack_windup.webp",attack:"./runtime/b3_qun/attack.webp"},
    b4_qun:{idle:"./runtime/b4_qun/idle.webp",attack_windup:"./runtime/b4_qun/attack_windup.webp",attack:"./runtime/b4_qun/attack.webp"}
  };
  const weaponBoostAssets={
    idle:"./runtime/b5_huangjin/weapon_boost/idle.webp",
    attack_windup:"./runtime/b5_huangjin/weapon_boost/attack_windup.webp",
    attack:"./runtime/b5_huangjin/weapon_boost/attack.webp"
  };
  const headAnchors={
    blade:{idle:["0%","0%"],attack_windup:["0%","0%"],attack:["0%","0%"]},
    spear:{idle:["0%","0%"],attack_windup:["0%","0%"],attack:["0%","0%"]},
    cavalry:{idle:["0%","0%"],attack_windup:["0%","0%"],attack:["0%","0%"]},
    daoDun:{idle:["0%","0%"],attack_windup:["0%","0%"],attack:["0%","0%"]},
    daoDunDog:{idle:["0%","0%"],attack_windup:["0%","0%"],attack:["0%","0%"]},
    b1Shu:{idle:["0%","0%"],attack_windup:["0%","0%"],attack:["0%","0%"]},
    jiBing:{idle:["0%","0%"],attack_windup:["0%","0%"],attack:["0%","0%"]},
    youJi:{idle:["0%","0%"],attack_windup:["0%","0%"],attack:["0%","0%"]},
    sheSheng:{idle:["0%","0%"],attack_windup:["0%","0%"],attack:["0%","0%"]},
    corpsePuppet:{idle:["0%","0%"],attack_windup:["0%","0%"],attack:["0%","0%"]},
    heroSpearPuppet:{idle:["0%","0%"],attack_windup:["0%","0%"],attack:["0%","0%"]},
    c_shu_huben:{idle:["0%","0%"],attack_windup:["0%","0%"],attack:["0%","0%"]},
    c_wei_baowei:{idle:["0%","0%"],attack_windup:["0%","0%"],attack:["0%","0%"]},
    c_wu_jieying:{idle:["0%","0%"],attack_windup:["0%","0%"],attack:["0%","0%"]},
    c_wu_firebow:{idle:["0%","0%"],attack_windup:["0%","0%"],attack:["0%","0%"]},
    c_huang_guidao:{idle:["0%","0%"],attack_windup:["0%","0%"],attack:["0%","0%"]},
    c_huang_zombie:{idle:["0%","0%"],attack_windup:["0%","0%"],attack:["0%","0%"]},
    c_shu_kongming:{idle:["0%","0%"],attack_windup:["0%","0%"],attack:["0%","0%"]},
    c_wei_huwei:{idle:["0%","0%"],attack_windup:["0%","0%"],attack:["0%","0%"]},
    c_qun_xiang:{idle:["0%","0%"],attack_windup:["0%","0%"],attack:["0%","0%"]},
    c_qun_baima:{idle:["0%","0%"],attack_windup:["0%","0%"],attack:["0%","0%"]},
    b2_wei:{idle:["0%","0%"],attack_windup:["0%","0%"],attack:["0%","0%"]},
    b2_huangjin:{idle:["0%","0%"],attack_windup:["0%","0%"],attack:["0%","0%"]},
    b4_shu:{idle:["0%","0%"],attack_windup:["0%","0%"],attack:["0%","0%"]},
    b5_shu:{idle:["0%","0%"],attack_windup:["0%","0%"],attack:["0%","0%"]},
    b3_wei:{idle:["0%","0%"],attack_windup:["0%","0%"],attack:["0%","0%"]},
    b4_wei:{idle:["0%","0%"],attack_windup:["0%","0%"],attack:["0%","0%"]},
    b5_wei:{idle:["0%","0%"],attack_windup:["0%","0%"],attack:["0%","0%"]},
    b1_wu:{idle:["0%","0%"],attack_windup:["0%","0%"],attack:["0%","0%"]},
    b3_wu:{idle:["0%","0%"],attack_windup:["0%","0%"],attack:["0%","0%"]},
    b4_wu:{idle:["0%","0%"],attack_windup:["0%","0%"],attack:["0%","0%"]},
    b5_wu:{idle:["0%","0%"],attack_windup:["0%","0%"],attack:["0%","0%"]},
    b1_huangjin:{idle:["0%","0%"],attack_windup:["0%","0%"],attack:["0%","0%"]},
    b3_huangjin:{idle:["0%","0%"],attack_windup:["0%","0%"],attack:["0%","0%"]},
    b5_huangjin:{idle:["0%","0%"],attack_windup:["0%","0%"],attack:["0%","0%"]},
    b1_qun:{idle:["0%","0%"],attack_windup:["0%","0%"],attack:["0%","0%"]},
    b2_qun:{idle:["0%","0%"],attack_windup:["0%","0%"],attack:["0%","0%"]},
    b3_qun:{idle:["0%","0%"],attack_windup:["0%","0%"],attack:["0%","0%"]},
    b4_qun:{idle:["0%","0%"],attack_windup:["0%","0%"],attack:["0%","0%"]},
    daoDunDog:{idle:["0%","0%"],attack_windup:["0%","0%"],attack:["0%","0%"]},
  };
  const projectileAssets={
    b1Shu:"./runtime/b1_shu/projectile_arrow.webp",
    youJi:"./runtime/you_ji/projectile_arrow.webp",
    sheSheng:"./runtime/she_sheng/projectile_arrow.webp",
    c_wu_firebow:"./runtime/c_wu_firebow/projectile_fire_arrow.webp",
    c_shu_kongming:"./runtime/c_shu_kongming/projectile_oil_jar.webp",
    c_qun_baima:"./runtime/c_qun_baima/projectile_arrow.webp",
    c_huang_guidao:"./runtime/c_huang_guidao/projectile_soul_talisman.webp",
    b4_shu:"./runtime/b4_shu/projectile_rotor.webp",
    b5_shu:"./runtime/b5_shu/projectile_herb.webp",
    b4_wei:"./runtime/b4_wei/projectile_stone.webp",
    b5_wei:"./runtime/b5_wei/projectile_herb.webp",
    b1_wu:"./runtime/b1_wu/projectile_arrow.webp",
    b4_wu:"./runtime/b4_wu/projectile_bolt.webp",
    b5_wu:"./runtime/b5_wu/projectile_herb.webp",
    b1_huangjin:"./runtime/b1_huangjin/projectile_arrow.webp",
    b5_huangjin:"./runtime/b5_huangjin/projectile_herb.webp",
    b1_qun:"./runtime/b1_qun/projectile_arrow.webp",
    b4_qun:"./runtime/b4_qun/projectile_stone.webp"
  };
  const effectAssets={
    earthDust:"./runtime/effects/earth-dust-v060.webp",
    blade:"./runtime/effects/blade_hit.webp",
    spear:"./runtime/effects/spear_hit.webp",
    cavalry:"./runtime/effects/cavalry_hit.webp",
    daoDun:"./runtime/effects/dao_dun_hit.webp",
    daoDunDog:"./runtime/effects/dao_dun_hit.webp",
    b1Shu:"./runtime/effects/b1_shu_hit.webp",
    jiBing:"./runtime/effects/ji_bing_hit.webp",
    youJi:"./runtime/effects/you_ji_hit.webp",
    sheSheng:"./runtime/effects/she_sheng_hit.webp",
    corpsePuppet:"./runtime/effects/corpse_puppet_hit.webp",
    heroSpearPuppet:"./runtime/effects/hero_spear_puppet_hit.webp",
    c_shu_huben:"./runtime/effects/c_shu_huben_hit.webp",
    c_wei_baowei:"./runtime/effects/c_wei_baowei_hit.webp",
    c_wu_jieying:"./runtime/effects/c_wu_jieying_hit.webp",
    c_wu_firebow:"./runtime/effects/c_wu_firebow_hit.webp",
    fireField:"./runtime/effects/c_wu_firebow_field.webp",
    fireBurst:"./runtime/effects/c_wu_firebow_burst.webp",
    c_huang_guidao:"./runtime/effects/c_huang_guidao_hit.webp",
    c_huang_zombie:"./runtime/effects/c_huang_zombie_hit.webp",
    c_shu_kongming:"./runtime/effects/c_shu_kongming_hit.webp",
    c_wei_huwei:"./runtime/effects/c_wei_huwei_hit.webp",
    c_qun_xiang:"./runtime/effects/c_qun_xiang_hit.webp",
    c_qun_baima:"./runtime/effects/c_qun_baima_hit.webp",
    b2_wei:"./runtime/effects/b2_wei_hit.webp",
    b2_huangjin:"./runtime/effects/b2_huangjin_hit.webp",
    b4_shu:"./runtime/effects/b4_shu_hit.webp",
    b5_shu:"./runtime/effects/b5_shu_hit.webp",
    b3_wei:"./runtime/effects/b3_wei_hit.webp",
    b4_wei:"./runtime/effects/b4_wei_hit.webp",
    b5_wei:"./runtime/effects/b5_wei_hit.webp",
    b1_wu:"./runtime/effects/b1_wu_hit.webp",
    b3_wu:"./runtime/effects/b3_wu_hit.webp",
    b4_wu:"./runtime/effects/b4_wu_hit.webp",
    b5_wu:"./runtime/effects/b5_wu_hit.webp",
    b1_huangjin:"./runtime/effects/b1_huangjin_hit.webp",
    b3_huangjin:"./runtime/effects/b3_huangjin_hit.webp",
    b5_huangjin:"./runtime/effects/b5_huangjin_hit.webp",
    b1_qun:"./runtime/effects/b1_qun_hit.webp",
    b2_qun:"./runtime/effects/b2_qun_hit.webp",
    b3_qun:"./runtime/effects/b3_qun_hit.webp",
    b4_qun:"./runtime/effects/b4_qun_hit.webp"
  };
  // Restore the first port: approved poses plus its approved projectile/effect overrides.
  const newArt=new URLSearchParams(location.search).get("art")!=="original";
  const approvedPack=window.APPROVED_ART_PACK;
  if(newArt)for(const [kind,entry] of Object.entries(approvedPack)){
    if(!assets[kind])throw new Error(`兵种映射不存在：${kind}`);
    for(const state of STATES)assets[kind][state]=entry.assets[state];
    if(entry.assets.projectile)projectileAssets[kind]=entry.assets.projectile;
    if(entry.assets.effect)effectAssets[kind]=entry.assets.effect;
  }
  document.documentElement.dataset.art=newArt?"approved":"original";
  window.__ART_PORT__={newArt,pack:approvedPack,assets,projectileAssets,effectAssets};
  const defs={
    blade:{formalId:"blade",name:"刀兵",action:"斜劈",hp:220,atk:[18,22],interval:1.2,speed:.60,range:.42,radius:.33,windup:.22,windupRetreat:.11,attackLunge:.25,attackTime:.28,hitStop:.10},
    spear:{formalId:"spear",name:"枪兵",action:"直线突刺",hp:200,atk:[24,28],interval:1.6,speed:.5625,range:.75,radius:.33,windup:.34,windupRetreat:.18,attackLunge:.42,attackTime:.32,hitStop:.13},
    cavalry:{formalId:"b2_shu",name:"汉中突骑",action:"人马冲锋",hp:420,atk:[34,40],interval:1.4,speed:.7875,range:.45,radius:.45,windup:.30,windupRetreat:.14,attackLunge:.34,attackTime:.30,hitStop:.14,charge:true},
    daoDun:{formalId:"daoDun",name:"刀盾兵",action:"守中短斩",hp:320,atk:[20,24],interval:1.3,speed:.48,range:.42,radius:.36,windup:.26,windupRetreat:.08,attackLunge:.19,attackTime:.24,hitStop:.09},
    daoDunDog:{formalId:"daoDunDog",name:"刀盾狗",action:"犬卫短斩",hp:320,atk:[20,24],interval:1.3,speed:.48,range:.42,radius:.36,windup:.26,windupRetreat:.08,attackLunge:.19,attackTime:.24,hitStop:.09,archetype:"bladeShield"},
    b1Shu:{formalId:"b1_shu",name:"益州弓手",action:"拉弓放箭",hp:150,atk:[18,22],interval:1.5,speed:.45,range:3,radius:.30,windup:.42,windupRetreat:.06,attackLunge:.08,attackTime:.22,hitStop:.06,ranged:true},
    jiBing:{formalId:"jiBing",name:"戟兵",action:"横刺压制",hp:230,atk:[27,31],interval:1.5,speed:.525,range:.78,radius:.34,windup:.30,windupRetreat:.14,attackLunge:.34,attackTime:.29,hitStop:.11},
    youJi:{formalId:"youJi",name:"游击兵",action:"短弓游射",hp:210,atk:[22,26],interval:1.1,speed:.5625,range:2,radius:.30,windup:.34,windupRetreat:.05,attackLunge:.06,attackTime:.20,hitStop:.06,ranged:true},
    sheSheng:{formalId:"sheSheng",name:"射声兵",action:"长弓点杀",hp:230,atk:[28,32],interval:1.5,speed:.46875,range:3.5,radius:.30,windup:.48,windupRetreat:.06,attackLunge:.07,attackTime:.24,hitStop:.07,ranged:true},
    corpsePuppet:{formalId:"corpsePuppet",name:"复生傀儡",action:"僵硬短斩",hp:225,atk:[14,18],interval:1.5,speed:.425,range:.42,radius:.34,windup:.38,windupRetreat:.14,attackLunge:.29,attackTime:.30,hitStop:.11},
    heroSpearPuppet:{formalId:"heroSpearPuppet",name:"枪兵傀儡",action:"轴线直刺",hp:160,atk:[18,18],interval:1.6,speed:.46875,range:.75,radius:.33,windup:.36,windupRetreat:.19,attackLunge:.44,attackTime:.31,hitStop:.13},
    c_shu_huben:{formalId:"c_shu_huben",name:"虎贲",action:"短势连斩",hp:520,atk:[40,46],interval:.75,speed:.50,range:.45,radius:.34,windup:.20,windupRetreat:.08,attackLunge:.28,attackTime:.20,hitStop:.08},
    c_wei_baowei:{formalId:"c_wei_baowei",name:"豹卫军",action:"潜袭快斩",hp:460,atk:[55,65],interval:1.3,speed:.59,range:.45,radius:.36,windup:.28,windupRetreat:.12,attackLunge:.34,attackTime:.25,hitStop:.11},
    c_wu_jieying:{formalId:"c_wu_jieying",name:"劫营步兵",action:"压低重劈",hp:400,atk:[30,36],interval:1.2,speed:.525,range:.45,radius:.34,windup:.34,windupRetreat:.12,attackLunge:.31,attackTime:.30,hitStop:.12},
    c_wu_firebow:{formalId:"c_wu_firebow",name:"火攻弓手",action:"斜上火箭",hp:260,atk:[24,28],interval:1.5,speed:.46875,range:3,radius:.30,windup:.46,windupRetreat:.06,attackLunge:.07,attackTime:.24,hitStop:.07,ranged:true},
    c_huang_guidao:{formalId:"c_huang_guidao",name:"鬼道师",action:"符杖召尸",hp:340,atk:[20,26],interval:2,speed:.45,range:2.4,radius:.31,windup:.50,windupRetreat:.08,attackLunge:.10,attackTime:.30,hitStop:.08,ranged:true,support:true},
    c_huang_zombie:{formalId:"c_huang_zombie",name:"僵尸兵",action:"跳扑短斩",hp:450,atk:[28,34],interval:1.5,speed:.45,range:.45,radius:.34,windup:.36,windupRetreat:.15,attackLunge:.34,attackTime:.32,hitStop:.12},
    c_shu_kongming:{formalId:"c_shu_kongming",name:"孔明灯",action:"俯投火油",hp:280,atk:[35,45],interval:2.4,speed:.45,range:2.25,radius:.36,windup:.56,windupRetreat:.06,attackLunge:.04,attackTime:.36,hitStop:.08,ranged:true,air:true},
    c_wei_huwei:{formalId:"c_wei_huwei",name:"虎卫军",action:"盾后短击",hp:900,atk:[30,36],interval:1.7,speed:.468,range:.45,radius:.39,windup:.34,windupRetreat:.08,attackLunge:.22,attackTime:.27,hitStop:.12,heavy:true},
    c_qun_xiang:{formalId:"c_qun_xiang",name:"巨象甲兵",action:"整象踏阵",hp:1400,atk:[70,85],interval:2.2,speed:.408,range:.52,radius:.58,windup:.42,windupRetreat:.18,attackLunge:.48,attackTime:.38,hitStop:.17,charge:true,giant:true},
    c_qun_baima:{formalId:"c_qun_baima",name:"白马义从",action:"驰射仰箭",hp:380,atk:[26,30],interval:1.2,speed:.72,range:2.5,radius:.45,windup:.38,windupRetreat:.08,attackLunge:.12,attackTime:.24,hitStop:.07,ranged:true,movingShot:true},
    b2_wei:{formalId:"b2_wei",name:"虎豹骑",action:"重枪冲锋",hp:420,atk:[34,40],interval:1.4,speed:.7875,range:.45,radius:.45,windup:.32,windupRetreat:.16,attackLunge:.38,attackTime:.31,hitStop:.15,charge:true},
    b2_huangjin:{formalId:"b2_huangjin",name:"黄天骑",action:"挺枪奔袭",hp:420,atk:[34,40],interval:1.4,speed:.7875,range:.45,radius:.45,windup:.31,windupRetreat:.16,attackLunge:.37,attackTime:.31,hitStop:.14,charge:true},
    b4_shu:{formalId:"b4_shu",name:"旋刃车",action:"蓄轮飞刃",hp:500,atk:[60,80],interval:3.2,speed:.3375,range:4,radius:.44,windup:.54,windupRetreat:.04,attackLunge:.03,attackTime:.34,hitStop:.10,ranged:true,machine:true},
    b5_shu:{formalId:"b5_shu",name:"蜀中医士",action:"振铃投药",hp:260,atk:[12,16],interval:1.8,speed:.46875,range:2.25,radius:.30,windup:.44,windupRetreat:.05,attackLunge:.05,attackTime:.26,hitStop:.07,ranged:true,support:true},
    b3_wei:{formalId:"b3_wei",name:"虎卫军",action:"举盾顿击",hp:620,atk:[26,30],interval:1.6,speed:.50625,range:.42,radius:.38,windup:.34,windupRetreat:.08,attackLunge:.22,attackTime:.29,hitStop:.12,heavy:true},
    b4_wei:{formalId:"b4_wei",name:"霹雳车",action:"绞索抛石",hp:500,atk:[60,80],interval:6.4,speed:.2025,get range(){return defs.sheSheng.range*1.5;},radius:.44,windup:1.35,windupRetreat:.03,attackLunge:.02,attackTime:.38,hitStop:.12,ranged:true,machine:true},
    b5_wei:{formalId:"b5_wei",name:"随军医士",action:"举葫投药",hp:260,atk:[12,16],interval:1.8,speed:.46875,range:2.25,radius:.30,windup:.43,windupRetreat:.05,attackLunge:.05,attackTime:.26,hitStop:.07,ranged:true,support:true},
    b1_wu:{formalId:"b1_wu",name:"江东弓手",action:"侧身疾射",hp:240,atk:[20,24],interval:1.5,speed:.46875,range:3,radius:.30,windup:.43,windupRetreat:.06,attackLunge:.07,attackTime:.23,hitStop:.06,ranged:true},
    b3_wu:{formalId:"b3_wu",name:"巾帼卫",action:"圆盾反斩",hp:620,atk:[26,30],interval:1.6,speed:.50625,range:.42,radius:.38,windup:.31,windupRetreat:.07,attackLunge:.24,attackTime:.27,hitStop:.11,heavy:true},
    b4_wu:{formalId:"b4_wu",name:"劲弩车",action:"踏弩贯射",hp:500,atk:[60,80],interval:3.2,speed:.3375,range:4,radius:.44,windup:.50,windupRetreat:.03,attackLunge:.02,attackTime:.31,hitStop:.11,ranged:true,machine:true},
    b5_wu:{formalId:"b5_wu",name:"江东医士",action:"摇铃投药",hp:260,atk:[12,16],interval:1.8,speed:.46875,range:2.25,radius:.30,windup:.42,windupRetreat:.05,attackLunge:.05,attackTime:.25,hitStop:.07,ranged:true,support:true},
    b1_huangjin:{formalId:"b1_huangjin",name:"太平弓手",action:"仰弓放箭",hp:240,atk:[20,24],interval:1.5,speed:.46875,range:3,radius:.30,windup:.45,windupRetreat:.07,attackLunge:.07,attackTime:.24,hitStop:.06,ranged:true},
    b3_huangjin:{formalId:"b3_huangjin",name:"黄巾力士",action:"木盾猛撞",hp:620,atk:[26,30],interval:1.6,speed:.50625,range:.42,radius:.38,windup:.37,windupRetreat:.11,attackLunge:.28,attackTime:.31,hitStop:.13,heavy:true},
    b5_huangjin:{formalId:"b5_huangjin",name:"太平道士",action:"符铃投药",hp:260,atk:[12,16],interval:1.8,speed:.46875,range:2.25,radius:.30,windup:.46,windupRetreat:.06,attackLunge:.05,attackTime:.28,hitStop:.08,ranged:true,support:true},
    b1_qun:{formalId:"b1_qun",name:"河北弓手",action:"强弓平射",hp:240,atk:[20,24],interval:1.5,speed:.46875,range:3,radius:.30,windup:.47,windupRetreat:.07,attackLunge:.07,attackTime:.25,hitStop:.07,ranged:true},
    b2_qun:{formalId:"b2_qun",name:"金戈铁马",action:"重骑冲锋",hp:420,atk:[34,40],interval:1.4,speed:.7875,range:.45,radius:.45,windup:.33,windupRetreat:.17,attackLunge:.39,attackTime:.32,hitStop:.15,charge:true},
    b3_qun:{formalId:"b3_qun",name:"金甲勇士",action:"金盾压斩",hp:620,atk:[26,30],interval:1.6,speed:.50625,range:.42,radius:.38,windup:.35,windupRetreat:.09,attackLunge:.25,attackTime:.29,hitStop:.12,heavy:true},
    b4_qun:{formalId:"b4_qun",name:"强石车",action:"重臂砸石",hp:500,atk:[60,80],interval:6.4,speed:.2025,get range(){return defs.sheSheng.range*1.5;},radius:.44,windup:1.35,windupRetreat:.03,attackLunge:.02,attackTime:.40,hitStop:.13,ranged:true,machine:true}
  };
  const heavyCombat=window.HeavyCombat;
  const allTroopKinds=Object.keys(assets);
  const TROOP_RATES_KEY='battle-troop-rates-v085';
  let storedRates={};try{storedRates=JSON.parse(localStorage.getItem(TROOP_RATES_KEY)||'{}')}catch{}
  const troopRates=window.TroopRates.create(allTroopKinds,storedRates);
  function attackSpeedFor(kind){return attackSpeed*troopRates.attack(kind);}
  function saveTroopRates(){try{localStorage.setItem(TROOP_RATES_KEY,JSON.stringify(troopRates.snapshot()));return true;}catch{return false;}}

  const horseKinds=new Set(["cavalry","c_qun_baima","b2_wei","b2_huangjin","b2_qun"]);
  const archerKinds=new Set(["b1Shu","youJi","sheSheng","c_wu_firebow","c_qun_baima","b1_wu","b1_huangjin","b1_qun"]);
  const COMBAT_DEFAULTS={archerAttack:.9,cavalryHp:1.25,elephantHp:1.25};
  const combatBalance={...COMBAT_DEFAULTS};
  const attackMultiplier=kind=>archerKinds.has(kind)?combatBalance.archerAttack:1;
  const damageAmount=(kind,raw,charge=false)=>Math.round(raw*attackMultiplier(kind)*(charge?1.5:1));
  const maximumHp=kind=>Math.round(defs[kind].hp*(kind==="c_qun_xiang"?combatBalance.elephantHp:horseKinds.has(kind)?combatBalance.cavalryHp:1));
  const machineKinds=new Set(["b4_shu","b4_wei","b4_wu","b4_qun"]);
    const CHAPTER1_KINDS=new Set(["blade","spear","b1_huangjin","b2_huangjin","b3_huangjin","b5_huangjin","c_huang_guidao","c_huang_zombie"]);
  const v018ImpactMotion={
    blade:{strikeTime:.045,attackForward:.31,attackTime:.14,recoveryTime:.20,knockback:.16,recoilPx:7,hitStopMs:56,numberDelay:82,style:"slash"},
    spear:{strikeTime:.042,attackForward:.45,attackTime:.13,recoveryTime:.20,knockback:.22,recoilPx:8,hitStopMs:72,numberDelay:100,style:"pierce"},
    b1_huangjin:{strikeTime:.055,attackForward:.10,attackTime:.15,recoveryTime:.20,knockback:.16,recoilPx:7,hitStopMs:60,numberDelay:96,style:"projectile"},
    b2_huangjin:{strikeTime:.060,attackForward:.42,attackTime:.16,recoveryTime:.30,knockback:.62,recoilPx:12,hitStopMs:92,numberDelay:124,style:"charge"},
    b3_huangjin:{strikeTime:.052,attackForward:.34,attackTime:.16,recoveryTime:.24,knockback:.32,recoilPx:10,hitStopMs:78,numberDelay:110,style:"crash"},
    b5_huangjin:{strikeTime:.055,attackForward:.09,attackTime:.16,recoveryTime:.22,knockback:.14,recoilPx:6,hitStopMs:58,numberDelay:96,style:"talisman"},
    c_huang_guidao:{strikeTime:.055,attackForward:.12,attackTime:.17,recoveryTime:.24,knockback:.18,recoilPx:7,hitStopMs:66,numberDelay:104,style:"talisman"},
    c_huang_zombie:{strikeTime:.050,attackForward:.36,attackTime:.15,recoveryTime:.24,knockback:.25,recoilPx:9,hitStopMs:74,numberDelay:108,style:"slash"}
  };
  const batches={
    chapter1:{label:"第一章 8",kinds:["blade","spear","b1_huangjin","b2_huangjin","b3_huangjin","b5_huangjin","c_huang_guidao","c_huang_zombie"]},
    allTroops:{label:"全员 39",kinds:allTroopKinds,overview:true},
    allBattle:{label:"全军会战",kinds:allTroopKinds,massBattle:true},
    crowd200:{label:"200人会战",kinds:allTroopKinds,massBattle:true,mixedCount:100},
    barracks98:{label:"44营通道出兵",kinds:allTroopKinds,massBattle:true,barracks:true},
    crowd400:{label:"400人压力测试",kinds:allTroopKinds,massBattle:true,mixedCount:200},
    cavalryRush:{label:"骑兵冲阵",kinds:["cavalry","b2_wei","blade"],massBattle:true,heavyScene:"rush"},
    chargeBlock:{label:"骑兵冲重装",kinds:["cavalry","c_qun_xiang","b4_wei","b4_qun"],massBattle:true,heavyScene:"block"},
    elephantStomp:{label:"象兵践踏",kinds:["c_qun_xiang","blade"],massBattle:true,heavyScene:"stomp"},
    stoneBlast:{label:"投石范围爆炸",kinds:["b4_wei","b4_qun","blade"],massBattle:true,heavyScene:"blast"},
    newTroop:{label:"新兵种 1",kinds:["daoDunDog"]},
    core:{label:"基础 6",kinds:["blade","spear","cavalry","daoDun","b1Shu","jiBing"]},
    new:{label:"新增 4",kinds:["youJi","sheSheng","corpsePuppet","heroSpearPuppet","blade","spear"]},
    c:{label:"C阶 6",kinds:["c_shu_huben","c_wei_baowei","c_wu_jieying","c_wu_firebow","c_huang_guidao","c_huang_zombie"]},
    special:{label:"特种 6",kinds:["c_shu_kongming","c_wei_huwei","c_qun_xiang","c_qun_baima","b2_wei","b2_huangjin"]},
    bShuWei:{label:"蜀魏B 6",kinds:["b4_shu","b5_shu","b3_wei","b4_wei","b5_wei","b1_wu"]},
    bWuHuang:{label:"吴黄B 6",kinds:["b3_wu","b4_wu","b5_wu","b1_huangjin","b3_huangjin","b5_huangjin"]},
    bQun:{label:"群雄B 4",kinds:["b1_qun","b2_qun","b3_qun","b4_qun"]}
  };
  for(const [kind,entry] of Object.entries(approvedPack))batches[`approved_${kind}`]={label:`新图素 · ${entry.name}`,kinds:[kind]};
  const requestedBatch=new URLSearchParams(location.search).get("batch");
  let activeBatch=batches[requestedBatch]?requestedBatch:"chapter1";
  const columnPattern=count=>count===1?[3]:count===2?[1.65,4.35]:count===4?[.6,2.2,3.8,5.4]:count===8?[.55,2.15,3.75,5.35,.55,2.15,3.75,5.35]:[.1,1.25,2.4,3.6,4.75,5.9];
  const formationOffsets=name=>name==="special"?[-.72,.72,-.72,.72,-.72,.72]:batches[name].kinds.length===1?[0]:batches[name].kinds.length===2?[0,0]:batches[name].kinds.length===4?[-.28,.28,-.28,.28]:batches[name].kinds.length===8?[-.72,-.72,-.72,-.72,.72,.72,.72,.72]:[-.42,.32,-.42,.32,-.42,.32];
  const buildLanes=name=>Object.fromEntries(batches[name].kinds.map((kind,index)=>[kind,(batches[name].overview||batches[name].massBattle)?(index%6+.08):columnPattern(batches[name].kinds.length)[index]]));
  let lanes=buildLanes(activeBatch);
  const terrain=window.BattleTerrain;
  const BASE_MAP={columns:terrain.columns,rows:terrain.rows.length},MASS_MAP={...BASE_MAP};
  let mapSize={...BASE_MAP};
  const isFreeBattle=()=>Boolean(batches[activeBatch].massBattle);
  const isVerticalBattle=()=>!isFreeBattle();
  const field=document.querySelector("#field"),board=document.querySelector("#board"),overviewGrid=document.querySelector("#overviewGrid"),clock=document.querySelector("#clock"),battleState=document.querySelector("#battleState"),modeState=document.querySelector("#modeState"),statusText=document.querySelector("#statusText"),assetState=document.querySelector("#assetState");
  board.style.setProperty("--health-track-scale",String(HUD_HEALTH_WIDTH_SCALE));
  const roster=document.querySelector("#roster"),pauseButton=document.querySelector("#pauseButton"),resetButton=document.querySelector("#resetButton"),speedButton=document.querySelector("#speedButton"),reviewButton=document.querySelector("#reviewButton"),batchButton=document.querySelector("#batchButton");
  const frameToggleButton=document.getElementById("frameToggleButton"),panelFrameToggle=document.getElementById("panelFrameToggle");
  // v074: silhouette keylines have their own preference; plaques stay hidden and HUD geometry stays fixed.
  const FRAME_VISIBILITY_KEY="action-port-troop-rates-v085";
  let framesVisible=true;
  function setFramesVisible(visible){
    framesVisible=Boolean(visible);
    document.body.classList.add("frames-hidden");
    document.body.classList.toggle("team-outline-on",framesVisible);
    for(const button of [frameToggleButton,panelFrameToggle]){
      button.textContent=framesVisible?"隐藏红蓝包边":"显示红蓝包边";
      button.setAttribute("aria-pressed",String(framesVisible));
      button.setAttribute("aria-label",framesVisible?"隐藏小兵红蓝包边":"显示小兵红蓝包边");
    }
    try{localStorage.setItem(FRAME_VISIBILITY_KEY,String(framesVisible))}catch{}
  }
  try{framesVisible=localStorage.getItem(FRAME_VISIBILITY_KEY)!=="false"}catch{}
  setFramesVisible(framesVisible);
  frameToggleButton.onclick=()=>setFramesVisible(!framesVisible);
  panelFrameToggle.onclick=()=>setFramesVisible(!framesVisible);
  let areaDamageEnabled=true,mainHeroes=[],areaFeedback=[];
  let unitSerial=0,barracksModel=null,barracksReclaimed=0,nextBarracksReclaim=0,barracksFps=0,fpsStart=0,fpsFrames=0;
  let artBounds={},presentationFits={},groundFits={},headFrameFits={},frameFits={},hudFits={},sizeFits={},units=[],runtimeFrames=Object.fromEntries(Object.keys(assets).map(kind=>[kind,{}])),weaponBoostRuntime={},effectRuntime={},projectileRuntime={},loaded=0,running=true,timeScale=1,attackSpeed=1.5,reviewMode=false,reviewStarted=0,reviewEffectPhase=-1,overviewStateIndex=0,last=performance.now(),elapsed=0,ready=false,battleToken=0;
  const expectedAssets=Object.keys(assets).length*STATES.length+Object.keys(effectAssets).length+Object.keys(projectileAssets).length+Object.keys(weaponBoostAssets).length;
  const effectCounts={...Object.fromEntries(Object.keys(assets).map(kind=>[kind,0])),heavyImpact:0,sameTargetDedup:0,arrow:0};

  const tileKey=(col,row)=>`${col},${row}`;
  function renderMapTiles(nextMap){
    mapSize={...nextMap};board.dataset.columns=String(mapSize.columns);board.dataset.rows=String(mapSize.rows);board.querySelectorAll(".tile").forEach(tile=>tile.remove());if(!field.classList.contains("full-map-field")){board.style.width=`${mapSize.columns*54}px`;board.style.height=`${mapSize.rows*54}px`;}board.style.gridTemplateColumns=`repeat(${mapSize.columns}, var(--cell))`;board.style.gridTemplateRows=`repeat(${mapSize.rows}, var(--cell))`;
    for(let row=0;row<mapSize.rows;row++)for(let col=0;col<mapSize.columns;col++){
      const cell=document.createElement("span"),type=terrain.rows[row][col];
      cell.className=`tile ${(row+col)%2?"alt":""} ${type==="~"?"water":""} ${type==="B"?"bridge":""}`;cell.dataset.col=col;cell.dataset.row=row;board.append(cell);
    }
  }
  renderMapTiles(BASE_MAP);
  function renderBatchChrome(){
    board.querySelectorAll(".lane-label").forEach(label=>label.remove());
    roster.innerHTML="";
    if(batches[activeBatch].overview||batches[activeBatch].massBattle){
      const summary=batches[activeBatch].barracks?[["蓝方 24营","core"],["红方 24营","daoDunDog"],["39兵种 · 每5秒出兵","spear"]]:batches[activeBatch].overview?[["正式配置 38","core"],["新兵种 1","daoDunDog"],["实机比例纵览","spear"]]:[[`蓝军 ${batches[activeBatch].mixedCount||39}`,"core"],[`红军 ${batches[activeBatch].mixedCount||39}`,"daoDunDog"],["自由索敌 · 双桥地形","spear"]];
      for(const [text,kind] of summary){
        const chip=document.createElement("span");chip.className=`kind-chip kind-chip--${kind}`;chip.textContent=text;roster.append(chip)
      }
    }else for(const kind of Object.keys(lanes)){
      const label=document.createElement("span");label.className=`lane-label ${kind}`;label.textContent=`${defs[kind].name} · ${defs[kind].action}`;label.style.left=`${(lanes[kind]+.5)*54}px`;board.append(label);
      const chip=document.createElement("span");chip.className=`kind-chip kind-chip--${kind}`;chip.textContent=`${defs[kind].name} · ${defs[kind].action}`;roster.append(chip);
    }
    const groupedOrder=["chapter1","newTroop","core","new","c","special","bShuWei","bWuHuang","bQun"],next=activeBatch==="allTroops"?"allBattle":activeBatch==="allBattle"?"allTroops":groupedOrder[(groupedOrder.indexOf(activeBatch)+1)%groupedOrder.length];
    batchButton.textContent=`看${batches[next].label.replace(/\s\d+$/,'')}`;
    batchButton.classList.toggle("on",activeBatch==="allTroops"||activeBatch==="allBattle");
  }

  function overviewUnitMarkup(kind){
    const def=defs[kind],weaponBoost=kind==="b5_huangjin"&&!newArt?`<span class="weapon-boost-wrap" aria-hidden="true"><img class="weapon-boost" alt=""></span>`:"";
    return `<div class="overview-unit unit blue" data-kind="${kind}" data-state="idle" data-country="${window.TroopOutline.countryOf(kind)}" data-tier="${window.TroopOutline.tierOf(kind)}" style="--troop-outline-filter:url(#troopOutline${window.TroopOutline.tierOf(kind)})"><div class="unit-action"><div class="unit-frame"></div><div class="unit-visual">${weaponBoost}<img class="card-sprite" alt="${def.name}待机帧"></div></div><div class="unit-hud"><span class="unit-hp"><i></i></span><span class="unit-level"><b>1</b></span></div></div><span class="overview-name">${def.name}</span>`
  }
  function setOverviewState(stateIndex){
    overviewStateIndex=(stateIndex+STATES.length)%STATES.length;const state=STATES[overviewStateIndex];
    for(const card of overviewGrid.querySelectorAll(".overview-card")){
      const kind=card.dataset.kind,unit=card.querySelector(".overview-unit"),sprite=card.querySelector(".card-sprite"),anchor=headAnchors[kind][state];
      unit.dataset.state=state;fitTroopArt(unit,kind,state);sprite.style.setProperty("--head-shift-x",anchor[0]);sprite.style.setProperty("--head-shift-y",anchor[1]);sprite.src=runtimeFrames[kind][state]||"";sprite.alt=`${defs[kind].name}${stateLabel[state]}帧`;
      const weaponWrap=card.querySelector(".weapon-boost-wrap"),weapon=card.querySelector(".weapon-boost");if(weaponWrap&&weapon){weaponWrap.style.setProperty("--head-shift-x",anchor[0]);weaponWrap.style.setProperty("--head-shift-y",anchor[1]);weapon.src=weaponBoostRuntime[state]||weaponBoostAssets[state]}
    }
    battleState.textContent=`全员39 · ${stateLabel[state]}帧同屏检查`;modeState.textContent=`${overviewStateIndex+1}/3 帧`;reviewButton.textContent="下一帧";clock.textContent=`${overviewStateIndex+1}/3`
  }
  function renderAllTroopsOverview(){
    overviewGrid.innerHTML="";
    for(const kind of allTroopKinds){const card=document.createElement("article");const sizeClass=kind==="c_qun_xiang"?"overview-card--elephant":horseKinds.has(kind)?"overview-card--mounted":machineKinds.has(kind)?"overview-card--machine":kind==="c_shu_kongming"?"overview-card--flying":"overview-card--ordinary";card.className=`overview-card ${sizeClass}`;card.dataset.kind=kind;card.title=`${defs[kind].name} · ${defs[kind].action}`;card.setAttribute("aria-label",card.title);card.innerHTML=overviewUnitMarkup(kind);overviewGrid.append(card)}
    overviewGrid.hidden=false;setOverviewState(overviewStateIndex)
  }

  function loadImage(src){return new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>{loaded++;assetState.textContent=`${loaded}/${expectedAssets}`;resolve(image)};image.onerror=()=>reject(new Error(`断图：${src}`));image.src=src})}
  function clearBorderBackground(frame,width,height){
    const d=frame.data,seen=new Uint8Array(width*height),queue=new Int32Array(width*height);let head=0,tail=0;
    const removable=index=>{const i=index*4,r=d[i],g=d[i+1],b=d[i+2],a=d[i+3],max=Math.max(r,g,b),min=Math.min(r,g,b);return a<12||(r>205&&g>205&&b>205&&max-min<30)};
    const seed=index=>{if(!seen[index]&&removable(index)){seen[index]=1;queue[tail++]=index}};
    for(let x=0;x<width;x++){seed(x);seed((height-1)*width+x)}for(let y=0;y<height;y++){seed(y*width);seed(y*width+width-1)}
    while(head<tail){const p=queue[head++],x=p%width,y=(p/width)|0;d[p*4+3]=0;if(x>0)seed(p-1);if(x<width-1)seed(p+1);if(y>0)seed(p-width);if(y<height-1)seed(p+width)}
  }
  async function makeRuntimeFrame(kind,state){
    if(newArt&&window.RuntimeGeometryV048)return (await loadImage(window.RuntimeGeometryV048.runtimeFrames[kind][state])).src;
    const image=await loadImage(assets[kind][state]);
    // Approved transparent PNGs are used unchanged, without the old white-background eraser.
    if(newArt&&approvedPack[kind])return image.src;
    const canvas=document.createElement("canvas");canvas.width=1024;canvas.height=1050;
    const ctx=canvas.getContext("2d",{willReadFrequently:true});
    const scale=Math.min(canvas.width/image.width,canvas.height/image.height),w=image.width*scale,h=image.height*scale;
    ctx.drawImage(image,(canvas.width-w)/2,(canvas.height-h)/2,w,h);
    const frame=ctx.getImageData(0,0,canvas.width,canvas.height);
    clearBorderBackground(frame,canvas.width,canvas.height);
    ctx.putImageData(frame,0,0);return canvas.toDataURL("image/png");
  }
  // Fit the visible art, including weapons/mounts. Ignore near-transparent export fringes when locating characters.
  async function measureArtBounds(src){
    const image=new Image();image.src=src;await image.decode();
    const canvas=document.createElement("canvas");canvas.width=image.naturalWidth;canvas.height=image.naturalHeight;
    const ctx=canvas.getContext("2d",{willReadFrequently:true});ctx.drawImage(image,0,0);
    const w=canvas.width,h=canvas.height,data=ctx.getImageData(0,0,w,h).data;
    let left=w,top=h,right=0,bottom=0,area=0;const outline=[];
    for(let y=0;y<h;y++){
      let rowLeft=w,rowRight=0;
      for(let x=0;x<w;x++)if(data[(y*w+x)*4+3]>20){rowLeft=Math.min(rowLeft,x);rowRight=Math.max(rowRight,x+1);area+=data[(y*w+x)*4+3]/255}
      if(rowRight>rowLeft){left=Math.min(left,rowLeft);top=Math.min(top,y);right=Math.max(right,rowRight);bottom=y+1;outline.push([rowLeft/w,y/w,rowRight/w,(y+1)/w])}
    }
    return {left:left/w,top:top/w,right:right/w,bottom:bottom/w,aspect:h/w,area:area/(w*w),outline};
  }
  async function prepareFrameFits(){
    const boostOrigins={idle:[.33,.74],attack_windup:[.64,.55],attack:[.71,.68]};
    // Fit inside the supplied raster's colored interior, in either facing direction.
    const interiors=[];
    for(const src of ["./frame-assets/ally-cyan-blue-v002.webp","./frame-assets/enemy-brick-red-v002.webp"]){
      const image=new Image();image.src=src;await image.decode();
      const canvas=document.createElement("canvas");canvas.width=canvas.height=512;
      const ctx=canvas.getContext("2d",{willReadFrequently:true});ctx.drawImage(image,0,0,512,512);
      const data=ctx.getImageData(0,0,512,512).data,rows=[];
      for(let y=0;y<512;y++){let left=512,right=-1;for(let x=0;x<512;x++){const i=(y*512+x)*4,r=data[i],g=data[i+1],b=data[i+2];if(data[i+3]>240&&Math.max(r,g,b)-Math.min(r,g,b)>60){left=Math.min(left,x);right=Math.max(right,x)}}rows.push([left,right])}
      interiors.push(rows);
    }
    const safeRows=interiors[0].map(([l,r],y)=>[Math.max(l,511-r,interiors[1][y][0],511-interiors[1][y][1])+2,Math.min(r,511-l,interiors[1][y][1],511-interiors[1][y][0])-2]);
    const fits=(pose,scale)=>{
      const cx=(pose.left+pose.right)/2,cy=(pose.top+pose.bottom)/2;
      for(const [l,t,r,b] of pose.outline){
        const x0=((.5+(l-cx)*scale+.14)/1.28)*512,x1=((.5+(r-cx)*scale+.14)/1.28)*512;
        const y0=Math.floor(((.5+(t-cy)*scale+.14)/1.28)*512)-1,y1=Math.ceil(((.5+(b-cy)*scale+.14)/1.28)*512)+1;
        if(y0<0||y1>=512)return false;
        for(let y=y0;y<=y1;y++)if(x0<safeRows[y][0]||x1>safeRows[y][1])return false;
      }
      return true;
    };
    const sizeRows=[];
    for(const kind of Object.keys(assets)){
      const poses={};let scale=Infinity;
      for(const state of STATES){
        const bounds=await measureArtBounds(runtimeFrames[kind][state]),pose={...bounds,outline:[...bounds.outline]};
        if(kind==="b5_huangjin"&&!newArt){
          const weapon=await measureArtBounds(weaponBoostRuntime[state]),origin=boostOrigins[state],ox=origin[0],oy=origin[1]*bounds.aspect;
          const expand=(v,o)=>o+(v-o)*1.16;
          pose.left=Math.min(pose.left,expand(weapon.left,ox));pose.right=Math.max(pose.right,expand(weapon.right,ox));
          pose.top=Math.min(pose.top,expand(weapon.top,oy));pose.bottom=Math.max(pose.bottom,expand(weapon.bottom,oy));
          pose.outline.push(...weapon.outline.map(([l,t,r,b])=>[expand(l,ox),expand(t,oy),expand(r,ox),expand(b,oy)]));
        }
        let low=0,high=1.28/Math.max(pose.right-pose.left,pose.bottom-pose.top);
        for(let i=0;i<16;i++){const mid=(low+high)/2;if(fits(pose,mid))low=mid;else high=mid}
        scale=Math.min(scale,low);poses[state]=pose;
      }
      const category=troopCatOf(kind),base={normal:.667,mounted:1.1,flying:1.1,giant:1.78,machine:1}[category];
      sizeRows.push({kind,category,base,area:poses.idle.area*scale*scale});
      hudFits[kind]={span:Math.max(...Object.values(poses).map(p=>(p.right-p.left)*scale)),top:(1-Math.max(...Object.values(poses).map(p=>(p.bottom-p.top)*scale)))/2};
      headFrameFits[kind]=headFrameFit(kind,poses.idle,scale*(sharedOn?.88:1));
      artBounds[kind]=Object.fromEntries(Object.entries(poses).map(([state,p])=>[state,{width:(p.right-p.left)*scale,height:(p.bottom-p.top)*scale,head:poseHeadBounds(kind,state,p)}]));
      // One three-pose envelope owns decorative UI sizing throughout an attack.
      const widths=Object.values(artBounds[kind]).map(b=>b.width),heights=Object.values(artBounds[kind]).map(b=>b.height);
      const turn=Math.sin(2*Math.PI/180);
      presentationFits[kind]={width:Math.max(...widths)*.90+Math.max(...heights)*.90*turn,height:Math.max(...heights)*.90+Math.max(...widths)*.90*turn};
      const idleScale=sharedOn?sharedMotion.sample(kind,"idle",0,0,1).scale:1;
      groundFits[kind]={width:(poses.idle.right-poses.idle.left)*scale*idleScale,height:(poses.idle.bottom-poses.idle.top)*scale*idleScale};
      frameFits[kind]={};
      for(const state of STATES){const p=poses[state];frameFits[kind][state]={width:100*scale,height:100*p.aspect*scale,left:50-50*(p.left+p.right)*scale,top:50-50*(p.top+p.bottom)*scale};}
    }
    sizeFits=window.TroopSizing.calibrate(sizeRows);
  }
  // Idle head rectangles relative to the visible art, measured from the source sheet.
  // Ordinary infantry keeps this head frame. Composed units use their full silhouette below;
  // these head rectangles still provide separate combat/head anchors.
  const headFrameBounds={
    blade:[.10,0,.83,.80],spear:[.11,0,.67,.76],cavalry:[.17,.10,.56,.52],
    daoDun:[.10,0,.72,.78],daoDunDog:[.08,0,.76,.73],b1Shu:[.08,.07,.72,.78],
    jiBing:[.12,0,.65,.85],youJi:[.02,.17,.64,.73],sheSheng:[.01,.24,.62,.76],
    corpsePuppet:[.08,0,.79,.81],heroSpearPuppet:[.04,0,.65,.83],c_shu_huben:[.03,0,.82,.77],
    c_wei_baowei:[.02,0,.96,.86],c_wu_jieying:[.03,0,.77,.72],c_wu_firebow:[0,.03,.68,.70],
    c_huang_guidao:[.03,0,.90,.88],c_huang_zombie:[.02,0,.87,.75],c_shu_kongming:[.18,.52,.82,.88],
    c_wei_huwei:[.01,0,.65,.82],c_qun_xiang:[.25,0,.65,.34],c_qun_baima:[.04,.03,.65,.57],
    b2_wei:[.12,.08,.63,.56],b2_huangjin:[.02,.13,.60,.56],b2_qun:[.04,0,.60,.58],
    b4_shu:[.12,0,.70,.57],b4_wei:[.38,.27,.88,.71],b4_wu:[.02,0,.57,.52],b4_qun:[.53,.22,.94,.66],
    b5_shu:[.02,0,.87,.87],b3_wei:[.03,0,.81,.72],b5_wei:[.08,0,.79,.82],
    b1_wu:[0,0,.83,.83],b3_wu:[.03,0,.88,.80],b5_wu:[.02,0,.88,.84],
    b1_huangjin:[.05,0,.84,.76],b3_huangjin:[.01,0,.70,.83],b5_huangjin:[.09,0,.84,.82],
    b1_qun:[.03,0,.82,.77],b3_qun:[.02,0,.72,.84]
  };
  // Rider helmet/face rectangles in the approved PNG canvas, per painted pose.
  // Long plumes, reins, weapons and horses do not shift the head center.
  const mountedHeadRects={
    cavalry:{idle:[.25,.19,.57,.52],attack_windup:[.27,.20,.56,.52],attack:[.29,.27,.55,.50]},
    b2_wei:{idle:[.25,.15,.58,.53],attack_windup:[.25,.23,.55,.51],attack:[.31,.25,.60,.51]},
    b2_huangjin:{idle:[.12,.17,.61,.56],attack_windup:[.27,.23,.60,.51],attack:[.17,.19,.60,.49]},
    b2_qun:{idle:[.27,.22,.58,.58],attack_windup:[.31,.31,.62,.62],attack:[.30,.29,.58,.52]},
    c_qun_baima:{idle:[.23,.15,.63,.56],attack_windup:[.25,.23,.56,.54],attack:[.33,.20,.64,.53]}
  };
  function poseHeadBounds(kind,state,pose){
    const r=newArt&&mountedHeadRects[kind]?.[state];
    if(!r)return headFrameBounds[kind]||[.1,0,.9,.8];
    const w=pose.right-pose.left,h=pose.bottom-pose.top;
    return [(r[0]-pose.left)/w,(r[1]*pose.aspect-pose.top)/h,(r[2]-pose.left)/w,(r[3]*pose.aspect-pose.top)/h];
  }
  function headFrameFit(kind,pose,scale){
    const [l,t,r,b]=poseHeadBounds(kind,"idle",pose),w=pose.right-pose.left,h=pose.bottom-pose.top;
    return {x:.5+((l+r)/2-.5)*w*scale,y:.5+((t+b)/2-.5)*h*scale,size:Math.max((r-l)*w,(b-t)*h)*scale*1.10};
  }
  // Resolve descendants once; per-frame DOM tree scans grow with the entire crowd.
  const troopNodeCache=new WeakMap(),artFitCache=new WeakMap();
  function troopNodes(el){
    let nodes=troopNodeCache.get(el);if(!nodes){nodes={sprite:el.querySelector(".card-sprite"),visual:el.querySelector(".unit-visual"),frame:el.querySelector(".unit-frame"),action:el.querySelector(".unit-action"),hud:el.querySelector(".unit-hud"),weapon:el.querySelector(".weapon-boost"),layers:[...el.querySelectorAll(".card-sprite,.weapon-boost-wrap")]};troopNodeCache.set(el,nodes);}return nodes;
  }
  function fitTroopArt(el,kind,state){
    const artKey=el.dataset.artKey||kind,staticKey=artKey+":"+el.classList.contains("face-left"),key=artKey+":"+staticKey+":"+state,old=artFitCache.get(el);
    if(old?.key===key)return;
    el.dataset.frameSizeGroup=troopCatOf(kind)==="normal"?"foot":"other";
    const fit=frameFits[artKey]?.[state];if(!fit)return;artFitCache.set(el,{key,staticKey});
    if(old?.staticKey!==staticKey){
    const size=sizeFits[kind];
    if(size){el.style.setProperty("--v034-base-scale",size.scale);el.style.setProperty("--v034-roster-scale",1);el.dataset.sizeCategory=size.category;el.dataset.sizeArea=String(size.area);el.dataset.sizeTarget=String(size.target);}
    const head=headFrameFits[artKey]||headFrameFits[kind],x=el.classList.contains("face-left")?1-head.x:head.x;
    el.style.setProperty("--head-frame-x",`${x*100}%`);el.style.setProperty("--head-frame-y",`${head.y*100}%`);
    el.style.setProperty("--head-frame-span",head.size);el.style.setProperty("--head-hud-x",x);el.style.setProperty("--head-hud-y",head.y);
    el.style.setProperty("--art-health-span",groundFits[kind]?.width||.8);
    el.style.setProperty("--art-hud-span",head.size/1.10);el.style.setProperty("--art-hud-top",head.y-head.size/2/1.10);
    // A stable idle body owns HUD width and height; an extended attack weapon
    // must never turn the health bar into the three-pose silhouette envelope.
    const idle=(artBounds[artKey]||artBounds[kind]).idle,idleScale=sharedOn?sharedMotion.sample(kind,"idle",0,0,1).scale:1;
    const wholeTop=machineKinds.has(kind)||kind==="c_shu_kongming";
    const top=wholeTop?0:idle.head[1],center=troopCatOf(kind)==="normal"?(x+.5)/2:.5;
    el.style.setProperty("--health-body-span",idle.width*idleScale);
    el.style.setProperty("--health-body-x",center);
    el.style.setProperty("--health-body-top", .5+((idle.centerY??.5)-.5+(top-.5)*idle.height)*idleScale);
    }
    for(const layer of troopNodes(el).layers)for(const key of ["width","height","left","top"])layer.style.setProperty(`--fit-${key}`,`${fit[key]}%`);
  }
  async function preload(){
    const jobs=[];for(const kind of Object.keys(assets))for(const state of STATES)jobs.push(makeRuntimeFrame(kind,state).then(frame=>{runtimeFrames[kind][state]=frame}));
    for(const [state,src] of Object.entries(weaponBoostAssets))jobs.push(loadImage(src).then(image=>{weaponBoostRuntime[state]=image.src}));
    for(const [kind,src] of Object.entries(effectAssets))jobs.push(loadImage(src).then(image=>{
      if(kind==='earthDust'){
        // Cache a display-resolution texture once; retain the full source on disk.
        const texture=document.createElement('canvas');texture.width=384;texture.height=256;
        const c=texture.getContext('2d');c.imageSmoothingQuality='high';c.drawImage(image,0,0,384,256);
        effectRuntime[kind]=texture.toDataURL();
      }else effectRuntime[kind]=image.src;
    }));
    for(const [kind,src] of Object.entries(projectileAssets))jobs.push(loadImage(src).then(image=>{projectileRuntime[kind]=image.src}));await Promise.all(jobs);
    // Parse the unchanged raster URL once; every burst shares the same CSS rule.
    const dustStyle=document.createElement('style');dustStyle.dataset.effectTexture='earthDust';dustStyle.textContent=`.earth-dust-plane {background-image:url("${effectRuntime.earthDust}");}`;document.head.append(dustStyle);
    if(newArt&&window.RuntimeGeometryV048){const cache=window.RuntimeGeometryV048;({artBounds,presentationFits,groundFits,headFrameFits,frameFits,hudFits,sizeFits}=structuredClone(cache));}
    else await prepareFrameFits();
    if(sharedOn&&newArt){window.DirectionalRuntime.prepare(runtimeFrames,frameFits,artBounds,{sizeFits,groundFits,headFrameFits,presentationFits});crowdResources=await window.CrowdCanvas.prepare(runtimeFrames,frameFits);}
    ready=true;assetState.textContent=`${expectedAssets}/${expectedAssets}`;
  }

  function makeUnit(kind,team,x,y=lanes[kind]){
    const def=defs[kind],maxHp=maximumHp(kind),el=document.createElement("div");el.className=`unit ${team}${team==="red"?" face-left":""}`;el.dataset.kind=kind;window.TroopOutline.apply(el,kind);el.dataset.family=sharedMotion?.roster[kind]?.baseAction||"";el.dataset.team=team;el.dataset.state="idle";el.style.setProperty("--troop-scale",String(troopScaleOf(kind)));el.style.setProperty("--troop-category-scale",String(troopCategoryScaleOf(kind)));
    const weaponBoost=kind==="b5_huangjin"&&!newArt?`<span class="weapon-boost-wrap" aria-hidden="true"><img class="weapon-boost" alt=""></span>`:"";
    el.innerHTML=`<div class="unit-action"><div class="unit-frame"></div><div class="unit-visual">${weaponBoost}<img class="card-sprite" alt="${def.name}本轮新动作层"></div></div><div class="unit-hud"><span class="unit-hp"><i></i></span><span class="unit-level"><b>1</b></span></div><span class="unit-name">${def.name}</span>`;const shadow=document.createElement("span");shadow.className="unit-ground-shadow";shadow.setAttribute("aria-hidden","true");board.append(shadow,el);
    const unit={effects:new Set(),shadow,id:`${team}-${kind}-${unitSerial++}`,kind,team,x,y,hp:maxHp,maxHp,state:"idle",stateElapsed:0,cool:team==="blue"?.15:.35,alive:true,el,chargeUsed:false,chargeReadyAt:.45,chargePending:false,originX:x,originY:y,restX:x,restY:y,targetId:null,hitTarget:null,hitResolved:false,hitPauseUntil:0,attackDirX:0,attackDirY:team==="blue"?-1:1};
    el.dataset.owner=unit.id;el.dataset.assemblyFrame=String(troopCatOf(kind)!=="normal");
    if(isVerticalBattle())el.classList.add(team==="blue"?"vertical-up":"vertical-down");
    const spawn=terrain.nearest({x,y});unit.x=unit.originX=unit.restX=unit.terrainX=spawn.x;unit.y=unit.originY=unit.restY=unit.terrainY=spawn.y;
    units.push(unit);setState(unit,"idle");place(unit);return unit;
  }
    function setState(unit,state){
    if(state!=="idle"&&!(sharedOn&&unit.combatPursuit&&!unit.chargePending))stopGridHop(unit);
    const visualState=state==="recover"?"attack":state;unit.state=state;unit.stateElapsed=0;
    // Shared rendering commits its final raster pose once after combat logic.
    if(sharedOn){if(!artFitCache.has(unit.el))fitTroopArt(unit.el,unit.kind,"idle");return;}
    unit.el.dataset.state=visualState;fitTroopArt(unit.el,unit.kind,visualState);
    const sprite=unit.el.querySelector(".card-sprite"),anchor=headAnchors[unit.kind][visualState];
    sprite.style.setProperty("--head-shift-x",anchor[0]);sprite.style.setProperty("--head-shift-y",anchor[1]);sprite.src=runtimeFrames[unit.kind][visualState]||"";
    const weaponWrap=unit.el.querySelector(".weapon-boost-wrap"),weapon=unit.el.querySelector(".weapon-boost");
    if(weaponWrap&&weapon){weaponWrap.style.setProperty("--head-shift-x",anchor[0]);weaponWrap.style.setProperty("--head-shift-y",anchor[1]);weapon.src=weaponBoostRuntime[visualState]||weaponBoostAssets[visualState]}
  }
  // Independent translate composes ahead of each effect's existing local transform.
  // Moving a volley no longer relays out every absolutely positioned sibling.
  function positionSharedEffect(el,x,y){
    if(el.sharedX===x&&el.sharedY===y)return;
    if(el.sharedX===undefined){el.style.left='0px';el.style.top='0px';}
    // Match the former positioned layout's 1/64-pixel coordinates.
    el.sharedX=x;el.sharedY=y;if(el.batchedNumber&&crowdCanvasOn())return;const qx=Math.trunc(x*64),qy=Math.trunc(y*64);
    if(el.sharedQx===qx&&el.sharedQy===qy)return;
    el.sharedQx=qx;el.sharedQy=qy;el.style.translate=`${qx/64}px ${qy/64}px`;
  }
  function syncTargetEffects(unit){
    if(!unit.effects?.size)return;
    let point;
    for(const effect of unit.effects){
      if(!effect.isConnected){unit.effects.delete(effect);continue;}
      if(effect.artAnchor){const p=artPoint(unit,effect.artAnchor);positionSharedEffect(effect,p.x,p.y);continue;}
      point??=unitRenderPoint(unit);
      const a=effect.sharedAnchor,dir=a?.dir??Number(effect.dataset.dir||1),x=a?.x??Number(effect.dataset.offsetX||0),y=a?.y??Number(effect.dataset.offsetY||0),vertical=a?.vertical??(effect.dataset.axis==="vertical");
      const px=point.x+(vertical?y:-dir*x),py=point.y+(vertical?-dir*x:y);
      if(sharedOn)positionSharedEffect(effect,px,py);else{effect.style.left=`${px}px`;effect.style.top=`${py}px`;}
    }
  }
  let numberPaintQueued=false,numberPaintView,numberPainter,crowdResources,crowdPainter,crowdCanvasOverride=null,crowdFont,canvasViewport=null;
  field.addEventListener("scroll",()=>{canvasViewport=null;},{passive:true});
  function crowdCanvasOn(){return Boolean(sharedOn&&newArt&&crowdResources&&(crowdCanvasOverride??(!sharedReview&&Boolean(batches[activeBatch].mixedCount||batches[activeBatch].barracks))));}
  let deferPlacement=false;
  function presentationLift(unit){return (unit.hopLift||0)+(unit.launchLift||0)+(defs[unit.kind].air?groundMetrics(unit).hoverLift:0);}
  function place(unit,force=false,syncEffects=true){
    if(deferPlacement&&!force)return;
    if(crowdCanvasOn()){if(syncEffects)syncTargetEffects(unit);return;}
    const point=unitRenderPoint(unit),foot=groundMetrics(unit),lift=presentationLift(unit),el=unit.el;
    const old=unit.placed||(unit.placed={});
    const top=point.y-foot.offsetY-lift,z=(unit.chargeFlight?260:20)+Math.round(unit.y*10),hp=Math.max(0,unit.hp/unit.maxHp*100);
    if(old.x!==point.x){el.style.left=`${point.x}px`;if(unit.shadow)unit.shadow.style.left=`${point.x}px`;old.x=point.x;}
    if(old.top!==top){el.style.top=`${top}px`;old.top=top;}
    if(old.y!==unit.y){el.dataset.y=unit.y.toFixed(4);old.y=unit.y;}
    if(old.logicalX!==unit.x){el.dataset.x=unit.x.toFixed(4);old.logicalX=unit.x;}
    if(old.z!==z){el.style.zIndex=String(z);old.z=z;}
    if(old.hp!==hp){el.style.setProperty("--hp",`${hp}%`);old.hp=hp;}
    if(unit.shadow){
      const shadow=unit.shadow,air=Math.min(1,lift/8);
      if(old.groundY!==point.y){shadow.style.top=`${point.y}px`;old.groundY=point.y;}
      if(old.halfX!==foot.halfX){shadow.style.width=`${foot.halfX*2}px`;old.halfX=foot.halfX;}
      if(old.halfY!==foot.halfY){shadow.style.height=`${foot.halfY*2}px`;old.halfY=foot.halfY;}
      if(old.air!==air){shadow.style.opacity=String(.44-air*.16);shadow.style.transform=`translate(-50%,-50%) scale(${1-air*.16})`;old.air=air;}
      if(old.offsetY!==foot.offsetY){el.dataset.groundOffset=foot.offsetY.toFixed(3);old.offsetY=foot.offsetY;}
      if(shadow.dataset.owner!==unit.id)shadow.dataset.owner=unit.id;
    }
    if(syncEffects)syncTargetEffects(unit);
  }
  function opponent(unit){
    let target;
    if(isFreeBattle()){
      const previous=unit.focusTarget?.alive?unit.focusTarget:null;
      // Keep a live opponent through small distance changes. A crowd otherwise
      // swaps nearest neighbours every frame and reverses a half-finished hop.
      if(previous&&elapsed<Math.max(unit.focusLockedUntil||0,unit.focusCheckAt||0))target=previous;
      else{
        let best=Infinity;
        for(const candidate of combatTeams?.[unit.team==="blue"?1:0]||units){if(candidate.team===unit.team||!candidate.alive)continue;const dx=candidate.x-unit.x,dy=candidate.y-unit.y,distance=dx*dx+dy*dy;if(distance<best){best=distance;target=candidate;}}
        best=Math.sqrt(best);
        if(previous&&target!==previous){
          const oldDistance=Math.hypot(previous.x-unit.x,previous.y-unit.y);
          if(canAttack(unit,previous)||best>=oldDistance*.75-.20)target=previous;
        }
        unit.focusCheckAt=elapsed+.50;
      }
      if(target&&target!==previous)unit.focusLockedUntil=elapsed+3;
      unit.focusTarget=target;
    }else target=units.find(v=>v.kind===unit.kind&&v.team!==unit.team&&v.alive);
    unit.targetId=target?.id||null;if(unit.el.dataset.targetKind!==(target?.kind||""))unit.el.dataset.targetKind=target?.kind||"";return target;
  }
  // Contact uses the displayed frame, including compact screens and troop/map scales.
  // Idle geometry stays stable while walking; strike clipping also accounts for the
  // existing action-group transform so two forward lunges cannot cross each other.
  const contactGeometryCache=new Map(),CONTACT_GAP=.65;
  let geometryEpoch=0;
  let contactFrameCache=null;
  let combatTeams=null;
  function unitGeometry(unit){
    if(unit.geometryEpoch===geometryEpoch&&unit.geometryKind===unit.kind)return unit.geometry;
    const key=unit.kind;
    let geometry=contactGeometryCache.get(key);
    if(!geometry){const u=getComputedStyle(unit.el),f=getComputedStyle(troopNodes(unit.el).frame);geometry={width:parseFloat(u.width),height:parseFloat(u.height),left:parseFloat(f.left),top:parseFloat(f.top),sizeX:parseFloat(f.width),sizeY:parseFloat(f.height),scale:parseFloat(u.getPropertyValue("--v034-base-scale"))*parseFloat(u.getPropertyValue("--v034-roster-scale"))};contactGeometryCache.set(key,geometry);}
    unit.geometryEpoch=geometryEpoch;unit.geometryKind=unit.kind;unit.geometry=geometry;return geometry;
  }
  // Idle silhouette fixes the feet; changing attack poses or decorative head frames cannot inflate occupancy.
  function groundMetrics(unit){
    const g=unitGeometry(unit),fit=groundFits[unit.kind]||{width:.8,height:.8},scale=g.scale*troopScaleOf(unit.kind);
    if(unit.groundCache?.geometry===g&&unit.groundCache.scale===scale)return unit.groundCache.metrics;
    const halfX=g.sizeX*fit.width*.36*scale;
    const metrics={hoverLift:defs[unit.kind].air?g.sizeY*fit.height*.38*scale:0,offsetY:(g.top+g.sizeY*(.5+fit.height/2)-g.height/2)*scale-Math.min(2,halfX*.08),halfX,halfY:halfX*.32};unit.groundCache={geometry:g,scale,metrics};return metrics;
  }
  function frameMetrics(unit,live=false){
    if(sharedOn)live=false; // Shared artwork moves inside an untransformed action group.
    if(!live&&contactFrameCache?.has(unit))return contactFrameCache.get(unit);
    const geometry=unitGeometry(unit);
    const scale=geometry.scale*troopScaleOf(unit.kind),foot=groundMetrics(unit);
    if(!live&&unit.contactCache?.geometry===geometry&&unit.contactCache.scale===scale){const metrics=unit.contactCache.metrics;contactFrameCache?.set(unit,metrics);return metrics;}
    if(!live){const metrics={x:(geometry.left+geometry.sizeX/2-geometry.width/2)*scale,y:(geometry.top+geometry.sizeY/2-geometry.height/2)*scale-foot.offsetY,halfX:geometry.sizeX/2*scale,halfY:geometry.sizeY/2*scale};unit.contactCache={geometry,scale,metrics};contactFrameCache?.set(unit,metrics);return metrics;}
    const points=[],[unitOx,unitOy]=getComputedStyle(unit.el).transformOrigin.split(" ").map(parseFloat),offsetX=(1-scale)*(unitOx-geometry.width/2),offsetY=(1-scale)*(unitOy-geometry.height/2);
    let matrix=new DOMMatrix(),ox=0,oy=0;
    if(live){const a=getComputedStyle(unit.el.querySelector(".unit-action"));matrix=new DOMMatrix(a.transform==="none"?undefined:a.transform);[ox,oy]=a.transformOrigin.split(" ").map(parseFloat);}
    for(const x of [geometry.left,geometry.left+geometry.sizeX])for(const y of [geometry.top,geometry.top+geometry.sizeY]){const p=matrix.transformPoint({x:x-ox,y:y-oy});points.push({x:(p.x+ox-geometry.width/2)*scale,y:(p.y+oy-geometry.height/2)*scale});}
    const left=Math.min(...points.map(p=>p.x)),right=Math.max(...points.map(p=>p.x)),top=Math.min(...points.map(p=>p.y)),bottom=Math.max(...points.map(p=>p.y));
    // Giant windup pivots the scaled whole unit below its center. Include that
    // parent-origin displacement as well as the inner action-group movement.
    return {x:(left+right)/2+offsetX,y:(top+bottom)/2+offsetY-foot.offsetY,halfX:(right-left)/2,halfY:(bottom-top)/2};
  }
  function frameGap(unit,target,point=unit,a=frameMetrics(unit),b=frameMetrics(target)){
    const p=unitRenderPoint(point),q=unitRenderPoint(target);
    return Math.max(Math.abs(q.x+b.x-p.x-a.x)-a.halfX-b.halfX,Math.abs(q.y+b.y-p.y-a.y)-a.halfY-b.halfY);
  }
  function contactReach(unit,target,gap=CONTACT_GAP){
    const a=frameMetrics(unit),b=frameMetrics(target),p=unitRenderPoint(unit),q=unitRenderPoint(target),dx=Math.abs(q.x+b.x-p.x-a.x),dy=Math.abs(q.y+b.y-p.y-a.y),distance=Math.hypot(target.x-unit.x,target.y-unit.y);
    return distance<1e-6?0:distance*Math.min(dx>1e-6?(a.halfX+b.halfX+gap)/dx:Infinity,dy>1e-6?(a.halfY+b.halfY+gap)/dy:Infinity);
  }
  const CONTACT_BOUND_PADDING=2;
  let mapCellFraction;
  function mapCellWidth(){return (mapCellFraction??=Math.min(...TERRAIN_ART.x.slice(1).map((x,i)=>x-TERRAIN_ART.x[i]))/TERRAIN_ART.width)*mapPlacement.width;}
  function reach(unit,target){
    const d=defs[unit.kind];
    // Ground contact plus weapon length; decorative frames never set combat range.
    const distance=d.ranged?d.range+groundContactReach(unit,target):groundContactReach(unit,target)+(d.charge?.08:d.range*.65);
    return cavalryCharge(unit.kind)?distance*2/3:distance;
  }
  function chargeTriggerReach(unit,target){
    const distance=reach(unit,target);
    // Acquisition is shorter; the committed 6.4-cell swept dash is unchanged.
    return cavalryCharge(unit.kind)?distance+(sharedOn?chargeMotion.length:1.8)*2/3:distance+1;
  }
  function moveStrike(unit,target,desired){
    if(defs[unit.kind].ranged||!target?.alive){unit.x=desired.x;unit.y=desired.y;clampUnit(unit);return;}
    const a=frameMetrics(unit,true),b=frameMetrics(target,true),gap=p=>frameGap(unit,target,p,a,b);
    let start={x:unit.x,y:unit.y};
    // A changing attack pose may itself move the frame forward. Make room along
    // the original attack direction without bypassing the terrain constraint.
    for(let i=0;i<60&&gap(start)<-.35;i++){const back={x:start.x-unit.attackDirX*.025,y:start.y-unit.attackDirY*.025};if(!terrain.segmentClear(start,back))break;start=back;}
    let end=desired,previous=start;
    const distance=Math.hypot(end.x-start.x,end.y-start.y),steps=Math.max(1,Math.ceil(distance/.04));
    for(let i=1;i<=steps;i++){const p={x:start.x+(end.x-start.x)*i/steps,y:start.y+(end.y-start.y)*i/steps};if(gap(p)<=CONTACT_GAP){let lo=previous,hi=p;for(let j=0;j<12;j++){const mid={x:(lo.x+hi.x)/2,y:(lo.y+hi.y)/2};if(gap(mid)>CONTACT_GAP)lo=mid;else hi=mid;}end=hi;break;}previous=p;}
    unit.x=end.x;unit.y=end.y;clampUnit(unit);
  }
  function interactionIsVertical(source,target){return Math.abs(target.y-source.y)>=Math.abs(target.x-source.x)}
  function clampUnit(unit){
    if(unit.x===unit.terrainX&&unit.y===unit.terrainY)return;
    const point=terrain.constrain({x:unit.terrainX??unit.x,y:unit.terrainY??unit.y},{x:unit.x,y:unit.y});
    unit.x=unit.terrainX=point.x;unit.y=unit.terrainY=point.y;
  }
  function canAttack(unit,target,recoilAllowance=0){
    const old=unit.attackRangeCache;
    if(contactFrameCache&&old?.frame===contactFrameCache&&old.targetId===target.id&&old.ax===unit.x&&old.ay===unit.y&&old.bx===target.x&&old.by===target.y&&old.allowance===recoilAllowance)return old.value;
    const value=Math.hypot(target.x-unit.x,target.y-unit.y)<=reach(unit,target)+.02+recoilAllowance&&(defs[unit.kind].ranged||terrain.segmentClear(unit,target,0));
    if(contactFrameCache)unit.attackRangeCache={frame:contactFrameCache,targetId:target.id,ax:unit.x,ay:unit.y,bx:target.x,by:target.y,allowance:recoilAllowance,value};return value;
  }
  function bodyHopDistance(unit,point){
    const metrics=frameMetrics(unit),bodyPixels=Math.min(metrics.halfX,metrics.halfY)*2;
    const distance=Math.hypot(point.x-unit.x,point.y-unit.y)||1;
    const start=unitRenderPoint(unit),along=unitRenderPoint({x:unit.x+(point.x-unit.x)/distance,y:unit.y+(point.y-unit.y)/distance});
    const pixelsPerCell=Math.hypot(along.x-start.x,along.y-start.y)||mapCellWidth();
    const step=Math.max(.025,Math.min(.55,bodyPixels*.40/pixelsPerCell));
    unit.el.dataset.gridStep=step.toFixed(4);unit.el.dataset.gridBodyPixels=bodyPixels.toFixed(2);
    return step;
  }
  // Avoid invalidating selector styles when the class is already absent.
  function stopWalking(unit){if(unit.el.classList.contains("walking"))unit.el.classList.remove("walking");}
  function stopGridHop(unit){
    if(!unit.gridHop&&!unit.hopLift&&!unit.walkHold&&!unit.walkCredit&&unit.gridStopped)return;
    unit.gridStopped=true;unit.gridHop=null;unit.hopLift=0;unit.walkHold=0;unit.walkCredit=0;
    if(unit.el.dataset.gridPhase!=="grounded")unit.el.dataset.gridPhase="grounded";
    if(unit.el.dataset.gridLift!=="0")unit.el.dataset.gridLift="0";
  }
  function gridHop(unit,point,dt,speed){
    if(dt<=0||speed<=0)return false;
    unit.gridStopped=false;
    const realDt=dt/Math.max(.25,timeScale);
    if(!unit.gridHop){
      unit.walkHold=Math.max(0,(unit.walkHold||0)-realDt);
      if(unit.walkHold>1e-9)return false;
      const fullDistance=Math.hypot(point.x-unit.x,point.y-unit.y);
      // A readable beat without waiting for movement credit before takeoff.
      // The body bounds the stride; faster playback increases travel, not jitter.
      const step=Math.min(bodyHopDistance(unit,point),speed*timeScale*.40);
      if(fullDistance>step+1e-7)point={x:unit.x+(point.x-unit.x)*step/fullDistance,y:unit.y+(point.y-unit.y)*step/fullDistance};
      const dx=point.x-unit.x,dy=point.y-unit.y,distance=Math.hypot(dx,dy);
      if(distance<1e-9||!terrain.segmentClear(unit,point))return false;
      const duration=Math.max(.30,distance/(speed*timeScale));
      const start=unitRenderPoint(unit),end=unitRenderPoint(point),bodyPixels=Number(unit.el.dataset.gridBodyPixels);
      unit.walkHeading={x:dx,y:dy};
      unit.gridHop={dx,dy,t:0,progress:0,duration:duration*.92,hold:duration*.08,lift:Math.min(5,bodyPixels*.13,Math.hypot(end.x-start.x,end.y-start.y)*.65)};
      unit.el.dataset.gridFrom=`${unit.x.toFixed(4)},${unit.y.toFixed(4)}`;
      unit.el.dataset.gridTo=`${point.x.toFixed(4)},${point.y.toFixed(4)}`;
      unit.el.dataset.gridHops=String(Number(unit.el.dataset.gridHops||0)+1);
    }
    const hop=unit.gridHop;
    hop.t=Math.min(hop.duration,hop.t+realDt);
    const p=hop.t/hop.duration,eased=p*p*(3-2*p),fraction=eased-hop.progress;
    let next={x:unit.x+hop.dx*fraction,y:unit.y+hop.dy*fraction};
    // Re-clip against a moving target's contact point. Never jump through it.
    const remaining=Math.hypot(point.x-unit.x,point.y-unit.y),travel=Math.hypot(next.x-unit.x,next.y-unit.y);
    const sameDirection=(point.x-unit.x)*hop.dx+(point.y-unit.y)*hop.dy>0;
    const clipped=sameDirection&&remaining<travel;
    if(clipped)next=point;
    if(!terrain.segmentClear(unit,next)){stopGridHop(unit);unit.nav=null;place(unit);return false;}
    unit.x=next.x;unit.y=next.y;clampUnit(unit);hop.progress=eased;
    unit.hopLift=hop.lift*Math.sin(Math.PI*p);
    if(unit.el.dataset.gridPhase!=="hopping")unit.el.dataset.gridPhase="hopping";unit.el.dataset.gridProgress=p.toFixed(3);unit.el.dataset.gridLift=unit.hopLift.toFixed(3);
    if(p>=1||clipped){unit.gridHop=null;unit.hopLift=0;unit.walkHold=hop.hold;unit.el.dataset.gridPhase="landing";unit.el.dataset.gridLift="0";}
    stopWalking(unit);place(unit);return true;
  }
  function navigateToward(unit,target,dt,speed,stopDistance){
    const goal=`${terrain.campRevision}:${target.id}:${Math.round(target.x)},${Math.round(target.y)}`;
    // Finish the current stride before replanning or advancing a corner. Stopping
    // it mid-air resets lift and leaves a reverse hop back to the old cell centre.
    if(!unit.gridHop){
      if(!unit.nav||unit.nav.goal!==goal||!unit.nav.points.length)unit.nav={goal,points:terrain.findGridPath(unit,target)};
      const points=unit.nav.points;
      while(points.length&&Math.hypot(points[0].x-unit.x,points[0].y-unit.y)<.015)points.shift();
      while(points.length>1){
        const a=points[0],b=points[1],progress=(unit.x-a.x)*(b.x-a.x)+(unit.y-a.y)*(b.y-a.y);
        if((progress< -1e-6&&Math.hypot(unit.x-a.x,unit.y-a.y)>=.35)||!terrain.segmentClear(unit,b))break;
        points.shift();
      }
    }
    const points=unit.nav?.points||[],hop=unit.gridHop;
    let waypoint=hop?{x:unit.x+hop.dx*(1-hop.progress),y:unit.y+hop.dy*(1-hop.progress)}:points[0];
    if(!waypoint)return;
    if(!terrain.segmentClear(unit,waypoint)){stopGridHop(unit);unit.nav=null;return;}
    // Clip the final hop at the original contact/ranged boundary, including a
    // small target between centres. Contact geometry along a clear hop is convex.
    const dx=waypoint.x-unit.x,dy=waypoint.y-unit.y,length2=dx*dx+dy*dy;
    const closest=Math.max(0,Math.min(1,((target.x-unit.x)*dx+(target.y-unit.y)*dy)/(length2||1)));
    const probe={kind:unit.kind,el:unit.el,x:unit.x,y:unit.y,geometry:unitGeometry(unit),geometryEpoch,geometryKind:unit.kind};
    const canAt=t=>{probe.x=unit.x+dx*t;probe.y=unit.y+dy*t;return stopDistance===undefined?canAttack(probe,target):Math.hypot(target.x-probe.x,target.y-probe.y)<=stopDistance+.02&&(defs[unit.kind].ranged||terrain.segmentClear(probe,target,0))};
    let high=canAt(closest)?closest:canAt(1)?1:null;
    if(high!==null){
      let low=0;
      for(let j=0;j<20;j++){const mid=(low+high)/2;if(canAt(mid))high=mid;else low=mid;}
      waypoint={x:unit.x+dx*high,y:unit.y+dy*high};
    }
    if(gridHop(unit,waypoint,dt,speed)&&points.length&&Math.hypot(unit.x-points[0].x,unit.y-points[0].y)<.015)points.shift();
  }
  // Movement owns its own pursuit latch; attacks keep their committed target and clock.
  function combatStandDistance(unit,target){
    const maximum=reach(unit,target),preferred=Math.max(groundContactReach(unit,target)+.03,maximum*.60);
    // Cavalry must also approach inside its newly shortened normal hit range.
    return cavalryCharge(unit.kind)?Math.min(preferred,maximum*.85):preferred;
  }
  function updateCombatMovement(unit,target,dt,allowMove=true){
    if(unit.engageTargetId!==target.id){unit.engageTargetId=target.id;unit.combatPursuit=true;}
    const distance=Math.hypot(target.x-unit.x,target.y-unit.y),clear=defs[unit.kind].ranged||terrain.segmentClear(unit,target,0);
    if(clear&&distance<=combatStandDistance(unit,target)+.02)unit.combatPursuit=false;
    else if(!canAttack(unit,target))unit.combatPursuit=true;
    if(unit.combatPursuit&&allowMove){navigateToward(unit,target,dt,defs[unit.kind].speed,combatStandDistance(unit,target));}
    else{stopGridHop(unit);stopWalking(unit);place(unit);}
  }
  function toggleUnitClass(el,name,on){if(el.classList.contains(name)!==on)el.classList.toggle(name,on);}
  function updateIdleUnit(unit,dt){const attackSpeed=attackSpeedFor(unit.kind);
    const target=opponent(unit);if(!target){stopGridHop(unit);stopWalking(unit);place(unit);return;}
    const def=defs[unit.kind],dx=target.x-unit.x,dy=target.y-unit.y,dist=Math.hypot(dx,dy),nx=dx/(dist||1),ny=dy/(dist||1),attackReach=reach(unit,target),vertical=Math.abs(ny)>=Math.abs(nx);
    if(Math.abs(dx)>.12&&Math.abs(nx)>.15)toggleUnitClass(unit.el,"face-left",nx<0);toggleUnitClass(unit.el,"vertical-up",vertical&&ny<0);toggleUnitClass(unit.el,"vertical-down",vertical&&ny>0);if(!sharedOn)fitTroopArt(unit.el,unit.kind,"idle");unit.cool=Math.max(0,unit.cool-dt*attackSpeed);
    const chargeReady=Boolean(def.charge&&elapsed>=unit.chargeReadyAt),clear=chargeReady&&terrain.segmentClear(unit,target),charge=Boolean(chargeReady&&clear&&(def.giant?dist<=attackReach+1.0:dist>attackReach+(sharedOn?.08:.45)&&dist<=chargeTriggerReach(unit,target)));
    if(!sharedOn&&chargeReady&&!def.giant&&clear&&dist<=attackReach+.55){
      const back={x:unit.x-(vertical?0:Math.sign(nx)),y:unit.y-(vertical?Math.sign(ny):0)};
      if(terrain.segmentClear(unit,back)){gridHop(unit,back,dt,def.speed);return;}
    }
    if(sharedOn){
      if(unit.cool<=0&&charge){startAttack(unit,target,true);return;}
      updateCombatMovement(unit,target,dt);
      if(unit.cool<=0&&canAttack(unit,target))startAttack(unit,target,false);
      return;
    }
    if(unit.cool<=0&&(canAttack(unit,target)||charge)){startAttack(unit,target,charge);return;}
    if(!canAttack(unit,target)){navigateToward(unit,target,dt,def.speed*(chargeReady&&def.giant?1.5:1));if(unit.cool<=0&&canAttack(unit,target)){unit.walkCredit=0;startAttack(unit,target,charge);}return;}
    stopGridHop(unit);stopWalking(unit);place(unit);
  }
  function groundFootprint(unit){
    const f=groundMetrics(unit),old=unit.footprintCache;
    if(old&&old.y===unit.y&&old.metrics===f&&old.map===mapPlacement&&old.scale===collisionScale)return old.footprint;
    const py=mapPlacement.top+rasterAxis(unit.y,TERRAIN_ART.y)/TERRAIN_ART.height*mapPlacement.height,qy=mapPlacement.top+rasterAxis(unit.y+1,TERRAIN_ART.y)/TERRAIN_ART.height*mapPlacement.height;
    const footprint={x:f.halfX/mapCellWidth()*collisionScale,y:f.halfY/(Math.abs(qy-py)||mapCellWidth())*collisionScale};
    unit.footprintCache={y:unit.y,metrics:f,map:mapPlacement,scale:collisionScale,footprint};return footprint;
  }
  function groundContactReach(a,b){
    const fa=groundFootprint(a),fb=groundFootprint(b),old=a.groundReachCache;
    if(old&&old.targetId===b.id&&old.fa===fa&&old.fb===fb&&old.ax===a.x&&old.ay===a.y&&old.bx===b.x&&old.by===b.y)return old.value;
    const dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy),ellipse=Math.hypot(dx/(fa.x+fb.x),dy/(fa.y+fb.y));
    const value=ellipse>1e-6?d/ellipse:Math.min(fa.y+fb.y,fa.x+fb.x);
    a.groundReachCache={targetId:b.id,fa,fb,ax:a.x,ay:a.y,bx:b.x,by:b.y,value};return value;
  }
  function separation(unit){
    if(!collisionOn||!isFreeBattle())return {x:0,y:0};let x=0,y=0;
    for(const other of units){if(other===unit||!other.alive||unit.team===other.team)continue;const dx=unit.x-other.x,dy=unit.y-other.y,distance=Math.hypot(dx,dy),minimum=groundContactReach(unit,other);if(distance>0&&distance<minimum){const strength=(minimum-distance)/minimum;x+=dx/distance*strength;y+=dy/distance*strength}}
    return {x,y};
  }
  /* v026: bottom ellipses define occupancy; teammates have a 45% soft core and yield sideways only.
     No forward/backward allied correction: overlapping units can cross a bridge
     or pass through an attacking teammate. Enemy heavy/charge rules stay intact. */
  let collisionScale=1,collisionOn=true,collisionStats={pairs:0,overlap:0};
  const COLLISION_SCRIPTED=new Set(["attack_windup","attack","recover"]);
  function sameKindAllies(a,b){return a.team===b.team&&a.kind===b.kind}
  function collisionPairEnabled(a,b){return !a.chargeFlight&&!b.chargeFlight&&!(a.chargeRun&&a.state==='attack')&&!(b.chargeRun&&b.state==='attack')&&(a.team===b.team?a.kind!==b.kind:massOf(a)>0&&massOf(b)>0)}
  function massOf(unit){const def=defs[unit.kind];return def.air?0:def.giant?3:def.machine?2.5:def.heavy?1.6:1}
  function yieldToAlly(unit,dx,dy,overlap,dt){
    if(!unit.gridHop||COLLISION_SCRIPTED.has(unit.state)||unit.chargePending)return;
    const next=unit.nav?.points?.[0],hop=unit.gridHop;
    const forward=hop?{x:hop.dx,y:hop.dy}:unit.walkHeading?unit.walkHeading:next?{x:next.x-unit.x,y:next.y-unit.y}:{x:0,y:unit.team==="blue"?-1:1};
    const length=Math.hypot(forward.x,forward.y)||1,side={x:-forward.y/length,y:forward.x/length};
    const projection=dx*side.x+dy*side.y;
    // Exactly head-on actors may overlap; never invent a backwards impulse.
    if(Math.abs(projection)<1e-6)return;
    const allowance=Math.max(0,.012*Math.min(2,dt*60)-(unit.allyYieldUsed||0));
    const amount=Math.min(allowance,overlap*.08,Math.abs(projection)*.08);
    const point={x:unit.x+side.x*Math.sign(projection)*amount,y:unit.y+side.y*Math.sign(projection)*amount};
    // A sideways yield must leave the committed stride and next corner reachable.
    // Otherwise a bridge approach pushes the actor against water, forcing a
    // repeated retreat to the previous cell centre after every northbound hop.
    const landing={x:point.x+hop.dx*(1-hop.progress),y:point.y+hop.dy*(1-hop.progress)};
    if(amount>0&&terrain.segmentClear(unit,point)&&terrain.segmentClear(point,landing)&&(!next||terrain.segmentClear(point,next))){unit.x=point.x;unit.y=point.y;unit.allyYieldUsed=(unit.allyYieldUsed||0)+amount;}
  }
  const collisionCells=new Map(),collisionBucketPool=[];
  const collisionGroup=()=>({all:[],active:[],free:[],activeFree:[],yield:[]});
  function resolveCollisions(initial=false,dt=1/60){
    if(!collisionOn||units.length<2)return;
    // Airborne and dashing actors cannot collide with any pair this frame.
    // Exclude them before building cells, rather than visiting their neighbours.
    const alive=[];for(const u of units)if(u.alive){u.allyYieldUsed=0;if(!u.chargeFlight&&!(u.chargeRun&&u.state==='attack'))alive.push(u);}
    if(alive.length<2)return;
    for(const u of alive){u.collisionFoot=groundFootprint(u);u.collisionScripted=COLLISION_SCRIPTED.has(u.state);u.collisionHeavy=Boolean(defs[u.kind].giant||defs[u.kind].machine);u.collisionCanYield=Boolean(u.gridHop&&!u.collisionScripted&&!u.chargePending);u.collisionMass=u.collisionScripted?1e6:(u.chargePending?Math.max(1,massOf(u))*4:Math.max(1,massOf(u)));}
    let maxRadius=0;for(const u of alive)maxRadius=Math.max(maxRadius,u.collisionFoot.x,u.collisionFoot.y);
    const PUSH=.085,CELL=maxRadius*2+PUSH*2+.15,EMPTY=[],yieldBudget=.012*Math.min(2,dt*60);let pairs=0,maxOverlap=0;
    for(let iter=0;iter<(initial?24:2);iter++){
      // Rebuild a ground-space broad phase each solver pass. Only neighbouring
      // cells can touch, regardless of how many troops stand elsewhere.
      const cells=collisionCells;cells.clear();let bucketCount=0;
      // Numeric keys avoid allocating nine neighbour strings for every actor.
      // 4096 exceeds the full legal map span in cells, including edge neighbours.
      // Partition eligibility once, then merge the two sorted candidate lists.
      // This retains the old cell / actor order and current live positions, but
      // never visits stationary allies or ordinary opposing pairs that cannot push.
      for(let i=0;i<alive.length;i++){
        const u=alive[i],key=Math.floor(u.x/CELL)*4096+Math.floor(u.y/CELL);let bucket=cells.get(key);
        if(!bucket){
          bucket=collisionBucketPool[bucketCount]??(collisionBucketPool[bucketCount]=[collisionGroup(),collisionGroup()]);bucketCount++;
          for(const g of bucket){g.all.length=g.active.length=g.free.length=g.activeFree.length=g.yield.length=0;}cells.set(key,bucket);
        }
        const team=bucket[u.team==='blue'?0:1],active=u.chargePending||u.collisionHeavy;
        team.all.push(i);if(active)team.active.push(i);
        if(!u.collisionScripted){team.free.push(i);if(active)team.activeFree.push(i);}
        if(u.collisionCanYield)team.yield.push(i);
      }
      for(let i=0;i<alive.length;i++){
        const a=alive[i],aScript=a.collisionScripted,aCharge=a.chargePending,aGiant=a.collisionHeavy,ma=a.collisionMass;
        const cx=Math.floor(a.x/CELL),cy=Math.floor(a.y/CELL);
        for(let gx=cx-1;gx<=cx+1;gx++)for(let gy=cy-1;gy<=cy+1;gy++){
        const bucket=cells.get(gx*4096+gy);if(!bucket)continue;
        const side=a.team==='blue'?0:1,enemy=bucket[1-side];
        const allies=initial||iter>0?EMPTY:(a.collisionCanYield?bucket[side].all:bucket[side].yield);
        const enemies=aCharge||aGiant?(aScript?enemy.free:enemy.all):(aScript?enemy.activeFree:enemy.active);
        let ai=0,ei=0;
        while(ai<allies.length||ei<enemies.length){
          const j=ei>=enemies.length||(ai<allies.length&&allies[ai]<enemies[ei])?allies[ai++]:enemies[ei++];
          if(j<=i)continue;
          const b=alive[j],allied=a.team===b.team;
          // Stationary allies do not yield, and ordinary enemies do not push.
          if(allied?(initial||iter>0||a.kind===b.kind||(!a.collisionCanYield&&!b.collisionCanYield)):(!aCharge&&!b.chargePending&&!aGiant&&!b.collisionHeavy))continue;
          if(!allied&&aScript&&b.collisionScripted)continue;
          // Once both lateral allowances are spent, this pair cannot move either
          // actor. Keep all eligible pairs whose original yield could still act.
          if(allied&&(!a.collisionCanYield||a.allyYieldUsed>=yieldBudget)&&(!b.collisionCanYield||b.allyYieldUsed>=yieldBudget))continue;
          const dx=b.x-a.x;
          if(Math.abs(dx)>a.collisionFoot.x+b.collisionFoot.x+.15)continue;
          const sumY=a.collisionFoot.y+b.collisionFoot.y,dy0=b.y-a.y;if(Math.abs(dy0)>=sumY)continue;
          if(!collisionPairEnabled(a,b))continue;
          if(a.team===b.team){
            if(initial||iter>0)continue;
            const dy=b.y-a.y;
            if(Math.abs(dy)>=.45*(a.collisionFoot.y+b.collisionFoot.y))continue;
            const fa=groundFootprint(a),fb=groundFootprint(b);
            if(Math.abs(dx)>=.45*(fa.x+fb.x))continue;
            const ellipse=Math.hypot(dx/(fa.x+fb.x),dy/(fa.y+fb.y));
            if(ellipse>=.45)continue;
            const dist=Math.hypot(dx,dy),core=.45*(ellipse>1e-6?dist/ellipse:Math.min(fa.y+fb.y,fa.x+fb.x));
            if(dist<core){pairs++;maxOverlap=Math.max(maxOverlap,core-dist);yieldToAlly(a,-dx,-dy,core-dist,dt);yieldToAlly(b,dx,dy,core-dist,dt);}
            continue;
          }
          const bCharge=b.chargePending,bGiant=b.collisionHeavy;
          if(a.team!==b.team&&!aCharge&&!bCharge&&!aGiant&&!bGiant)continue;
          const bScript=b.collisionScripted;
          if(aScript&&bScript)continue;
          const dy=b.y-a.y;
          if(Math.abs(dy)>=a.collisionFoot.y+b.collisionFoot.y)continue;
          const fa=groundFootprint(a),fb=groundFootprint(b),ellipse=Math.hypot(dx/(fa.x+fb.x),dy/(fa.y+fb.y));
          if(ellipse>=1)continue;
          const dist=Math.hypot(dx,dy),min=ellipse>1e-6?dist/ellipse:Math.min(fa.y+fb.y,fa.x+fb.x);
          if(dist>=min)continue;
          const mb=b.collisionMass,overlap=min-dist;
          let effA=ma,effB=mb;
          if(!aScript&&!aCharge&&aGiant&&effB<=1.2)effB=.25;
          if(!bScript&&!bCharge&&bGiant&&effA<=1.2)effA=.25;
          pairs++;if(overlap>maxOverlap)maxOverlap=overlap;
          let px=dist>1e-4?dx/dist*overlap:overlap,py=dist>1e-4?dy/dist*overlap:0;
          const len=Math.hypot(px,py);
          if(len>PUSH){px*=PUSH/len;py*=PUSH/len}
          const total=effA+effB;
          a.x-=px*effB/total;a.y-=py*effB/total;
          b.x+=px*effA/total;b.y+=py*effA/total;
          if(initial){a.y=a.team==="red"?Math.min(5.2,a.y):Math.max(10.8,a.y);b.y=b.team==="red"?Math.min(5.2,b.y):Math.max(10.8,b.y);clampUnit(a);clampUnit(b);}
        }
        }
      }
    }
    for(const u of alive){clampUnit(u);place(u)}
    collisionStats={pairs,overlap:maxOverlap};
  }
  function damageTop(target){
    if(sharedOn){
      // The unchanged v039 HUD uses fixed local geometry. Compute the same top
      // from its inputs instead of forcing global layout for every hit.
      const g=unitGeometry(target),scale=g.scale*troopScaleOf(target.kind),pixel=1/(scale*(Number(board.style.getPropertyValue("--hud-map-scale"))||1));
      const idle=(artBounds[target.sharedArtKey]||artBounds[target.kind]).idle,poseScale=idlePoseScale(target.kind),wholeTop=machineKinds.has(target.kind)||target.kind==="c_shu_kongming";
      const bodyY=g.top+g.sizeY*(.5+((idle.centerY??.5)-.5+((wholeTop?0:idle.head[1])-.5)*idle.height)*poseScale),head=headFrameFits[target.sharedArtKey]||headFrameFits[target.kind],assembly=target.el.dataset.assemblyFrame==="true",nodes=troopNodes(target.el);
      const frameY=assembly?(target.idleHudY??target.liveHudY??(parseFloat(nodes.hud.style.getPropertyValue("--idle-frame-hud-y")||nodes.hud.style.getPropertyValue("--live-frame-hud-y"))||g.top+g.sizeY/2))-Math.max((presentationFits[target.sharedArtKey]||presentationFits[target.kind]).width*g.sizeX,(presentationFits[target.sharedArtKey]||presentationFits[target.kind]).height*g.sizeY)*1.10*otherFrameScale/2:g.top+g.sizeY*head.y-g.sizeY*head.size*frameScale/2;
      const bare=document.body.classList.contains("frames-hidden"),anchor=bare?bodyY:(Math.min(bodyY,frameY)+bodyY)/2,gap=bare?bareHudGap+.5:3.5;
      return target.damageTop=(Math.min(g.top,anchor-(gap+8)*pixel)-g.height/2)*scale-groundMetrics(target).offsetY-presentationLift(target);
    }
    if(deferPlacement)place(target,true);
    const nodes=troopNodes(target.el),lift=presentationLift(target);
    const key=[geometryEpoch,troopScaleOf(target.kind),frameScale,otherFrameScale,bareHudScale,bareHudGap,viewZoom,mapScale,document.body.classList.contains("frames-hidden"),nodes.hud.style.getPropertyValue("--idle-frame-hud-y")].join(":");
    if(target.damageGeometry?.key===key){target.damageTop=target.damageGeometry.top-lift;return target.damageTop;}
    if(target.el.isConnected){const rect=board.getBoundingClientRect(),zoom=rect.width/board.offsetWidth,top=Math.min(...[".unit-hp",".unit-level",".unit-frame"].map(selector=>target.el.querySelector(selector).getBoundingClientRect().top));target.damageTop=(top-rect.top)/zoom-unitRenderPoint(target).y;if(sharedOn)target.damageGeometry={key,top:target.damageTop+lift};}
    return target.damageTop??-31;
  }
  let damageTextContext,damageTextFont;
  const damageTextWidths=new Map();
  function sharedDamageSize(el){
    if(!damageTextContext){damageTextContext=document.createElement("canvas").getContext("2d");damageTextFont=`1000 13px ${getComputedStyle(document.body).fontFamily}`;damageTextContext.font=damageTextFont;}
    const text=el.textContent;let width=damageTextWidths.get(text);if(width===undefined){width=Math.round(damageTextContext.measureText(text).width);damageTextWidths.set(text,width);if(damageTextWidths.size>512)damageTextWidths.clear();}
    return {el,width,height:13};
  }
  function readDamageLayout(target,recalculate=true){
    const active=[...(target.effects||[])].filter(el=>el.isConnected&&el.classList.contains("damage"));if(!active.length)return;
    const top=recalculate?damageTop(target):target.damageTop??-31;
    const sizes=sharedOn?active.map(sharedDamageSize):active.map(el=>({el,width:el.offsetWidth,height:el.offsetHeight}));
    const pitch=Math.max(44,...sizes.map(s=>s.width*1.14+6));
    for(const s of sizes)s.half=s.height*1.14/2+s.width*Math.sin(2*Math.PI/180)*1.14/2;
    return {target,top,sizes,pitch,rowHeight:Math.max(54,...sizes.map(s=>30+s.half*2+6))};
  }
  function applyDamageLayout(layout){
    if(!layout)return;const {target,top,sizes,pitch,rowHeight}=layout;
    for(const {el,half} of sizes){const slot=Number(el.dataset.damageSlot),column=[0,-1,1][slot%3],row=Math.floor(slot/3);el.dataset.offsetX=String(-column*pitch);el.dataset.offsetY=String(top-4-half-2-row*rowHeight);if(el.sharedAnchor){el.sharedAnchor.x=-column*pitch;el.sharedAnchor.y=top-4-half-2-row*rowHeight;}}
    syncTargetEffects(target);
  }
  function layoutDamageNumbers(target,recalculate=true){applyDamageLayout(readDamageLayout(target,recalculate));}
  const pendingDamageLayouts=new Set();let damageLayoutQueued=false;
  function queueDamageLayout(target){
    pendingDamageLayouts.add(target);if(damageLayoutQueued)return;damageLayoutQueued=true;
    // All hit targets are measured together after the frame's final poses, then
    // written together. A volley must not force layout once for every soldier.
    queueMicrotask(()=>{damageLayoutQueued=false;const layouts=[...pendingDamageLayouts].map(t=>readDamageLayout(t));pendingDamageLayouts.clear();for(const layout of layouts)applyDamageLayout(layout);});
  }
  function showDamage(target,amount,source){
    if(sharedOn){showSharedDamage(target,amount,source);return;}
    const pierceKinds=new Set(["spear","jiBing","heroSpearPuppet","c_wu_firebow","c_huang_guidao","c_qun_baima","b1_wu","b1_huangjin","b1_qun","b4_wu"]),rangedKinds=new Set(Object.keys(defs).filter(kind=>defs[kind].ranged)),heavyKinds=new Set(Object.keys(defs).filter(kind=>defs[kind].charge||defs[kind].machine||defs[kind].giant)),motion=v018ImpactMotion[source.kind],token=battleToken,dx=target.x-source.x,dy=target.y-source.y,distance=Math.hypot(dx,dy)||1,recoil=(motion?.recoilPx??(heavyKinds.has(source.kind)?10:pierceKinds.has(source.kind)?7:5))*impactFeel,reactionMs=motion?(motion.hitStopMs*impactFeel+(motion.style==="charge"?270:210)):(heavyKinds.has(source.kind)?260:pierceKinds.has(source.kind)?205:175),numberDelay=motion?.numberDelay??(heavyKinds.has(source.kind)?115:rangedKinds.has(source.kind)?90:70);
    target.el.style.setProperty("--recoil-x",`${dx/distance*recoil}px`);target.el.style.setProperty("--recoil-y",`${dy/distance*recoil}px`);target.el.classList.remove("hit",...Object.keys(assets).map(kind=>`hit-${kind}`));void target.el.offsetWidth;target.el.classList.add("hit",`hit-${source.kind}`);
    damageTop(target);
    setTimeout(()=>{if(token!==battleToken)return;const el=document.createElement("span"),used=new Set([...board.querySelectorAll(".damage")].filter(e=>e.dataset.targetId===target.id).map(e=>Number(e.dataset.damageSlot)));let slot=0;while(used.has(slot))slot++;el.dataset.damageSlot=String(slot);el.className=`damage damage--${source.kind}`;el.textContent=`-${amount}`;board.append(el);anchorEffect(el,target,1,0,0);layoutDamageNumbers(target);setTimeout(()=>{if(token===battleToken)el.remove()},560)},numberDelay);
    setTimeout(()=>{if(token===battleToken)target.el.classList.remove("hit",`hit-${source.kind}`)},reactionMs)
  }
  const effectProfiles={
    blade:{offsetX:3,offsetY:-2,life:260},spear:{offsetX:4,offsetY:2,life:235},cavalry:{offsetX:0,offsetY:3,life:330},daoDun:{offsetX:2,offsetY:4,life:235},daoDunDog:{offsetX:2,offsetY:4,life:235},b1Shu:{offsetX:0,offsetY:0,life:220},jiBing:{offsetX:4,offsetY:3,life:245},
    youJi:{offsetX:1,offsetY:1,life:205},sheSheng:{offsetX:2,offsetY:0,life:230},corpsePuppet:{offsetX:3,offsetY:3,life:265},heroSpearPuppet:{offsetX:5,offsetY:2,life:240},
    c_shu_huben:{offsetX:2,offsetY:0,life:230},c_wei_baowei:{offsetX:2,offsetY:1,life:240},c_wu_jieying:{offsetX:3,offsetY:3,life:270},c_wu_firebow:{offsetX:1,offsetY:0,life:235},c_huang_guidao:{offsetX:2,offsetY:0,life:270},c_huang_zombie:{offsetX:3,offsetY:3,life:260},
    c_shu_kongming:{offsetX:0,offsetY:5,life:300},c_wei_huwei:{offsetX:2,offsetY:2,life:245},c_qun_xiang:{offsetX:0,offsetY:5,life:360},c_qun_baima:{offsetX:2,offsetY:-1,life:230},b2_wei:{offsetX:0,offsetY:3,life:340},b2_huangjin:{offsetX:0,offsetY:3,life:330},
    b4_shu:{offsetX:0,offsetY:2,life:315},b5_shu:{offsetX:1,offsetY:0,life:230},b3_wei:{offsetX:2,offsetY:3,life:255},b4_wei:{offsetX:0,offsetY:5,life:350},b5_wei:{offsetX:1,offsetY:0,life:230},
    b1_wu:{offsetX:2,offsetY:0,life:225},b3_wu:{offsetX:2,offsetY:2,life:250},b4_wu:{offsetX:3,offsetY:1,life:300},b5_wu:{offsetX:1,offsetY:0,life:225},
    b1_huangjin:{offsetX:2,offsetY:0,life:230},b3_huangjin:{offsetX:2,offsetY:4,life:270},b5_huangjin:{offsetX:1,offsetY:0,life:240},
    b1_qun:{offsetX:2,offsetY:0,life:230},b2_qun:{offsetX:0,offsetY:3,life:345},b3_qun:{offsetX:2,offsetY:3,life:260},b4_qun:{offsetX:0,offsetY:5,life:360}
  };
    function effectMarkup(kind){
    const thrust=kind==="spear"?'<i class="pixel-thrust-core" aria-hidden="true"></i>':"";
    const impact=CHAPTER1_KINDS.has(kind)?'<span class="v018-impact-drive" aria-hidden="true"><i></i><i></i></span><span class="v018-impact-core" aria-hidden="true"></span><span class="v018-impact-splatter" aria-hidden="true"><i></i><i></i><i></i><i></i></span>':"";
    return `<span class="fx-direction">${impact}${thrust}<img src="${effectRuntime[kind]||effectAssets[kind]}" alt=""></span>`
  }
  function anchorEffect(effect,target,dir,offsetX,offsetY,axis="horizontal"){effect.effectTarget?.effects.delete(effect);effect.effectTarget=target;target.effects.add(effect);effect.dataset.targetId=target.id;effect.dataset.dir=String(dir);effect.dataset.offsetX=String(offsetX);effect.dataset.offsetY=String(offsetY);effect.dataset.axis=axis;effect.sharedAnchor={dir,x:offsetX,y:offsetY,vertical:axis==="vertical"};syncTargetEffects(target)}
  function showAttackEffects(source,target,forceHeavy=false){
    if(sharedOn){showSharedEffect(source,target);return;}
    const token=battleToken,now=performance.now(),vertical=interactionIsVertical(source,target),dir=Math.sign(vertical?target.y-source.y:target.x-source.x)||1,profile=effectProfiles[source.kind],motion=v018ImpactMotion[source.kind],heavy=Boolean(defs[source.kind].charge&&(source.chargePending||forceHeavy)),existing=[...board.querySelectorAll(`.attack-fx--${source.kind}`)].find(el=>el.dataset.targetId===target.id&&now-Number(el.dataset.createdAt)<85);
    if(existing){existing.classList.add("is-repeat");effectCounts.sameTargetDedup++;return}
    const impact=document.createElement("span");impact.className=`attack-fx target-body-fx attack-fx--${source.kind} ${motion?`chapter1-impact impact-style--${motion.style}`:""} ${vertical?`vertical-axis ${dir<0?"vertical-up":"vertical-down"}`:dir<0?"face-left":""} ${heavy?"is-heavy":""}`;impact.dataset.kind=source.kind;impact.dataset.createdAt=String(now);impact.dataset.owner="target-unit";impact.innerHTML=effectMarkup(source.kind);board.append(impact);anchorEffect(impact,target,dir,profile.offsetX,profile.offsetY,vertical?"vertical":"horizontal");effectCounts[source.kind]++;setTimeout(()=>{if(token===battleToken)impact.remove()},motion?Math.max(profile.life,330):heavy?370:profile.life);
    if(heavy){effectCounts.heavyImpact++;board.style.setProperty("--impact-dir",String(dir));board.classList.remove("impact-heavy");void board.offsetWidth;board.classList.add("impact-heavy");setTimeout(()=>{if(token===battleToken)board.classList.remove("impact-heavy")},145)}
  }
  function applyHit(unit,target,amount,options={}){
        if(!target.alive)return;
    if(sharedOn&&sharedReview){target.hp=Math.max(target.maxHp*.25,target.hp-amount);place(target);showAttackEffects(unit,target);showDamage(target,amount,unit);sharedHits++;return;}
    const token=battleToken,motion=v018ImpactMotion[unit.kind],dx=target.x-(options.centre||unit).x,dy=target.y-(options.centre||unit).y,distance=Math.hypot(dx,dy)||1,nx=dx/distance,ny=dy/distance;target.hp=Math.max(0,target.hp-amount);
    if(sharedOn){const kb=target.chargeFlight?0:options.knockback??(unit.chargePending?.46*heavyCombat.resistance(defs[target.kind]):SHARED_MELEE_RECOIL);target.x+=nx*kb;target.y+=ny*kb;clampUnit(target);if(unit.chargePending){unit.chargeUsed=true;unit.chargeReadyAt=elapsed+(defs[unit.kind].giant?3.4:2.8)}board.dataset.lastKnockback=String(kb);}
    else if(motion){const kb=motion.knockback*(unit.chargePending?(defs[unit.kind].giant?1.15:1.8):1);target.x+=nx*kb;target.y+=ny*kb;if(unit.chargePending){const wd=defs[unit.kind].giant?.15:1.3;unit.restX=unit.x-nx*wd;unit.restY=unit.y-ny*wd;unit.chargeUsed=true;unit.chargeReadyAt=elapsed+(defs[unit.kind].giant?3.4:2.8)}clampUnit(target);clampUnit(unit)}
    else if(unit.chargePending){target.x+=nx*(defs[unit.kind].giant?.5:.9);target.y+=ny*(defs[unit.kind].giant?.5:.9);const wd=defs[unit.kind].giant?.12:1.15;unit.restX=unit.x-nx*wd;unit.restY=unit.y-ny*wd;clampUnit(target);clampUnit(unit);unit.chargeUsed=true;unit.chargeReadyAt=elapsed+(defs[unit.kind].giant?3.4:2.8)}
    place(target);place(unit);showAttackEffects(unit,target);showDamage(target,amount,unit);
    if(!sharedOn&&motion){const hold=motion.hitStopMs*impactFeel/timeScale,pauseTo=performance.now()+hold;unit.hitPauseUntil=Math.max(unit.hitPauseUntil,pauseTo);target.hitPauseUntil=Math.max(target.hitPauseUntil,pauseTo);unit.el.classList.add("impact-hold",`strike-${motion.style}`);target.el.classList.add("impact-hold");board.dataset.lastImpactKind=unit.kind;board.dataset.lastHitStopMs=String(Math.round(motion.hitStopMs*impactFeel));board.dataset.hitStopScope="attackerAndTargetOnly";board.dataset.lastKnockback=String(motion.knockback);setTimeout(()=>{if(token===battleToken){unit.el.classList.remove("impact-hold",`strike-${motion.style}`);target.el.classList.remove("impact-hold")}},hold)}
    else if(!sharedOn){const hold2=defs[unit.kind].hitStop*impactFeel*1000;unit.el.classList.remove("hit-stop");void unit.el.offsetWidth;unit.el.classList.add("hit-stop");setTimeout(()=>{if(token===battleToken)unit.el.classList.remove("hit-stop")},hold2)}
    if(target.hp<=0){target.alive=false;if(!target.chargeFlight){target.el.remove();target.shadow?.remove();}if(!batches[activeBatch].massBattle){const result=document.createElement("span");result.className="lane-result";result.textContent=`${unit.team==="blue"?"蓝方":"红方"}${defs[unit.kind].name}胜`;result.style.left="189px";result.style.top=`${unitRenderPoint(unit).y}px`;board.append(result)}}
  }
  function syncProjectile(arrow){
    const def=defs[arrow.dataset.sourceKind],isOil=arrow.dataset.sourceKind==="c_shu_kongming",start=unitRenderPoint({x:Number(arrow.dataset.startX),y:Number(arrow.dataset.startY)}),end=unitRenderPoint({x:Number(arrow.dataset.endX),y:Number(arrow.dataset.endY)}),startY=start.y-(isOil?30:def.machine?4:0),travelX=end.x-start.x,travelY=end.y+(isOil?9:def.machine?5:0)-startY-3,angle=Math.atan2(travelY,travelX)*180/Math.PI;
    arrow.style.left=`${start.x}px`;arrow.style.top=`${startY}px`;arrow.style.setProperty("--arrow-x",`${travelX}px`);arrow.style.setProperty("--arrow-y",`${travelY}px`);arrow.style.setProperty("--projectile-angle",`${angle}deg`);arrow.dataset.angle=angle.toFixed(3);arrow.dataset.travelX=travelX.toFixed(3);arrow.dataset.travelY=travelY.toFixed(3);board.dataset.lastProjectileAngle=angle.toFixed(3);
  }
  function launchArrow(unit,target,amount,token){
    if(sharedOn){launchSharedProjectile(unit,target,amount,token);return;}
    const arrow=document.createElement("span"),def=defs[unit.kind],flightMs=unit.kind==="youJi"?210:unit.kind==="sheSheng"?285:unit.kind==="c_wu_firebow"?275:unit.kind==="c_qun_baima"?235:unit.kind==="c_shu_kongming"?365:def.machine?340:def.support?260:240;
    arrow.className=`arrow-projectile arrow-projectile--${unit.kind} is-directional`;arrow.dataset.sourceKind=unit.kind;arrow.dataset.targetKind=target.kind;arrow.dataset.startX=String(unit.x);arrow.dataset.startY=String(unit.y);arrow.dataset.endX=String(target.x);arrow.dataset.endY=String(target.y);syncProjectile(arrow);arrow.style.setProperty("--arrow-flight",`${flightMs}ms`);arrow.innerHTML=`<span class="projectile-direction"><img src="${projectileRuntime[unit.kind]}" alt=""></span>`;board.append(arrow);effectCounts.arrow++;board.dataset.projectileLaunches=String(effectCounts.arrow);board.dataset.lastProjectileSource=unit.kind;board.dataset.lastProjectileTarget=target.kind;
    setTimeout(()=>{arrow.remove();if(token===battleToken&&unit.alive&&target.alive)applyHit(unit,target,amount)},flightMs);
  }
  function resolveHit(unit,target){
    const def=defs[unit.kind],raw=def.atk[0]+Math.random()*(def.atk[1]-def.atk[0]),amount=damageAmount(unit.kind,raw,unit.chargePending);
    if(def.ranged){if(!sharedOn||canAttack(unit,target))launchArrow(unit,target,amount,battleToken);}
    // A committed melee swing tolerates one ordinary hit recoil. Rechecking the
    // exact start range after the first hit otherwise suppresses the counterhit.
    // Keep acquisition strict, and still reject escape, water and distant targets.
    else if(canAttack(unit,target,sharedOn&&!unit.chargePending?SHARED_MELEE_RECOIL:0))deliverMeleeHit(unit,target,amount);
  }
  function pushGround(unit,dx,dy){
    // Small swept steps stop on a bank instead of teleporting across a water cell.
    const steps=Math.max(1,Math.ceil(Math.hypot(dx,dy)/.06));
    for(let i=0;i<steps;i++){const next={x:unit.x+dx/steps,y:unit.y+dy/steps};if(!terrain.segmentClear(unit,next))break;unit.x=unit.terrainX=next.x;unit.y=unit.terrainY=next.y;}
    stopGridHop(unit);unit.nav=null;place(unit);
  }
  function launchVictim(source,target,type='charge',centre=source,direction=null){
    if(sharedReview||source.team===target.team||!target.alive||target.chargeFlight)return false;
    if(!heavyCombat.canLaunch(target.kind,defs[target.kind],type))return false;
    const dx=direction?.x??target.x-centre.x,dy=direction?.y??target.y-centre.y,length=Math.hypot(dx,dy);
    const nx=length>1e-4?dx/length:source.attackDirX||0,ny=length>1e-4?dy/length:source.attackDirY||-1;
    const profile=heavyCombat.launchProfile(defs[target.kind],type),g=unitGeometry(target),bounds=artBounds[target.sharedArtKey]||artBounds[target.kind],height=g.sizeY*bounds.idle.height*g.scale*troopScaleOf(target.kind);
    stopGridHop(target);target.nav=null;target.sharedStrike=null;target.sharedReaction=null;target.heavyRecoil=null;target.chargeRun=null;target.chargePending=false;target.hitTarget=null;target.combatPursuit=false;
    target.el.classList.remove('walking','charging','recovering');setState(target,'idle');
    target.chargeFlight={type,t:0,travel:0,dx:nx*profile.distance,dy:ny*profile.distance,height:Math.max(26,Math.min(58,height*.85))*profile.lift*(type==='charge'?1:.65),tilt:(nx<-.1?-1:nx>.1?1:target.team==='red'?-1:1)*profile.tilt};
    target.launchLift=0;target.el.dataset.chargeFlight='airborne';target.el.dataset.launchType=type;
    board.dataset.chargeLaunches=String(Number(board.dataset.chargeLaunches||0)+1);return true;
  }
  function launchChargeVictim(source,target){return launchVictim(source,target,'charge',source,{x:source.attackDirX,y:source.attackDirY});}
  function tickChargeVictim(unit,dt){
    const h=unit.chargeFlight;h.t+=dt;const p=chargeLaunch.sample(h.t),step=p.travel-h.travel;
    pushGround(unit,h.dx*step,h.dy*step);h.travel=p.travel;unit.launchLift=p.lift*h.height;
    const flightPhase=p.lift>0?'airborne':'landing';if(unit.el.dataset.chargeFlight!==flightPhase)unit.el.dataset.chargeFlight=flightPhase;
    if(p.done){
      unit.chargeFlight=null;unit.launchLift=0;delete unit.el.dataset.chargeFlight;delete unit.el.dataset.launchType;
      unit.originX=unit.restX=unit.x;unit.originY=unit.restY=unit.y;unit.focusCheckAt=0;unit.cool=Math.max(unit.cool,.12);
      unit.sharedReaction=null;unit.renderMotion=null;
      if(unit.alive)setState(unit,'idle');else{unit.el.remove();unit.shadow?.remove();}
    }
    place(unit);
  }
  function resolveGroundArea(source,centre,radius,amount,type,primary=null){
    const hits=heavyCombat.radial(source,centre,units,radius,amount,primary,t=>defs[t.kind]);
    showGroundBurst(centre,radius,type);board.dataset.lastAreaType=type;board.dataset.lastAreaHits=String(hits.length);
    for(const hit of hits){
      const target=hit.target;
      // Freeze the landing vector before damage/death; keep the body until it lands.
      launchVictim(source,target,type,centre);
      applyHit(source,target,hit.amount,{knockback:0,centre});
    }
    damageAreaEntities(source,centre,radius,amount);
    if(type==='stomp')source.heavyLanding={t:0,duration:.36};
  }
  function deliverMeleeHit(source,target,amount){
    if(sharedOn&&defs[source.kind].giant){
      const foot=groundFootprint(source),radius=Math.max(Math.max(foot.x,foot.y)+(source.chargePending?.85:.65),Math.hypot(target.x-source.x,target.y-source.y)+.03);
      resolveGroundArea(source,{x:source.x,y:source.y},radius,amount,'stomp',target);return;
    }
    if(sharedOn&&source.chargePending&&cavalryCharge(source.kind)){const a=unitRenderPoint(source),b=unitRenderPoint(target),dx=b.x-a.x,dy=b.y-a.y;showGroundBurst({x:(source.x+target.x)/2,y:(source.y+target.y)/2},.62,'charge');const burst=groundBursts.at(-1);burst.el.style.setProperty('--charge-angle',`${Math.atan2(dy,dx)*180/Math.PI}deg`);renderGroundBurst(burst);launchChargeVictim(source,target);}
    applyHit(source,target,amount);
  }
  function startAttack(unit,target,charge){if(!sharedOn||charge||!unit.combatPursuit)stopGridHop(unit);unit.el.dataset.chargeTravel="0";const dx=target.x-unit.x,dy=target.y-unit.y,distance=Math.hypot(dx,dy)||1;unit.originX=unit.x;unit.originY=unit.y;unit.restX=unit.x;unit.restY=unit.y;unit.attackDirX=dx/distance;unit.attackDirY=dy/distance;unit.chargePending=charge;unit.chargeFinished=false;unit.chargeRun=sharedOn&&charge&&cavalryCharge(unit.kind)?{distance:0,hits:new Set()}:null;unit.hitTarget=target;if(sharedOn&&newArt)window.DirectionalRuntime.choose(unit,elapsed,true);unit.hitResolved=false;unit.el.classList.remove("walking","recovering");unit.el.classList.toggle("charging",charge);setState(unit,"attack_windup");unit.cool=defs[unit.kind].interval}
    function updateV018Unit(unit,dt,now){
    if(!unit.alive||now<unit.hitPauseUntil)return;const def=defs[unit.kind],motion=v018ImpactMotion[unit.kind];
    if(unit.state==="attack_windup"){const target=unit.hitTarget;if(!target||!target.alive){unit.hitTarget=null;unit.chargePending=false;setState(unit,"idle");return}unit.stateElapsed+=dt;const p=Math.min(1,unit.stateElapsed/def.windup),retreat=(unit.chargePending&&!def.giant?.21:def.windupRetreat)*p;unit.x=unit.originX-unit.attackDirX*retreat;unit.y=unit.originY-unit.attackDirY*retreat;clampUnit(unit);place(unit);if(p>=1){setState(unit,"attack");unit.attackStartX=unit.x;unit.attackStartY=unit.y;const forward=unit.chargePending&&!def.giant?Math.hypot(target.x-unit.originX,target.y-unit.originY):motion.attackForward;unit.attackTargetX=unit.originX+unit.attackDirX*forward;unit.attackTargetY=unit.originY+unit.attackDirY*forward;clampUnit(unit)}return}
    if(unit.state==="attack"){const target=unit.hitTarget;unit.stateElapsed+=dt;const p=Math.min(1,unit.stateElapsed/motion.strikeTime),eased=1-Math.pow(1-p,4);moveStrike(unit,target,{x:unit.attackStartX+(unit.attackTargetX-unit.attackStartX)*eased,y:unit.attackStartY+(unit.attackTargetY-unit.attackStartY)*eased});place(unit);if(!unit.hitResolved&&p>=1&&target&&target.alive){unit.hitResolved=true;resolveHit(unit,target)}if(unit.stateElapsed>=motion.attackTime){unit.recoverStartX=unit.x;unit.recoverStartY=unit.y;unit.el.classList.add("recovering");setState(unit,"recover")}return}
    if(unit.state==="recover"){unit.stateElapsed+=dt;const p=Math.min(1,unit.stateElapsed/motion.recoveryTime),eased=1-Math.pow(1-p,2);unit.x=unit.recoverStartX+(unit.restX-unit.recoverStartX)*eased;unit.y=unit.recoverStartY+(unit.restY-unit.recoverStartY)*eased;clampUnit(unit);place(unit);if(p>=1){unit.chargePending=false;unit.hitTarget=null;unit.el.classList.remove("recovering","charging");setState(unit,"idle");place(unit)}return}
    updateIdleUnit(unit,dt);
  }
  function updateLegacyUnit(unit,dt){
    if(!unit.alive)return;const def=defs[unit.kind],target=unit.hitTarget,attackReach=target?reach(unit,target):0;
    if((unit.state==="attack_windup"||unit.state==="attack")&&(!target||!target.alive)){unit.chargePending=false;unit.hitTarget=null;setState(unit,"idle");}

    if(unit.state==="attack_windup"){unit.stateElapsed+=dt;const p=Math.min(1,unit.stateElapsed/def.windup),retreat=(unit.chargePending&&!def.giant?.16:def.windupRetreat)*p;unit.x=unit.originX-unit.attackDirX*retreat;unit.y=unit.originY-unit.attackDirY*retreat;clampUnit(unit);place(unit);if(p>=1){setState(unit,"attack");const desired=unit.chargePending&&!def.giant?{x:target.x,y:target.y}:{x:unit.originX+unit.attackDirX*def.attackLunge,y:unit.originY+unit.attackDirY*def.attackLunge};moveStrike(unit,target,desired);place(unit);resolveHit(unit,target)}return}
    if(unit.state==="attack"){moveStrike(unit,target,{x:unit.x,y:unit.y});place(unit);unit.stateElapsed+=dt;if(unit.stateElapsed>=def.attackTime){unit.x=unit.restX;unit.y=unit.restY;clampUnit(unit);unit.chargePending=false;unit.hitTarget=null;setState(unit,"idle");place(unit)}return}
    updateIdleUnit(unit,dt);
  }
    function updateUnit(unit,dt,now){const attackSpeed=attackSpeedFor(unit.kind);if(sharedOn&&unit.chargeFlight){tickChargeVictim(unit,dt);return;}const actionDt=unit.state==="idle"?dt:dt*attackSpeed;if(sharedOn)return updateSharedUnit(unit,actionDt);return CHAPTER1_KINDS.has(unit.kind)?updateV018Unit(unit,actionDt,now):updateLegacyUnit(unit,actionDt)}
  const blueMassOrder=[...allTroopKinds],redMassOrder=allTroopKinds.map((_,index)=>allTroopKinds[(index*11+7)%allTroopKinds.length]);
  function massPosition(team,index,count=39){if(count>49){const columns=14,row=Math.floor(index/columns),spacing=Math.min(.52,7/Math.max(1,Math.ceil(count/columns)-1));return {x:(index%columns)*6/(columns-1),y:team==="red"?terrain.banks.north-row*spacing:terrain.banks.south+row*spacing};}const column=index%7,row=Math.floor(index/7),jitter=(((index*37+(team==="blue"?3:9))%7)-3)*.025;return {x:column+jitter,y:team==="red"?terrain.banks.north-row*.75:terrain.banks.south+row*.95};}
  function centerMassBattleCamera(){field.scrollLeft=Math.max(0,(MASS_MAP.columns*54-field.clientWidth)/2);field.scrollTop=Math.max(0,(MASS_MAP.rows*54-field.clientHeight)/2)}
  function centerImpactShowcase(){
    const point=unitRenderPoint({x:3,y:11.1}),r=board.getBoundingClientRect(),f=field.getBoundingClientRect(),scale=r.width/board.offsetWidth;
    field.scrollTop+=r.top+point.y*scale-f.top-field.clientHeight*.5;
  }
  function barracksAppearance(kind){
    const skin=window.BarracksSkinV063,def=defs[kind],id=def.formalId||kind,original=skin.heads[id];
    const ref=window.BarracksReferenceV080,related={daoDunDog:'daoDun',corpsePuppet:'c_huang_zombie',heroSpearPuppet:'spear'},reference=ref[id]||ref[related[id]];
    if(reference)return {...reference,name:ref[id]?reference.name:def.name,reference:true,sourceId:reference.id};
    const faction=original?.faction||Object.keys(skin.factions).find(f=>f!=='common'&&id.includes('_'+(f==='huangjin'?'huang':f)))||'common';
    const quality=original?.quality||(id.startsWith('c_')?'A':/^b[1-5]_/.test(id)?'B':'C');
    const role=original?.role||(def.giant?'elephant':def.machine?'siege':def.air?'lantern':horseKinds.has(kind)?'cavalry':archerKinds.has(kind)?'bow':def.support?'heal':kind.includes('guidao')?'magic':/zombie|corpse/.test(kind)?'undead':/spear|jiBing|Puppet/.test(kind)?'spear':def.heavy||kind.startsWith('daoDun')?'shield':'blade');
    if(original)return {...original,faction,quality,role,atlas:true};
    // Portrait crops use the frozen source registration, before battle-direction calibration.
    const source=window.RuntimeGeometryV048,fit=source.frameFits[kind].idle,art=source.artBounds[kind].idle,h=def.machine||def.air?[0,0,1,1]:art.head||headFrameBounds[kind]||[0,0,1,1];
    const w=(h[2]-h[0])*art.width*100,height=(h[3]-h[1])*art.height*100;
    const left=((art.centerX??.5)+(h[0]-.5)*art.width)*100,top=((art.centerY??.5)+(h[1]-.5)*art.height)*100;
    return {name:def.name,faction,quality,role,ratio:w/height,spriteSize:`${fit.width/w*100}% ${fit.height/height*100}%`,spritePos:`${(left-fit.left)/(fit.width-w)*100}% ${(top-fit.top)/(fit.height-height)*100}%`,atlas:false};
  }
  // Static combat entities share the exact ground-space AOE falloff. Their
  // health/production is real; no reset timer can resurrect a destroyed camp.
  function buildMainHeroes(layer){
    mainHeroes=['red','blue'].map(team=>{
      const direction=team==='red'?'down':'up',frame=window.DirectionalPack.units.b3_qun[direction].frames.idle,b=frame.bounds;
      const hero={id:`hero-${team}`,team,x:3,y:team==='red'?-.90:16.90,hp:1800,maxHp:1800,alive:true,type:'hero'};
      const el=document.createElement('div');el.className=`battle-hero ${team}`;el.setAttribute('aria-label',`${team==='red'?'红':'蓝'}方主将`);
      const w=b[2]-b[0],h=b[3]-b[1];
      el.innerHTML=`<span class="hero-shadow"></span><span class="hero-art" style="--hero-art-ratio:${w/(h*frame.aspect)};background-image:url('${frame.src}');background-size:${100/w}% ${100/h}%;background-position:${b[0]/(1-w)*100}% ${b[1]/(1-h)*100}%"></span><span class="hero-title">${team==='red'?'红':'蓝'}方主将</span><span class="hero-hp"><i></i></span>`;
      hero.el=el;hero.hpFill=el.querySelector('.hero-hp i');layer.append(el);return hero;
    });
  }
  function damageAreaEntities(source,centre,radius,amount){
    if(!areaDamageEnabled||!barracksModel)return;
    let hits=0,campsChanged=false;
    for(const list of [barracksModel.cells,mainHeroes])for(const target of list){
      if(!target.alive||target.team===source.team||Math.abs(target.x-centre.x)>radius||Math.abs(target.y-centre.y)>radius)continue;
      const power=heavyCombat.falloff(Math.hypot(target.x-centre.x,target.y-centre.y),radius);if(power<=0)continue;
      const damage=Math.max(1,Math.round(amount*power));target.hp=Math.max(0,target.hp-damage);target.hpFill.style.transform=`scaleX(${target.hp/target.maxHp})`;
      if(target.type==='barracks')target.el.classList.add('hp-revealed');
      target.el.dataset.hp=String(target.hp);target.el.classList.add('area-hit');target.hitRemaining=.18;hits++;
      let feedback=target.damageFeedback;
      if(feedback&&feedback.el.isConnected&&feedback.t<.15){feedback.amount+=damage;feedback.t=0;feedback.el.textContent=`-${feedback.amount}`;}
      else{const el=document.createElement('span');el.className='area-damage';el.textContent=`-${damage}`;board.append(el);feedback={el,target,t:0,amount:damage,life:.7};target.damageFeedback=feedback;areaFeedback.push(feedback);}
      if(target.hp===0){target.alive=false;if(target.type==='barracks')campsChanged=true;target.el.classList.add('destroyed');target.el.setAttribute('aria-label',target.type==='hero'?'主将阵亡':'兵营已摧毁，停止出兵');target.el.title=target.type==='hero'?'主将阵亡':`${defs[target.kind].name}营已摧毁 · 停止出兵`;}
    }
    if(campsChanged)terrain.setCamps(barracksModel.cells);
    board.dataset.lastAreaEntityHits=String(hits);
  }
  function tickAreaFeedback(dt){
    if(barracksModel)for(const list of [barracksModel.cells,mainHeroes])for(const target of list)if(target.hitRemaining>0){target.hitRemaining=Math.max(0,target.hitRemaining-dt);if(!target.hitRemaining)target.el.classList.remove('area-hit');}
    let write=0;for(const f of areaFeedback){f.t+=dt;if(f.t>=f.life){f.el.remove();continue;}const p=unitRenderPoint(f.target),size=f.target.displaySize||mapCellWidth()*.7;positionSharedEffect(f.el,p.x,p.y-size*.8-f.t*22);f.el.style.opacity=String(Math.min(1,(f.life-f.t)*3));areaFeedback[write++]=f;}areaFeedback.length=write;
  }
  function buildBarracks(){
    barracksModel=window.BarracksStress.create(allTroopKinds,kind=>troopRates.get(kind).spawn);
    terrain.setCamps(barracksModel.cells);
    // Every exit must reach all columns of the opponent's rear row AND cross its baseline.
    terrain.validateCampPassages(barracksModel.cells);
    const layer=document.createElement('div');layer.className='barracks-layer';layer.setAttribute('aria-label','红蓝双方各22营，横向通道和中央纵向通道，每5秒自动出兵');
    for(const camp of barracksModel.cells){
      const el=document.createElement('div'),look=barracksAppearance(camp.kind),skin=window.BarracksSkinV063;
      el.className=`stress-barracks ${camp.team}`;el.dataset.kind=camp.kind;el.dataset.team=camp.team;el.dataset.role=look.role;el.dataset.quality=look.quality;el.dataset.faction=look.faction;el.dataset.source=look.reference?'v020':'runtime';el.dataset.referenceId=look.sourceId||'';el.classList.toggle('camp-long-name',look.longName||look.name.length>3);el.title=`${defs[camp.kind].name}营 · 等级1 · 每${troopRates.get(camp.kind).spawn}秒出1兵`;
      el.style.setProperty('--camp-quality',skin.qualities[look.quality]);el.style.setProperty('--camp-country',skin.factions[look.faction]);
      const portrait=look.reference?'./previews/level-cd-v092/'+look.headImage:look.atlas?'./barracks-assets-v063/heads-atlas.webp':runtimeFrames[camp.kind].idle;
      const roleIcon=look.reference?'./previews/level-cd-v092/'+look.icon:'./barracks-assets-v063/'+look.role+'.webp';
      el.innerHTML=`<span class="camp-tile"><span class="camp-portrait"><span class="camp-head" style="--ratio:${look.ratio};background-image:url('${portrait}');background-size:${look.spriteSize};background-position:${look.spritePos}"></span></span><span class="camp-name"><span class="camp-name-text">${look.name}</span></span></span><span class="camp-hp"><i></i></span><img class="camp-role" alt="" src="${roleIcon}"><span class="camp-level"><svg class="camp-level-cd" viewBox="0 0 100 100" aria-hidden="true"><path class="camp-cd-track" d="M50 8 L92 50 L50 92 L8 50 Z"/><path class="camp-cd-fill" d="M50 8 L92 50 L50 92 L8 50 Z" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100"/></svg><span class="camp-digit">1</span></span>`;
      camp.el=el;camp.type='barracks';camp.hpFill=el.querySelector('.camp-hp i');camp.cdFill=el.querySelector('.camp-cd-fill');layer.append(el);
    }
    barracksModel.layer=layer;buildMainHeroes(layer);board.append(layer);layoutBarracks();
  }
  function layoutBarracks(){
    if(!barracksModel)return;
    for(const camp of barracksModel.cells){const p=unitRenderPoint(camp),a=unitRenderPoint({x:camp.x-.5,y:camp.y-.5}),b=unitRenderPoint({x:camp.x+.5,y:camp.y+.5}),size=Math.min(Math.abs(b.x-a.x),Math.abs(b.y-a.y))*.698;Object.assign(camp.el.style,{left:`${p.x}px`,top:`${p.y}px`,width:`${size}px`,height:`${size}px`});camp.displaySize=size;camp.el.style.setProperty('--camp-size',`${size}px`);}
    for(const hero of mainHeroes){const p=unitRenderPoint(hero),size=mapCellWidth()*1.12;hero.displaySize=size;Object.assign(hero.el.style,{left:`${p.x}px`,top:`${p.y}px`,width:`${size}px`,height:`${size}px`});hero.el.style.setProperty('--hero-size',`${size}px`);}
  }
  const BARRACKS_POPULATION_LIMIT=100;
  function livingPopulation(){
    const population={blue:0,red:0};
    for(const unit of units)if(unit.alive)population[unit.team]++;
    return population;
  }
  function tickBarracks(){
    if(!barracksModel)return;
    const population=livingPopulation();
    barracksModel.advance(elapsed,(camp,wave)=>{
      if(population[camp.team]>=BARRACKS_POPULATION_LIMIT)return false;
      const unit=makeUnit(camp.kind,camp.team,camp.exit.x,camp.exit.y);
      population[camp.team]++;
      unit.chargeReadyAt=elapsed+.45;unit.barracksId=camp.id;unit.spawnWave=wave;
    });
    if(elapsed>=nextBarracksReclaim){
      nextBarracksReclaim=elapsed+1;
      // Landed corpses leave the simulation; in-flight bodies and all feedback
      // retain their existing full lifetime. Monotonic IDs never repeat.
      units=units.filter(unit=>{if(unit.alive||unit.chargeFlight)return true;unit.el.remove();unit.shadow?.remove();unit.focusTarget=unit.hitTarget=null;unit.nav=unit.chargeRun=null;unit.effects.clear();pendingDamageLayouts.delete(unit);barracksReclaimed++;return false;});
    }
  }
  function measureBarracksFps(now){
    if(!barracksModel||!ready||!running||sharedReview||reviewMode){fpsStart=0;fpsFrames=0;return;}
    if(!fpsStart){fpsStart=now;fpsFrames=0;return;}
    fpsFrames++;if(now-fpsStart>=1000){barracksFps=Math.round(fpsFrames*1000/(now-fpsStart));fpsStart=now;fpsFrames=0;}
  }
  function clearBattleUnits(){
    terrain.setCamps([]);
    // Unit bodies and their detached ground shadows have one shared lifetime.
    board.querySelectorAll(".unit,.unit-ground-shadow").forEach(el=>el.remove());
    board.querySelectorAll(".barracks-layer").forEach(el=>el.remove());barracksModel=null;unitSerial=0;barracksReclaimed=0;nextBarracksReclaim=0;barracksFps=0;fpsStart=0;fpsFrames=0;
    for(const f of areaFeedback)f.el.remove();areaFeedback=[];mainHeroes=[];
    pendingDamageLayouts.clear();units=[];crowdPainter?.show(false);
  }
  function reset(){
    clearBattleUnits();
    clearFireFields();sharedReview=false;sharedFlights=[];sharedImpacts=[];sharedNumbers=[];groundBursts.forEach(removeGroundBurst);groundBursts=[];sharedClock=0;sharedCycle=-1;chargePainter?.clear();board.dataset.chargeBlocks="0";board.dataset.chargeLaunches="0";board.dataset.longestCharge="0";delete board.dataset.lastChargeBlocked;delete board.dataset.lastAreaType;delete board.dataset.lastAreaHits;
    battleToken++;reviewEffectPhase=-1;for(const key of Object.keys(effectCounts))effectCounts[key]=0;
    board.querySelectorAll(".unit,.damage,.lane-result,.attack-fx,.attack-trail,.arrow-projectile,.shared-projectile,.shared-impact,.ground-burst").forEach(el=>el.remove());board.classList.remove('shared-review-board');
    const massBattle=Boolean(batches[activeBatch].massBattle);board.classList.remove("impact-heavy","overview-mode","all-battle-mode","battle-vertical");board.classList.add(massBattle?"all-battle-mode":"battle-vertical");field.classList.toggle("free-battle-field",massBattle);renderMapTiles(massBattle?MASS_MAP:BASE_MAP);field.scrollLeft=0;field.scrollTop=0;
    overviewGrid.hidden=true;overviewGrid.innerHTML="";units=[];elapsed=0;running=true;pauseButton.disabled=false;speedButton.disabled=false;pauseButton.textContent="暂停";speedButton.textContent=timeScale===.5?"恢复1×":"0.5×";resetButton.textContent="重新战斗";reviewButton.textContent=reviewMode?"返回对打":"特效轮播";renderBatchChrome();
    if(batches[activeBatch].overview){reviewMode=false;overviewStateIndex=0;running=false;board.classList.add("overview-mode");speedButton.disabled=true;pauseButton.textContent="看分批";speedButton.textContent="39种";resetButton.textContent="回待机";reviewButton.classList.remove("on");renderAllTroopsOverview();applyTroopScales();statusText.textContent="v035 全员39 · 按实机比例同屏纵览";syncSharedControls();return}
    if(massBattle&&batches[activeBatch].barracks){reviewMode=false;buildBarracks();battleState.textContent="双方各22营 · 39兵种 · 通道出兵";statusText.textContent="按兵种间隔出兵 · 双方各100人口上限";syncSharedControls();updateHud();return;}
    if(massBattle&&batches[activeBatch].heavyScene){
      const scene=batches[activeBatch].heavyScene;
      if(scene==='rush'){
        makeUnit('cavalry','blue',1,14.2);makeUnit('b2_wei','blue',5,14.2);
        for(let i=0;i<8;i++)makeUnit(i%2?'blade':'daoDun','red',i%2?5:1,7.5+Math.floor(i/2)*1.4);
      }else if(scene==='block'){
        for(const [i,kind] of ['c_qun_xiang','b4_wei','b4_qun'].entries()){
          const x=1+i*2;makeUnit(kind,'red',x,10.3);makeUnit('cavalry','blue',x,13.2);
        }
      }else{
        for(const [i,x] of [1.5,4.5].entries())makeUnit(scene==='stomp'?'c_qun_xiang':i?'b4_qun':'b4_wei','blue',x,scene==='stomp'?12:14);
        for(let i=0;i<18;i++)makeUnit(i%3?'blade':'daoDun','red',.7+(i%6)*1.1,9.8+Math.floor(i/6)*.55);
      }
      requestAnimationFrame(()=>{if(batches[activeBatch].heavyScene===scene)centerImpactShowcase();});
      battleState.textContent=batches[activeBatch].label;statusText.textContent=scene==='rush'?'骑兵 6.4 格长冲阵 · 沿途撞飞敌军':scene==='block'?'骑兵长冲刺 · 象兵、投石车短距离震飞':scene==='stomp'?'象兵冲阵 · 落脚践踏震开敌军':'双投石落点 · 地面范围爆炸';syncSharedControls();return;
    }
    if(massBattle){
      const custom=batches[activeBatch].custom,count=batches[activeBatch].mixedCount,blueOrder=count?Array.from({length:count},(_,i)=>allTroopKinds[i%allTroopKinds.length]):custom?Array(custom.count).fill(custom.kind):blueMassOrder,redOrder=count?Array.from({length:count},(_,i)=>allTroopKinds[i%allTroopKinds.length]):custom?Array(custom.count).fill(custom.kind):redMassOrder;
      for(let index=0;index<blueOrder.length;index++){const position=massPosition("blue",index,count);makeUnit(blueOrder[index],"blue",position.x,position.y)}
      for(let index=0;index<redOrder.length;index++){const position=massPosition("red",index,count);makeUnit(redOrder[index],"red",position.x,position.y)}
      resolveCollisions(true);for(const unit of units){unit.originX=unit.restX=unit.x;unit.originY=unit.restY=unit.y;}
      battleState.textContent=reviewMode?"全军自由动作轮播：双方跨兵种索敌":count?`${count*2}人混编会战 · 蓝${count} 对 红${count} · 39种现有小兵`:custom?`${defs[custom.kind].name} ×${custom.count} 对 ${custom.count} · 自由索敌`:"全员会战 · 78单位自由寻找最近敌人";statusText.textContent=count?`${count*2}人混编会战 · 保留原尺寸、血条与动作`:custom?`v035 自定义 · ${defs[custom.kind].name} ${custom.count}v${custom.count}`:"v035 全员会战 · 与分批战场同一张地图";syncSharedControls();return
    }
    const kinds=Object.keys(lanes),offsets=formationOffsets(activeBatch);for(let index=0;index<kinds.length;index++){const kind=kinds[index],x=lanes[kind],rowOffset=offsets[index];makeUnit(kind,"red",x,terrain.banks.north+rowOffset*.6);makeUnit(kind,"blue",x,terrain.banks.south+rowOffset*.6)}battleState.textContent=reviewMode?"上下动作轮播：蓝方先攻，红方再反击":`${batches[activeBatch].label} · 红上蓝下纵向实战`;syncSharedControls();
  }
  function reviewTick(now){const phases=[{blue:"idle",red:"idle",label:"双方待机"},{blue:"attack_windup",red:"idle",label:"蓝方蓄力"},{blue:"attack",red:"idle",label:"蓝军自由索敌",attacker:"blue"},{blue:"idle",red:"attack_windup",label:"红方蓄力"},{blue:"idle",red:"attack",label:"红军自由索敌",attacker:"red"}],phase=Math.max(0,Math.floor((now-reviewStarted)/(820/attackSpeed))),current=phases[phase%phases.length];for(const unit of units){const state=current[unit.team];if(unit.state!==state)setState(unit,state);stopWalking(unit)}if(phase!==reviewEffectPhase){reviewEffectPhase=phase;if(current.attacker)for(const kind of Object.keys(lanes)){const source=units.find(unit=>unit.kind===kind&&unit.team===current.attacker),target=source?opponent(source):null;if(source&&target){showAttackEffects(source,target,Boolean(defs[kind].charge));showDamage(target,damageAmount(kind,(defs[kind].atk[0]+defs[kind].atk[1])/2),source)}}}modeState.textContent=`${isFreeBattle()?"自由索敌":"上下轮播"} · ${current.label}`;battleState.textContent=isFreeBattle()?"全军动作检查 · 攻击特效落在当前最近敌人身上":`${batches[activeBatch].label} · 红上蓝下 · ${Object.keys(lanes).map(kind=>defs[kind].action).join(" / ")}`}
  let lastHudUpdate=-Infinity;
  function updateHud(force=true){
    const now=performance.now();if(!force&&now-lastHudUpdate<100)return;lastHudUpdate=now;
    let aliveBlue=0,aliveRed=0;for(const unit of units)if(unit.alive){if(unit.team==="blue")aliveBlue++;else aliveRed++;}
    if(panelStatus&&units.length){const text=`${batches[activeBatch].label} · 蓝${aliveBlue}:红${aliveRed} · ${elapsed.toFixed(1)}s · ${assetState.textContent}`;if(panelStatus.textContent!==text)panelStatus.textContent=text;}
    if(barracksModel&&!sharedReview){
      const remaining=Number.isFinite(barracksModel.nextAt)?Math.max(0,barracksModel.nextAt-elapsed).toFixed(1):'—';
      for(const camp of barracksModel.cells)if(camp.alive)camp.cdFill.style.strokeDashoffset=String(100*(1-barracksModel.progress(elapsed,camp)));
      if(motionLabel)motionLabel.textContent=`存活${barracksModel.cells.filter(c=>c.alive).length}/${barracksModel.cells.length}营 · 出兵${barracksModel.wave}批 · 下次${remaining}s · ${running?(barracksFps?barracksFps+' FPS':'帧率采样中'):'已暂停'}`;
      statusText.textContent=`我方 ${aliveBlue}/${BARRACKS_POPULATION_LIMIT} · 敌方 ${aliveRed}/${BARRACKS_POPULATION_LIMIT} · 累计 ${barracksModel.total}`;
    }
    if(batches[activeBatch].overview)return;
    const time=`${elapsed.toFixed(2)}s`;if(clock.textContent!==time)clock.textContent=time;
    if(!reviewMode&&!sharedReview){const text=`${batches[activeBatch].label} · 蓝${aliveBlue}:红${aliveRed}`;if(modeState.textContent!==text)modeState.textContent=text;}
  }
  function loop(now){const dt=Math.min(.035,(now-last)/1000)*timeScale;last=now;measureBarracksFps(now);if(ready&&running){if(sharedReview)tickSharedReview(dt);else if(reviewMode)reviewTick(now);else{
    // Reuse pure geometry only within this synchronous combat frame. Live action
    // matrices stay fresh, and positions are checked again after every move.
    contactFrameCache=new WeakMap();
    try{deferPlacement=sharedOn;elapsed+=dt;tickBarracks();combatTeams=[[],[]];for(const u of units)if(u.alive)combatTeams[u.team==="blue"?0:1].push(u);for(const unit of units)updateUnit(unit,dt,now);resolveCollisions(false,dt/Math.max(.25,timeScale))}
    finally{deferPlacement=false;for(const unit of units)if(unit.alive||unit.chargeFlight)place(unit,false,!sharedOn);contactFrameCache=null;combatTeams=null;}
  } if(sharedOn){tickSharedFlights(dt);tickFireFeedback(dt);tickSharedFeedback(dt/timeScale);for(const u of units)if(u.alive||u.chargeFlight)renderSharedVisual(u,dt/timeScale);}}updateHud(false);if(sharedReview)syncSharedPhaseLabel();drawCrowdCanvas();drawChargeFeedback(running?dt:0);requestAnimationFrame(loop)}
  function renderCleanExport(kind,state){
    document.body.className="clean-export-mode";
    document.body.innerHTML=`<img class="clean-export-sprite" src="${runtimeFrames[kind][state]}" alt="${defs[kind].name}${stateLabel[state]}干净动作帧">`;
  }
  document.getElementById('panelAreaDamage').onchange=e=>{areaDamageEnabled=e.target.checked;};
  pauseButton.onclick=()=>{if(sharedOn){toggleSharedPlayback();return;}if(batches[activeBatch].overview){activeBatch="newTroop";lanes=buildLanes(activeBatch);reset();return}if(running){running=false;battleToken++;board.querySelectorAll(".attack-fx,.attack-trail,.arrow-projectile,.damage").forEach(el=>el.remove())}else running=true;pauseButton.textContent=running?"暂停":"继续";pauseButton.classList.toggle("on",!running)};
  resetButton.onclick=()=>{if(sharedReview){startSharedReview(sharedKind);return;}if(batches[activeBatch].overview){setOverviewState(0);return}reviewMode=false;reviewButton.classList.remove("on");reviewButton.textContent="特效轮播";reset()};
  speedButton.onclick=()=>{if(batches[activeBatch].overview)return;timeScale=timeScale===1?.5:1;speedButton.classList.toggle("on",timeScale===.5);speedButton.textContent=timeScale===.5?"恢复1×":"0.5×";syncSharedControls();};
  reviewButton.onclick=()=>{if(batches[activeBatch].overview){setOverviewState(overviewStateIndex+1);return}reviewMode=!reviewMode;reviewButton.classList.toggle("on",reviewMode);reviewButton.textContent=reviewMode?"返回对打":"特效轮播";reset();reviewMode=reviewButton.classList.contains("on");reviewStarted=performance.now();statusText.textContent=reviewMode?(isFreeBattle()?"v035 全局混战 · 跨兵种目标特效检查":`v035 ${batches[activeBatch].label} · 检查红上攻、蓝下攻与敌身命中`):(isFreeBattle()?"v035 全局混战 · 正常尺寸 · 可拖动地图":`v035 ${batches[activeBatch].label} · 红上蓝下 · 按地形寻路`)};
  batchButton.onclick=()=>{const groupedOrder=["chapter1","newTroop","core","new","c","special","bShuWei","bWuHuang","bQun"],index=groupedOrder.indexOf(activeBatch);activeBatch=activeBatch==="allTroops"?"allBattle":activeBatch==="allBattle"?"allTroops":groupedOrder[(index+1)%groupedOrder.length];lanes=buildLanes(activeBatch);reviewStarted=performance.now();statusText.textContent=batches[activeBatch].overview?"v035 全员39 · 按实机比例独立纵览":batches[activeBatch].massBattle?"v035 全局混战 · 正常尺寸 · 可拖动地图":`v035 ${batches[activeBatch].label} · 红上蓝下 · 按地形寻路`;reset();syncBatchUI();applyView()};
  const sceneBg=document.createElement("img");sceneBg.id="sceneBg";sceneBg.alt="";sceneBg.src="./runtime/scenes/map-env-full-v064.webp";board.prepend(sceneBg);
  const atmoBg=document.createElement("img");atmoBg.id="atmoBg";atmoBg.alt="";atmoBg.src="./runtime/scenes/scene_atmo.webp";board.append(atmoBg);
  const fogFracs={fogA:[0.06,0.16],fogB:[0.40,0.12],fogC:[0.68,0.18]};
  const fogEls={};
  for(const [key,[ft,fh]] of Object.entries(fogFracs)){const el=document.createElement("div");el.className=`atmo-fog ${key.replace("fog","fog-").toLowerCase()}`;el.dataset.ft=String(ft);el.dataset.fh=String(fh);board.append(el);fogEls[key]=el}
  const SCENES={battle:`./runtime/scenes/map-env-full-v064.webp?sync=${Date.now()}`,levels:"./runtime/scenes/scene_levels.webp",atmo:"./runtime/scenes/scene_atmo.webp"};
  const modeButtons={battle:modeBattle,show:modeShow,adjust:modeAdjust};
  let displayMode="battle";
  const panelModeButtons={battle:panelModeBattle,show:panelModeShow,adjust:panelModeAdjust};
  /* Preserve the existing background placement; unit anchors use measured raster grid lines. */
  const REAL={zr:0.7013779280972066,left:62.43517474633596,top:141.79819616685455,mapW:390,mapH:390*2595/970,mapTop:317-1166.5*390/970,cell:37.87440811724915};
  const TERRAIN_ART={width:768,height:2048,x:[130,203,274,346,419,492,563,634],y:[284,354,424,496,568,640,712,784,857,932,1005,1077,1148,1221,1294,1365,1437,1510]};
  // Keep the average logical cell span from v063; fit only the world into the field.
  const FULL_MAP_WIDTH=(REAL.mapW/REAL.zr)*(641/970)/(504/768);
  const FULL_MAP_HEIGHT=FULL_MAP_WIDTH*TERRAIN_ART.height/TERRAIN_ART.width;
  let mapPlacement={left:-REAL.left/REAL.zr,top:(REAL.mapTop-REAL.top)/REAL.zr,width:REAL.mapW/REAL.zr,height:REAL.mapH/REAL.zr};
  function rasterAxis(value,lines){const coordinate=value+.5,index=Math.max(0,Math.min(lines.length-2,Math.floor(coordinate)));return lines[index]+(lines[index+1]-lines[index])*(coordinate-index);}
  function unitRenderPoint(unit){
    const previous=unit.renderPointCache;
    if(previous&&previous.x===unit.x&&previous.y===unit.y&&previous.map===mapPlacement)return previous.point;
    const point={x:mapPlacement.left+rasterAxis(unit.x,TERRAIN_ART.x)/TERRAIN_ART.width*mapPlacement.width,y:mapPlacement.top+rasterAxis(unit.y,TERRAIN_ART.y)/TERRAIN_ART.height*mapPlacement.height};
    unit.renderPointCache={x:unit.x,y:unit.y,map:mapPlacement,point};return point;
  }
  let viewZoom=1,troopScale=1,mapDX=0,mapDY=0,mapScale=1,mapBrightness=1,frameBrightness=1,frameScale=1,otherFrameScale=1,bareHudScale=.9,bareHudGap=3,realMode=true,impactFeel=1;
  /* Overall × category scales the troop/frame; HP retains v008 and badges cancel category enlargement. */
  const troopCat={mounted:1,flying:1,giant:1,machine:1};
  function troopCatOf(kind){if(kind==="c_qun_xiang")return"giant";if(kind==="c_shu_kongming")return"flying";if(horseKinds.has(kind))return"mounted";if(machineKinds.has(kind))return"machine";return"normal"}
  function troopScaleOf(kind){const cat=troopCatOf(kind);return troopScale*(cat==="normal"?1:troopCat[cat])}
  function troopCategoryScaleOf(kind){const cat=troopCatOf(kind);return cat==="normal"?1:troopCat[cat]}
  function applyTroopScales(){for(const u of units){u.el.style.setProperty("--troop-scale",String(troopScaleOf(u.kind)));u.el.style.setProperty("--troop-category-scale",String(troopCategoryScaleOf(u.kind)))}document.querySelectorAll(".overview-unit").forEach(el=>{el.style.setProperty("--troop-scale",String(troopScaleOf(el.dataset.kind)));el.style.setProperty("--troop-category-scale",String(troopCategoryScaleOf(el.dataset.kind))) });for(const u of units)layoutDamageNumbers(u)}
  /* v030 出厂默认值与本地存档：滑杆是唯一数据源，命名记录存 localStorage */
  const FACTORY={...window.TroopSizing.defaults,mapScale:1,mapDY:0,mapBrightness:1,frameBrightness:1,frameScale:1,otherFrameScale:1,bareHudScale:.9,bareHudGap:3,collisionScale:1,timeScale:1,attackSpeed:1.5,impactFeel:1};
  const SETTINGS_KEY="action-port-settings-v001",RECORD_KEY="action-port-records-v001";
  function collectPanelState(){return {sizePreset:"screenshot-v048",troopScale:troopScale,mounted:troopCat.mounted,flying:troopCat.flying,giant:troopCat.giant,machine:troopCat.machine,mapScale:mapScale,mapDY:mapDY,mapBrightness,frameBrightness,frameScale,otherFrameScale,bareHudScale,bareHudGap,collisionScale,timeScale:timeScale,attackSpeed,impactFeel:impactFeel,...combatBalance}}
  function setPanelState(s){if(!s)return;const set=(id,v)=>{if(v===undefined||!Number.isFinite(Number(v)))return;const el=document.getElementById(id);if(!el)return;el.value=String(el.dataset.sizeKey?window.TroopSizing.toPosition(el.dataset.sizeKey,v):v);el.dispatchEvent(new Event("input",{bubbles:true}))};set("panelTroop",s.troopScale);set("panelCatMounted",s.mounted);set("panelCatFlying",s.flying);set("panelCatGiant",s.giant);set("panelCatMachine",s.machine);set("panelMapScale",s.mapScale);set("panelMapY",s.mapDY);set("panelMapBrightness",s.mapBrightness);set("panelFrameBrightness",s.frameBrightness);set("panelFrameScale",s.frameScale);set("panelOtherFrameScale",s.otherFrameScale??s.frameScale);set("panelCollisionScale",s.collisionScale);set("panelBareHudScale",s.bareHudScale);set("panelBareHudGap",s.bareHudGap);set("panelArcherAttack",s.archerAttack);set("panelCavalryHp",s.cavalryHp);set("panelElephantHp",s.elephantHp);set("panelTimeScale",s.timeScale);set("panelAttackSpeed",s.attackSpeed);set("panelImpactFeel",s.impactFeel);queueSettingsSave()}
  function sliderState(){const num=id=>{const el=document.getElementById(id);return el.dataset.sizeKey?window.TroopSizing.fromPosition(el.dataset.sizeKey,el.value):Number(el.value)};return {troopScale:num("panelTroop"),mounted:num("panelCatMounted"),flying:num("panelCatFlying"),giant:num("panelCatGiant"),machine:num("panelCatMachine"),mapScale:num("panelMapScale"),mapDY:num("panelMapY"),mapBrightness:num("panelMapBrightness"),frameBrightness:num("panelFrameBrightness"),frameScale:num("panelFrameScale"),collisionScale:num("panelCollisionScale"),bareHudScale:num("panelBareHudScale"),bareHudGap:num("panelBareHudGap"),archerAttack:num("panelArcherAttack"),cavalryHp:num("panelCavalryHp"),elephantHp:num("panelElephantHp"),timeScale:num("panelTimeScale"),attackSpeed:num("panelAttackSpeed"),impactFeel:num("panelImpactFeel")}}
  let saveTimer=null;
  function queueSettingsSave(){clearTimeout(saveTimer);saveTimer=setTimeout(()=>{try{localStorage.setItem(SETTINGS_KEY,JSON.stringify(collectPanelState()))}catch{}},300)}
  function loadRecords(){try{return JSON.parse(localStorage.getItem(RECORD_KEY))||[]}catch{return[]}}
  function storeRecords(list){try{localStorage.setItem(RECORD_KEY,JSON.stringify(list))}catch{}}
  function renderRecords(){if(!window.panelRecordList)return;panelRecordList.innerHTML="";for(const [index,rec] of loadRecords().entries()){const row=document.createElement("div");row.className="record-row";const name=document.createElement("span");name.textContent=rec.name;const apply=document.createElement("button");apply.type="button";apply.textContent="应用";apply.onclick=()=>{setPanelState(rec.values);queueSettingsSave()};const del=document.createElement("button");del.type="button";del.textContent="删";del.onclick=()=>{const list=loadRecords();list.splice(index,1);storeRecords(list);renderRecords()};row.append(name,apply,del);panelRecordList.append(row)}}
  function applyView(){
    canvasViewport=null;
    /* 所有批次共用原图 7×17 地形及地图变换。 */
    const realOk=realMode;
    board.classList.toggle("scene-mode",displayMode!=="battle"||realOk);
    const fullMap=!sharedReview&&!batches[activeBatch].overview;
    field.classList.toggle("full-map-field",fullMap);
    board.style.width=fullMap?`${FULL_MAP_WIDTH}px`:"";
    board.style.height=fullMap?`${FULL_MAP_HEIGHT}px`:"";
    const z=fullMap?Math.min(field.clientWidth/FULL_MAP_WIDTH,field.clientHeight/FULL_MAP_HEIGHT):(realOk?REAL.zr:1)*viewZoom;
    board.style.zoom=String(z);
    board.style.setProperty("--world-map-scale",z);
    // Fit the HUD together with its troop; preserve the approved local HUD proportions.
    board.style.setProperty("--hud-map-scale",fullMap?REAL.zr:z);
    const placeMap=(L,T,W,H)=>{
      const ax=(REAL.left+3.5*REAL.cell)*viewZoom/z, ay=(REAL.top+9.5*REAL.cell)*viewZoom/z;
      const L2=ax+(L-ax)*mapScale, T2=ay+(T-ay)*mapScale, W2=W*mapScale, H2=H*mapScale;
      mapPlacement={left:L2,top:T2,width:W2,height:H2};
      for(const el of [sceneBg,atmoBg]){el.style.left=`${L2}px`;el.style.top=`${T2}px`;el.style.width=`${W2}px`;el.style.height=`${H2}px`;el.style.objectFit="fill"}
      for(const el of Object.values(fogEls)){el.style.top=`${T2+Number(el.dataset.ft)*H2}px`;el.style.height=`${Math.max(8,Number(el.dataset.fh)*H2)}px`}
    };
    if(fullMap){
      // left/top are local coordinates under CSS zoom. All layers share this transform.
      board.style.left=`${(field.clientWidth/z-FULL_MAP_WIDTH)/2}px`;
      board.style.top=`${(field.clientHeight/z-FULL_MAP_HEIGHT)/2}px`;
      mapPlacement={left:0,top:0,width:FULL_MAP_WIDTH,height:FULL_MAP_HEIGHT};
      for(const el of [sceneBg,atmoBg])Object.assign(el.style,{left:"0px",top:"0px",width:`${FULL_MAP_WIDTH}px`,height:`${FULL_MAP_HEIGHT}px`,objectFit:"fill"});
      field.scrollLeft=field.scrollTop=0;
    }else{
      board.style.left=`${REAL.left*viewZoom}px`;board.style.top=`${REAL.top*viewZoom}px`;
      placeMap(-(REAL.left*viewZoom+mapDX)/z,((REAL.mapTop-REAL.top)*viewZoom+mapDY)/z,REAL.mapW*viewZoom/z,REAL.mapH*viewZoom/z);
    }
    for(const control of [panelMapScale,panelMapY]){control.disabled=fullMap;control.title=fullMap?"整图模式自动适配视窗":"";}
    realReadout.textContent=fullMap?"地形 7×17 · 完整地图自动适配 · 上下树林完整显示":`地形 7×17 · 动作近景 · 棋盘 ${Math.round(z*100)}%`;
    layoutBarracks();
    board.classList.toggle("linked-scene",sceneBg.src.includes("map-env"));
    for(const unit of units)if(unit.alive)place(unit);
    board.querySelectorAll(".arrow-projectile").forEach(syncProjectile);
    if(sharedOn){sharedFlights.forEach(renderSharedProjectile);groundBursts.forEach(renderGroundBurst);fireFields.forEach(renderFireField);}
    for(const unit of units)if(!unit.alive)syncTargetEffects(unit);
    for(const unit of units)layoutDamageNumbers(unit);
    if(sharedReview)centerSharedPreview();
  }
  function setDisplayMode(mode){
    displayMode=mode;
    for(const [name,button] of Object.entries(modeButtons))button.classList.toggle("on",name===mode);
    for(const [name,button] of Object.entries(panelModeButtons))button.classList.toggle("on",name===mode);
    sizeRow.hidden=mode!=="adjust";
    app.classList.toggle("adjusting",mode==="adjust");
    board.classList.toggle("adjust-mode",mode==="adjust");
    /* v030 全模式共用用户双桥地图原图 */
    sceneBg.src=SCENES.battle;
    if(mode==="adjust"){running=false;pauseButton.textContent="继续";pauseButton.classList.add("on")}
    applyView();syncSharedControls();
  }
  function syncBatchUI(){if(panelBatch.options.length)panelBatch.value=activeBatch}
  function openMobilePanel(){
    if(matchMedia("(min-width:720px)").matches)return;
    editorPanel.classList.add("mobile-open");editorPanel.setAttribute("role","dialog");editorPanel.setAttribute("aria-modal","true");editorPanel.setAttribute("aria-labelledby","panelHeading");
    editorPanel.scrollTop=0;panelClose.focus();
  }
  function closeMobilePanel(){editorPanel.classList.remove("mobile-open");editorPanel.removeAttribute("role");editorPanel.removeAttribute("aria-modal");if(!matchMedia("(min-width:720px)").matches)modeAdjust.focus()}
  panelClose.onclick=closeMobilePanel;
  editorPanel.addEventListener("keydown",event=>{
    if(!editorPanel.classList.contains("mobile-open"))return;
    if(event.key==="Escape"){event.preventDefault();closeMobilePanel();return}
    if(event.key!=="Tab")return;
    const controls=[...editorPanel.querySelectorAll("button,input,select")].filter(el=>!el.disabled&&el.getClientRects().length);
    const first=controls[0],last=controls.at(-1);
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
  });
  modeBattle.onclick=()=>setDisplayMode("battle");
  modeShow.onclick=()=>setDisplayMode("show");
  modeAdjust.onclick=()=>{setDisplayMode("adjust");openMobilePanel()};
  for(const [name,button] of Object.entries(panelModeButtons))button.onclick=()=>setDisplayMode(name);
  document.getElementById("panelAttackSpeed").oninput=event=>{attackSpeed=Number(event.target.value);document.getElementById("panelAttackSpeedV").textContent=`${attackSpeed}×`;if(sharedReview){sharedClock=0;sharedCycle=-1;}};
  panelTimeScale.oninput=()=>{timeScale=Number(panelTimeScale.value);panelTimeScaleV.textContent=`${timeScale}×`;speedButton.textContent=timeScale===.5?"恢复1×":timeScale===1?"0.5×":`${timeScale}×`;speedButton.classList.toggle("on",timeScale!==1)};
  panelImpactFeel.oninput=()=>{impactFeel=Number(panelImpactFeel.value);panelImpactFeelV.textContent=`${Math.round(impactFeel*100)}%`};
  panelMapScale.oninput=()=>{mapScale=Number(panelMapScale.value);panelMapScaleV.textContent=`${Math.round(mapScale*100)}%`;applyView()};
  panelMapY.oninput=()=>{mapDY=Number(panelMapY.value);panelMapYV.textContent=String(mapDY);applyView()};
  panelMapBrightness.oninput=()=>{mapBrightness=Number(panelMapBrightness.value);panelMapBrightnessV.textContent=`${Math.round(mapBrightness*100)}%`;sceneBg.style.filter=`brightness(${mapBrightness})`};
  function setFrameScale(value,group="foot"){
    const numeric=Number(value);
    const scale=Math.round(Math.max(.5,Math.min(1.5,Number.isFinite(numeric)?numeric:1))*20)/20;
    const id=group==="other"?"panelOtherFrameScale":"panelFrameScale";
    if(group==="other")otherFrameScale=scale;else frameScale=scale;
    document.getElementById(id).value=String(scale);
    document.getElementById(`${id}Number`).value=String(Math.round(scale*100));
    document.body.style.setProperty(group==="other"?"--other-frame-scale":"--head-frame-scale",scale);
  }
  for(const [group,id] of [["foot","panelFrameScale"],["other","panelOtherFrameScale"]]){
    document.getElementById(id).oninput=event=>setFrameScale(event.target.value,group);
    const number=document.getElementById(`${id}Number`);
    number.oninput=event=>{const value=Number(event.target.value);if(value>=50&&value<=150){setFrameScale(value/100,group);queueSettingsSave()}};
    number.onchange=event=>{setFrameScale(event.target.value===""?1:Number(event.target.value)/100,group);queueSettingsSave()};
  }
  function setCollisionScale(value){
    collisionScale=Math.round(Math.max(.25,Math.min(2,Number(value)||1))*100)/100;
    document.getElementById("panelCollisionScale").value=collisionScale;
    document.getElementById("panelCollisionScaleNumber").value=Math.round(collisionScale*100);
  }
  document.getElementById("panelCollisionScale").oninput=e=>setCollisionScale(e.target.value);
  document.getElementById("panelCollisionScaleNumber").oninput=e=>{const n=Number(e.target.value);if(n>=25&&n<=200){setCollisionScale(n/100);queueSettingsSave()}};
  document.getElementById("panelCollisionScaleNumber").onchange=e=>{setCollisionScale(Number(e.target.value)/100);queueSettingsSave()};
  document.getElementById("panelFrameBrightness").oninput=event=>{frameBrightness=Number(event.target.value);document.getElementById("panelFrameBrightnessV").textContent=`${Math.round(frameBrightness*100)}%`;document.body.style.setProperty("--frame-brightness",frameBrightness)};
  document.getElementById("panelBareHudScale").oninput=event=>{bareHudScale=Number(event.target.value);document.getElementById("panelBareHudScaleV").textContent=`${Math.round(bareHudScale*100)}%`;document.body.style.setProperty("--bare-hud-scale",bareHudScale)};
  document.getElementById("panelBareHudGap").oninput=event=>{bareHudGap=Number(event.target.value);document.getElementById("panelBareHudGapV").textContent=`${bareHudGap}px`;document.body.style.setProperty("--bare-hud-gap",`${bareHudGap}px`);document.body.style.setProperty("--bare-hud-gap-number",bareHudGap)};
  function applyHpBalance(){
    for(const unit of units){
      if(!unit.alive||unit.hp<=0)continue;
      const nextMax=maximumHp(unit.kind);if(nextMax===unit.maxHp)continue;
      const remaining=Math.max(0,Math.min(1,unit.hp/unit.maxHp));unit.maxHp=nextMax;unit.hp=remaining*nextMax;place(unit);
    }
  }
  function refreshCombatReadout(){combatReadout.textContent=`益州弓手攻击 ${defs.b1Shu.atk.map(raw=>damageAmount("b1Shu",raw)).join("–")} · 常规骑兵血量 ${maximumHp("cavalry")} · 大象血量 ${maximumHp("c_qun_xiang")}`}
  for(const [key,id] of Object.entries({archerAttack:"panelArcherAttack",cavalryHp:"panelCavalryHp",elephantHp:"panelElephantHp"})){
    const slider=document.getElementById(id);slider.oninput=()=>{combatBalance[key]=Number(slider.value);document.getElementById(`${id}V`).textContent=`${Math.round(combatBalance[key]*100)}%`;if(key!=="archerAttack")applyHpBalance();refreshCombatReadout()};
  }
  panelCombatReset.onclick=()=>setPanelState({...COMBAT_DEFAULTS,attackSpeed:1.5});
  for(const [kind,def] of Object.entries(defs)){const option=document.createElement("option");option.value=kind;option.textContent=def.name;panelCustomKind.append(option)}
  panelCustomCount.oninput=()=>{panelCustomCountV.textContent=panelCustomCount.value};
  panelCustomStart.onclick=()=>{const kind=panelCustomKind.value,count=Number(panelCustomCount.value),name=`custom_${kind}_${count}`;if(!batches[name]){batches[name]={label:`${defs[kind].name} ${count}v${count}`,kinds:[kind],massBattle:true,custom:{kind,count}};const option=document.createElement("option");option.value=name;option.textContent=batches[name].label;panelBatch.append(option)}activeBatch=name;lanes=buildLanes(name);reviewStarted=performance.now();reset();syncBatchUI();applyView()};
  const sizeControls={troopScale:[panelTroop,troopSizeRange],mounted:[panelCatMounted],flying:[panelCatFlying],giant:[panelCatGiant],machine:[panelCatMachine]};
  function setSizeValue(key,value){
    value=Math.round(Math.max(.5,Math.min(5,value))*20)/20;
    if(key==="troopScale")troopScale=value;else troopCat[key]=value;
    for(const slider of sizeControls[key]){slider.value=String(window.TroopSizing.toPosition(key,value));slider.setAttribute("aria-valuetext",`${Math.round(value*100)}%`);document.getElementById(slider===troopSizeRange?"troopSizeValue":`${slider.id}V`).textContent=`${Math.round(value*100)}%`;}
    applyTroopScales();
  }
  for(const [key,sliders] of Object.entries(sizeControls))for(const slider of sliders){
    slider.oninput=()=>setSizeValue(key,window.TroopSizing.fromPosition(key,slider.value));
    slider.onkeydown=event=>{const delta={ArrowLeft:-.05,ArrowDown:-.05,ArrowRight:.05,ArrowUp:.05,PageDown:-.25,PageUp:.25}[event.key];if(delta!==undefined||event.key==="Home"||event.key==="End"){event.preventDefault();const value=key==="troopScale"?troopScale:troopCat[key];setSizeValue(key,event.key==="Home"?.5:event.key==="End"?5:value+delta);queueSettingsSave();}};
  }
  panelViewReset.onclick=()=>{viewZoom=1;setPanelState(FACTORY);speedButton.classList.remove("on");queueSettingsSave()};
  panelRecordSave.onclick=()=>{const name=panelRecordName.value.trim()||`记录 ${new Date().toLocaleString("zh-CN",{month:"numeric",day:"numeric",hour:"2-digit",minute:"2-digit"})}`;const list=loadRecords();list.unshift({name,values:collectPanelState(),ts:Date.now()});storeRecords(list.slice(0,20));panelRecordName.value="";renderRecords()};
  function exportCurrentSettings(){
    const now=new Date();
    const payload={
      format:'troop-battle-settings',schemaVersion:1,previewVersion:'level-cd-v092',
      exportedAt:now.toISOString(),
      panel:collectPanelState(),
      troopRates:troopRates.snapshot(),
      troopInfo:Object.fromEntries(allTroopKinds.map(kind=>[kind,{name:defs[kind].name,category:rateGroups.find(group=>group.id===rateGroupOf(kind)).label}])),
      display:{teamOutlines:framesVisible,collisionEnabled:collisionOn},
      scenario:{batch:activeBatch,mode:displayMode,populationLimitPerTeam:100},
      savedRecords:loadRecords(),
      units:{panelScale:'1 = 100%',spawn:'seconds per troop',attack:'multiplier of panel.attackSpeed',savedRecords:'named main-panel snapshots; current per-kind rates are in troopRates'}
    };
    const pad=value=>String(value).padStart(2,'0');
    const stamp=`${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
    const filename=`小兵调节数值-${stamp}.json`;
    const url=URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)],{type:'application/json;charset=utf-8'}));
    const link=document.createElement('a');link.href=url;link.download=filename;link.hidden=true;
    try{document.body.append(link);link.click();}finally{link.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);}
    return filename;
  }
  for(const button of document.querySelectorAll('[data-settings-export]'))button.onclick=()=>{
    const status=document.getElementById(button.id==='panelSettingsExport'?'panelExportStatus':'troopRatesExportStatus');
    status.hidden=false;
    try{const filename=exportCurrentSettings();status.textContent=`已生成 ${filename}，请在下载中查看并将文件发给我。`}
    catch(error){status.textContent='导出未成功，请重试。';console.error('Settings export failed',error);}
  };
  editorPanel.addEventListener("input",queueSettingsSave);
  /* 启动时恢复：优先上次调节值，其次出厂默认（滑杆 value 即默认值） */
  try{const saved=JSON.parse(localStorage.getItem(SETTINGS_KEY)||"null");setPanelState({...sliderState(),...window.TroopSizing.migrate(saved)})}catch{setPanelState({...sliderState(),...window.TroopSizing.defaults})}
  renderRecords();
  troopSizeRange.addEventListener("input",queueSettingsSave);
  panelPause.onclick=()=>pauseButton.click();
  panelCollision.onchange=()=>{collisionOn=panelCollision.checked};
  panelReset.onclick=()=>resetButton.click();
  panelSpeed.onclick=()=>speedButton.click();
  panelReview.onclick=()=>{if(sharedOn){startSharedReview(sharedKind);closeMobilePanel();return;}reviewButton.click();};
  for(const [name,batch] of Object.entries(batches)){const option=document.createElement("option");option.value=name;option.textContent=batch.label;panelBatch.append(option)}
  panelBatch.onchange=()=>{const name=panelBatch.value;if(!batches[name])return;activeBatch=name;lanes=buildLanes(name);reviewStarted=performance.now();statusText.textContent=batches[name].overview?"v035 全员39 · 按实机比例独立纵览":batches[name].massBattle?"v035 全局混战 · 正常尺寸 · 可拖动地图":`v035 ${batches[name].label} · 红上蓝下 · 按地形寻路`;reset();syncBatchUI();applyView()};
  function fitPhone(){const desk=matchMedia("(min-width:720px)").matches;phoneFrame.style.zoom=desk?String(Math.min(1,(innerHeight-28)/844,(innerWidth-360)/390)):"1"}
  addEventListener("resize",()=>{geometryEpoch++;canvasViewport=null;contactGeometryCache.clear();fitPhone();applyView();if(sharedReview)centerSharedPreview();if(matchMedia("(min-width:720px)").matches)closeMobilePanel()});
  window.__TROOP_MAP_V035_QA__={
    version:"crowd-fluid-v051+long-charge-v050+uniform-windup-v049+directional-crowd-v048+charge-launch-v047+charge-readable-v046+heavy-impact-v045+range-bands-v044+two-bridges-v043+committed-combat-v042+stable-crowd-v041+crowd-v040+hud-mid-v039+health-hud-v036+melee-trade-v035+split-frame-size-v034+cavalry-charge-v033+eight-bridges-v032+head-frame-v023+clear-hop-v022+grid-hop-v019+attack-tuning-v015+collision-hud-v014+shared-motion-v013+enemy-collision-v012+static-hud-v011+balance-brightness-v010+battle-readability-v009+carddemon-thirtyeight-plus-one-v035-free-battle-v003+chapter1-v018-impact+scene-display-v011+editor-v015+collision-v001+fxlayer-v001+charge-rhythm-v001+static-map-v001+static-map-all-modes-v001+settings-memory-v001+unified-map-v001+battlesim-map-v001+giant-plow-v001+troop-cat-scale-v001+action-panel-v001+boardzoom-removed-v001+team-base-v001+custom-battle-v001+red-top-cardbase-v001",
    areaCombat:{get enabled(){return areaDamageEnabled;},get heroes(){return mainHeroes.map(({id,team,x,y,hp,maxHp,alive})=>({id,team,x,y,hp,maxHp,alive}));},get camps(){return barracksModel?.cells.map(({id,team,x,y,hp,maxHp,alive})=>({id,team,x,y,hp,maxHp,alive}))||[];}},
    barracks:{get state(){return barracksModel?{cells:barracksModel.cells.map(({id,team,kind,column,row,x,y,exit})=>({id,team,kind,column,row,x,y,exit:{...exit}})),wave:barracksModel.wave,total:barracksModel.total,populationLimit:BARRACKS_POPULATION_LIMIT,population:livingPopulation(),nextAt:barracksModel.nextAt,schedules:barracksModel.cells.map(c=>({id:c.id,kind:c.kind,team:c.team,nextAt:c.nextAt,interval:c.interval,attempts:c.attempts})),elapsed,retained:units.length,reclaimed:barracksReclaimed,fps:barracksFps}:null;}},
    troopRates:{get values(){return troopRates.snapshot();},effective:kind=>({spawn:troopRates.get(kind).spawn,attack:attackSpeedFor(kind),cooldown:defs[kind].interval/attackSpeedFor(kind),windup:windupSeconds(kind)})},
    balance:{defaults:{...COMBAT_DEFAULTS},archerKinds:[...archerKinds],cavalryKinds:[...horseKinds],get values(){return {...combatBalance}},get stats(){return Object.fromEntries(Object.entries(defs).map(([kind,def])=>[kind,{name:def.name,baseHp:def.hp,maxHp:maximumHp(kind),baseAttack:[...def.atk],attack:def.atk.map(raw=>damageAmount(kind,raw))}]))}},
    chargeLaunch:{dashLength:chargeMotion.length,get longest(){return Number(board.dataset.longestCharge||0);},profile:kind=>heavyCombat.launchProfile(defs[kind]),get runs(){return units.filter(u=>u.chargeRun).map(u=>({id:u.id,kind:u.kind,state:u.state,travel:u.chargeRun.distance,hits:u.chargeRun.hits.size}));},get count(){return Number(board.dataset.chargeLaunches||0);},get victims(){return units.filter(u=>u.chargeFlight).map(u=>({id:u.id,kind:u.kind,type:u.chargeFlight.type,alive:u.alive,x:u.x,y:u.y,lift:u.launchLift,t:u.chargeFlight.t,angle:u.renderMotion?.angle||0}));}},
    chargeFeedback:{get stats(){return chargePainter?.stats||{tracks:0,points:0,painted:0,limit:24};}},
    fireVisual:{get fields(){return fireFields.map(f=>({centre:{...f.centre},t:f.t,life:f.life,contacts:Number(f.el.dataset.contacts)}));}},
    heavyCombat:{blastRadius:heavyCombat.blastRadius,effectLimit:heavyCombat.effectLimit,get bursts(){return groundBursts.map(b=>({type:b.type,centre:b.centre,radius:b.radius,t:b.t}));},get blocked(){return Number(board.dataset.chargeBlocks||0);}},
    combatRanges:{unit:"terrain cells; extra reach beyond the two ground-shadow edges",get stats(){return Object.fromEntries(Object.entries(defs).map(([kind,def])=>[kind,{name:def.name,ranged:!!def.ranged,extraRange:def.range}]))},get engagements(){return units.filter(u=>u.alive).map(u=>{const target=units.find(t=>t.id===u.targetId&&t.alive)||(sharedReview?units.find(t=>t.team!==u.team&&t.kind===u.kind&&t.alive):null);return {id:u.id,kind:u.kind,team:u.team,targetId:target?.id,distance:target?Math.hypot(target.x-u.x,target.y-u.y):null,maximum:target?reach(u,target):null,preferred:target?combatStandDistance(u,target):null,canAttack:!!target&&canAttack(u,target)};})}},
    sourcePolicy:"preserve every troop's outer size, action class, frame and level/HP center pairing; maximize complete art inside native frame and keep HP thickness constant across categories; preserve overview grid and grouped troop pairings; all battles use the same raster-aligned terrain; mass battle retains a draggable map, staggered non-mirrored teams and nearest-enemy two-dimensional targeting",
    map:{baseColumns:BASE_MAP.columns,baseRows:BASE_MAP.rows,massColumns:MASS_MAP.columns,massRows:MASS_MAP.rows,cell:54,battleColumns:{...lanes},formation:"red starts above blue, then both teams roam freely",overviewFormation:"39 unique troops visible at once in a proportional six-column seven-row collection board; elephant spans two columns and two rows",massBattleFormation:"39 blue and 39 red units in different stable shuffled formations on the raster-aligned 7 by 17 two-bridge terrain; no kind-to-kind pairing",groundPalette:"mid-dark-low-saturation-lilac-cyan-sand",get columns(){return mapSize.columns},get rows(){return mapSize.rows},get battleAxis(){return "terrain-aware-2d"}},
    terrain:{get campPassages(){return terrain.campPassages;},get campObstacles(){return terrain.campObstacles;},get campRevision(){return terrain.campRevision;},rows:[...terrain.rows],clearance:terrain.clearance,raster:TERRAIN_ART,route:(from,to)=>terrain.findGridPath(from,to),
      get positions(){return units.filter(u=>u.alive).map(u=>({id:u.id,kind:u.kind,team:u.team,x:u.x,y:u.y,state:u.state,valid:terrain.isWalkable(u.x,u.y),render:unitRenderPoint(u),path:u.nav?.points||[]}));},
      position(id,x,y){const u=units.find(u=>u.id===id);if(!u)return false;const p=terrain.nearest({x,y});u.x=u.originX=u.restX=u.terrainX=p.x;u.y=u.originY=u.restY=u.terrainY=p.y;u.nav=null;u.hitTarget=null;u.chargePending=false;setState(u,"idle");place(u);return {...p};},
      move(id,x,y){const u=units.find(u=>u.id===id);if(!u)return false;u.x=x;u.y=y;clampUnit(u);place(u);return {x:u.x,y:u.y};}
    },
    assets:{expected:expectedAssets,get loaded(){return loaded}},
    collision:{sap:"ground-anchor flat-ellipse collision independent of hop/pose/head frame; spatial-grid neighboring-cell broad phase; mass-weighted positional correction; same-team same-kind ignored; same-team different-kind uses 45% soft core with capped lateral-only yield while hopping; settled allies hold their ground, allows overlap and passage including air; dynamic broad-phase bounds; enemy teams only pushed by giant/machine/charging units; scripted states (attack_windup/attack/recover) act as immovable anchors; 2 relaxation iterations; enemy per-iteration push clamp .085 cells; allied sideways budget .012 cells at 60fps, terrain checked",get distanceScale(){return collisionScale},get enabled(){return collisionOn},set enabled(v){collisionOn=Boolean(v);if(typeof panelCollision!=="undefined")panelCollision.checked=collisionOn},get footprints(){return units.filter(u=>u.alive).map(u=>({id:u.id,kind:u.kind,team:u.team,x:u.x,y:u.y,ellipse:groundFootprint(u),ground:unitRenderPoint(u),metrics:groundMetrics(u),lift:u.hopLift||0}))},get stats(){return collisionStats},get units(){return units.filter(u=>u.alive).map(u=>({id:u.id,hp:u.hp,charge:u.chargePending,travel:Number(u.el.dataset.chargeTravel||0),kind:u.kind,team:u.team,x:u.x,y:u.y,state:u.state,mass:massOf(u)}))}},
    roster:{productionTroopDefs:38,simulatedTroopDefs:39,formalIds:Object.values(defs).map(def=>def.formalId),covered:39,remaining:0,batches,overview:{batch:"allTroops",defaultEntrypoint:true,uniqueCount:allTroopKinds.length,duplicates:0,allVisibleAtOnce:true,states:STATES,scalePolicy:"shared overview multiplier times actual troop outer scale"},massBattle:{batch:"allBattle",uniqueKindsPerTeam:39,totalUnits:78,axis:"free-2d",targeting:"nearest living enemy across all troop kinds",scalePolicy:"exact grouped-battle outer scale; no extra mass-battle shrink"},crowd200:{batch:"crowd200",uniqueKindsPerTeam:39,totalUnits:200,teams:100,realUnits:true},crowd400:{batch:"crowd400",uniqueKindsPerTeam:39,totalUnits:400,teams:200,realUnits:true},get active(){return activeBatch}},
    newTroop:{id:"daoDunDog",formalId:"daoDunDog",name:"刀盾狗",archetype:"bladeShield",status:"action_review",states:["idle","attack_windup","attack"],sourceSheet:"generated-sheets/dao-dun-dog-troop-v035.webp",runtimeFolder:"runtime/dao_dun_dog",independentFrom:"daoDun",replacesOriginal:false,simulatorAxis:"vertical",teamOrder:["blue-top","red-bottom"],palette:["warm ochre fur","cream muzzle","dark indigo Han helmet","vermilion tie","jade-teal octagonal shield","aged bronze rim"]},
    anchorPolicy:{frameCenterTallPx:{x:38,y:41},frameCenterCompactPx:{x:32,y:34},footTarget:"head-only colored frame; complete art remains unchanged",footKinds:["blade","spear","daoDun","daoDunDog","b1Shu","jiBing","youJi","sheSheng","corpsePuppet","heroSpearPuppet","c_shu_huben","c_wei_baowei","c_wu_jieying","c_wu_firebow","c_huang_guidao","c_huang_zombie","c_wei_huwei","b5_shu","b3_wei","b5_wei","b1_wu","b3_wu","b5_wu","b1_huangjin","b3_huangjin","b5_huangjin","b1_qun","b3_qun"],machineTarget:"colored frame centered on complete operator and machine",machineKinds:["b4_shu","b4_wei","b4_wu","b4_qun"],mountedTarget:"colored frame centered on complete rider and mount",mountedKinds:["cavalry","c_qun_xiang","c_qun_baima","b2_wei","b2_huangjin","b2_qun"],flyingTarget:"colored frame centered on complete flying assembly",flyingKinds:["c_shu_kongming"],weaponExcluded:false,assemblyFrameIncludesEquipment:true,completeArtMustStayInsideFrame:false,headFrameBounds,frameScaleRange:[.5,1.5],headTopMustStayInsideFrame:true,stateAnchors:headAnchors,mirrorsWithFacing:true},
    scalePolicy:{ordinaryWholeGroupMultiplier:.667,ordinaryIncludes:["head","hands","weapon","body","unitFrame"],levelSize:"compact 11 screen px; fixed beside stable idle-body health track",hpThickness:"6 screen px independent of troop/category/map scale; stable idle-body width",exceptions:{horseCavalry:["cavalry","c_qun_baima","b2_wei","b2_huangjin","b2_qun"],horseSizeFlying:["c_shu_kongming"],elephant:["c_qun_xiang"],largeMachines:["b4_shu","b4_wei","b4_wu","b4_qun"]},baseOuterScale:{cavalry:1.10,c_qun_xiang:1.78,c_qun_baima:1.10,b2_wei:1.10,b2_huangjin:1.10,b2_qun:1.10,c_shu_kongming:1.10,b4_wu:.94},mountedSpriteScale:{cavalry:.88,c_qun_baima:.86,b2_wei:.86,b2_huangjin:.86,b2_qun:.86},kongmingGroupScale:{outerScale:1.10,artScale:.70,includes:["complete compact lantern craft","unitFrame","hpBar","levelBadge"],matchesHorseGroup:true,redesign:"compact-v036 wide balloon, short suspension, oil jar absent from attack character frame"},bladeSpriteScale:{idle:.600,attack_windup:.622,attack:.673,liftY:-3,sourceMultiplier:1.05},bladeUiLocked:["unitFrame","hpBar","levelBadge","gridPosition","parentScale"],largeMachineScale:{b4_shu:{outerScale:1,artScale:.88},b4_wei:{outerScale:1,artScale:.88},b4_wu:{outerScale:.94,artScale:.88},b4_qun:{outerScale:1,artScale:.88},includes:["operator","complete machine","unitFrame","hpBar","levelBadge"]},weaponBoost:{kind:"b5_huangjin",sourceSpriteScale:.70,underlayScale:1.16,states:["idle","attack_windup","attack"],unchanged:["head","face","body","unitFrame","hpBar","levelBadge","gridPosition","attackPath"]},mountedRasterPolicy:"rider plus complete horse remains one undistorted raster",singleTransformOwner:"unit",restoredV025SpriteOnlyScale:true,artGeometry:"complete source alpha uniformly maximized per kind across all three poses within red/blue native frame interior; source rasters unchanged",allBattlePathsVertical:false,massBattleUsesNormalScale:true},
    rasterRepair:{legacy:{kinds:["b4_wei","b4_qun"],states:["idle","attack_windup"],report:"validation/v031/raster-repair-report.json"},current:{kind:"b4_wu",states:["idle","attack_windup","attack"],rule:"keep the largest connected alpha component and clear detached edge fragments only",report:"validation/v032/b4-wu-raster-repair-report.json"}},
    puppetMaterialCorrection:{kinds:["corpsePuppet","heroSpearPuppet"],states:["idle","attack_windup","attack"],geometryChanged:false,alphaChangedPixels:0,scaleChanged:false,uiChanged:false,report:"validation/v034/puppet-color-report.json",palette:{corpsePuppet:["cool teal-blue slate hood","pale warm gray-green face","clean red sash","warm bronze and brighter steel"],heroSpearPuppet:["medium charcoal-indigo hood","warm copper bindings","pale warm gray face","turquoise knot","scarlet tassel","brighter wood and steel"]}},
    actionClasses:Object.fromEntries(Object.entries(defs).map(([kind,def])=>{const motion=v018ImpactMotion[kind];return [kind,{name:def.action,windup:def.windup,windupRetreat:def.windupRetreat,attackLunge:def.attackLunge,attackTime:motion?.attackTime??def.attackTime,strikeTime:motion?.strikeTime??null,recoveryTime:motion?.recoveryTime??null,knockback:motion?.knockback??null,hitStopMs:motion?.hitStopMs??Math.round(def.hitStop*1000),numberDelay:motion?.numberDelay??null}]})),
    spearContract:{sequence:["idle low horizontal spear","whole group retreats during windup","head and both hands drive forward in straight thrust"],weaponBelowEyes:true,swingForbidden:true,frameSharesActionGroup:true},
    historicalDirection:{period:"late Eastern Han to Three Kingdoms",evidenceContract:"historical-design-contract.md",intent:"stylized common soldiers, not archaeological reconstruction",jiBingCorrection:"remove Roman-like purple fan crest and fantasy giant crescent; use compact iron helmet and spearpoint-plus-short-side-gee ji",forbidden:["Roman transverse crest","bright purple fantasy helmet","Tang or later ceremonial armor","jeweled fantasy shield","giant moon-crescent ji"]},
    styleTransfer:{directionReference:"v023 historical square-head sheets plus approved complete-mount group rule",palette:{outline:"native raster near-black outline plus quality silhouette keyline v058",shu:"jade-rust-ochre",wei:"indigo-steel-old-gold",wu:"teal-vermilion-warm-brown",huangjin:"turmeric-earth-rust",qun:"dark-leather-old-gold-steel",ground:"mid-dark-lilac-cyan-sand",unitFrame:"user PNG v002: ally cyan-blue / enemy brick-red with native cream outline"},uiTraits:["hidden battlefield troop labels","user-provided cyan-blue and brick-red frame PNGs v002","thirty-nine independently addressable troop palettes in the simulator","native hand-inked outlines","smooth rounded unit frames","circular level badges","separate proportional overview and mass-battle modes","original grouped battle switch"],forbiddenElements:["Roman or later armor","soft neon glow","glass gloss","plastic highlights","generic faction recolor","cut-corner polygons","jagged frame edges"],newRasterSets:17,newRuntimeFrames:51,totalRuntimeFrames:117,backgroundCleanup:"edge-connected alpha cleanup plus per-pose component retention"},
    handOcclusion:{daoDun:{shieldHand:"behind shield in all states",visibleHands:1,visibleHandRole:"dao hand",states:["idle","attack_windup","attack"]},daoDunDog:{shieldHand:"behind shield in all states",visibleHands:1,visibleHandRole:"dao paw",states:["idle","attack_windup","attack"]},c_wei_baowei:{shieldHand:"behind shield in all states",visibleHands:1,visibleHandRole:"saber hand",states:["idle","attack_windup","attack"]},c_wei_huwei:{shieldHand:"behind giant rectangular shield in all states",visibleHands:1,visibleHandRole:"short saber hand",states:["idle","attack_windup","attack"]}},
    frameMotion:{sharedActionGroup:true,walkTogether:false,walking:"static-pose-body-scaled-hop",hopBodyRatio:.16,maxHopCells:.45,minHopHoldSeconds:.18,gridRoute:"four-neighbour",perKindMotion:true,hitFrameImpact:false,groupedBattleAxis:"terrain-aware-2d",massBattleAxis:"free-2d",frameRotation:false},
    projectile:{separateKinds:Object.keys(projectileAssets),attackFrameContainsProjectile:false,orientation:"continuous atan2 angle from launch point to actual target; source PNG right-facing equals zero degrees",angleToleranceDegrees:.5,ordinaryArrowTrail:false,kongmingPath:"high craft release toward enemy body with an independently spinning oil jar",baimaPath:"moving 25-40 degree bow release with the projectile rotating to the current enemy vector",machinePath:"rotor, bolt or stone flies from the complete machine to enemy body",supportPath:"small medicine packet flies to enemy body for the unit's normal ranged attack",get launched(){return effectCounts.arrow}},
    attackEffects:{owner:"targetUnit",assetType:"independent-transparent-png plus scoped pixel-paper DOM impact shell",contactPoint:"inside-target-middle-frame",chapter1PixelKinds:["blade","spear","b1_huangjin","b2_huangjin","b3_huangjin","b5_huangjin","c_huang_guidao","c_huang_zombie"],pixelSampling:"nearest-neighbor 7x source block grid",spearThrustSequence:["direction line","spear tip thrust","contact pixel spark"],centralContactMerge:false,longTrails:false,dust:false,simultaneousCrossForbidden:true,damageNumberDelay:true,damagePlacement:"above actual HP/level/frame bounds, three-column target-owned slots; original values, delay and animation preserved",profiles:{...Object.fromEntries(Object.keys(defs).map(kind=>[kind,effectProfiles[kind]]))},get counts(){return {...effectCounts}}},
        impactFeel:{reference:"carddemon-spear-cavalry-v018-battle",scopedKinds:[...CHAPTER1_KINDS],sequence:["readable windup retreat","short fast strike or projectile release","attacker and target local hit stop","target knockback and recoil","delayed damage number","eased recovery"],mapUiUnchanged:true,otherTroopsUnchanged:true,motions:v018ImpactMotion},
    characterOuterKeyline:{enabled:false,cssDropShadow:false,nativeRasterInkPreserved:true,changesAnchor:false,rasterModified:false},
    frameContinuity:{unitFrame:{construction:"user-provided transparent PNG v002, native outline and color",borderRadiusPx:0,outerNearBlackKeylinePx:0,cutCorners:false,continuous:true},levelBadge:{construction:"2px near-black border on circular faction face",shape:"circle",diameterPx:18,relation:"left of HP bar, vertically centered with a positive gap",cutCorners:false,continuous:true},hpBar:{relation:"center and horizontal length preserved; compact overview may meet native cream frame edge",battleThicknessBoardPx:7,overviewThicknessScreenPx:5,categoryThicknessCompensated:true,movesWithActionGroup:false,tracksMapPosition:true,fillPreserved:true}},
    statuses:{...Object.fromEntries(Object.keys(defs).map(kind=>[kind,["daoDunDog","c_shu_kongming"].includes(kind)?"action_review":["b4_shu","b5_shu","b3_wei","b4_wei","b5_wei","b1_wu","b3_wu","b4_wu","b5_wu","b1_huangjin","b3_huangjin","b5_huangjin","b1_qun","b2_qun","b3_qun","b4_qun"].includes(kind)?"new_action_review_v024":"carried_review"])),page:"battle_review"},
    sceneDisplay:{source:"tuntian-cocos/assets/resources (屯田战游戏场景原图)",modes:{battle:"网格对战",show:"场景展示（背景可切换，战斗继续）",adjust:"调整（仅大小）"},scenes:{battle:"runtime/scenes/scene_battle.webp (战场·草地 970x2595)",levels:"runtime/scenes/scene_levels.webp (关卡·夜色 780x1688)",atmo:"runtime/scenes/scene_atmo.webp (氛围·雾境 780x1688)"},defaultScene:"battle",actionsAndEffects:"unchanged"},
    editor:{layout:"desktop >=720px: phone frame 390x844 + side panel 322px; mobile: unchanged in-phone controls",realRestore:{enabledByDefault:true,source:"runtime/scenes/map-env-full-v064.webp exact user PNG; full-map contain",cols:7,rows:17,gridLines:TERRAIN_ART,mapArt:"768×2048 user raster",appliesTo:"all battle batches, including custom"},adjustEntries:{troopScale:"0.5-5 整体，1.7默认居中",troopCatScale:"骑兵/飞行/大象/器械 各 0.5-5；默认 .8/.65/.55/1.05 居中；步兵按头部宽度、组合兵按完整主体高度校准，正背面分别注册，三动作固定整组比例",timeScale:"0.25-4 动作速度",impactFeel:"0-2 打击停顿（硬直/受击反应同比，不影响节奏）",mapScale:"0.75-1.25 地图整体大小",mapDY:"-160..160 地图上下",baseTint:"user-frame-png-v002: 敌我底框使用用户PNG，原CSS底色、描边、阴影和亮度变化移除",customBattle:"任选兵种×每方1-20，按地图地形自由索敌"},actionsAndEffects:"unchanged"},
    get presentation(){return window.DirectionalRuntime.profiles},
    windupSeconds(kind){return windupSeconds(kind)},
    get directional(){return window.DirectionalRuntime.coverage},
    get ready(){return ready},
    get units(){return units.map(u=>({id:u.id,kind:u.kind,team:u.team,state:u.state,hp:Math.round(u.hp),maxHp:u.maxHp,alive:u.alive,x:Number(u.x.toFixed(3)),y:Number(u.y.toFixed(3)),targetKind:units.find(target=>target.id===u.targetId)?.kind||null,artKey:u.sharedArtKey||u.kind,artDirection:u.artDirection||null,facingLeft:u.el.classList.contains("face-left"),verticalDirection:u.el.classList.contains("vertical-up")?"up":u.el.classList.contains("vertical-down")?"down":null}))},
    get effects(){return {...effectCounts}},
    previewEffect(kind,heavy=Boolean(defs[kind]?.charge)){if(!defs[kind])return false;const source=units.find(unit=>unit.kind===kind&&unit.team==="blue"),target=source?opponent(source):null;if(!source||!target)return false;showAttackEffects(source,target,heavy);showDamage(target,damageAmount(kind,(defs[kind].atk[0]+defs[kind].atk[1])/2),source);return true},
    previewProjectile(kind){if(!defs[kind]?.ranged||!projectileRuntime[kind])return false;const source=units.find(unit=>unit.kind===kind&&unit.team==="blue"),target=source?opponent(source):null;if(!source||!target)return false;launchArrow(source,target,damageAmount(kind,(defs[kind].atk[0]+defs[kind].atk[1])/2),battleToken);return true},
    previewImpact(kind){if(!CHAPTER1_KINDS.has(kind))return false;const source=units.find(unit=>unit.kind===kind&&unit.team==="blue"),target=source?opponent(source):null;if(!source||!target)return false;source.chargePending=Boolean(defs[kind].charge);applyHit(source,target,1);return true},
    previewAction(kind){if(!CHAPTER1_KINDS.has(kind))return false;const source=units.find(unit=>unit.kind===kind&&unit.team==="blue"),target=source?opponent(source):null;if(!source||!target)return false;running=true;reviewMode=false;startAttack(source,target,Boolean(defs[kind].charge));return true},
    setBatch(name){if(!batches[name])return false;activeBatch=name;lanes=buildLanes(name);reset();return true},
    setReviewState(state){if(!STATES.includes(state))return false;running=false;reviewMode=true;reviewEffectPhase=-1;board.querySelectorAll(".damage,.lane-result,.attack-fx,.attack-trail,.arrow-projectile").forEach(el=>el.remove());board.classList.remove("impact-heavy");reviewButton.classList.add("on");reviewButton.textContent="返回对打";for(const unit of units){setState(unit,state);unit.el.classList.remove("walking","hit-stop","hit");for(const name of [...unit.el.classList])if(name.startsWith("hit-"))unit.el.classList.remove(name)}modeState.textContent=`特效轮播 · ${stateLabel[state]}`;battleState.textContent=Object.keys(lanes).map(kind=>defs[kind].action).join(" / ");updateHud();return true},
    reset
  };
  // The new motion model owns the visual layer only. Unit anchors and the original
  // HUD geometry stay owned by the map and the existing layout rules.
  let motionDeck,familySelect,memberSelect,phaseSelect,motionPlay,motionSpeed,motionMode,motionLabel;
  const familyCache=new Map(),idleScaleCache=new Map();
  function familyOf(kind){let f=familyCache.get(kind);if(!f){f=sharedMotion.families.find(f=>f.id===sharedMotion.roster[kind].baseAction);familyCache.set(kind,f);}return f;}
  function idlePoseScale(kind){let scale=idleScaleCache.get(kind);if(scale===undefined){scale=sharedMotion.sample(kind,"idle",0,0,1).scale;idleScaleCache.set(kind,scale);}return scale;}
  function setSharedPose(unit,pose){
    const artKey=sharedOn&&newArt?window.DirectionalRuntime.choose(unit,elapsed):unit.kind;
    const directional=artKey.includes('@'),facing=!directional&&unit.el.classList.contains("face-left");
    if(unit.sharedPose===pose&&unit.sharedFacing===facing&&unit.sharedArtKey===artKey&&unit.el.dataset.state===pose&&(crowdCanvasOn()||unit.domArtKey===artKey+pose))return;
    unit.sharedArtKey=artKey;unit.el.dataset.artKey=artKey;unit.el.dataset.artDirection=unit.artDirection||'legacy';
    fitTroopArt(unit.el,unit.kind,pose);unit.sharedPose=pose;unit.sharedFacing=facing;unit.el.dataset.state=pose;
    if(!crowdCanvasOn()){troopNodes(unit.el).sprite.src=runtimeFrames[unit.sharedArtKey||unit.kind][pose];unit.domArtKey=artKey+pose;}
    const weapon=troopNodes(unit.el).weapon;if(weapon)weapon.src=weaponBoostRuntime[pose];
  }
  function windupSeconds(kind,charging=false){const attackSpeed=attackSpeedFor(kind);const f=familyOf(kind);return Math.max(heavyCombat.stone(kind)?0.9:0,window.CombatTiming.windup(f.id,charging&&cavalryCharge(kind)?chargeMotion.windup*attackSpeed:defs[kind].windup,attackSpeed));}
  function sharedLogicalPose(unit){const attackSpeed=attackSpeedFor(unit.kind);
    const phase=sharedReview?(unit.sharedRenderPhase||unit.state):unit.state;
    return {phase,p:sharedReview?(unit.sharedProgress??0):unit.stateElapsed/(phase==='attack_windup'?windupSeconds(unit.kind,unit.chargePending)*attackSpeed:phase==='recover'?familyOf(unit.kind).recovery:defs[unit.kind].attackTime)};
  }
  function keepSharedStrike(unit){const attackSpeed=attackSpeedFor(unit.kind);
    const c=feedback.contact(defs[unit.kind],impactFeel,attackSpeed*timeScale);
    unit.sharedStrike={t:0,hold:c.release+(defs[unit.kind].ranged?0:c.hold),recover:c.recover,dx:unit.attackDirX,dy:unit.attackDirY};
  }
  function reactSharedTarget(source,target){const attackSpeed=attackSpeedFor(source.kind);
    const c=feedback.contact(defs[source.kind],impactFeel,attackSpeed*timeScale),pose=sharedLogicalPose(target);
    target.sharedReaction={t:0,dx:target.x-source.x,dy:target.y-source.y,hold:c.hold,strength:c.strength,duration:.16+c.recover,pose};
    board.dataset.lastImpactKind=source.kind;board.dataset.lastHitStopMs=String(Math.round(c.hold*1000));board.dataset.hitStopScope='attackerAndTargetVisualOnly';
    if(!defs[source.kind].ranged)keepSharedStrike(source);
  }
  function renderSharedVisual(unit,dt=0){const attackSpeed=attackSpeedFor(unit.kind);
    let {phase,p}=sharedLogicalPose(unit),dx=unit.attackDirX,dy=unit.attackDirY;
    if(unit.sharedStrike&&phase==='attack_windup')unit.sharedStrike=null;
    if(unit.chargeRun)unit.sharedStrike=null;
    if(unit.sharedStrike){
      const h=unit.sharedStrike;h.t+=dt;
      // New preparation owns the next attack; a previous recovery never hides it.
      if(h.t>=h.hold+h.recover||(phase==='attack_windup'&&h.t>=h.hold))unit.sharedStrike=null;
      else {phase=h.t<h.hold?'attack':'recover';p=h.t<h.hold?({blade_slash:.62,spear_thrust:.65,shield_short_strike:.48,bow_shot:.32,mounted_contact:.65,siege_projectile:.32,cast_projectile:.55}[familyOf(unit.kind).id]):(h.t-h.hold)/h.recover;dx=h.dx;dy=h.dy;}
    }
    let r={x:0,y:0,angle:0,scale:1};
    if(unit.sharedReaction){
      const h=unit.sharedReaction;h.t+=dt;
      if(h.t<h.hold){phase=h.pose.phase;p=h.pose.p;}
      const progress=Math.min(1,h.t/(h.hold+h.duration));
      r=sharedMotion.reaction(unit.kind,progress,h.dx,h.dy);r.x*=h.strength;r.y*=h.strength;r.angle*=h.strength;r.scale=1+(r.scale-1)*h.strength;
      if(h.t>=h.hold+h.duration)unit.sharedReaction=null;
    }
    let m;
    if(unit.chargeFlight){
      // Airborne presentation already replaces every body transform and raster
      // pose. Evaluate that exact final pose directly, retaining the timers above.
      const h=unit.chargeFlight,s=chargeLaunch.sample(h.t);
      if(defs[unit.kind].giant&&unit.heavyLanding){const landing=unit.heavyLanding;landing.t+=dt;if(landing.t>=landing.duration)unit.heavyLanding=null;}
      m={x:0,y:s.landing*2,angle:h.tilt*s.tilt,scale:idlePoseScale(unit.kind),pose:'idle',phase:({attack_windup:'windup',attack:'release',recover:'recovery'})[phase]||phase};
    }else{
    const raw=sharedMotion.sample(unit.kind,phase,phase==='attack_windup'?window.CombatTiming.progress(familyOf(unit.kind).id,Math.min(1,p)):Math.min(1,p),dx,dy,r),targetMotion=feedback.weighted(raw,defs[unit.kind],phase,p,dx,dy);
    if(defs[unit.kind].giant){
      if(phase==='attack_windup')targetMotion.y-=Math.sin(Math.PI*Math.min(1,p)) * 3.8;
      if(unit.heavyLanding){const h=unit.heavyLanding;h.t+=dt;targetMotion.y+=Math.sin(Math.PI*Math.min(1,h.t/h.duration))*2.8;if(h.t>=h.duration)unit.heavyLanding=null;}
    }else if(cavalryCharge(unit.kind)&&unit.chargePending){
      const pulse=Math.sin(Math.PI*Math.min(1,p));if(phase==='attack_windup'){targetMotion.x-=dx*pulse*4.2;targetMotion.y-=dy*pulse*4.2;targetMotion.y-=pulse*1.8;}
      if(phase==='attack'&&!unit.hitResolved){const age=unit.stateElapsed/attackSpeed;targetMotion.x+=dx*2.8;targetMotion.y+=dy*2.8-Math.abs(Math.sin(age*20))*1.5;targetMotion.angle+=dx*2;}
    }
      m=feedback.present(targetMotion,unit.renderMotion,dt);
    }
    setSharedPose(unit,m.pose);if(unit.el.dataset.pose!==m.pose)unit.el.dataset.pose=m.pose;
    if(crowdCanvasOn()){
      unit.renderMotion=m;const g=unitGeometry(unit);unit.liveFrameSpan=Math.max((presentationFits[unit.sharedArtKey]||presentationFits[unit.kind]).width*g.sizeX,(presentationFits[unit.sharedArtKey]||presentationFits[unit.kind]).height*g.sizeY)*1.10;unit.liveHudY=g.top+g.sizeY*(.5+(((artBounds[unit.sharedArtKey]||artBounds[unit.kind]).idle.centerY??.5)-.5)*m.scale)+m.y*g.sizeX/50;if(phase==="idle")unit.idleHudY=unit.liveHudY;syncTargetEffects(unit);return;
    }
    const visual=troopNodes(unit.el).visual,frame=unitGeometry(unit).sizeX||50,factor=frame/50;
    unit.renderMotion=m;visual.style.transform=`translate(${m.x*factor}px,${m.y*factor}px) rotate(${m.angle}deg) scale(${unit.sharedArtKey?.includes("@")?m.scale:unit.el.classList.contains("face-left")?-m.scale:m.scale},${m.scale})`;
    const g=unitGeometry(unit);
    const envelope=presentationFits[unit.sharedArtKey]||presentationFits[unit.kind];
    if(unit.el.dataset.assemblyFrame==="true"){
      // Center the full assembled silhouette, including rider/mount and equipment.
      // Combat and launch anchors remain independent from this decorative frame.
      const w=envelope.width*g.sizeX,h=envelope.height*g.sizeY;
      // Algebraic local centre avoids subtracting world positions every frame.
      const x=g.left+g.sizeX/2+m.x*g.sizeX/50,y=g.top+g.sizeY*(.5+(((artBounds[unit.sharedArtKey]||artBounds[unit.kind]).idle.centerY??.5)-.5)*m.scale)+m.y*g.sizeX/50;
      const projectedWidth=w,projectedHeight=h;
      const span=Math.max(projectedWidth,projectedHeight)*1.10;
      troopNodes(unit.el).frame.style.setProperty("--live-frame-x",`${x-g.left}px`);
      troopNodes(unit.el).frame.style.setProperty("--live-frame-y",`${y-g.top}px`);
      if(unit.liveFrameSpan!==span){unit.el.style.setProperty("--live-frame-span",`${span}px`);unit.liveFrameSpan=span;}
      
      if(unit.liveHudY!==y){troopNodes(unit.el).hud.style.setProperty("--live-frame-hud-y",`${y}px`);unit.liveHudY=y;}
      // Decorative frame can move in combat; the HUD keeps the idle reference.
      if(phase==="idle"&&unit.idleHudY!==y){troopNodes(unit.el).hud.style.setProperty("--idle-frame-hud-y",`${y}px`);unit.idleHudY=y;}
    }
    syncTargetEffects(unit);
    unit.el.dataset.motionPhase=phase;unit.el.dataset.motionProgress=String(Math.min(1,p).toFixed(3));unit.el.dataset.motionWeight=feedback.weight(defs[unit.kind]);unit.el.dataset.contactHoldMs=String(Math.round((unit.sharedReaction?.hold||0)*1000));
  }
  function crowdDescription(unit,now,mapZoom,bare){
    const g=unitGeometry(unit),scale=g.scale*troopScaleOf(unit.kind),point=unitRenderPoint(unit),foot=groundMetrics(unit),m=unit.renderMotion||sharedMotion.sample(unit.kind,"idle",0,0,1),artKey=unit.sharedArtKey||unit.kind,face=unit.sharedFacing??(!unit.sharedArtKey?.includes("@")&&unit.el.classList.contains("face-left"));
    let cache=unit.crowdGeometry;
    // Body/HUD geometry changes with controls, direction or viewport, never with
    // population. Reuse the exact local geometry and row objects between paints.
    if(!cache||cache.g!==g||cache.scale!==scale||cache.artKey!==artKey||cache.face!==face||cache.mapZoom!==mapZoom||cache.bare!==bare||cache.frameScale!==frameScale||cache.otherFrameScale!==otherFrameScale||cache.bareHudScale!==bareHudScale||cache.bareHudGap!==bareHudGap){
      const head=headFrameFits[artKey]||headFrameFits[unit.kind],assembly=troopCatOf(unit.kind)!=="normal",pixel=1/(scale*mapZoom),idle=(artBounds[artKey]||artBounds[unit.kind]).idle,idleScale=idlePoseScale(unit.kind),fit=presentationFits[artKey]||presentationFits[unit.kind];
      const span=Math.max(fit.width*g.sizeX,fit.height*g.sizeY)*1.10;
      const bodyY=g.top+g.sizeY*(.5+((idle.centerY??.5)-.5+((machineKinds.has(unit.kind)||unit.kind==="c_shu_kongming"?0:idle.head[1])-.5)*idle.height)*idleScale);
      const width=(g.sizeX*idle.width*idleScale*(bare?(bareHudScale+Math.min(1,bareHudScale))/2:1)-6*pixel)*HUD_HEALTH_WIDTH_SCALE;
      const hud={x:g.left+g.sizeX*(assembly?.5:((face?1-head.x:head.x)+.5)/2)-width/2+2.75*pixel,y:0,width,pixel};
      const row={id:unit.id,kind:artKey,team:unit.team,x:0,y:0,scale,g,m,face,hud,frame:{x:0,y:0,size:1.28*(assembly?span*otherFrameScale:g.sizeX*head.size*frameScale)},hpDisplay:1,shadow:{x:0,y:0,halfX:foot.halfX,halfY:foot.halfY,opacity:.44,scale:1},order:0};
      cache=unit.crowdGeometry={g,scale,artKey,face,mapZoom,bare,frameScale,otherFrameScale,bareHudScale,bareHudGap,head,assembly,pixel,idle,span,bodyY,row};
    }
    const {head,assembly,pixel,idle,span,bodyY,row}=cache;
    const frameY=assembly?(unit.idleHudY??unit.liveHudY??g.top+g.sizeY/2)-span*otherFrameScale/2:g.top+g.sizeY*head.y-g.sizeY*head.size*frameScale/2;
    row.hud.y=(bare?bodyY:(Math.min(bodyY,frameY)+bodyY)/2)-(bare?bareHudGap+.5:3.5)*pixel-6*pixel;
    const hp=Math.max(0,unit.hp/unit.maxHp);if(unit.canvasHpTarget!==hp){unit.canvasHpFrom=unit.canvasHpDisplay??1;unit.canvasHpTarget=hp;unit.canvasHpAt=now;}
    unit.canvasHpDisplay=unit.canvasHpFrom+(hp-unit.canvasHpFrom)*Math.min(1,(now-unit.canvasHpAt)/160);
    row.frame.x=assembly?g.left+g.sizeX/2+m.x*g.sizeX/50:g.left+g.sizeX*(face?1-head.x:head.x);
    row.frame.y=assembly?g.top+g.sizeY*(.5+((idle.centerY??.5)-.5)*m.scale)+m.y*g.sizeX/50:g.top+g.sizeY*head.y;
    const lift=presentationLift(unit),air=Math.min(1,lift/8);
    row.x=point.x;row.y=point.y-foot.offsetY-lift;row.m=m;row.hpDisplay=unit.canvasHpDisplay;row.shadow.x=point.x;row.shadow.y=point.y;row.shadow.halfX=foot.halfX;row.shadow.halfY=foot.halfY;row.shadow.opacity=.44-air*.16;row.shadow.scale=1-air*.16;row.order=(unit.chargeFlight?260:20)+Math.round(unit.y*10);return row;
  }
  // Size backing surfaces to the visible field, not the entire offscreen forest.
  // Layout is read only after a view change; scrolling invalidates the same cache.
  function paintViewport(){
    if(canvasViewport)return canvasViewport;
    const f=field.getBoundingClientRect(),b=board.getBoundingClientRect(),zoom=b.width/board.offsetWidth||1;
    const left=Math.floor((Math.max(0,f.left)-b.left)/zoom)-16,top=Math.floor((Math.max(0,f.top)-b.top)/zoom)-16;
    canvasViewport={left,top,width:Math.ceil((Math.min(innerWidth,f.right)-Math.max(0,f.left))/zoom)+32,height:Math.ceil((Math.min(innerHeight,f.bottom)-Math.max(0,f.top))/zoom)+32};
    return canvasViewport;
  }
  function drawCrowdCanvas(){
    const on=crowdCanvasOn();if(!on){crowdPainter?.show(false);numberPainter?.show(false);for(const n of sharedNumbers){n.el.style.translate=`${Math.trunc(n.el.sharedX*64)/64}px ${Math.trunc(n.el.sharedY*64)/64}px`;n.el.style.opacity=String(n.opacity??1);n.el.style.transform=`translate(-50%,calc(-50% - ${n.rise||0}px))`;}return;}
    if(!crowdPainter)crowdPainter=crowdResources.create(board);crowdPainter.show(true);
    const zoom=Number(board.style.getPropertyValue("--world-map-scale"))||1,hudZoom=Number(board.style.getPropertyValue("--hud-map-scale"))||1,now=performance.now(),bare=document.body.classList.contains("frames-hidden"),rows=units.filter(u=>u.alive||u.chargeFlight).map(u=>crowdDescription(u,now,hudZoom,bare));rows.sort((a,b)=>a.order-b.order);
    crowdFont??=getComputedStyle(document.body).fontFamily;
    crowdPainter.draw(rows,{...paintViewport(),dpr:Math.min(2,devicePixelRatio||1)*zoom,brightness:frameBrightness,drawFrames:false,teamOutline:framesVisible,fontFamily:crowdFont});
    numberPainter??=window.DamageCanvas.create(board);numberPainter.show(true);numberPaintView={...paintViewport(),dpr:Math.min(2,devicePixelRatio||1)*zoom};
    // Layout slots are queued on hits; paint after that same microtask batch.
    if(!numberPaintQueued){numberPaintQueued=true;queueMicrotask(()=>{numberPaintQueued=false;if(crowdCanvasOn())numberPainter.draw(sharedNumbers,numberPaintView);});}
  }
  function drawChargeFeedback(dt=0){
    if(!sharedOn)return;
    const rows=[];
    for(const u of units){
      if(!u.alive||!u.chargePending||!cavalryCharge(u.kind))continue;
      const phase=sharedReview?u.sharedRenderPhase:u.state;
      if(phase!=='attack_windup'&&(phase!=='attack'||u.hitResolved))continue;
      const a=unitRenderPoint(u),b=unitRenderPoint({x:u.x+u.attackDirX,y:u.y+u.attackDirY}),length=Math.hypot(b.x-a.x,b.y-a.y)||1,g=unitGeometry(u);
      rows.push({id:u.id,x:a.x,y:a.y,nx:(b.x-a.x)/length,ny:(b.y-a.y)/length,span:Math.max(18,g.sizeX*g.scale*troopScaleOf(u.kind)*.55),phase,p:sharedLogicalPose(u).p});
    }
    if(!chargePainter&&!rows.length)return;
    chargePainter??=window.ChargeFeedback.create(board);
    const zoom=Number(board.style.getPropertyValue('--world-map-scale'))||1;
    chargePainter.draw(rows,{...paintViewport(),dpr:Math.min(2,devicePixelRatio||1)*zoom},dt);
  }
  window.__CROWD_RENDER_QA__={get active(){return crowdCanvasOn();},get stats(){return crowdPainter?.stats||{};},get layout(){return crowdPainter?.layout||[];},set enabled(value){crowdCanvasOverride=value;crowdPainter?.show(crowdCanvasOn());for(const u of units)if(u.alive){place(u,true);renderSharedVisual(u);}drawCrowdCanvas();},draw:drawCrowdCanvas};
  function updateLongCharge(unit,dt){const attackSpeed=attackSpeedFor(unit.kind);
    const run=unit.chargeRun;unit.stateElapsed+=dt;
    if(unit.state==='attack_windup'){
      if(unit.stateElapsed>=windupSeconds(unit.kind,true)*attackSpeed)setState(unit,'attack');
      return;
    }
    if(unit.state!=='attack')return;
    const from={x:unit.x,y:unit.y},travel=Math.min(chargeMotion.length-run.distance,chargeMotion.step(unit.stateElapsed/attackSpeed,dt/attackSpeed));
    pushGround(unit,unit.attackDirX*travel,unit.attackDirY*travel);
    const moved=Math.hypot(unit.x-from.x,unit.y-from.y);run.distance+=moved;
    unit.el.dataset.chargeTravel=String(run.distance);board.dataset.longestCharge=String(Math.max(Number(board.dataset.longestCharge||0),run.distance));
    const enemies=units.filter(t=>t.alive&&t.team!==unit.team&&!t.chargeFlight&&!run.hits.has(t.id));
    for(const {target} of chargeMotion.contacts(from,unit,enemies,t=>groundContactReach(unit,t))){
      run.hits.add(target.id);
      const d=defs[unit.kind],raw=d.atk[0]+Math.random()*(d.atk[1]-d.atk[0]);
      deliverMeleeHit(unit,target,damageAmount(unit.kind,raw,true));
    }
    // A bank or map edge ends the dash safely. No return to the take-off position.
    if(run.distance>=chargeMotion.length-1e-5||moved<travel-1e-4){
      unit.el.dataset.chargeHits=String(run.hits.size);unit.chargeRun=null;unit.chargeFinished=true;unit.hitResolved=true;unit.chargePending=false;unit.sharedStrike=null;
      unit.originX=unit.restX=unit.x;unit.originY=unit.restY=unit.y;unit.chargeReadyAt=elapsed+2.8;
      unit.el.classList.remove('charging');setState(unit,'recover');
    }
  }
  function updateSharedUnit(unit,dt){const attackSpeed=attackSpeedFor(unit.kind);
    if(!unit.alive)return;const f=familyOf(unit.kind),d=defs[unit.kind];
    if(unit.heavyRecoil){
      const h=unit.heavyRecoil,old=h.t/h.duration;h.t=Math.min(h.duration,h.t+dt/attackSpeed);
      const p=h.t/h.duration,step=(1-Math.pow(1-p,3))-(1-Math.pow(1-old,3));pushGround(unit,h.dx*step,h.dy*step);
      if(p>=1){unit.heavyRecoil=null;unit.hitTarget=null;setState(unit,'idle');}return;
    }
    if(unit.state==='idle'){updateIdleUnit(unit,dt);return;}
    if(unit.chargeRun){updateLongCharge(unit,dt);return;}
    if(unit.state==='recover'&&unit.chargeFinished){unit.stateElapsed+=dt;if(unit.stateElapsed>=f.recovery){unit.chargeFinished=false;unit.hitTarget=null;setState(unit,'idle');}return;}
    const target=unit.hitTarget;
    if(!target||!target.alive){unit.chargePending=false;unit.hitTarget=null;unit.el.classList.remove("charging");setState(unit,'idle');return;}
    if(!unit.chargePending){
      // Action dt is scaled by attack speed; locomotion remains at its original speed.
      // Heavy siege machines plant for windup/release, and follow during recovery.
      updateCombatMovement(unit,target,dt/attackSpeed,!d.machine||unit.state==='recover');
    }
    unit.stateElapsed+=dt;
    if(unit.state==='attack_windup'&&unit.stateElapsed>=windupSeconds(unit.kind,unit.chargePending)*attackSpeed){setState(unit,'attack');return;}
    if(unit.state==='attack'){
      if(unit.chargePending&&!unit.hitResolved){
        const travel=d.giant?1.85*dt/attackSpeed:chargeMotion.step(unit.stateElapsed/attackSpeed,dt/attackSpeed);
        const next=chargeMotion.sweep(unit,target,travel,units.filter(e=>e.alive&&!e.chargeFlight&&e.team!==unit.team&&!defs[e.kind].air),e=>groundContactReach(unit,e));
        const stopTarget=next.hit;
        if(terrain.segmentClear(unit,next)){unit.x=next.x;unit.y=next.y;clampUnit(unit);place(unit);}
        unit.el.dataset.chargeTravel=String(Math.hypot(unit.x-unit.originX,unit.y-unit.originY));
        const contactNow=Math.hypot(stopTarget.x-unit.x,stopTarget.y-unit.y)<=groundContactReach(unit,stopTarget)+.04;
        if(contactNow){unit.hitTarget=stopTarget;unit.hitResolved=true;unit.stateElapsed=d.attackTime*.68;resolveHit(unit,stopTarget);}
        else if(unit.stateElapsed>1.5*attackSpeed){unit.chargePending=false;setState(unit,'recover');}
        return;
      }
      if(!unit.hitResolved&&unit.stateElapsed>=d.attackTime*(d.ranged?.38:.68)){unit.hitResolved=true;resolveHit(unit,target);}
      if(unit.stateElapsed>=d.attackTime)setState(unit,'recover');
    }else if(unit.state==='recover'&&unit.stateElapsed>=f.recovery){unit.chargePending=false;unit.hitTarget=null;unit.el.classList.remove("charging");setState(unit,'idle');}
  }
  function sharedProjectileAsset(kind){return familyOf(kind).id==='bow_shot'&&kind!=='c_wu_firebow'?(projectileRuntime.b1Shu||projectileAssets.b1Shu):(projectileRuntime[kind]||projectileAssets[kind]);}
  const launchAnchors={c_shu_kongming:[.50,.88],b4_wei:[.28,.30],b4_qun:[.28,.28],b4_shu:[.73,.48],b4_wu:[.80,.46],c_qun_baima:[.64,.27]};
  function artPoint(unit,anchor="body"){
    const g=unitGeometry(unit),parent=g.scale*troopScaleOf(unit.kind),foot=groundMetrics(unit),ground=unitRenderPoint(unit),state=anchor==="hud-head"?"idle":unit.sharedPose||unit.el.dataset.pose||"idle",bounds=(artBounds[unit.sharedArtKey]||artBounds[unit.kind])?.[state]||artBounds[unit.kind]?.idle||{width:.8,height:.8};
    const m=unit.renderMotion||{x:0,y:0,angle:0,scale:.88},mirror=unit.sharedArtKey?.includes("@")?1:unit.el.classList.contains("face-left")?-1:1,head=bounds.head||headFrameBounds[unit.kind]||[.1,0,.9,.8];
    const lift=presentationLift(unit),cached=unit.artPointCache?.[anchor];
    // Volley/impact anchors can be read many times before the next body pose.
    // Cache only while every live geometric input is unchanged.
    if(cached&&cached.g===g&&cached.parent===parent&&cached.ground===ground&&cached.m===unit.renderMotion&&cached.state===state&&cached.artKey===unit.sharedArtKey&&cached.mirror===mirror&&cached.direction===unit.artDirection&&cached.lift===lift)return cached.point;
    const large=defs[unit.kind].charge||defs[unit.kind].machine||defs[unit.kind].air||defs[unit.kind].movingShot;
    const xy=anchor==="assembly-center"?[.5,.5]:anchor==="launch"?(unit.sharedArtKey?.includes("@")?[.5,unit.artDirection==="up"?.20:.74]:(launchAnchors[unit.kind]||[.68,.45])):(anchor==="head"||anchor==="hud-head")?[(head[0]+head[2])/2,head[1]]:anchor==="head-center"?[(head[0]+head[2])/2,(head[1]+head[3])/2]:large?[.5,defs[unit.kind].air?.70:.64]:[(head[0]+head[2])/2,(head[1]+head[3])/2];
    const sourcePoint=newArt&&anchor==="launch"?window.ProjectileAnchorsV053.framePoint(unit.sharedArtKey||unit.kind,frameFits[unit.sharedArtKey||unit.kind]?.attack_windup):null;
    const x=(sourcePoint?sourcePoint.x-.5:(bounds.centerX??.5)-.5+(xy[0]-.5)*bounds.width)*g.sizeX*m.scale*mirror,y=(sourcePoint?sourcePoint.y-.5:(bounds.centerY??.5)-.5+(xy[1]-.5)*bounds.height)*g.sizeY*m.scale,a=m.angle*Math.PI/180;
    const point={x:ground.x+((g.left+g.sizeX/2-g.width/2)+m.x*g.sizeX/50+x*Math.cos(a)-y*Math.sin(a))*parent,y:ground.y-foot.offsetY-lift+((g.top+g.sizeY/2-g.height/2)+m.y*g.sizeX/50+x*Math.sin(a)+y*Math.cos(a))*parent,width:bounds.width*g.sizeX*m.scale*parent,height:bounds.height*g.sizeY*m.scale*parent};
    (unit.artPointCache??={})[anchor]={g,parent,ground,m:unit.renderMotion,state,artKey:unit.sharedArtKey,mirror,direction:unit.artDirection,lift,point};return point;
  }
  function sharedBodyPoint(unit){return artPoint(unit,"body");}
  function launchSharedProjectile(source,target,amount,token){
    const f=familyOf(source.kind),el=document.createElement('span');el.className=`shared-projectile shared-projectile--${source.kind}`;
    el.dataset.sourceKind=source.kind;el.dataset.family=f.id;el.dataset.launchArtKey=source.sharedArtKey||source.kind;
    const fireBow=source.kind==='c_wu_firebow',fire=fireBow&&((source.fireArrowCount=(source.fireArrowCount||0)+1)%3===0);
    el.dataset.fireArrow=String(fire);
    const projectile=fireBow&&!fire?(projectileRuntime.b1Shu||projectileAssets.b1Shu):sharedProjectileAsset(source.kind);
    el.innerHTML=`<img src="${projectile}" alt="">`;board.append(el);
    const frame=frameMetrics(source),start=artPoint(source,"launch"),size=feedback.dimensions(f.id,start.width,artPoint(target).width);
    el.style.width=`${size.projectileWidth}px`;el.style.height=`${size.projectileHeight}px`;
    // The shared arrow raster points slightly upward before CSS rotation.
    // Compensate after display sizing so its shaft follows the flight tangent.
    const nativeAngle=newArt&&f.id==='bow_shot'&&!fire?Math.atan2(-.52*size.projectileHeight,.84*size.projectileWidth)*180/Math.PI:0;
    const flight={source,target,amount,token,el,fire,t:0,duration:f.flight||.32,start,nativeAngle,arc:defs[source.kind].machine&&source.kind!=='b4_wu'?Math.min(32,frame.halfY*.7):defs[source.kind].air?Math.min(28,frame.halfY*.65):0};
    if(heavyCombat.stone(source.kind)){flight.landing={x:target.x,y:target.y};flight.arc=Math.max(48,Math.hypot(unitRenderPoint(target).y-start.y,unitRenderPoint(target).x-start.x)*.32);flight.duration=1.28;el.dataset.groundImpact='true';}
    keepSharedStrike(source);sharedFlights.push(flight);effectCounts.arrow++;renderSharedProjectile(flight);
  }
  function renderSharedProjectile(flight){
    const p=Math.min(1,flight.t/flight.duration),start=flight.start,end=flight.landing?unitRenderPoint(flight.landing):sharedBodyPoint(flight.target),arc=flight.arc;
    const x=start.x+(end.x-start.x)*p,y=start.y+(end.y-start.y)*p-Math.sin(Math.PI*p)*arc;
    const angle=Math.atan2(end.y-start.y-Math.cos(Math.PI*p)*Math.PI*arc,end.x-start.x)*180/Math.PI;
    if(!flight.launchDiagnostic){flight.launchDiagnostic=true;flight.el.dataset.launchX=start.x.toFixed(2);flight.el.dataset.launchY=start.y.toFixed(2);}
    positionSharedEffect(flight.el,x,y);flight.el.style.transform=`translate(-50%,-50%) rotate(${angle-(flight.nativeAngle||0)}deg)`;flight.el.dataset.trajectoryAngle=angle.toFixed(3);flight.el.dataset.progress=p.toFixed(3);flight.el.dataset.targetX=end.x.toFixed(2);flight.el.dataset.targetY=end.y.toFixed(2);
  }
  function tickSharedFlights(dt){
    const count=sharedFlights.length;let write=0;
    for(let i=0;i<count;i++){const flight=sharedFlights[i];flight.t+=dt;renderSharedProjectile(flight);if(flight.t>=flight.duration){flight.el.remove();if(flight.token===battleToken){if(flight.landing)resolveGroundArea(flight.source,flight.landing,heavyCombat.blastRadius,flight.amount,"blast");else {if(flight.source.alive&&flight.target.alive)applyHit(flight.source,flight.target,flight.amount);if(flight.fire)showFireField({x:flight.target.x,y:flight.target.y});}}}else sharedFlights[write++]=flight;}
    for(let i=count;i<sharedFlights.length;i++)sharedFlights[write++]=sharedFlights[i];sharedFlights.length=write;
  }
  function showSharedEffect(source,target){const attackSpeed=attackSpeedFor(source.kind);
    const f=familyOf(source.kind),previous=target.sharedImpact,old=previous?.el.isConnected?previous:null,life=feedback.lifetimes(attackSpeed*timeScale).impact;
    if(old&&old.t<life*.65){old.el.dataset.contacts=String(Number(old.el.dataset.contacts||1)+1);effectCounts.sameTargetDedup++;return;}
    if(old){old.el.remove();sharedImpacts.splice(sharedImpacts.indexOf(old),1);}
    const el=document.createElement('span'),frame=frameMetrics(target),size=feedback.dimensions(f.id,artPoint(source).width,artPoint(target).width),angle=Math.atan2(target.y-source.y,target.x-source.x)*180/Math.PI;
    el.className=`shared-impact shared-impact--${f.id}`;el.dataset.family=f.id;el.dataset.contacts='1';
    el.innerHTML=`<img src="${effectRuntime[f.effectKind]||effectAssets[f.effectKind]}" alt="">`;
    el.style.width=el.style.height=`${size.impact}px`;el.style.setProperty('--shared-impact-angle',`${angle}deg`);board.append(el);el.artAnchor="body";el.dataset.artAnchor="body";anchorEffect(el,target,1,0,0);if(source.chargePending){el.classList.add("charge-contact");el.dataset.charge="true";board.dataset.lastChargeContact=source.kind;}
    const frozen=sharedReview&&sharedPhase==='hit';if(frozen)el.classList.add('shared-impact-frozen');const impact={el,target,t:0,life,frozen};target.sharedImpact=impact;sharedImpacts.push(impact);effectCounts[source.kind]++;
  }
  function showSharedDamage(target,amount,source){const attackSpeed=attackSpeedFor(source.kind);
    reactSharedTarget(source,target);
    // At most two numbers belong to a target; avoid scanning every other
    // actor's numbers for each contact in an area hit. Disconnected entries
    // expire lazily, including scene / review resets.
    const timing=feedback.lifetimes(attackSpeed*timeScale),active=(target.sharedDamageNumbers||[]).filter(n=>n.el.isConnected),last=active.at(-1);target.sharedDamageNumbers=active;
    if(last&&last.t<=timing.merge){last.amount+=amount;last.count++;last.el.textContent=`-${last.amount}`;last.el.dataset.hitCount=String(last.count);last.el.setAttribute('aria-label',`${last.count}次伤害合计${last.amount}`);queueDamageLayout(target);return;}
    while(active.length>=2){const old=active.shift();old.el.remove();sharedNumbers.splice(sharedNumbers.indexOf(old),1);}
    const el=document.createElement('span');el.className=`damage shared-damage damage--${source.kind}`;el.textContent=`-${amount}`;el.dataset.hitCount='1';
    const used=new Set(active.map(n=>Number(n.el.dataset.damageSlot)));el.dataset.damageSlot=String(used.has(0)?1:0);board.append(el);anchorEffect(el,target,1,0,0);queueDamageLayout(target);
    el.batchedNumber=true;const number={el,target,t:0,life:timing.number,amount,count:1};active.push(number);sharedNumbers.push(number);
  }
  function removeGroundBurst(b){b.animations?.forEach(a=>a.cancel());b.dust.remove();b.el.remove();}
  function showGroundBurst(centre,radius,type){
    while(groundBursts.length>=heavyCombat.effectLimit){removeGroundBurst(groundBursts.shift());}
    const el=document.createElement('span');el.className=`ground-burst ground-burst--${type}`;el.setAttribute('aria-hidden','true');
    const dust=document.createElement('span');dust.className=`earth-dust-plane earth-dust-plane--${type}`;dust.setAttribute('aria-hidden','true');
    el.innerHTML=Array.from({length:3},()=>'<i class="ground-debris"></i>').join('');
    const b={el,dust,centre:{...centre},radius,type,t:0,life:type==='blast'?.48:type==='stomp'?.55:type==='charge'?.38:.32};groundBursts.push(b);board.append(dust,el);renderGroundBurst(b);
  }
  function renderGroundBurst(b){
    const point=unitRenderPoint(b.centre),edgeX=unitRenderPoint({x:b.centre.x+b.radius,y:b.centre.y}),edgeY=unitRenderPoint({x:b.centre.x,y:b.centre.y+b.radius}),p=b.t/b.life;
    const width=Math.abs(edgeX.x-point.x)*2,height=Math.abs(edgeY.y-point.y)*2,angle=b.el.style.getPropertyValue('--charge-angle')||'0deg',geometryKey=[point.x,point.y,width,height,angle].join(":");
    if(b.geometryKey!==geometryKey){
      b.geometryKey=geometryKey;
      for(const layer of [b.el,b.dust]){layer.style.left=`${point.x}px`;layer.style.top=`${point.y}px`;layer.style.width=`${width}px`;layer.style.height=`${height}px`;}
      b.animations?.forEach(a=>a.cancel());
      // One shared raster gives the pressure front a broken, painted edge.
      // Only transform/opacity advance with the battle clock; geometry is cached.
      const options={duration:b.life*1000,fill:'both'},animations=[];
      const animate=(el,frames)=>{const a=el.animate(frames,options);a.pause();animations.push(a);};
      const directed=b.type==='charge'||b.type==='block',rotation=directed?angle:'0deg',flat=directed?.46:b.type==='stomp'?.82:1;
      const dustTransform=(s,shift=0)=>`translate(-50%,-50%) rotate(${rotation}) translateX(${shift*width}px) scale(${s},${s*flat})`;
      animate(b.dust,[{offset:0,transform:dustTransform(.18),opacity:0},{offset:.12,transform:dustTransform(.58,directed?.05:0),opacity:b.type==='stomp'?.6:.72},{offset:.4,transform:dustTransform(1.02,directed?.1:0),opacity:.52},{offset:.7,transform:dustTransform(1.08,directed?.14:0),opacity:.22},{offset:1,transform:dustTransform(1.12,directed?.16:0),opacity:0}]);
      const radians=parseFloat(angle)*Math.PI/180;
      for(const [i,chip] of [...b.el.querySelectorAll('.ground-debris')].entries()){
        const a=directed?radians+(i-1)*.65:(i*120+15)*Math.PI/180,reach=.34+(i%3)*.055,dx=Math.cos(a)*width*reach,dy=Math.sin(a)*height*reach,lift=height*(b.type==='stomp'?.10:.20);
        const pose=(x,y,r)=>`translate(${x}px,${y}px) rotate(${r}deg)`;
        animate(chip,[{offset:0,transform:pose(dx*.13,dy*.13,i*23),opacity:0},{offset:.08,transform:pose(dx*.22,dy*.22-lift*.35,i*23+10),opacity:1},{offset:.44,transform:pose(dx*.65,dy*.65-lift,i*23+65),opacity:.95},{offset:1,transform:pose(dx,dy,i*23+145),opacity:0}]);
      }
      animate(b.el,[{offset:0,opacity:1},{offset:.65,opacity:1},{offset:1,opacity:0}]);
      b.animations=animations;
    }
    for(const a of b.animations)a.currentTime=Math.min(1,p)*b.life*1000;
    b.el.dataset.progress=p.toFixed(3);b.el.dataset.radius=String(b.radius);
  }
  // Visual fire is independent of unit poses and damage balance. Refresh nearby
  // patches rather than allocating a particle system for every overlapping hit.
  function clearFireFields(){for(const f of fireFields)f.el.remove();fireFields=[];}
  function showFireField(centre){
    const old=fireFields.find(f=>Math.hypot(f.centre.x-centre.x,f.centre.y-centre.y)<.45);
    if(old){old.t=0;old.el.dataset.contacts=String(Number(old.el.dataset.contacts)+1);renderFireField(old);return;}
    if(fireFields.length>=32){fireFields[0].el.remove();fireFields.shift();}
    const el=document.createElement('span');el.className='fire-field';el.setAttribute('aria-hidden','true');el.dataset.contacts='1';
    el.innerHTML=`<img class="fire-field-flames" src="${effectRuntime.fireField}" alt=""><img class="fire-field-burst" src="${effectRuntime.fireBurst}" alt="">`;
    const f={el,flames:el.firstElementChild,burst:el.lastElementChild,centre:{...centre},t:0,life:4,phase:fireFields.length*1.7};board.append(el);fireFields.push(f);renderFireField(f);
  }
  function renderFireField(f){
    const point=unitRenderPoint(f.centre),edge=unitRenderPoint({x:f.centre.x+1.5,y:f.centre.y}),width=Math.abs(edge.x-point.x)*2;
    const key=[point.x,point.y,width].join(':');if(f.geometryKey!==key){f.geometryKey=key;positionSharedEffect(f.el,point.x,point.y);f.el.style.width=`${width}px`;f.el.style.height=`${width*.76}px`;}
    const fade=Math.min(1,f.t/.12,(f.life-f.t)/.55),pulse=Math.sin(f.t*15+f.phase);
    f.flames.style.transform=`translate(-50%,-70%) scale(${.96+pulse*.035},${.90+Math.sin(f.t*19+f.phase)*.07})`;
    f.flames.style.opacity=String(Math.max(0,fade)*(.82+pulse*.08));
    const p=Math.min(1,f.t/.4);f.burst.style.transform=`translate(-50%,-65%) scale(${.35+p*.5})`;f.burst.style.opacity=String(Math.max(0,1-p)*.95);
    f.el.dataset.age=f.t.toFixed(3);
  }
  function tickFireFeedback(dt){for(let i=fireFields.length-1;i>=0;i--){const f=fireFields[i];f.t+=dt;if(f.t>=f.life){f.el.remove();fireFields.splice(i,1);}else renderFireField(f);}}
  function tickSharedFeedback(dt){
    tickAreaFeedback(dt);
    let burstWrite=0;for(let i=0;i<groundBursts.length;i++){const b=groundBursts[i];b.t+=dt;if(b.t>=b.life)removeGroundBurst(b);else{renderGroundBurst(b);groundBursts[burstWrite++]=b;}}groundBursts.length=burstWrite;

    // Stable compaction preserves effect order and exact lifetimes, without
    // searching / shifting the remaining array for every expired contact.
    let impactWrite=0;
    for(let i=0;i<sharedImpacts.length;i++){
      const h=sharedImpacts[i];
      if(!h.el.isConnected||!h.target.alive||(!h.frozen&&(h.t+=dt)>=h.life)){h.el.remove();continue;}
      if(!h.frozen){const p=h.t/h.life;h.el.style.opacity=String(Math.min(1,(1-p)*1.8));h.el.style.scale=String(.85+.2*p);}
      sharedImpacts[impactWrite++]=h;
    }
    sharedImpacts.length=impactWrite;let numberWrite=0;
    for(let i=0;i<sharedNumbers.length;i++){
      const n=sharedNumbers[i];
      if(!n.el.isConnected||(!n.target.alive)||(n.t+=dt)>=n.life){n.el.remove();continue;}
      const p=n.t/n.life;n.opacity=p<.55?1:(1-p)/.45;n.rise=Math.round(p*15);if(!crowdCanvasOn()){n.el.style.opacity=String(n.opacity);n.el.style.transform=`translate(-50%,calc(-50% - ${Math.round(p*15)}px))`;}
      sharedNumbers[numberWrite++]=n;
    }
    sharedNumbers.length=numberWrite;
  }
  function syncSharedControls(){if(!motionDeck)return;if(!sharedReview)motionLabel.textContent=batches[activeBatch].barracks?"双方各22营 · 每营5秒1兵 · 留通道覆盖39兵种":batches[activeBatch].mixedCount?`${batches[activeBatch].mixedCount*2}人会战 · 蓝${batches[activeBatch].mixedCount} 对 红${batches[activeBatch].mixedCount} · 原尺寸与动作`:'全军会战 · 39 种共用七类动作';motionMode.textContent=sharedReview?'看全军会战':'七类动作预览';motionPlay.textContent=running?'暂停':'继续';motionSpeed.textContent=timeScale===.5?'恢复1×':'慢速0.5×';phaseSelect.disabled=!sharedReview;pauseButton.textContent=panelPause.textContent=running?'暂停':'继续';panelSpeed.textContent=timeScale===.5?'恢复1×':'0.5×';panelBatch.value=activeBatch;}
  function cavalryCharge(kind){return horseKinds.has(kind)&&Boolean(defs[kind].charge);}
  function startSharedReview(kind){
    sharedKind=kind;reviewMode=false;activeBatch='allBattle';lanes=buildLanes(activeBatch);reset();sharedReview=true;sharedClock=0;sharedCycle=-1;sharedPhase='loop';sharedHits=0;
    clearBattleUnits();sharedFlights=[];
    const previewX=terrain.banks.previewX;
    const red=makeUnit(kind,'red',previewX,terrain.banks.centre-1),blue=makeUnit(kind,'blue',previewX,terrain.banks.centre+1);
    // Match the real pursuit stop for each ranged kind; melee staging is unchanged.
    const dist=defs[kind].charge?2:defs[kind].ranged?combatStandDistance(blue,red):contactReach(blue,red)+.015;
    for(const [u,y] of [[red,terrain.banks.centre-dist/2],[blue,terrain.banks.centre+dist/2]]){const point=terrain.nearest({x:previewX,y});u.x=u.originX=u.restX=u.terrainX=point.x;u.y=u.originY=u.restY=u.terrainY=point.y;u.el.classList.remove('face-left');u.attackDirX=0;u.attackDirY=u.team==='blue'?-1:1;place(u);}
    board.classList.add('shared-review-board');field.classList.remove('free-battle-field');field.scrollTop=field.scrollLeft=0;
    familySelect.value=familyOf(kind).id;fillSharedMembers(kind);phaseSelect.value='loop';reviewButton.classList.remove('on');
    statusText.textContent='双桥地图动作预览 · 双方交替攻击，血量累计';battleState.textContent=`${familyOf(kind).label} · ${defs[kind].name}`;
    syncSharedControls();tickSharedReview(0);for(const u of units)renderSharedVisual(u);applyView();centerSharedPreview();
  }
  function centerSharedPreview(){
    if(!sharedReview||!units.length)return;
    const fieldBox=field.getBoundingClientRect(),rects=units.map(u=>u.el.getBoundingClientRect());
    const mid=rects.reduce((sum,r)=>sum+r.top+r.height/2,0)/rects.length;
    field.scrollTop=Math.max(0,field.scrollTop+mid-fieldBox.top-fieldBox.height*.5);
  }
  // The review moves the same ground anchor as combat; only its reset is staged.
  function positionChargeReview(source,target,phase,p){
    for(const u of units){u.x=u.originX;u.y=u.originY;u.chargePending=false;u.heavyRecoil=null;}
    if(!defs[source.kind].charge)return;
    source.chargePending=true;
    const from={x:source.originX,y:source.originY},to={x:target.originX,y:target.originY};
    const end=chargeMotion.sweep(from,target,99,[target],e=>groundContactReach(source,e));
    const amount=phase==='attack'?chargeMotion.progress(p):phase==='recover'?1-chargeMotion.progress(p):0;
    source.x=from.x+(end.x-from.x)*amount;source.y=from.y+(end.y-from.y)*amount;
    source.el.dataset.chargeTravel=String(Math.hypot(source.x-from.x,source.y-from.y));
    for(const u of units)place(u);
  }
  function tickSharedReview(dt){const attackSpeed=attackSpeedFor(sharedKind);
    if(sharedPhase!=='loop')return;
    sharedClock+=dt;const f=familyOf(sharedKind),charging=Boolean(defs[sharedKind].charge),flightTime=heavyCombat.stone(sharedKind)?1.28:(f.flight||0),windup=windupSeconds(sharedKind,charging),strike=charging?.48/Math.sqrt(attackSpeed):f.release/attackSpeed,recovery=charging?.65/Math.sqrt(attackSpeed):f.recovery/attackSpeed,cycleDuration=Math.max((.4+.5)/attackSpeed+windup+strike+flightTime+recovery,heavyCombat.stone(sharedKind)?windup+strike+recovery+defs[sharedKind].interval/attackSpeed:0),cycle=Math.floor(sharedClock/cycleDuration),t=sharedClock%cycleDuration;
    const source=units.find(u=>u.team===(cycle%2?'red':'blue')),target=units.find(u=>u!==source);
    if(cycle!==sharedCycle){
      // Preserve both sides' damage across turns. Restart the health demo only
      // after a complete exchange with both units at the nonlethal review floor.
      const resetHealth=sharedCycle<0||(cycle%2===0&&units.every(u=>u.hp<=u.maxHp*.25));
      sharedCycle=cycle;
      for(const u of units){if(resetHealth)u.hp=u.maxHp;u.sharedReaction=null;u.sharedStrike=null;u.heavyRecoil=null;place(u);}
      source.hitResolved=false;sharedFlights.forEach(f=>f.el.remove());sharedFlights=[];
    }
    const wind=.4/attackSpeed,release=wind+windup,arrival=release+strike+flightTime,finish=arrival+recovery;
    let phase='idle',p=0;if(t>=wind&&t<release){phase='attack_windup';p=(t-wind)/windup;}else if(t>=release&&t<arrival){phase='attack';p=Math.min(1,(t-release)/strike);}else if(t>=arrival&&t<finish){phase='recover';p=(t-arrival)/recovery;}
    if(charging)positionChargeReview(source,target,phase,p);
    for(const u of units){u.sharedRenderPhase=u===source?phase:'idle';u.sharedProgress=u===source?p:0;u.state=u===source?phase:'idle';}
    if(!source.hitResolved&&t>=(charging?arrival:release+strike*(defs[source.kind].ranged?.38:.68))){source.hitResolved=true;const amount=damageAmount(source.kind,(defs[source.kind].atk[0]+defs[source.kind].atk[1])/2,charging);if(defs[source.kind].ranged)launchSharedProjectile(source,target,amount,battleToken);else deliverMeleeHit(source,target,amount);}
    modeState.textContent=`${source.team==='blue'?'蓝方':'红方'} · ${phase==='attack_windup'?'蓄力':phase==='attack'?(charging?'加速冲刺':defs[source.kind].ranged?'出手与飞行':'接触'):phase==='recover'?'收回':'待机'}`;
  }
  function syncSharedPhaseLabel(){motionLabel.textContent=sharedPhase==='loop'?`${familyOf(sharedKind).label} · ${defs[sharedKind].name} · ${modeState.textContent}`:`${defs[sharedKind].name} · ${phaseSelect.selectedOptions[0].textContent}`;}
  function fillSharedMembers(kind){memberSelect.innerHTML='';const id=familyOf(kind).id;for(const key of Object.keys(defs).filter(k=>familyOf(k).id===id)){const o=document.createElement('option');o.value=key;o.textContent=defs[key].name;memberSelect.append(o);}memberSelect.value=kind;}
  function toggleSharedPlayback(){running=!running;pauseButton.textContent=running?'暂停':'继续';updateHud();syncSharedControls();}
  function showSharedPhase(value){
    clearFireFields();sharedPhase=value;if(value==='loop'){groundBursts.forEach(removeGroundBurst);groundBursts=[];chargePainter?.clear();board.querySelectorAll('.ground-burst,.shared-impact,.shared-projectile,.damage').forEach(el=>el.remove());sharedFlights=[];for(const u of units){u.sharedReaction=null;u.sharedStrike=null;}sharedImpacts=[];sharedNumbers=[];running=true;sharedClock=0;sharedCycle=-1;syncSharedControls();return;}
    running=false;chargePainter?.clear();groundBursts.forEach(removeGroundBurst);groundBursts=[];sharedImpacts=[];sharedNumbers=[];sharedFlights.forEach(f=>f.el.remove());sharedFlights=[];board.querySelectorAll('.shared-impact,.damage').forEach(el=>el.remove());
    const source=units.find(u=>u.team==='blue'),target=units.find(u=>u.team==='red');
    const phase=value==='hit'?'attack':value;positionChargeReview(source,target,phase,value==='hit'?1:value==='attack'?.65:value==='recover'?.65:0);for(const u of units){u.sharedReaction=null;u.sharedStrike=null;u.sharedRenderPhase=u===source?phase:'idle';u.sharedProgress=u===source?((value==='attack'||value==='hit')?{blade_slash:.62,spear_thrust:.65,shield_short_strike:.48,bow_shot:.32,mounted_contact:.65,siege_projectile:.32,cast_projectile:.55}[familyOf(u.kind).id]:value==='recover'?.65:value==='attack_windup'?.8:0):0;renderSharedVisual(u);}
    if(value==='attack'&&defs[source.kind].ranged){launchSharedProjectile(source,target,0,battleToken);sharedFlights[0].t=sharedFlights[0].duration*.5;renderSharedProjectile(sharedFlights[0]);}
    if(value==='hit'){showSharedEffect(source,target);reactSharedTarget(source,target);const h=target.sharedReaction;h.t=(h.hold+h.duration)*.28;renderSharedVisual(target);renderSharedVisual(source);}
    syncSharedControls();syncSharedPhaseLabel();
  }
  if(sharedOn){
    document.title=batches[activeBatch].barracks?'44营通道出兵 · 兵营阻挡 v082':batches[activeBatch].mixedCount?`${batches[activeBatch].mixedCount*2}人会战 · 压力测试 v066`:'会战预览 v066';document.getElementById('panelHeading').innerHTML='会战压力测试 <i>v066</i>';panelReview.textContent='七类动作预览';
    motionDeck=document.createElement('section');motionDeck.id='motionDeck';motionDeck.setAttribute('aria-label','七类动作预览');
    motionDeck.innerHTML='<div class="motion-selectors"><select id="motionFamily" aria-label="动作类别"></select><select id="motionMember" aria-label="同类兵种"></select><select id="motionPhase" aria-label="动作阶段"><option value="loop">连续播放</option><option value="idle">待机</option><option value="attack_windup">蓄力</option><option value="attack">出手</option><option value="hit">命中受击</option><option value="recover">收回</option></select></div><div class="motion-buttons"><button id="motionPlay">暂停</button><button id="motionSpeed">慢速0.5×</button><button id="motionMode">看全军会战</button></div><p id="motionLabel">七类基础动作</p>';
    document.getElementById('app').append(motionDeck);
    familySelect=document.getElementById('motionFamily');memberSelect=document.getElementById('motionMember');phaseSelect=document.getElementById('motionPhase');motionPlay=document.getElementById('motionPlay');motionSpeed=document.getElementById('motionSpeed');motionMode=document.getElementById('motionMode');motionLabel=document.getElementById('motionLabel');
    for(const f of sharedMotion.families){const o=document.createElement('option');o.value=f.id;o.textContent=f.label;familySelect.append(o);}
    familySelect.value=familyOf(sharedKind).id;fillSharedMembers(sharedKind);
    familySelect.onchange=()=>startSharedReview(sharedMotion.families.find(f=>f.id===familySelect.value).representative);
    memberSelect.onchange=()=>startSharedReview(memberSelect.value);phaseSelect.onchange=()=>showSharedPhase(phaseSelect.value);
    motionPlay.onclick=()=>{if(sharedReview&&sharedPhase!=='loop'){phaseSelect.value='loop';showSharedPhase('loop');return;}toggleSharedPlayback();};
    motionSpeed.onclick=()=>{timeScale=timeScale===.5?1:.5;syncSharedControls();};
    panelTimeScale.addEventListener('input',syncSharedControls);
    motionMode.onclick=()=>{if(sharedReview){sharedReview=false;board.classList.remove('shared-review-board');activeBatch='allBattle';lanes=buildLanes(activeBatch);reset();applyView();motionLabel.textContent='全军会战 · 39 种共用七类动作';}else startSharedReview(sharedKind);syncSharedControls();};
    window.__SHARED_MOTION_QA__={version:'cavalry-charge-v033',families:sharedMotion.families,roster:sharedMotion.roster,get geometry(){return units.filter(u=>u.alive).map(u=>({id:u.id,kind:u.kind,body:artPoint(u),launch:artPoint(u,"launch"),head:artPoint(u,"head"),range:opponent(u)?reach(u,opponent(u)):0}))},get preview(){return sharedReview},get hits(){return sharedHits},get time(){return sharedClock},get flights(){return sharedFlights.map(f=>({kind:f.source.kind,t:f.t,duration:f.duration}))}};
  }

  const artSelect=document.getElementById("artSource");
  artSelect.value=newArt?"approved":"original";
  artSelect.onchange=()=>{const url=new URL(location.href);url.searchParams.set("art",artSelect.value);url.searchParams.set("batch",activeBatch);location.href=url.href};
  const inspectSelect=document.getElementById("inspectApproved");
  for(const [kind,entry] of Object.entries(approvedPack)){const option=document.createElement("option");option.value=kind;option.textContent=entry.name;inspectSelect.append(option)}
  inspectSelect.onchange=()=>{const kind=inspectSelect.value;if(!approvedPack[kind])return;if(sharedOn){startSharedReview(kind);closeMobilePanel();return;}panelCustomKind.value=kind;activeBatch=`approved_${kind}`;lanes=buildLanes(activeBatch);reviewMode=false;reviewButton.classList.remove("on");reset();syncBatchUI();applyView();reviewButton.click()};
  const ratesPage=document.getElementById('troopRatesPage'),ratesList=document.getElementById('troopRatesList');
  const rateRows=new Map(),rateCountries={wei:'魏',shu:'蜀',wu:'吴',qun:'群雄',huangjin:'黄巾',common:'通用'};
  const rateGroups=[
    {id:'common',label:'通用',hint:'刀兵和枪兵两种基础兵种'},
    {id:'composite',label:'复合',hint:'刀盾、长戟和复合弓兵'},
    {id:'special',label:'特殊',hint:'各国弓手、盾兵、医士及特种兵'},
    {id:'cavalry',label:'骑兵',hint:'冲锋骑兵和骑射单位'},
    {id:'elephant',label:'大象',hint:'象兵与践踏单位'},
    {id:'machine',label:'器械',hint:'投石车、弩车和旋刃车'}
  ];
  function rateGroupOf(kind){
    if(horseKinds.has(kind))return 'cavalry';
    if(defs[kind].giant)return 'elephant';
    if(machineKinds.has(kind))return 'machine';
    const tier=window.TroopOutline.tierOf(kind);
    if(tier==='A')return 'composite';
    return tier==='base'?'common':'special';
  }
  const groupLists=new Map(),groupSections=new Map();
  for(const group of rateGroups){
    const kinds=allTroopKinds.filter(kind=>rateGroupOf(kind)===group.id);
    const section=document.createElement('div');section.className='rates-group';section.id='rates-group-'+group.id;section.dataset.category=group.id;
    section.innerHTML=`<div class="rates-group-heading" id="${section.id}-heading"><h2><button type="button" class="rates-category-toggle" id="${section.id}-title" data-category-toggle="${group.id}" aria-expanded="false" aria-controls="${section.id}-list"><span class="rates-chevron" aria-hidden="true">›</span>${group.label}<small>${kinds.length}种</small></button></h2><button type="button" class="rates-global-toggle" data-global-toggle="${group.id}" aria-label="${group.label}全局设置" aria-expanded="false" aria-controls="${section.id}-global">全局设置</button></div><div class="rates-group-list" id="${section.id}-list" hidden></div><section class="rates-global-panel" id="${section.id}-global" hidden aria-labelledby="${section.id}-global-title"><h2 id="${section.id}-global-title">${group.label} · 全局设置</h2><p class="hint">统一设置本类${kinds.length}种兵种，红蓝双方共用。数值不同会显示“混合”，留空则保留原值。</p><form data-group-form="${group.id}"><div class="rates-fields">${[['spawn','出兵间隔',0.5,60,0.5,'秒/个'],['attack','攻击速度',0.1,5,0.1,'倍']].map(([key,label,min,max,step,unit])=>`<div class="rates-field"><label for="group-${group.id}-${key}">${label}</label><div class="rates-number"><input id="group-${group.id}-${key}" name="${key}" type="number" min="${min}" max="${max}" step="${step}" placeholder="混合" aria-label="${group.label}统一${label}"><b>${unit}</b></div><input id="group-${group.id}-${key}-range" data-group-range="${key}" type="range" min="${min}" max="${max}" step="${step}" aria-label="${group.label}统一${label}滑杆"></div>`).join('')}</div><button class="wide rates-group-apply" type="submit">应用到${group.label}全部${kinds.length}种</button><p class="hint rates-group-status" role="status"></p></form><button type="button" class="wide rates-global-return" data-group-return="${group.id}">展开${group.label}单个兵种设置 ↓</button></section>`;
    ratesList.append(section);groupLists.set(group.id,section.querySelector('.rates-group-list'));groupSections.set(group.id,{section,kinds,group});
  }
  function refreshGroupForm(id){
    const {section,kinds}=groupSections.get(id),form=section.querySelector('form');
    for(const key of ['spawn','attack']){
      const values=kinds.map(kind=>troopRates.get(kind)[key]),uniform=values.every(v=>v===values[0]);
      form.elements.namedItem(key).value=uniform?values[0]:'';
      form.querySelector(`[data-group-range="${key}"]`).value=uniform?values[0]:(key==='spawn'?5:1);
    }
    section.querySelector('.rates-group-status').textContent='点击应用后统一生效；之后仍可单独调整兵种。';
  }
  function showRateGroup(id,view){
    const {section}=groupSections.get(id),list=section.querySelector('.rates-group-list'),global=section.querySelector('.rates-global-panel');
    list.hidden=view!=='kinds';global.hidden=view!=='global';
    section.querySelector('[data-category-toggle]').setAttribute('aria-expanded',String(!list.hidden));
    section.querySelector('[data-global-toggle]').setAttribute('aria-expanded',String(!global.hidden));
    if(view==='global')refreshGroupForm(id);
  }
  for(const kind of allTroopKinds){
    const card=document.createElement('section');card.className='rates-card';card.id='rates-'+kind;card.dataset.kind=kind;
    const name=defs[kind].name,country=rateCountries[window.TroopOutline.countryOf(kind)]||'通用';
    card.innerHTML=`<div class="rates-card-heading"><h2>${name}<span class="rates-country">${country}</span></h2><button type="button" class="rates-reset" data-reset="${kind}" aria-label="恢复${name}默认设置">恢复默认</button></div><div class="rates-fields">${[['spawn','出兵间隔',0.5,60,0.5,'秒/个'],['attack','攻击速度',0.1,5,0.1,'倍']].map(([key,label,min,max,step,unit])=>`<div class="rates-field"><label for="rate-${kind}-${key}">${label}</label><div class="rates-number"><input id="rate-${kind}-${key}" data-rate="${key}" data-control="number" type="number" min="${min}" max="${max}" step="${step}" aria-label="${name}${label}"><b>${unit}</b></div><input id="rate-${kind}-${key}-range" data-rate="${key}" data-control="range" type="range" min="${min}" max="${max}" step="${step}" aria-label="${name}${label}滑杆"></div>`).join('')}</div><p class="hint rates-note"></p>`;
    rateRows.set(kind,card);groupLists.get(rateGroupOf(kind)).append(card);
  }
  function refreshRatesPage(kind){
    for(const k of kind?[kind]:allTroopKinds){const card=rateRows.get(k),v=troopRates.get(k);
      for(const input of card.querySelectorAll('[data-rate]'))input.value=v[input.dataset.rate];
      card.querySelector('.rates-note').textContent=`每${v.spawn}秒出1兵 · 实际攻速${Number(attackSpeedFor(k).toFixed(2))}倍`;
    }
  }
  function showRatesPage(open){
    editorPanel.classList.toggle('rates-open',open);ratesPage.hidden=!open;
    panelHeading.innerHTML=open?'兵种设置 <i>分类调节</i>':'动作原版移植 <i>v089</i>';
    editorPanel.scrollTop=0;
    if(open){refreshRatesPage();for(const group of rateGroups)showRateGroup(group.id,'closed');document.getElementById('troopRatesBack').focus();}else document.getElementById('troopRatesOpen').focus();
  }
  document.getElementById('troopRatesOpen').onclick=()=>showRatesPage(true);
  document.getElementById('troopRatesBack').onclick=()=>showRatesPage(false);
  function syncCampRate(kind){
    if(!barracksModel)return;
    const interval=troopRates.get(kind).spawn;barracksModel.configure(kind,interval,elapsed);
    for(const camp of barracksModel.cells)if(camp.kind===kind)camp.el.title=`${defs[kind].name}营 · 等级1 · 每${interval}秒出1兵`;
  }
  function applyKindRate(kind,key,value){
    if(!troopRates.set(kind,key,value)){refreshRatesPage(kind);return;}
    if(key==='spawn')syncCampRate(kind);
    document.getElementById('troopRatesStatus').textContent=saveTroopRates()?'已保存 · 红蓝双方同兵种即时生效':'本次已生效；当前浏览器无法保存到本机';
    refreshRatesPage(kind);updateHud();
  }
  ratesList.addEventListener('input',e=>{if(e.target.dataset.groupRange){e.target.closest('form').elements.namedItem(e.target.dataset.groupRange).value=e.target.value;}if(e.target.dataset.control==='range')applyKindRate(e.target.closest('.rates-card').dataset.kind,e.target.dataset.rate,e.target.value);});
  ratesList.addEventListener('change',e=>{if(e.target.closest('[data-group-form]')&&e.target.name&&e.target.value!=='')e.target.closest('form').querySelector(`[data-group-range="${e.target.name}"]`).value=e.target.value;if(e.target.dataset.control==='number')applyKindRate(e.target.closest('.rates-card').dataset.kind,e.target.dataset.rate,e.target.value);});
  function resetKindRates(kind){
    for(const k of kind?[kind]:allTroopKinds){troopRates.reset(k);syncCampRate(k);}
    document.getElementById('troopRatesStatus').textContent=saveTroopRates()?(kind?defs[kind].name:'全部兵种')+'已恢复默认并保存':'已恢复默认；当前浏览器无法保存到本机';refreshRatesPage(kind);for(const group of rateGroups)if(!groupSections.get(group.id).section.querySelector('.rates-global-panel').hidden)refreshGroupForm(group.id);updateHud();
  }
  ratesList.addEventListener('click',e=>{
    const toggle=e.target.closest('[data-category-toggle]'),global=e.target.closest('[data-global-toggle]'),back=e.target.closest('[data-group-return]'),reset=e.target.closest('[data-reset]');
    if(toggle)showRateGroup(toggle.dataset.categoryToggle,toggle.getAttribute('aria-expanded')==='true'?'closed':'kinds');
    if(global)showRateGroup(global.dataset.globalToggle,global.getAttribute('aria-expanded')==='true'?'closed':'global');
    if(back){showRateGroup(back.dataset.groupReturn,'kinds');const section=groupSections.get(back.dataset.groupReturn).section;editorPanel.scrollTop+=section.getBoundingClientRect().top-editorPanel.getBoundingClientRect().top-80;section.querySelector('[data-category-toggle]').focus({preventScroll:true});}
    if(reset)resetKindRates(reset.dataset.reset);
  });
  ratesList.addEventListener('submit',e=>{
    const form=e.target.closest('[data-group-form]');if(!form)return;e.preventDefault();
    const id=form.dataset.groupForm,{section,kinds,group}=groupSections.get(id),updates=['spawn','attack'].filter(key=>form.elements.namedItem(key).value.trim()!=='');
    if(!updates.length){section.querySelector('.rates-group-status').textContent='请先填写要统一设置的数值。';return;}
    if(!form.reportValidity())return;
    for(const kind of kinds){for(const key of updates)troopRates.set(kind,key,form.elements.namedItem(key).value);if(updates.includes('spawn'))syncCampRate(kind);refreshRatesPage(kind);}
    const saved=saveTroopRates();refreshGroupForm(id);
    const message=`${group.label}${kinds.length}种已统一设置`+(saved?'并保存 · 红蓝双方即时生效':' · 当前浏览器无法保存到本机');
    section.querySelector('.rates-group-status').textContent=message;document.getElementById('troopRatesStatus').textContent=message;updateHud();
  });
  document.getElementById('troopRatesResetAll').onclick=()=>resetKindRates();
  refreshRatesPage();
  preload().then(()=>{
    const query=new URLSearchParams(location.search),exportKind=query.get("export"),exportState=query.get("state");
    if(assets[exportKind]&&STATES.includes(exportState)){renderCleanExport(exportKind,exportState);return}
    reset();setDisplayMode("show");syncBatchUI();fitPhone();if(sharedOn&&query.get("preview")!=="battle")startSharedReview(sharedMotion.families.find(f=>f.id===query.get("preview"))?.representative||"blade");requestAnimationFrame(loop);
  }).catch(error=>{battleState.textContent=error.message;assetState.textContent="载入失败";console.error(error)});
})();
