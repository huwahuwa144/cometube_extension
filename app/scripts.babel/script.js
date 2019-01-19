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
  var heart = document.getElementById('unhearted');
  if ($(heart).css('display') != 'none') {
    // 表示されている場合の処理
    heart.click();
  } else {
    // 非表示の場合の処理
  }
}
