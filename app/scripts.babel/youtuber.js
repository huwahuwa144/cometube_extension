//pageToken格納用変数
var nextPageToken = '';
var token = '';
var allComments = [];
var flg = 1;
var title = '';
var id;
chrome.runtime.onMessage.addListener(
	function(request,sender,sendResponse){
		parseItems = [];
		console.log(sender);
    id = sender.videoId;
		var res = 'finish';
		sendResponse(res);


	}
);
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
  x.onloadend = function(){

  }
  x.send();
  // if(flg == 0){
  //   //reply html に飛ばす

  // }
});

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
  }else{
    document.getElementById('movieTitle').innerText = title;
		for(let i = 0 ;i < allComments.length;i++){
			console.log(allComments[i]);
			for(let j = 0;j < 1;i++){
					$('<div class="swiper-slide"><div class="list-group"><a href="#" class="list-group-item list-group-item-action flex-column align-items-start">	<div class="d-flex w-100 justify-content-between"><img class="d-block img-fluid rounded-circle float-left" src="https://pingendo.com/assets/photos/wireframe/photo-1.jpg" style="	width: 80px;	height: 80px;">	<h2 class="mb-1 flex-row justify-content-start align-items-end flex-grow-1 d-flex mx-2" style="">ユーザー名 </h2> <small class="text-muted">コントの時間表示</small></div><h3 class="my-2">ここにyoutubeのコメント</h3></a></div></div>').appendTo('#swiper-wrapper-id');
			}
		}
    console.log(title);
  }
}

function commentSend(){
	gapi.client.load('youtube','v3',function(){
		var request = gapi.client.youtube.comments.insert({

		})
	});
}
