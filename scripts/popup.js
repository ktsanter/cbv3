//------------------------------------------------------------------------------
// CBv3 popup
//------------------------------------------------------------------------------
// TODO: 
//------------------------------------------------------------------------------
const app = function () {
	const page = {};
  
	const settings = {
    hideClass: 'hide-me'
	};
	
	//---------------------------------------
	// get things going
	//----------------------------------------
	async function init () {
    page.body = document.getElementsByTagName('body')[0];
    page.mainContainer = page.body.getElementsByClassName('main-container')[0];

    page.errorContainer = page.mainContainer.getElementsByClassName('error-container')[0];
    page.navContainer = page.mainContainer.getElementsByClassName('nav-container')[0];
    page.contents = page.mainContainer.getElementsByClassName('contents')[0];
    
    page.control = page.contents.getElementsByClassName('controls')[0];
    page.tagList = page.control.getElementsByClassName('taglist')[0];
    
    page.commentList = page.contents.getElementsByClassName('commentlist')[0];
    page.rendered = page.contents.getElementsByClassName('rendered')[0];
    
    page.notice = new StandardNotice(page.errorContainer, page.errorContainer);
    
    if ( !(await _getCommentData()) ) return;
    
    _renderCommentData();
    _attachHandlers();
  }
  	
	//--------------------------------------------------------------
	// page rendering
	//--------------------------------------------------------------
  function _renderCommentData() {
    console.log('_renderCommentData');
  }
  
  function _attachHandlers() {
    console.log('_attachHandlers');
  }
  
	//--------------------------------------------------------------
	// updating
	//--------------------------------------------------------------
  function _doHelp() {
    window.open(settings.helpURL, '_blank');
  }
  
  function _doLogout() {
    window.open(settings.logoutURL, '_self'); 
  }
  	
	//--------------------------------------------------------------
	// handlers
	//--------------------------------------------------------------

	//---------------------------------------
	// DB interface
	//---------------------------------------
  async function _getCommentData() {
    page.notice.setNotice('loading...', true);
    
    var userId = await _getUserId();
    if (userId == null) {
      console.log('show login');
      return false;
    }
    
    var dbResult = await SQLDBInterface.doGetQuery('commentbuddy-client/query', 'comment-list');
    console.log(dbResult);
    
    page.notice.setNotice('');
    return true;
  }
  
  async function _getUserId() {
    console.log('_getUserId');
    return 1;
  }
  
  async function _getProjectInfo() {    
    var dbResult = await SQLDBInterface.doGetQuery('imageflipper/query', 'projectinfo');

    settings.projectInfo = null;
    if (dbResult.success) {
      for (var i = 0; i < dbResult.projects.length; i++) {
        dbResult.projects[i].layoutimages = JSON.parse(dbResult.projects[i].layoutimages);
      }

      settings.projectInfo = dbResult.projects;
    } 
    
    return dbResult.success;
  }  
    
  //---------------------------------------
  // clipboard functions
  //----------------------------------------
  function _copyToClipboard(txt) {
    if (!page._clipboard) page._clipboard = new ClipboardCopy(page.body, 'plain');

    page._clipboard.copyToClipboard(txt);
	}	

  function _copyRenderedToClipboard(txt) {
    if (!page._renderedclipboard) page._renderedclipboard = new ClipboardCopy(page.body, 'rendered');

    page._renderedclipboard.copyRenderedToClipboard(txt);
	}	    

	//---------------------------------------
	// utility
	//---------------------------------------
	return {
		init: init
 	};
}();
