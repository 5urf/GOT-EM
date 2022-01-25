
//reviewState 를 위해서 사용합니다. current: 기준 객체, target: 합치려는 객체 
const mergeState = (currentObj,targetObj,mode)=>{
  Object.keys(targetObj).forEach((objKey)=>{ 
    Object.keys(targetObj[objKey]).forEach((key)=>{
      mode === 'merge' ? currentObj[objKey][key]+=targetObj[objKey][key]:'';
      mode === 'rollback' ? currentObj[objKey][key]-=targetObj[objKey][key]:'';
    })
  });
  return currentObj;
}

module.exports = mergeState

