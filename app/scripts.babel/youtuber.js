'use strict';

//pageToken格納用変数
var nextPageToken = ''; //コメント取得Token
var tokenResult; //ユーザ認証tokenの一時保存
var allComments = []; //取得したコメントを管理
var title = '';
var id; //動画id
var userIcon;
var userName;
var userComment;
var userPublishedAt; //コメントを投稿した時間
var videoPublishedAt; //動画を投稿した時間
var commentCount = 0; //コメント総数変動
var commentCounter = 0; //選択中のコメントの位置
var commentCountAll = 0;//コメント総数固定
var realCommentId; //YouTubeコメントのユニークid
var inputText; //フォーム内テキストの保存
var saveId; //送信したコメントのidを保存予定
var loginUserName; //現在ログイン中のユーザ名
var dt; //時間データのtemp
var playerCome; //youtubeIframe
var linkVideoTime; //リンクによる動画時間が存在する場合のindex
var linkTimeTemp;
var videoSecond;
var lkUrlvId;
var player;
var templateList; //templatejson文字列を格納
var templateList1 = [];
var templateList2;
var templateListJson = {
  templateList1:templateList1
};
// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//   parseItems = [];
//   console.log(sender);
//   id = sender.videoId;
//   var res = 'finish';
//   sendResponse(res);
// });

id = localStorage.id;
title = localStorage.videoTitle;
console.log(id);

chrome.identity.getAuthToken({
  interactive: true
}, function (token) {
  tokenResult = token;
  console.log(token);
  if (chrome.runtime.lastError) {
    alert(chrome.runtime.lastError.message);
    return;
  }
  var x = new XMLHttpRequest();
  x.open('GET', 'https://www.googleapis.com/oauth2/v1/tokeninfo?alt=json&access_token=' + token);
  x.onload = function () {
    // logout();
    console.log(x);
    currentLoginUser();
    videoInfo();
    commentThreadsApi(id, token, nextPageToken, getAllComments);
    loadPlayer(id);
  };

  x.onloadend = function () {
    // $('#fakeLoader').hide();
  };
  x.send();
});

/**
 * [getAllComments description]
 * @param  {[type]} json [commentInfo]
 * @param  {[type]} n    [nextPageToken]
 * @param  {[type]} v    [videoId]
 * @param  {[type]} t    [access_token]
 * @return {[type]}      [description]
 */
function getAllComments(json, n, v, t) {
  console.log('response:', json);
  console.log(nextPageToken);
  allComments.push(json);
  if ('nextPageToken' in json) {
    commentThreadsApi(v, t, n, getAllComments);
  } else {
    stopload();
    $('textarea').focus();
    document.getElementById('movieTitle').innerText = title;
    userIcon = allComments[0].items[0].snippet.topLevelComment.snippet.authorProfileImageUrl;
    userName = allComments[0].items[0].snippet.topLevelComment.snippet.authorDisplayName;
    userComment = allComments[0].items[0].snippet.topLevelComment.snippet.textDisplay;
    userPublishedAt = allComments[0].items[0].snippet.topLevelComment.snippet.updatedAt;
    dt = new Date(userPublishedAt);
    userPublishedAt = dt.toLocaleString();
    realCommentId = allComments[0].items[0].id;
    for (var i = 0; i < allComments.length; i++) {
      for (var j = 0; j < allComments[i].items.length; j++) {
        commentCount+=1;
      }
    }
    commentCountAll = commentCount;
    document.getElementById('comment-count').innerText = commentCount+'/'+commentCountAll;
    $('<div class="swiper-slide"><div class="list-group"><div class="list-group-item list-group-item-action flex-column align-items-start">	<div class="d-flex w-100 justify-content-between"><img class="d-block img-fluid rounded-circle float-left" src='+ userIcon +' style="	width: 60px;	height: 60px;">	<h2 class="mb-1 flex-row justify-content-start align-items-end flex-grow-1 d-flex mx-2" style="">'+userName+' </h2> <small class="text-muted">'+userPublishedAt+'</small></div><h3 class="my-2">'+userComment+'</h3></div></div></div>').appendTo('#swiper-wrapper');
    console.log($('#listbox'));
    var el = document.getElementById('listbox');
    var sortable = Sortable.create(el, {
        group: 'hoge',
        animation: 100
    });
    linkCheck();
    loadPlayer(id,videoSecond);
    console.log(title);
  }
}

