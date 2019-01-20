var heartJson;
var ecommentCount;
var contents;
var pageCommentCount;
var commentCheckCounter = 0;
var id;

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    if (request[0] == 'myAction') {
      if(request[1] != null){
        heartJson = JSON.parse(request[1]);
        ecommentCount = heartJson.heartList[0].commentCount;
        startHeartProcess();
      }
    }
});

function startHeartProcess(){
  id = setInterval('commentCheck()',500);
}

function commentCheck(){
  var a = document.documentElement;
  var y = a.scrollHeight - a.clientHeight;
  console.log('hogehoge');
  window.scroll(0, y);
  contents = document.getElementById('contents');
  if(contents != null){
    pageCommentCount = contents.childElementCount;
  }
  console.log(ecommentCount+'@'+pageCommentCount);
  if(ecommentCount <= pageCommentCount){
    console.log(ecommentCount+'コメント数チェック完了'+pageCommentCount);
    clearInterval(id);
  }
  if(commentCheckCounter > 120){
    console.log('制限超過');
    clearInterval(id);
  }
  console.log(commentCheckCounter);
  commentCheckCounter+=1;
  process();
}

function process(){
  var heart = document.getElementById('unhearted');
  console.log($(contents).find('ytd-comment-thread-renderer'));
  if(heart != null){
    if ($(heart).css('display') != 'none') {
      // 表示されている場合の処理
      heart.click();
    } else {
      // 非表示の場合の処理
    }
  }
}

function test(){
  for(var i = 0;i < 100;i++){
    var a = document.documentElement;
    var y = a.scrollHeight - a.clientHeight;
    console.log('hogehoge');
    window.scroll(0, y);
  };
  var num = document.getElementById('contents');
  console.log(num.childElementCount);
  console.log(count);
  var heart = document.getElementById('unhearted');
  if ($(heart).css('display') != 'none') {
    // 表示されている場合の処理
    heart.click();
  } else {
    // 非表示の場合の処理
  }
}
