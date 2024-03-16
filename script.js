// Additional script
let base_url = window.location.origin;
let queryString = window.location.search;
// console.log(queryString);

let new_init = false;
let repeat = false;
let play_yt_vm = false;
let played = false;

let video_YT_obj = document.getElementById("video_YT");
let video_obj = document.getElementById("video");

let url = "";
let new_url = "";
let str_pattern_loop = "?loop=true";

if (queryString.length > 0) {
    // console.log(queryString.indexOf(str_pattern_loop))
    if (queryString.indexOf(str_pattern_loop) != -1) {
        document.getElementById("cb_repeat").checked = true;
        repeat = true;
    }
}

let player_cfg = {
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
        'download',
        'fullscreen',
    ],
    autoplay: true,
    clickToPlay: true,
    keyboard: {
        global: true
    },
    tooltips: {
        controls: true,
        seek: true
    },
    hideControls: true,
    settings: ['captions', 'quality', 'speed'],
};

video_obj.style.display = 'none';

update_ui_url();
get_direct_link();

function play() {
    url = document.getElementById("url").value;
    if (url.length < 1) {
        alert("Please input URL of video before !!!")
        return;
    } else {
        get_direct_link();
    }
    console.log("play_yt_vm: " + play_yt_vm);

    if (play_yt_vm === false) {
        video_obj.style.display = 'block';
        video_YT_obj.style.display = 'none';

        // Change the second argument to your options:
        // https://github.com/sampotts/plyr/#options
        // https://github.com/sampotts/plyr/blob/master/src/js/config/defaults.js
        let player = new Plyr('#video', player_cfg);
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
        let player_YT = new Plyr('#video_YT', player_cfg);
        // console.log(player_YT);

        // Expose player so it can be used from the console
        window.player = player_YT;
        player_YT.play(); // Start playback
        played = true;
    }
}

function get_direct_link() {
    new_init = true;
    repeat = document.getElementById("cb_repeat").checked;
    console.log("repeat: " + repeat);

    update_ui_url();
    if (played === true) {
        // location.reload();
        window.location.href = new_url;
        played = false;
        new_init = true;
    }

    let video_id = "";
    let str_pattern_video = "";

    if ((url.indexOf("youtube.com") != -1) || (url.indexOf("youtu.be") != -1)) // youtube.com or youtu.be in url
    {
        play_yt_vm = true;

        if (url.indexOf("youtube.com") != -1) {
            str_pattern_video = "v=";
            video_id = url.substring(url.indexOf(str_pattern_video) + str_pattern_video.length);
        } else if (url.indexOf("youtu.be") != -1) {
            str_pattern_video = "youtu.be/";
            video_id = url.substring(url.indexOf(str_pattern_video) + str_pattern_video.length);
        }
        video_id = "&v=" + video_id;

        if (video_id.length > 1) {
            video_YT_obj.setAttribute("data-plyr-provider", "youtube");
            video_YT_obj.setAttribute("data-plyr-embed-id", video_id);
        }
        console.log("youtube video_id: " + video_id);

        let api_url = "https://dev-py-svl.minhtamgroup.org/api/v1/youtube/info?url=" + url;
        console.log("api_url: " + api_url);
        $.getJSON(api_url).then(
            function (data) {
                console.log(data);
                let title = data["title"];
                let author_name = data["author_name"];
                let duration = data["duration"];
                let viewCount = data["viewCount"];
                let likeCount = data["likeCount"];
                let favoriteCount = data["favoriteCount"];
                let commentCount = data["commentCount"];
                console.log(title + " | " + author_name + " | " + duration);
                if (title.length > 0 && author_name.length > 0) {
                    document.title = duration + " | " + title + " | " + author_name + " | " + " 👀." + viewCount + " 👍." + likeCount + " 💖." + favoriteCount + " 💬." + commentCount + " | Online Player | www.minhtamgroup.org";
                    document.getElementById("org_url").innerHTML = duration + " | " + " 👀." + viewCount + " 👍." + likeCount + " 💖." + favoriteCount + " 💬." + commentCount + " | " + title + " | " + author_name + "<br/><br/>" + url;
                }
            }
        );

        api_url = "https://svl.minhtamgroup.org/api/v1/download?service=youtube&url=" + url;
        console.log("api_url: " + api_url);
        $.getJSON(api_url).then(
            function (data) {
                // console.log(data);
                // let direct_link = data.url;
                let direct_link = data["direct_link"];
                console.log("direct_link: " + direct_link);
                if (direct_link.length > 0) {
                    // window.open(direct_link, '_blank');
                    document.getElementById("direct_link").innerHTML = direct_link;
                    document.getElementById("direct_link").href = direct_link;
                }
            }
        );

        api_url = "https://svl.minhtamgroup.org/api/v1/download?service=yt&url=" + url;
        console.log("api_url: " + api_url);
        $.getJSON(api_url).then(
            function (data) {
                // console.log(data);
                // let direct_link = data.url;
                let direct_link = data["direct_link"];
                console.log("direct_link: " + direct_link);
                if (direct_link.length > 0) {
                    // window.open(direct_link, '_blank');
                    document.getElementById("direct_link_yt").innerHTML = direct_link;
                    document.getElementById("direct_link_yt").href = direct_link;
                }
            }
        );
    } else if (url.indexOf("vimeo") != -1) // vimeo.com in url
    {
        play_yt_vm = true;

        str_pattern_video = "vimeo.com/";
        video_id = url.substring(url.indexOf(str_pattern_video) + str_pattern_video.length);

        if (video_id.length > 1) {
            video_YT_obj.setAttribute("data-plyr-provider", "vimeo");
            video_YT_obj.setAttribute("data-plyr-embed-id", video_id);
        }
        console.log("vimeo video_id: " + video_id);
    } else if (url.indexOf("soundcloud.com") != -1) // soundcloud.com in url
    {
        let api_url = "https://svl.minhtamgroup.org/api/v1/download?service=soundcloud&url=" + url;
        console.log("api_url: " + api_url);

        $.getJSON(api_url).then(
            function (data) {
                // console.log(data);
                let direct_link = data.direct_link;
                console.log("direct_link: " + direct_link);
                if (direct_link.length > 0) {
                    // window.open("https://play.minhtamgroup.org/?url=" + direct_link, '_blank');
                    video_obj.src = direct_link
                    document.getElementById("direct_link").innerHTML = direct_link;
                    document.getElementById("direct_link").href = direct_link;
                }
            }
        );
    }

}

function update_ui_url() {
    if (url.length < 1) {
        url = queryString.substring(queryString.indexOf("http"));
        if (url.length === -1) {
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
    if (repeat === true) {
        new_url = new_url + str_pattern_loop;
        new_url = new_url + "&url=" + url;
    } else {
        new_url = new_url + "?url=" + url;
    }
    console.log(new_url);

    document.getElementById("org_url").innerHTML = url;
    document.getElementById("org_url").href = url;

    if (url.length > 1) {
        document.getElementById("mp4_url").innerHTML = new_url;
        document.getElementById("mp4_url").href = new_url;
    }

    video_obj.src = url;
    if (new_init === true) {
        // window.history.pushState({ path: base_url }, '', mp4_url);
        new_init = false;
    }
}

document.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        document.getElementById("playBtn").click();
    }
});