/**
 * [commentThreadsApi 指定したvideoIdのコメントid一覧を取得]
 * @param  {[String]} v [videoId]
 * @param  {[String]} t [token]
 * @return {[type]}   [description]
 */
function commentThreadsApi(v, t, n, callback) {
  gapi.client.load('youtube', 'v3', function () {
    var request = gapi.client.youtube.commentThreads.list({
      videoId: v,
      part: 'snippet',
      access_token: t,
      pageToken: n
    });
    request.execute(function (response) {
      callback(response, response.nextPageToken, v, t);
    });
  });
}

/**
 * [フォーム内コメントを送信する]
 * @return {[type]} [description]
 */
function commentSend() {
  document.getElementById('send-click').disabled = 'disabled';
  console.log(inputText);
  gapi.client.load('youtube', 'v3', function () {
    var request = gapi.client.youtube.comments.insert({
      part:'snippet',
      access_token:tokenResult,
    },{
      snippet:{
        parentId:realCommentId,
        textOriginal:document.getElementById('form35').value
      }
    });
    request.execute(function(response){
      console.log(response.error);
      if(200 < response.code){
        toastr.info('送信エラー');
      }else{
        toastr.info('送信しました');
        commentNext();
        document.getElementById('form35').value = '';
      }
      document.getElementById('send-click').disabled = '';
    })
  });
}

/**
 * [次のコメントに移動]
 * @return {[type]} [description]
 */
function commentNext(){
  document.getElementById('send-click').disabled = '';
  $('textarea').focus();
  commentCounter+=1;
  var k = Math.floor(commentCounter/20);
  var l = Math.floor(commentCounter%20);
  if(commentCounter<commentCountAll){
    userIcon = allComments[k].items[l].snippet.topLevelComment.snippet.authorProfileImageUrl;
    userName = allComments[k].items[l].snippet.topLevelComment.snippet.authorDisplayName;
    userComment = allComments[k].items[l].snippet.topLevelComment.snippet.textDisplay;
    userPublishedAt = allComments[k].items[l].snippet.topLevelComment.snippet.updatedAt;
    realCommentId = allComments[k].items[l].id;
    dt = new Date(userPublishedAt);
    userPublishedAt = dt.toLocaleString();
    document.getElementById('swiper-wrapper').textContent = null;
    $('<div class="swiper-slide"><div class="list-group"><div class="list-group-item list-group-item-action flex-column align-items-start">	<div class="d-flex w-100 justify-content-between"><img class="d-block img-fluid rounded-circle float-left" src='+ userIcon +' style="	width: 60px;	height: 60px;">	<h2 class="mb-1 flex-row justify-content-start align-items-end flex-grow-1 d-flex mx-2" style="">'+userName+' </h2> <small class="text-muted">'+userPublishedAt+'</small></div><h3 class="my-2">'+userComment+'</h3></div></div></div>').appendTo('#swiper-wrapper');
    commentCount-=1;
    document.getElementById('comment-count').innerHTML = commentCount+'/'+commentCountAll;
  }else{
    commentCounter = commentCountAll-1;
  }
  console.log(k);
  console.log(l);
  linkCheck();
}
/**
 * [前のコメントに移動]
 * @return {[type]} [description]
 */
function commentPrev(){
  commentCounter-=1;
  document.getElementById('send-click').disabled = '';
  $('textarea').focus();
  var k = Math.floor(commentCounter/20);
  var l = Math.floor(commentCounter%20);
  if(0 <= commentCounter){
    userIcon = allComments[k].items[l].snippet.topLevelComment.snippet.authorProfileImageUrl;
    userName = allComments[k].items[l].snippet.topLevelComment.snippet.authorDisplayName;
    userComment = allComments[k].items[l].snippet.topLevelComment.snippet.textDisplay;
    userPublishedAt = allComments[k].items[l].snippet.topLevelComment.snippet.updatedAt;
    realCommentId = allComments[k].items[l].id;
    dt = new Date(userPublishedAt);
    userPublishedAt = dt.toLocaleString();
    document.getElementById('swiper-wrapper').textContent = null;
    $('<div class="swiper-slide"><div class="list-group"><div class="list-group-item list-group-item-action flex-column align-items-start">	<div class="d-flex w-100 justify-content-between"><img class="d-block img-fluid rounded-circle float-left" src='+ userIcon +' style="	width: 60px;	height: 60px;">	<h2 class="mb-1 flex-row justify-content-start align-items-end flex-grow-1 d-flex mx-2" style="">'+userName+' </h2> <small class="text-muted">'+userPublishedAt+'</small></div><h3 class="my-2">'+userComment+'</h3></div></div></div>').appendTo('#swiper-wrapper');
    commentCount+=1;
    document.getElementById('comment-count').innerHTML  = commentCount+'/'+commentCountAll;
  }else{
    commentCounter = 0;
  }
  linkCheck();
  localStorage.removeItem('templateList');
}

