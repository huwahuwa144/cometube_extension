var heartJson;
var ecommentCount;
var contents;
var pageCommentCount;
var commentCheckCounter = 0;
var id;
var id2;
var obj;
var i = 0;

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    if (request[0] == 'myAction') {
      if(request[1] != null){
        heartJson = JSON.parse(request[1]);
        console.log(heartJson);

        ecommentCount = heartJson.heartList[0].commentCount;
        startHeartProcess()
      }
    }
});

function startHeartProcess(){
  id = setInterval('commentCheck()',1000);
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
  if(ecommentCount <= pageCommentCount){
    clearInterval(id);
    process();
  }else if(ecommentCount <= pageCommentCount+2){
    process();
  }
  console.log(ecommentCount+'@'+pageCommentCount);
  // if(ecommentCount <= pageCommentCount){
  //   console.log(ecommentCount+'コメント数チェック完了'+pageCommentCount);
  //   clearInterval(id);
  // }
  if(commentCheckCounter > 15){
    console.log('制限超過');
    clearInterval(id);
    process();
  }
  console.log(commentCheckCounter);
  commentCheckCounter+=1;
}

function process(){
  if($('ytd-comment-thread-renderer')){
    obj = $('ytd-comment-thread-renderer');
    console.log(obj.length);
    console.log(obj);
    // console.log(obj.eq(0));
    // console.log(obj.eq(1));
    // console.log(obj.eq(2));
    if(ecommentCount <= obj.length){
      id2 = setInterval('heartClick()',1000);
    }else if(ecommentCount <= obj.length+2){
      id2 = setInterval('heartClick()',1000);
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

function heartClick(){
    for(var j=0;j<ecommentCount;j++){
      // console.log(heartJson.heartList[j].text);
      // console.log(obj.eq(i).find('#content-text').text());
      if(obj.eq(i).find('#author-text').attr('href') == (heartJson.heartList[j].channelId)){
        // console.log(obj.eq(i).find('#author-text').attr('href'));
        if(obj.eq(i).find('#content-text').text().replace(/\uFEFF/g,'')==(heartJson.heartList[j].text)){
          // console.log('channnelidTrue');
          var heart = obj.eq(i).find('#creator-heart-button');
          if(!heart){

          }else{
            // heart.click();
            if ($(heart).children('#button').attr('aria-label') == 'ハート') {
              // 表示されている場合の処理
              // console.log('cssTrue');
              // console.log(heartJson.heartList[j].heartSend);
              if(heartJson.heartList[j].heartSend){
                console.log('heartSendTrue');
                console.log(obj.eq(i).find('#content-text').text()+','+heartJson.heartList[j].text);
                heart.click();
              }
            } else if($(heart).children('#button').attr('aria-label') == 'ハートを削除'){
                if(!heartJson.heartList[j].heartSend){
                  console.log('heartSendFalse');
                  heart.click();
                }
              // 非表示の場合の処理
            }
          }
        }
      }
    }
    i++;
    if(obj.length < i){
      clearInterval(id2);
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
