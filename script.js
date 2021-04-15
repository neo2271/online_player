// Additional script
var base_url = window.location.origin;
var queryString = window.location.search;
// console.log(queryString);

var repeat;

var url = "";
var new_url = "";
var str_pattern_loop = "?loop=true";

if (queryString.length > 0) {
    // console.log(queryString.indexOf(str_pattern_loop))
    if (queryString.indexOf(str_pattern_loop) != -1 )
    {
        document.getElementById("cb_repeat").checked = true;
    }
}

update_ui_url();

function watch() {
    url = document.getElementById("url").value;
    if (url.length < 1)
    {
        return;
    } else
    {
        var video_id = "";
        var str_pattern_video = "";
        if ((queryString.indexOf("youtube.com") != -1 ) || (queryString.indexOf("youtu.be") != -1 )) // youtube.com or youtu.be in url
        {
            if (queryString.indexOf("youtube.com") != -1 )
            {
                str_pattern_video = "youtube.com/watch?v=";
                video_id = url.substring(url.indexOf(str_pattern_video) + str_pattern_video.length);
            } else if (queryString.indexOf("youtu.be") != -1 )
            {
                str_pattern_video = "youtu.be/";
                video_id = url.substring(url.indexOf(str_pattern_video) + str_pattern_video.length);
            }

            if (video_id.length > 1)
            {
                document.getElementById("video").setAttribute("data-plyr-provider", "youtube");
                document.getElementById("video").setAttribute("data-plyr-embed-id", video_id);
            }
            console.log("youtube video_id: " + video_id);
        } else if (queryString.indexOf("vimeo") != -1 ) // vimeo.com in url
        {
            str_pattern_video = "vimeo.com/";
            video_id = url.substring(url.indexOf(str_pattern_video) + str_pattern_video.length);

            if (video_id.length > 1)
            {
                document.getElementById("video").setAttribute("data-plyr-provider", "vimeo");
                document.getElementById("video").setAttribute("data-plyr-embed-id", "video_id");
            }
            console.log("vimeo video_id: " + video_id);
        }
    }

    repeat = document.getElementById("cb_repeat").checked;
    // console.log("repeat: " + repeat);

    // Change the second argument to your options:
    // https://github.com/sampotts/plyr/#options
    // https://github.com/sampotts/plyr/blob/master/src/js/config/defaults.js
    var player = new Plyr('#video', {
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
            'rewind',
            'play',
            'fast-forward',
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
    });
    // console.log(player);

    // Expose player so it can be used from the console
    window.player = player;

    update_ui_url();
    player.play(); // Start playback
}

function update_ui_url() {
    if (url.length < 1)
    {
        url = queryString.substring(queryString.indexOf("http"));
        if (url.length == -1)
        {
            return;
        }
    }

    url = url.substring(url.indexOf("http"));
    if (url.indexOf(str_pattern_loop) != -1)
    {
        url = url.replace(str_pattern_loop, "");
    }
    console.log(url);

    document.getElementById("url").value  = url;

    new_url = base_url;
    if (repeat == true)
    {
        new_url = new_url + str_pattern_loop;
    }
    new_url = new_url + "?url=" + url;
    // console.log(new_url);

    document.getElementById("org_url").innerHTML = url;
    document.getElementById("org_url").href = url;

    if (url.length > 1)
    {
        document.getElementById("mp4_url").innerHTML = new_url;
        document.getElementById("mp4_url").href = new_url;
    }

    document.getElementById("video").src = url;
    window.history.pushState({path:base_url},'',mp4_url);
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