/**
 * [現在ログイン中のユーザ名を表示する]
 * @return {[type]} [description]
 */
function currentLoginUser(){
  gapi.client.load('youtube', 'v3', function () {
    var request = gapi.client.youtube.channels.list({
      part:'snippet',
      access_token:tokenResult,
      mine:true
    });
    request.execute(function(response){
      loginUserName = response.items[0].snippet.title
      document.getElementById('login-user-name').innerHTML = 'ログイン中のユーザ名:'+loginUserName;
    })
  });
}

/**
 * [作業中の動画の情報を取得(予備)]
 * @return {[type]} [description]
 */
function videoInfo(){
  gapi.client.load('youtube', 'v3', function () {
    var request = gapi.client.youtube.videos.list({
      part:'snippet',
      access_token:tokenResult,
      id:id
    });
    request.execute(function(response){
      videoPublishedAt = response.items[0].snippet.publishedAt
      console.log(response);
    })
  });
}


document.addEventListener('DOMContentLoaded',function(){
  document.getElementById('send-click').addEventListener('click',commentSend);
  document.getElementById('next-button').addEventListener('click',commentNext);
  document.getElementById('prev-button').addEventListener('click',commentPrev);
  document.getElementById('logout-button').addEventListener('click',logout);
  });
document.addEventListener('DOMContentLoaded',function(){
  document.getElementById('ntya').addEventListener('click',function(){
        var aa = document.getElementById('ntya').textContent;
        console.log(aa);
        document.getElementById('form35').value = aa;
      });

      document.getElementById('ari').addEventListener('click',function(){
        var aa = document.getElementById('ari').textContent;
        console.log(aa);
        document.getElementById('form35').value = aa;
      });

      document.getElementById('nan').addEventListener('click',function(){
        var aa = document.getElementById('nan').textContent;
        console.log(aa);
        document.getElementById('form35').value = aa;
      });
      document.getElementById('del-button').addEventListener('click',function(){
        var aa = document.getElementById('nan').textContent;
        console.log(aa);
        document.getElementById('form35').value = aa;
      });
    });

// document.addEventListener('DOMContentLoaded',function(){
//   document.getElementById('form35').addEventListener('input',print);
// });
//
// function print(){
//   inputText = document.getElementById('form35').value;
// }




/**
 * ローディング画面
 */
$(function() {
  var h = $(window).height();

  $('#wrap').css('display','none');
  $('#loader-bg ,#loader').height(h).css('display','block');
});


//30秒たったら強制的にロード画面を非表示
$(function(){
  setTimeout('stopload()',30000);
});

function stopload(){
  $('#wrap').css('display','block');
  $('#loader-bg').delay(900).fadeOut(800);
  $('#loader').delay(600).fadeOut(300);
};

$(function($){
  //←+enter
  $(window).keydown(function(e){
    if(event.shiftKey){
      if(e.keyCode === 37){
        commentPrev();
        return false;
      }else if(e.keyCode === 38 || e.keyCode === 40){
        commentSend();
        return false;
      }else if(e.keyCode === 39){
        commentNext();
         return false;
      }
    }
  });
});


/**
 * [ユーザログアウト]
 * @return {[type]} [description]
 */
function logout(){
  chrome.identity.removeCachedAuthToken({
      token: tokenResult
    },
    function(tokenUrl) {
      var x = new XMLHttpRequest();
      x.open('GET','https://accounts.google.com/o/oauth2/revoke?token=' +tokenResult);
      x.onload = function () {

      };
      x.onloadend = function () {
        // $('#fakeLoader').hide();
      };
      x.send();
    //   chrome.tabs.getSelected(window.id, function(tab){
    //   }
    // );
    chrome.tabs.getSelected(null, function(tab) {
chrome.tabs.remove(tab.id);
});
    }
);
}
window.onbeforeunload = linkCheck;

