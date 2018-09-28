'use strict';

// $(function(){
//   $('body').css('background-color','#ff0000');
// });

chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.create({'url': 'index.html' });
});


// var url = chrome.extension.getURL('index.html');
//
// $(function() {
//   $('#demo1').click(function(){
//       window.open('url');
//       return false;
//     });
// });
