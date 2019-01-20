// var url = location.href ;
// console.log('url');
// if ( url.match(/youtube/)) {
//
// }


console.log('popup');
var id;
var title;
var message = ['myAction'];
chrome.tabs.getSelected(null, function(tab){
  console.log(tab.url);
  if (!tab.url.indexOf('https://www.youtube.com')){
    console.log('youtube');
    console.log(tab.url);
    // Amazon のページのときの処理
    document.getElementById('comebtn').disabled = '';
    document.getElementById('heartbtn').disabled = '';
  }else{
    console.log('not youtube');
    document.getElementById('comebtn').disabled = 'disabled';
    document.getElementById('heartbtn').disabled = 'disabled';
  }
});

function commentStart(){
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id,'commentStart',
            function (response) {
            });
    });
}
function startExecute() {
  var currentTab = '';
  chrome.tabs.getSelected(null, function (tab) {
    currentTab = tab.url;
    id = /[/?=]([-\w]{11})/.exec(tab.url);
    if(id != null){
      console.log(id);
      title = tab.title;
      localStorage.videoTitle = title;
      localStorage.id = id[1];
      chrome.tabs.create({'url': 'reply.html' },tab => {});
    }
  });

}

function startHeart(){
  message.push(localStorage.heartListJson);
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function (tabs) {
    // ...and send a request for the DOM info...
    chrome.tabs.sendMessage(
        tabs[0].id,
        message,
        // ...also specifying a callback to be called
        //    from the receiving end (content script)
        function(){});
  });

  console.log('startHeart');
}
document.addEventListener('DOMContentLoaded',function(){
  document.getElementById('comebtn').addEventListener('click',startExecute);
});
document.addEventListener('DOMContentLoaded',function(){
  document.getElementById('heartbtn').addEventListener('click',startHeart);
});


document.addEventListener('DOMContentLoaded',function(){
  var animateButton = function(e) {

    e.preventDefault;
    //reset animation
    e.target.classList.remove('animate');

    e.target.classList.add('animate');
    setTimeout(function(){
      e.target.classList.remove('animate');
    },700);
  };

  var bubblyButtons = document.getElementsByClassName("heartbtn2");

  for (var i = 0; i < bubblyButtons.length; i++) {
    bubblyButtons[i].addEventListener('click', animateButton, false);
  }
});
