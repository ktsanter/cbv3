//----------------------------------------------------------------------
// on install/update of extension create a right-click menu item
//----------------------------------------------------------------------
// TODO: 
//----------------------------------------------------------------------
const __USELOCALHOST__ = false;

/*--------------------------
addContextMenuOption();

function addContextMenuOption() {
  chrome.contextMenus.create({
    title: 'add selected text to CommentBuddy repository', 
    contexts:["selection"], 
    onclick: contextMenuHandler
  });
}

// handler for context menu selection
async function contextMenuHandler(e) {
  await addSelectedTextToRepository(e.selectionText);
}

// open save comment page with specified text preloaded as comment
function addSelectedTextToRepository(saveText) {  
  chrome.storage.sync.get(null, function(items) {
    var accessKey = items['cbv3-accesskey'];

    var dbResult =  doPostQuery(
      'commentbuddy-client/insert', 
      'preset-comment', 
      {
        "accesskey": accessKey, 
        "preset": saveText
      }
    );
    _openApp();
  });
}
---------------*/

// handler for keyboard shortcut 
chrome.commands.onCommand.addListener(function(command) {
  _openApp();  
});

function _openApp() {
  if (__USELOCALHOST__) {
    chrome.tabs.create({url: "http://localhost:8000/commentbuddy/composer"});
  } else {
    chrome.tabs.create({url: "https://aardvark-studios.com/commentbuddy/composer"});
  }  
}

/*---------------
async function doPostQuery(queryType, queryName, postData) {
  var resultData = {success: false};
  
  var requestResult = await dbPost(queryType, queryName, postData);
  if (requestResult.success) {
    resultData = requestResult;

  } else {
    resultData.details = requestResult.details;
  }
  
  return resultData;
} 
---------------*/  
  
//----------------------------------------------------------------------
// DB interface
//----------------------------------------------------------------------  
/*------------------
async function dbPost(queryType, queryName, postData) {
  const METHOD_TITLE = 'dbPost';
  
  var url = __buildApiUrl__(queryType, queryName);
  var result = {success: false, details: 'unspecified error in ' + METHOD_TITLE};

  try {
    const resp = await fetch(url, {
      method: 'post', 
      mode: 'cors',
      headers: {'Content-Type': 'application/json; charset=utf-8'}, 
      body: JSON.stringify(postData)
    });
    const json = await resp.json();
    //console.log(json);
    
    if (!json.success) {
      var errmsg = '*ERROR: in ' + METHOD_TITLE + ', ' + JSON.stringify(json.details);
      console.log(errmsg);
      console.log('url: ' + url);
      console.log('postData: ' + JSON.stringify(postData));
      result.details = errmsg;
    } else {
      result = json;
    }
    
  } catch (error) {
    var errmsg = '**ERROR: in ' + METHOD_TITLE + ', ' + error;
    console.log(errmsg);
    result.details = errmsg;
  }
  
  return result;
}

function __buildApiUrl__(queryType, queryName) {
  var dbOrigin = 'https://aardvark-studios.com';
  if (__USELOCALHOST__) {
    console.log('using localhost');
    dbOrigin = 'http://localhost:8000';
  }

  var url = dbOrigin + '/' + queryType + '/' + queryName;
  
  //console.log('buildApiUrl: url: ' + url);
  
  return url;
}   
-----------------------*/