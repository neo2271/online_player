// WE NEED THE YouTUBE iFrame API
var script = document.createElement("script");
script.src = 'https://www.youtube.com/iframe_api';
document.head.appendChild(script);

var queryString = window.location.search;
var str_pattern_id = "?v=";
var str_pattern_rate = "&r=";

var videoId = queryString.substring(queryString.indexOf(str_pattern_id) + str_pattern_id.length);
var playbackRate = 1;
if (queryString.indexOf(str_pattern_rate) != -1) {
  videoId = queryString.substring(queryString.indexOf(str_pattern_id) + str_pattern_id.length, queryString.indexOf(str_pattern_rate));
  playbackRate = queryString.substring(queryString.indexOf(str_pattern_rate) + str_pattern_rate.length);
}
console.log("videoId: " + videoId);
console.log("playbackRate: " + playbackRate);

// INI VAR
var player;
var isPlaying = false;

// BUILD VIDEO
function onYouTubeIframeAPIReady() {
  player = new YT.Player('YouTube', {
    height: '360',
    width: '640',
    videoId: videoId,
    events: {
      'onReady': current_duration,
    }
  });
}

// PLAY FUNCTION
function start_player() {
  player.setPlaybackRate(parseFloat(playbackRate));
  player.setLoop(true)
  player.playVideo();
}

// DURATION TIME HELPER
function current_duration(stop) {
  if (stop == true) {
    var time = player.getDuration();
  } else {
    var time = player.getDuration() - player.getCurrentTime();
  }
  var minutes = Math.floor(time / 60);
  var seconds = Math.floor(time - minutes * 60);
  seconds = seconds.toString();
  seconds = seconds.padStart(2, '0');
  document.querySelector('.duration').innerHTML = minutes + ':' + seconds;
}

// TOGGLE PLAY BUTTON AND PLAY VIDEO AND SHOW TIME
function toggle_player() {
  if (isPlaying) {
    isPlaying = false;
    player.pauseVideo();
    document.querySelector('.player-button').classList.remove('playing');
    // current_duration(true);
    clearInterval(intervalID);
  } else {
    isPlaying = true;
    player.playVideo();
    document.querySelector('.player-button').classList.add('playing');
    intervalID = setInterval(current_duration, 1000);
  }
}
