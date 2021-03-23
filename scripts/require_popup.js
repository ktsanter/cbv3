define(function (require) {
  //require('/scripts/utilitykts'); 
  //require('/scripts/clipboard_copy');  
  //require('/scripts/classProfile');
  //require('/scripts/usermanagement');  
  
  require('standard_notice'); 
  require('create_element');  
  require('sqldbinterface'); 
  require('popup');

  document.addEventListener('DOMContentLoaded', app.init());
});
