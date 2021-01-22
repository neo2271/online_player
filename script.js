// Change the second argument to your options:
// https://github.com/sampotts/plyr/#options
const player = new Plyr('video', { captions: { active: true } });

// Expose player so it can be used from the console
window.player = player;

// Additional script
var base_url = window.location.origin;
var queryString = window.location.search;
// console.log(queryString);

var url = "";
var new_url = "";

if (queryString.length > 0) {
    url = queryString.substring(queryString.indexOf("http"));

    update_ui_url();
    document.getElementById("url").value  = url;
    window.history.pushState({path:base_url},'',base_url);
}

function watch() {
    url = document.getElementById("url").value;
    url = url.substring(url.indexOf("http"));

    update_ui_url();
}

function update_ui_url() {
    new_url = base_url + "?url=" + url;

    document.getElementById("org_url").innerHTML = url;
    document.getElementById("org_url").href = url;

    document.getElementById("mp4_url").innerHTML = new_url;
    document.getElementById("mp4_url").href = new_url;

    document.getElementById("video").src = url;
}

var input = document.getElementById("url");
// Execute a function when the user releases a key on the keyboard
input.addEventListener("keyup", function(event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
      // Trigger the button element with a click
      document.getElementById("watchBtn").click();
    }
});
