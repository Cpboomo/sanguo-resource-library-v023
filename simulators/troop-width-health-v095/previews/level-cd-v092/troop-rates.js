(function(root){
'use strict';
function create(kinds,stored={}){
 const values=Object.fromEntries(kinds.map(kind=>[kind,{spawn:5,attack:1}]));
 function set(kind,key,value){if(!values[kind]||!['spawn','attack'].includes(key)||String(value).trim()===''||!Number.isFinite(Number(value)))return false;const min=key==='spawn'?.5:.1,max=key==='spawn'?60:5;const step=key==='spawn'?.5:.1;values[kind][key]=Number((Math.round(Math.max(min,Math.min(max,Number(value)))/step)*step).toFixed(1));return true;}
 for(const kind of kinds)for(const key of ['spawn','attack'])if(stored?.[kind]?.[key]!=null)set(kind,key,stored[kind][key]);
 return {attack:kind=>values[kind].attack,get:kind=>({...values[kind]}),set,snapshot:()=>JSON.parse(JSON.stringify(values)),reset(kind){for(const k of kind?[kind]:kinds){set(k,'spawn',5);set(k,'attack',1);}}};
}
const api={create};if(typeof module!=='undefined')module.exports=api;else root.TroopRates=api;
})(typeof window==='undefined'?globalThis:window);
