'use strict';

//pageToken格納用変数
var nextPageToken = '';
var token = '';
var allComments = [];
var flg = 1;
var title = '';
var id;



 //ポップアップとログインの表示
function startExecute() {
  var currentTab = '';
  chrome.tabs.getSelected(null, function (tab) {
    currentTab = tab.url;
    id = /[/?=]([-\w]{11})/.exec(tab.url);
    if(id != null){
      console.log(id);
      title = tab.title;
      alert(tab.title + '\n' + tab.url);
      localStorage.videoTitle = title;
      localStorage.id = id[1];
      chrome.tabs.create({'url': 'reply.html' },tab => {});
    }
  });

}

chrome.browserAction.onClicked.addListener(startExecute);
// chrome.browserAction.onClicked.addListener(function(tab) {
//     chrome.tabs.sendMessage(tab.id, "myAction");
// });
// function messageSend(tab){
//   chrome.runtime.sendMessage({videoId:id},
//     function(response){
//       console.log('message sent');
//     });
// }