function linkCheck(event){
  $('a').each(function() {
    var $href = $(this).attr('href');
    console.log($href);
    lkUrlvId = /[/?=]([-\w]{11})/.exec($href);
    console.log(lkUrlvId);
    if (lkUrlvId != null) {
      $(this).addClass('disable');
    }
  });

  $(function(){
    $('a.disable').click(function(){
      // event.preventDefault();
      linkVideoTime = $(this).attr('href').indexOf('&t=')
      lkUrlvId = /[/?=]([-\w]{11})/.exec($(this).attr('href'));
      console.log(linkVideoTime);
      if(0 <= linkVideoTime){
        videoSecond = hmsToSecondsOnly($(this).context.innerText);
        console.log(videoSecond);
      }else{
        videoSecond = 0;
      }
      return loadPlayer2(lkUrlvId[1],videoSecond);
    });
  });
}

//初期プレイヤーの生成
function loadPlayer(vid,seconds) {
  console.log('loadPlayer');
  console.log(vid+seconds);
	//プレイヤー生成
	player = new YT.Player('player', {
	height: '360',
	width: '640',
	videoId: vid,
	events: {
		}
	});
  return false;
}

function loadPlayer2(vid,seconds) {
  console.log('loadPlayer');
  console.log(vid+seconds);
	//プレイヤー生成
  $('iframe').replaceWith('<div id="player"></div>');
	player = new YT.Player('player', {
	height: '360',
	width: '640',
	videoId: vid,
  start:seconds,
	events: {
    'onReady':onPlayerReady
  },
  playerVars: {
	'rel': 0,
	'autoplay': 0,
	'wmode': 'opaque',
	'origin': location.protocol + '//' + location.hostname + '/'
}
	});
  return false;
}
function onPlayerReady(){
  player.seekTo(videoSecond,true);
}

// function linkPlayer(vid,seconds){
//   playerCome.loadVideoById({
// 	videoId: vid,
//   startSeconds:seconds
// });
// }

//hh:mm:ss形式の文字列を秒単位に変換する
function hmsToSecondsOnly(str) {
    var p = str.split(':'),
        s = 0, m = 1;

    while (p.length > 0) {
        s += m * parseInt(p.pop(), 10);
        m *= 60;
    }

    return s;
}

/**
 * template処理
 * @return {[type]} [description]
 */

function templateDelete(id){

}
/**
 * [templateSet templateをlocalstorageと画面に追加する]
 * @return {[type]} [description]
 */
function templateAdd(word){
  templateList = localStorage.getItem('templateList')
  if(!templateList){
    //初回起動時Json登録
    templateList = JSON.stringify(templateListJson);
    localStorage.setItem('templateList',templateList);
  }else{
    templateListJson = JSON.parse(templateList);
    if(templateListJson.templateList1.length < 6){
      templateListJson.templateList1.push(word);
      localStorage.setItem('templateList',JSON.stringify(templateListJson));
      $('#list-group-template').append($('<li class="list-group-item list-group-item-action justify-content-between d-flex flex-row align-items-center"> <a class="navbar-brand2 text-body justify-content-center" href="#">Cras justo odio</a> <span class="badge badge-danger shadow-none border border-danger text-center rounded-top" style="	box-shadow: 0px 0px 0px  black;">☓</span> </li>'));
    }else{
      console.log(templateListJson.templateList1.length);
      toastr.warning('テンプレート容量オーバーです。一つ削除してください。');
    }

  }
}
function templateReload(){
  templateList = localStorage.getItem('templateList');
  if(templateList)
  templateListJson = JSON.parse(localStorage.getItem('templateList'));
}
$(document).ready(function() {
  // $('.list-group').append($('<li class="list-group-item list-group-item-action justify-content-between d-flex flex-row align-items-center"> <a class="navbar-brand2 text-body justify-content-center" href="#">Cras justo odio</a> <span class="badge badge-danger shadow-none border border-danger text-center rounded-top" style="	box-shadow: 0px 0px 0px  black;">☓</span> </li>'))
    $('.btn btn-info').on('click','',function(){
      if(templateList.lengtth<6){
        templateList.push($('#template-form').val());
        templateReload();
      }
    })
    $('.list-group').on('click','#text-listbox',function(){
      console.log('listclick');
    })
    $('#text-listbox').on('click','#del-button', function(e){
        e.stopPropagation();
        $(this).parents('li').remove();
    })
    $('.input-group-append').on('click','#template-add-button',function(){
      templateAdd();
    })
});
