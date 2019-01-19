var url = location.href ;
console.log('url');
if ( url.match(/youtube/)) {
document.getElementById('comebtn').disabled = '';
document.getElementById('heartbtn').disabled = '';
}
