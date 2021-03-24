//------------------------------------------------------------------------------
// CBv3 popup
//------------------------------------------------------------------------------
// TODO: add login mechanism and store for user id
// TODO: use chrome storage for persistent data rather than localstorage
// TODO: data migration mechanism (from old CB to this one)
// TODO: data download/restore mechanism (in composer?)
// TODO: finish about
// TODO: finish help
//------------------------------------------------------------------------------
const app = function () {
	const page = {};
  
	const settings = {
    hideClass: 'hide-me',
    commentData: null,
    selectedCommentId: null,

    origin: 'http://localhost:8000',    
    editContentsURL: 'http://localhost:8000/commentbuddy/composer',
    helpURL: 'help.html'
	};
  
  var userSettings = {
    userid: null,
    searchtext: '',
    tags: '',
    commentid: null
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
    page.searchText = page.control.getElementsByClassName('input-search')[0];
    page.tagText = page.control.getElementsByClassName('input-tag')[0];
    page.tagIcon = page.control.getElementsByClassName('icon-tag')[0];
    page.tagList = page.control.getElementsByClassName('taglist')[0];
    
    page.commentList = page.contents.getElementsByClassName('commentlist')[0];
    page.rendered = page.contents.getElementsByClassName('rendered')[0];
    
    page.notice = new StandardNotice(page.errorContainer, page.errorContainer);
    
    await _loadUserSettings();
    userSettings.userid = 1;
    
    if (!userSettings.userid) {
      console.log('no user id');
      console.log(userSettings);
      //return;
      userSettings.userid = 1;
    }
    
    if ( !(await _getCommentData()) ) return;
    
    _attachHandlers();
    _renderCommentData();
  }
  	
	//--------------------------------------------------------------
	// page rendering
	//--------------------------------------------------------------
  function _attachHandlers() {
    var elemDropdown = page.navContainer.getElementsByClassName('dropdown-content')[0];
    elemDropdown.getElementsByClassName('item-edit')[0].addEventListener('click', (e) => { _handleEditContents(e); });
    elemDropdown.getElementsByClassName('item-help')[0].addEventListener('click', (e) => { _handleHelp(e); });
    elemDropdown.getElementsByClassName('item-about')[0].addEventListener('click', (e) => { _handleAbout(e); });
    
    page.searchText.addEventListener('input', (e) => { _handleLookupInput(e); });
    page.tagText.addEventListener('input', (e) => { _handleLookupInput(e); });
    page.control.getElementsByClassName('icon-tag')[0].addEventListener('click', (e) => { _handleTagToggle(e); });
  }
  
  function _renderCommentData() {
    if (!settings.commentData) return;

    _renderTagList(_buildTagList(settings.commentData));

    settings.selectedCommentId = userSettings.commentid;
    page.searchText.value = userSettings.searchtext;
    page.tagText.value = userSettings.tags;
    
    _filterCommentList();    
  }
  
  function _buildTagList(commentData) {
    var tagSet = new Set();
    for (var i = 0; i < commentData.length; i++) {
      var comment = commentData[i];
      var tagList = _parseTagItem(comment.tags);
      for (var j = 0; j < tagList.length; j++) {
        tagSet.add(tagList[j]);
      }
    }
    
    var tagList = Array.from(tagSet);
    return tagList.sort();
  }
  
  function _renderTagList(tagList) {
    UtilityKTS.removeChildren(page.tagList);
    for (var i = 0; i < tagList.length; i++) {
      var elem = CreateElement.createDiv(null, 'taglist-item', tagList[i]);
      page.tagList.appendChild(elem);
      elem.addEventListener('click', (e) => { _handleTagSelection(e); });
    }
  }
  
	//--------------------------------------------------------------
	// updating
	//--------------------------------------------------------------
  function _toggleTagSelection() {
    var tagListOpen = page.tagIcon.classList.contains('fa-caret-down');
    
    UtilityKTS.setClass(page.tagIcon, 'fa-caret-right', tagListOpen);
    UtilityKTS.setClass(page.tagIcon, 'fa-caret-down', !tagListOpen);
    UtilityKTS.setClass(page.tagList, settings.hideClass, tagListOpen);    
  }
  
  function _addToTagSelection(tagText) {
    var tagSelections = _parseTagItem(page.tagText.value);
    var tagSet = new Set(tagSelections);
    tagSet.add(tagText);
    tagSelections = Array.from(tagSet);
    
    var newTagText = '';
    for (var i = 0; i < tagSelections.length; i++) {
      if (i > 0) newTagText += ', ';
      newTagText += tagSelections[i];
    }

    page.tagText.value = newTagText;
    
    _filterCommentList();
  }
  
  function _filterCommentList() {
    var filteredList = _getFilteredCommentData();
    
    var selectedId = settings.selectedCommentId;
    _deselectComment();
    
    UtilityKTS.removeChildren(page.commentList);
    for (var i = 0; i < filteredList.length; i++) {
      var commentItem = filteredList[i];
      var elem = CreateElement.createDiv(null, 'commentlist-item', _toPlaintext(commentItem.comment));
      page.commentList.appendChild(elem);
      elem.addEventListener('click', (e) => { _handleCommentSelection(e); });
      elem.commentDetails = commentItem;
      elem.title = commentItem.hovertext;
      if (selectedId && selectedId == commentItem.commentid) _selectComment(elem);
    }
    
    _saveUserSettings();
  }
  
  function _getFilteredCommentData() {
    var filteredList = settings.commentData;
    
    var searchVal = page.searchText.value;
    var tagSet = new Set(_parseTagItem(page.tagText.value));
    var useSearchVal = searchVal != '';
    var useTagSet = tagSet.size > 0;
;
    if (useSearchVal || useTagSet) {
      filteredList = [];

      for (var i = 0; i < settings.commentData.length; i++) {
        var item = settings.commentData[i];
        var searchMatches = true;
        var tagMatches = true;
        
        if (useSearchVal) {
          searchMatches = item.comment.toLowerCase().includes(searchVal);
        }

        if (useTagSet) {
          var itemTagSet = new Set(_parseTagItem(item.tags));
          tagMatches = (_setDifference(tagSet, itemTagSet).size == 0);
        }

        if (searchMatches && tagMatches) filteredList.push(item);
      }
    }
    
    return filteredList;
  }
  	
  function _selectComment(selectedElement) {
    
    if (selectedElement.classList.contains('selected-item')) {
      _deselectComment();    
      
    } else {
      _deselectComment();    
      UtilityKTS.setClass(selectedElement, 'selected-item', true);
      _showRenderedComment(selectedElement.commentDetails);
      settings.selectedCommentId = selectedElement.commentDetails.commentid;
    }
    
    _saveUserSettings();
  }
  
  function _deselectComment() {
    var commentElements = page.commentList.getElementsByClassName('commentlist-item');
    for (var i = 0; i < commentElements.length; i++) {
      UtilityKTS.setClass(commentElements[i], 'selected-item', false);
    }
 
    UtilityKTS.setClass(page.rendered, settings.hideClass, true);
    settings.selectedCommentId = null;
  }
  
  function _showRenderedComment(commentDetails) {
    page.rendered.innerHTML = commentDetails.comment;
    UtilityKTS.setClass(page.rendered, settings.hideClass, false);
    _copyRenderedToClipboard(commentDetails.comment);
  }

	//--------------------------------------------------------------
	// handlers
	//--------------------------------------------------------------
  function _handleLookupInput(e) {
    _filterCommentList();
  }
  
  function _handleTagToggle(e) {
    _toggleTagSelection();
  }
  
  function _handleTagSelection(e) {
    _addToTagSelection(e.target.innerHTML);
    _toggleTagSelection();
  }
  
  function _handleCommentSelection(e) {
    _selectComment(e.target);
  }
  
  function _handleEditContents(e) {
    window.open(settings.editContentsURL, '_blank');
  }
  
  function _handleHelp(e) {
    window.open(settings.helpURL, '_blank');
  }
  
  function _handleAbout(e) {
    console.log('_handleAbout');
  }
  
  //---------------------------------------
  // local storage
  //---------------------------------------
  async function _loadUserSettings() {
    page.notice.setNotice('loading user settings...', true);
    var paramList = [
      {paramkey: 'cbv3-userid', resultkey: 'userid', defaultval: null},
      {paramkey: 'cbv3-searchtext', resultkey: 'searchtext', defaultval: ''},
      {paramkey: 'cbv3-tags', resultkey: 'tags', defaultval: ''},
      {paramkey: 'cbv3-commentid', resultkey: 'commentid', defaultval: null},
    ];
    
    userSettings = ParamStorage.load(paramList);
    
    page.notice.setNotice('');
  }
  
  async function _saveUserSettings() {
    userSettings.searchtext = page.searchText.value;
    userSettings.tags = page.tagText.value;
    userSettings.commentid = settings.selectedCommentId;
    
    var paramList = [
      {paramkey: 'cbv3-searchtext', value: userSettings.searchtext},
      {paramkey: 'cbv3-tags', value: userSettings.tags},
      {paramkey: 'cbv3-commentid', value: userSettings.commentid},    
    ];
    
    ParamStorage.store(paramList);
  }
  
	//---------------------------------------
	// DB interface
	//---------------------------------------
  async function _getCommentData() {
    page.notice.setNotice('loading comments...', true);
    settings.commentData = null;
    
    var userId = userSettings.userid;
    if (userId == null) {
      console.log('failed to get user id');
      return false;
    }
    
    var dbResult = await SQLDBInterface.doPostQuery('commentbuddy-client/query', 'comment-list', {"userId": userId});
    if (dbResult.success) {
      settings.commentData = dbResult.data;
      page.notice.setNotice('');
    } else {
      page.notice.setNotice('failed to load comments');
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
  function _parseTagItem(tag) {
    var parsedTags = [];

    var splitTags = tag.split(',');
    for (var i = 0; i < splitTags.length; i++) {
      var trimmed = splitTags[i].trim();
      if (trimmed.length > 0) parsedTags.push(trimmed);
    }

    return parsedTags;
  }
  
  function _toPlaintext(str) {
    var plaintext = str;

    plaintext = plaintext.replace(/<.*?\>(.*?)/g, '$1');        // strip all angle bracket tags
    plaintext = plaintext.replace('&nbsp;', ' ');
    
    return plaintext;
  }
  
  function _setDifference(a, b) {
    return a_minus_b = new Set([...a].filter(x => !b.has(x)));
  }
  
	//---------------------------------------
	// initialization
	//---------------------------------------
	return {
		init: init
 	};
}();
