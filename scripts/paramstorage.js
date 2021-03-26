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
  
  //---------------------------------------------------------------------------------
  // private methods
  //---------------------------------------------------------------------------------
  static async test(paramList) {
    var finalResult = null;
    var result = {};
    var resultMap = {};
    var keyList = [];
    
    for (var i = 0;  i < paramList.length; i++) {
      var param = paramList[i];
      var key = param.paramkey;
      var resultfield = paramList.resultkey;
      var defaultval = paramList.defaultval;
      
      result[ resultfield ] = defaultval;
      resultMap[ key ] = resultfield;
      keyList.push( key );
    }    
    
    var result = await this._testPromise(keyList, resultMap)
      .then((value) => {
        finalResult = value;
      });

    return finalResult;
  }
  
  static _testPromise(keyList, resultMap) {
    return new Promise((resolve) => {
      this._test(keyList, (result) => {
        console.log('_testPromise result');
        for (var key in result) {
          console.log(key + ': ' + result[key]);
        }
        resolve(result);
      });
    })
  }

  static _test(keyList, promiseCallback) {
    console.log('_test: ' + JSON.stringify(keyList));
    keyList = ['cb2_fileid'];
    chrome.storage.sync.get(null, function(result) {
      promiseCallback(result);
    });
  }

  static async test2(paramList) {
    var storageVals = paramList;

    var result = await this._testPromise2(storageVals);

    return true;
  }
  
  static _testPromise2(storageVals) {
    return new Promise((resolve) => {
      this._test2(storageVals, () => {
        resolve();
      });
    })
  }

  static _test2(storageVals, promiseCallback) {
    var theValue = 'xyzzy';
    console.log(storageVals);
    chrome.storage.sync.set({storageVals}, function() {
      console.log('Settings saved');
      promiseCallback();
    });    
  }
}
