//----------------------------------------------------------------------
// on install/update of extension create a right-click menu item
//----------------------------------------------------------------------
// TODO: 
//----------------------------------------------------------------------

//chrome.runtime.onInstalled.addListener(addContextMenuOption); // didn't seem to work
//chrome.runtime.onStartup.addListener(addContextMenuOption);   // didn't seem to work
addContextMenuOption();

function addContextMenuOption() {
  chrome.contextMenus.create({
    title: 'add selected text to CommentBuddy repository', 
    contexts:["selection"], 
    onclick: contextMenuHandler
  });
}

// handler for context menu selection
function contextMenuHandler(e) {
  addSelectedTextToRepository(e.selectionText);
}

// open save comment page with specified text preloaded
function addSelectedTextToRepository(saveText) {
  chrome.storage.sync.set({"cbv3_savecommenttext": saveText}, function() {
    chrome.tabs.create({url: "https://www.aardvark-studios.com/commentbuddy/composer"});
  });
}

// handler for keyboard shortcut 
chrome.commands.onCommand.addListener(function(command) {
  addSelectedTextToRepository('');
});
