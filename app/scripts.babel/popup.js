// var url = location.href ;
// console.log('url');
// if ( url.match(/youtube/)) {
//
// }
var colors = new Array(
  [62,35,255],
  [60,255,60],
  [255,35,98],
  [45,175,230],
  [255,0,255],
  [255,128,0]);

var step = 0;
//color table indices for:
// current color left
// next color left
// current color right
// next color right
var colorIndices = [0,1,2,3];

//transition speed
var gradientSpeed = 0.002;

function updateGradient()
{
console.log('gradient');
  if ( $===undefined ) return;

var c0_0 = colors[colorIndices[0]];
var c0_1 = colors[colorIndices[1]];
var c1_0 = colors[colorIndices[2]];
var c1_1 = colors[colorIndices[3]];

var istep = 1 - step;
var r1 = Math.round(istep * c0_0[0] + step * c0_1[0]);
var g1 = Math.round(istep * c0_0[1] + step * c0_1[1]);
var b1 = Math.round(istep * c0_0[2] + step * c0_1[2]);
var color1 = "rgb("+r1+","+g1+","+b1+")";

var r2 = Math.round(istep * c1_0[0] + step * c1_1[0]);
var g2 = Math.round(istep * c1_0[1] + step * c1_1[1]);
var b2 = Math.round(istep * c1_0[2] + step * c1_1[2]);
var color2 = "rgb("+r2+","+g2+","+b2+")";

 $('#gradient').css({
   background: "-webkit-gradient(linear, left top, right top, from("+color1+"), to("+color2+"))"}).css({
    background: "-moz-linear-gradient(left, "+color1+" 0%, "+color2+" 100%)"});

  step += gradientSpeed;
  if ( step >= 1 )
  {
    step %= 1;
    colorIndices[0] = colorIndices[1];
    colorIndices[2] = colorIndices[3];

    //pick two new target color indices
    //do not pick the same as the current one
    colorIndices[1] = ( colorIndices[1] + Math.floor( 1 + Math.random() * (colors.length - 1))) % colors.length;
    colorIndices[3] = ( colorIndices[3] + Math.floor( 1 + Math.random() * (colors.length - 1))) % colors.length;

  }
}

setInterval(updateGradient,10);

console.log('popup');
var id;
var title;
var message = ['myAction'];
chrome.tabs.getSelected(null, function(tab){
  console.log(tab.url);
  if (!tab.url.indexOf('https://www.youtube.com')){
    console.log('youtube');
    console.log(tab.url);
    // Amazon のページのときの処理
    document.getElementById('comebtn').disabled = '';
    document.getElementById('heartbtn').disabled = '';
  }else{
    console.log('not youtube');
    document.getElementById('comebtn').disabled = 'disabled';
    document.getElementById('heartbtn').disabled = 'disabled';
  }
});

function commentStart(){
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id,'commentStart',
            function (response) {
            });
    });
}
function startExecute() {
  var currentTab = '';
  chrome.tabs.getSelected(null, function (tab) {
    currentTab = tab.url;
    id = /[/?=]([-\w]{11})/.exec(tab.url);
    if(id != null){
      console.log(id);
      title = tab.title;
      localStorage.videoTitle = title;
      localStorage.id = id[1];
      localStorage.tabid = tab.id;
      chrome.tabs.create({'url': 'reply.html' },tab => {});
    }
  });

}

function startHeart(){
  // chrome.tabs.update(localStorage.tabid, {active: true});
  message.push(localStorage.heartListJson);
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function (tabs) {
    // ...and send a request for the DOM info...
    chrome.tabs.sendMessage(
        tabs[0].id,
        message,
        // ...also specifying a callback to be called
        //    from the receiving end (content script)
        function(){});
  });

  console.log('startHeart');
}
document.addEventListener('DOMContentLoaded',function(){
  document.getElementById('comebtn').addEventListener('click',startExecute);
});
document.addEventListener('DOMContentLoaded',function(){
  document.getElementById('heartbtn').addEventListener('click',startHeart);
});


document.addEventListener('DOMContentLoaded',function(){
  var animateButton = function(e) {

    e.preventDefault;
    //reset animation
    e.target.classList.remove('animate');

    e.target.classList.add('animate');
    setTimeout(function(){
      e.target.classList.remove('animate');
    },700);
  };

  var bubblyButtons = document.getElementsByClassName("heartbtn2");

  for (var i = 0; i < bubblyButtons.length; i++) {
    bubblyButtons[i].addEventListener('click', animateButton, false);
  }
});
