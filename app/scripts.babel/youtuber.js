'use strict';

//pageToken格納用変数
var nextPageToken = '';
var token = '';
var allComments = [];
var flg = 1;
var title = '';
var id;
var userIcon;
var userName;
var userComment;
var userPublishedAt;
var commentCount;
var commentCounter;
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
  if (chrome.runtime.lastError) {
    alert(chrome.runtime.lastError.message);
    return;
  }
  var x = new XMLHttpRequest();
  x.open('GET', 'https://www.googleapis.com/oauth2/v1/tokeninfo?alt=json&access_token=' + token);
  x.onload = function () {
    commentThreadsApi(id, token, nextPageToken, getAllComments);
  };
  x.onloadend = function () {};
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
    document.getElementById('movieTitle').innerText = title;
    userIcon = allComments[0].items[0].snippet.topLevelComment.snippet.authorProfileImageUrl
    userName = allComments[0].items[0].snippet.topLevelComment.snippet.authorDisplayName
    userComment = allComments[0].items[0].snippet.topLevelComment.snippet.textDisplay
    userPublishedAt = allComments[0].items[0].snippet.topLevelComment.snippet.updatedAt

    for (var i = 0; i < allComments.length; i++) {
      for (var j = 0; j < allComments[i].items.length; j++) {
        commentCount+=1;
      }
    }
    $('<div class="swiper-slide"><div class="list-group"><a href="#" class="list-group-item list-group-item-action flex-column align-items-start">	<div class="d-flex w-100 justify-content-between"><img class="d-block img-fluid rounded-circle float-left" src='+ userIcon +' style="	width: 80px;	height: 80px;">	<h2 class="mb-1 flex-row justify-content-start align-items-end flex-grow-1 d-flex mx-2" style="">'+userName+' </h2> <small class="text-muted">'+publishedAt+'</small></div><h3 class="my-2">'+userComment+'</h3></a></div></div>').appendTo('#swiper-wrapper');
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

function commentSend(token,id,text) {
  gapi.client.load('youtube', 'v3', function () {
    var request = gapi.client.youtube.comments.insert({
      part:'snippet',
      access_token:token,
    },{
      snippet:{
        parentId:id,
        textOriginal:text
      }
    });
    request.execute(function(response){

    })
  });
}
