define(function (require) {
  //require('/scripts/utilitykts'); 
  //require('/scripts/classProfile');
  //require('/scripts/usermanagement');  
  
  require('standard_notice'); 
  require('create_element');  
  require('sqldbinterface'); 
  require('utilitykts');
  require('clipboard_copy');  
  require('popup');

  document.addEventListener('DOMContentLoaded', app.init());
});
