// Additional script
var base_url = window.location.origin;
var queryString = window.location.search;
// console.log(queryString);

var new_init = false;
var repeat = false;
var play_yt_vm = false;
var played = false;

var video_YT_obj = document.getElementById("video_YT");
var video_obj = document.getElementById("video");

var url = "";
var new_url = "";
var str_pattern_loop = "?loop=true";

var player_cfg = {
    captions: {
        active: true,
        language: 'auto',
    },
    loop: {
        active: repeat,
    },
    controls: [
        'play-large',
        'restart',
        'play',
        'progress',
        'current-time',
        'duration',
        'mute',
        'volume',
        'captions',
        'settings',
        'pip',
        'airplay',
        // 'download',
        'fullscreen',
    ],
    autoplay: true,
};

if (queryString.length > 0) {
    // console.log(queryString.indexOf(str_pattern_loop))
    if (queryString.indexOf(str_pattern_loop) != -1) {
        document.getElementById("cb_repeat").checked = true;
        repeat = true;
    }
}

video_obj.style.display = 'none';

update_ui_url();

function watch() {
    url = document.getElementById("url").value;
    if (url.length < 1) {
        return;
    } else {
        new_init = true;
        repeat = document.getElementById("cb_repeat").checked;
        console.log("repeat: " + repeat);

        update_ui_url();
        if (played == true) {
            location.reload();
            played = false;
            new_init = true;
        }

        var video_id = "";
        var str_pattern_video = "";

        if ((queryString.indexOf("youtube.com") != -1) || (queryString.indexOf("youtu.be") != -1)) // youtube.com or youtu.be in url
        {
            play_yt_vm = true;

            if (queryString.indexOf("youtube.com") != -1) {
                str_pattern_video = "youtube.com/watch?v=";
                video_id = url.substring(url.indexOf(str_pattern_video) + str_pattern_video.length);
            } else if (queryString.indexOf("youtu.be") != -1) {
                str_pattern_video = "youtu.be/";
                video_id = url.substring(url.indexOf(str_pattern_video) + str_pattern_video.length);
            }

            if (video_id.length > 1) {
                video_YT_obj.setAttribute("data-plyr-provider", "youtube");
                video_YT_obj.setAttribute("data-plyr-embed-id", video_id);
            }
            console.log("youtube video_id: " + video_id);
        } else if (queryString.indexOf("vimeo") != -1) // vimeo.com in url
        {
            play_yt_vm = true;

            str_pattern_video = "vimeo.com/";
            video_id = url.substring(url.indexOf(str_pattern_video) + str_pattern_video.length);

            if (video_id.length > 1) {
                video_YT_obj.setAttribute("data-plyr-provider", "vimeo");
                video_YT_obj.setAttribute("data-plyr-embed-id", "video_id");
            }
            console.log("vimeo video_id: " + video_id);
        }
    }
    console.log("play_yt_vm: " + play_yt_vm);

    if (play_yt_vm == false) {
        video_obj.style.display = 'block';
        video_YT_obj.style.display = 'none';

        // Change the second argument to your options:
        // https://github.com/sampotts/plyr/#options
        // https://github.com/sampotts/plyr/blob/master/src/js/config/defaults.js
        var player = new Plyr('#video', [player_cfg]);
        // console.log(player);

        // Expose player so it can be used from the console
        window.player = player;
        player.play(); // Start playback
        played = true;
    } else {
        video_obj.style.display = 'none';
        video_YT_obj.style.display = 'block';

        // Change the second argument to your options:
        // https://github.com/sampotts/plyr/#options
        // https://github.com/sampotts/plyr/blob/master/src/js/config/defaults.js
        var player_YT = new Plyr('#video_YT', [player_cfg]);
        // console.log(player_YT);

        // Expose player so it can be used from the console
        window.player = player_YT;
        player_YT.play(); // Start playback
        played = true;
    }
}

function update_ui_url() {
    if (url.length < 1) {
        url = queryString.substring(queryString.indexOf("http"));
        if (url.length == -1) {
            return;
        }
    }

    url = url.substring(url.indexOf("http"));
    if (url.indexOf(str_pattern_loop) != -1) {
        url = url.replace(str_pattern_loop, "");
    }
    console.log(url);

    document.getElementById("url").value = url;

    new_url = base_url;
    if (repeat == true) {
        new_url = new_url + str_pattern_loop;
    }
    new_url = new_url + "?url=" + url;
    console.log(new_url);

    document.getElementById("org_url").innerHTML = url;
    document.getElementById("org_url").href = url;

    if (url.length > 1) {
        document.getElementById("mp4_url").innerHTML = new_url;
        document.getElementById("mp4_url").href = new_url;
    }

    video_obj.src = url;
    if (new_init == true) {
        window.history.pushState({ path: base_url }, '', mp4_url);
        new_init = false;
    }
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
