// Change the second argument to your options:
// https://github.com/sampotts/plyr/#options
const player = new Plyr('video', { captions: { active: true } });

// Expose player so it can be used from the console
window.player = player;

function watch() {
    var x = document.getElementById("url").value;
    document.getElementById("mp4_url").innerHTML = x;
    document.getElementById("mp4_url").href = x;
    document.getElementById("video").src = x;
  }
