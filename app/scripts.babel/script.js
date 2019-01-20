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
        console.log(heartJson);
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
  if($('ytd-comment-thread-renderer')){
    var obj = $('ytd-comment-thread-renderer');
    console.log(obj.length);
    console.log(obj.eq(0));
    console.log(obj.eq(1));
    console.log(obj.eq(2));
    for(var i=0;i<obj.length;i++){
      for(var j=0;j<ecommentCount;j++){
        console.log(heartJson.heartList[j].text);
        console.log(obj.eq(i).find('#content-text').text());
        if(obj.eq(i).find('#content-text').html().indexOf(heartJson.heartList[j].text)){
          console.log('textTrue');
          console.log(obj.eq(i).find('#author-text').attr('href'));
          if(obj.eq(i).find('#author-text').attr('href').indexOf(heartJson.heartList[j].channelId)){
            console.log('channnelidTrue');
            var heart = obj.eq(i).find('#unhearted');
            console.log($(heart).css);
            if ($(heart).css('display') != 'none') {
              // 表示されている場合の処理
              console.log('cssTrue');
              if(heartJson.heartList[j].heartSend){
                console.log('heartSendTrue');
                heart.click();
              }
              } else {
              // 非表示の場合の処理
            }
          }
        }
      }
      // console.log(obj.eq(i).find('#content-text').text());
    }
  }

  // if(heart != null){
  //   if ($(heart).css('display') != 'none') {
  //     // 表示されている場合の処理
  //     heart.click();
  //   } else {
  //     // 非表示の場合の処理
  //   }
  // }
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
