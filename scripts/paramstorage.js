//-------------------------------------------------------------------------------------
// wrapper class for Chrome sync storage (fallback to local storage)
//-------------------------------------------------------------------------------------
class ParamStorage {
  constructor() {}
  
  //-----------------------------------------------------------------------------------
  // load:
  //   paramList: [ {paramkey: xxx, resultkey: xxx, defaultval: xxx}, ... } 
  //-----------------------------------------------------------------------------------
  static load(paramList) {
    var results = {};
    
    if (chrome.storage) {
      console.log('stub instead of chrome.storage');
      for (var i = 0; i < paramList.length; i++) {
        var param = paramList[i];
        results[param.resultkey] = param.defaultval;
      }
      
      
    } else {   // fallback to localStorage (for non-extension environment)
      for (var i = 0; i < paramList.length; i++) {
        var param = paramList[i];
        var val = localStorage.getItem(param.paramkey);
        results[param.resultkey] = val ? val : param.defaultval;
      }
    }
    
    return results;    
  }
  /*
  load(params, callback) {
    var result = {};
    var resultmap = {};
    var loadkeys = [];
    
    for (var i = 0;  i < params.length; i++) {
      var key = params[i].key;
      var resultfield = params[i].resultfield;
      var defaultval = params[i].defaultval;
      
      result[ resultfield ] = defaultval;
      resultmap[ key ] = resultfield;
      loadkeys.push( key );
    }
    
    chrome.storage.sync.get(loadkeys, function (loadresult) {
      for (var key in loadresult) {
        if (typeof loadresult[key] != 'undefined') result[ resultmap[key] ] = loadresult[key];
      }
      
      if (callback != null) callback(result);
    });
   }
   */
  
  //-----------------------------------------------------------------------------------
  // store:
  //   paramList: [ {paramkey: xxx, value: xxxxx}, ... ]
  //-----------------------------------------------------------------------------------
  static store(paramList) {
    if (chrome.storage) {
      
    } else {  // fallback to localStorage (for non-extension environment)
      for (var i = 0; i < paramList.length; i++) {
        var param = paramList[i];
        localStorage.setItem(param.paramkey, param.value);
      }
    }
  }
  
  /*
  store(params, callback) {
    var storagevals = {};
    for (var i = 0; i < params.length; i++) {
      storagevals[ params[i].key ] = params[i].value;
    }

    chrome.storage.sync.set(storagevals, function() {
      if (callback != null) callback();
    });
  }
  */
}
