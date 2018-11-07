//pageToken格納用変数
var nextPageToken = '';
var token = '';
var allComments = [];

/**
 * [commentThreadsApi 指定したvideoIdのコメントid一覧を取得]
 * @param  {[String]} v [videoId]
 * @param  {[String]} t [token]
 * @return {[type]}   [description]
 */
function commentThreadsApi(v,t,n,callback) {
  gapi.client.load('youtube', 'v3', function() {
    var request = gapi.client.youtube.commentThreads.list({
      videoId: v,
      part: 'snippet',
      access_token: t,
      pageToken: n
    });
    request.execute(function(response) {
      callback(response,response.nextPageToken,v,t);
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
function getAllComments(json,n,v,t){
    console.log('response:', json);
    console.log(nextPageToken);
    allComments.push(json)
    if('nextPageToken' in json){
      commentThreadsApi(v,t,n,getAllComments);
    }
    console.log(allComments[4]);
}

/**
 * [startExecute description]
 * @return {[type]} [description]
 */
function startExecute(){
  var currentTab = ''
  chrome.tabs.getSelected(null, function(tab) {
      currentTab = tab.url;
      var id = /[/?=]([-\w]{11})/.exec(tab.url);
      console.log(id);
      if(id !=null){
        chrome.identity.getAuthToken({
          interactive: true
        }, function(token) {
          if (chrome.runtime.lastError) {
            alert(chrome.runtime.lastError.message);
            return;
          }
          var x = new XMLHttpRequest();
          x.open('GET', 'https://www.googleapis.com/oauth2/v1/tokeninfo?alt=json&access_token=' + token);
          x.onload = function() {
            commentThreadsApi(id[1],token,nextPageToken,getAllComments);
            console.log(nextPageToken);
          };
          console.log(allComments[0]);
          x.send();
        });
      }
  });
}

function commentListSet(json){

}

chrome.browserAction.onClicked.addListener(startExecute);
