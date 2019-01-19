chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    if (request == 'myAction') {
        test();
    }
});

function test(){
  var a = document.documentElement;
  var y = a.scrollHeight - a.clientHeight;
  console.log('hogehoge');
  window.scroll(0, y);
}
