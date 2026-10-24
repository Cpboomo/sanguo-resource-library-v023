/* Charge victims travel in ground space while their complete presentation lifts. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.ChargeLaunch=api;})(typeof window==='object'?window:this,function(){
  const airTime=.58,settleTime=.12;
  function sample(t){
    const p=Math.max(0,Math.min(1,t/airTime)),landing=Math.max(0,Math.min(1,(t-airTime)/settleTime));
    return {travel:1-(1-p)**2,lift:4*p*(1-p),tilt:Math.sin(Math.PI*p),landing:Math.sin(Math.PI*landing),done:t>=airTime+settleTime};
  }
  return Object.freeze({sample,duration:airTime+settleTime});
});
