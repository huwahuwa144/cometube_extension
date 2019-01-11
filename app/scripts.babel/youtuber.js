'use strict';

//pageToken格納用変数
var nextPageToken = '';
var tokenResult;
var allComments = [];
var flg = 1;
var title = '';
var id;
var userIcon;
var userName;
var userComment;
var userPublishedAt;
var commentCount = 0;
var commentCounter = 0;
var commentCountAll = 0;
var realCommentId;
var inputText;
var s;
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  parseItems = [];
  console.log(sender);
  id = sender.videoId;
  var res = 'finish';
  sendResponse(res);
});

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
    currentLoginUser();
    commentThreadsApi(id, token, nextPageToken, getAllComments);
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
    realCommentId = allComments[0].items[0].id;
    for (var i = 0; i < allComments.length; i++) {
      for (var j = 0; j < allComments[i].items.length; j++) {
        commentCount+=1;
      }
    }
    commentCountAll = commentCount;
    document.getElementById('comment-count').innerText = commentCount;
    $('<div class="swiper-slide"><div class="list-group"><a href="#" class="list-group-item list-group-item-action flex-column align-items-start">	<div class="d-flex w-100 justify-content-between"><img class="d-block img-fluid rounded-circle float-left" src='+ userIcon +' style="	width: 80px;	height: 80px;">	<h2 class="mb-1 flex-row justify-content-start align-items-end flex-grow-1 d-flex mx-2" style="">'+userName+' </h2> <small class="text-muted">'+userPublishedAt+'</small></div><h3 class="my-2">'+userComment+'</h3></a></div></div>').appendTo('#swiper-wrapper');
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
      console.log(response);
      toastr.info('送りました');
      document.getElementById('send-click').disabled = '';
    })
  });
}

function commentNext(){
  document.getElementById('send-click').disabled = '';
  commentCounter+=1;
  var k = Math.floor(commentCounter/20);
  var l = Math.floor(commentCounter%20);
  if(commentCounter<commentCountAll){
    userIcon = allComments[k].items[l].snippet.topLevelComment.snippet.authorProfileImageUrl;
    userName = allComments[k].items[l].snippet.topLevelComment.snippet.authorDisplayName;
    userComment = allComments[k].items[l].snippet.topLevelComment.snippet.textDisplay;
    userPublishedAt = allComments[k].items[l].snippet.topLevelComment.snippet.updatedAt;
    realCommentId = allComments[k].items[l].id;
    document.getElementById('swiper-wrapper').textContent = null;
    $('<div class="swiper-slide"><div class="list-group"><a href="#" class="list-group-item list-group-item-action flex-column align-items-start">	<div class="d-flex w-100 justify-content-between"><img class="d-block img-fluid rounded-circle float-left" src='+ userIcon +' style="	width: 80px;	height: 80px;">	<h2 class="mb-1 flex-row justify-content-start align-items-end flex-grow-1 d-flex mx-2" style="">'+userName+' </h2> <small class="text-muted">'+userPublishedAt+'</small></div><h3 class="my-2">'+userComment+'</h3></a></div></div>').appendTo('#swiper-wrapper');
    commentCount-=1;
    document.getElementById('comment-count').innerHTML = commentCount
  }else{
    commentCounter = commentCountAll-1;
  }
  console.log(k);
  console.log(l);
}

function commentPrev(){
  commentCounter-=1;
  var k = Math.floor(commentCounter/20);
  var l = Math.floor(commentCounter%20);
  if(0 <= commentCounter){
    userIcon = allComments[k].items[l].snippet.topLevelComment.snippet.authorProfileImageUrl;
    userName = allComments[k].items[l].snippet.topLevelComment.snippet.authorDisplayName;
    userComment = allComments[k].items[l].snippet.topLevelComment.snippet.textDisplay;
    userPublishedAt = allComments[k].items[l].snippet.topLevelComment.snippet.updatedAt;
    realCommentId = allComments[k].items[l].id;
    document.getElementById('swiper-wrapper').textContent = null;
    $('<div class="swiper-slide"><div class="list-group"><a href="#" class="list-group-item list-group-item-action flex-column align-items-start">	<div class="d-flex w-100 justify-content-between"><img class="d-block img-fluid rounded-circle float-left" src='+ userIcon +' style="	width: 80px;	height: 80px;">	<h2 class="mb-1 flex-row justify-content-start align-items-end flex-grow-1 d-flex mx-2" style="">'+userName+' </h2> <small class="text-muted">'+userPublishedAt+'</small></div><h3 class="my-2">'+userComment+'</h3></a></div></div>').appendTo('#swiper-wrapper');
    commentCount+=1;
    document.getElementById('comment-count').innerHTML = commentCount
  }else{
    commentCounter = 0;
  }
}

function currentLoginUser(){
  gapi.client.load('youtube', 'v3', function () {
    var request = gapi.client.youtube.channels.list({
      part:'snippet',
      access_token:tokenResult,
      mine:true
    });
    request.execute(function(response){
      document.getElementById('login-user-name').innerHTML = 'ログイン中のユーザ名:'+response.items[0].snippet.title
    })
  });
}


document.addEventListener('DOMContentLoaded',function(){
  document.getElementById('send-click').addEventListener('click',commentSend);
  document.getElementById('next-button').addEventListener('click',commentNext);
  document.getElementById('prev-button').addEventListener('click',commentPrev);

  });
document.addEventListener('DOMContentLoaded',function(){
  document.getElementById('ntya').addEventListener('click',function(){
        var aa = document.getElementById('ntya').textContent;
        console.log(aa);
        document.getElementById('form35').innerHTML = aa;
      });

      document.getElementById('ari').addEventListener('click',function(){
        var aa = document.getElementById('ari').textContent;
        console.log(aa);
        document.getElementById('form35').innerHTML = aa;
      });

      document.getElementById('nan').addEventListener('click',function(){
        var aa = document.getElementById('nan').textContent;
        console.log(aa);
        document.getElementById('form35').innerHTML = aa;
      });
    });
// document.addEventListener('DOMContentLoaded',function(){
//   document.getElementById('form35').addEventListener('input',print);
// });
//
// function print(){
//   inputText = document.getElementById('form35').value;
// }




//ローディング
$(function() {
  var h = $(window).height();

  $('#wrap').css('display','none');
  $('#loader-bg ,#loader').height(h).css('display','block');
});


//10秒たったら強制的にロード画面を非表示
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
        alert('←+enter');
         return false;
      }else if(e.keyCode === 39){
        commentNext();
         return false;
      }
    }
  });
});
