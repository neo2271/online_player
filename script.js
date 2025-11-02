// Additional script
// Khai báo biến player toàn cục để quản lý instance Plyr
window.player = null;

function hideAllPlayers() {
    // Destroy player hiện tại nếu có
    if (window.player && typeof window.player.destroy === 'function') {
        window.player.destroy();
        window.player = null;
    }
    // Ẩn tất cả video
    video_obj.style.display = 'none';
    video_YT_obj.style.display = 'none';
    // Xóa các phần tử .plyr khỏi DOM nếu còn sót lại
    document.querySelectorAll('.plyr').forEach(function (el) { el.parentNode && el.parentNode.removeChild(el); });
}
let base_url = window.location.origin;
let queryString = window.location.search;
console.log("queryString: " + queryString);

let new_init = false;
let repeat = false;
let direct = false;
let play_yt_vm = false;
let played = false;

let video_YT_obj = document.getElementById("video_YT");
let video_obj = document.getElementById("video");
let youtube_container = document.getElementById("youtubeContainer");
let youtube_frame = document.getElementById("youtubeFrame");

let url = "";
let new_url = "";
let str_pattern_loop = "&loop=true";
let str_pattern_direct = "&direct=true";
let yt_video_id = "";

if (queryString.length > 0) {
    // console.log(queryString.indexOf(str_pattern_loop))
    if (queryString.indexOf(str_pattern_loop) != -1) {
        document.getElementById("cb_repeat").checked = true;
        repeat = true;
    }
    if (queryString.indexOf(str_pattern_direct) != -1) {
        document.getElementById("cb_direct").checked = true;
        direct = true;
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
    youtube: {
        noCookie: false,
        rel: 0,
        showinfo: 0,
        iv_load_policy: 3,
        modestbranding: 1,
        hl: 'vi'
    }
};

video_obj.style.display = 'none';
youtube_container.style.display = 'none';

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


    // Ẩn và destroy toàn bộ player trước khi tạo mới
    hideAllPlayers();

    if (play_yt_vm === false) {
        video_obj.style.display = 'block';
        let player = new Plyr('#video', player_cfg);
        window.player = player;
        player.play();
        played = true;
    } else {
        video_YT_obj.style.display = 'block';
        let player_YT = new Plyr('#video_YT', player_cfg);
        window.player = player_YT;
        player_YT.play();
        played = true;
    }
}

function get_direct_link(info=true, init=true) {
    new_init = true;
    repeat = document.getElementById("cb_repeat").checked;
    direct = document.getElementById("cb_direct").checked;
    console.log("repeat: " + repeat);
    console.log("direct: " + direct);

    update_ui_url(init);
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

        if (url.indexOf("/shorts/") != -1) {
            url = url.replace("shorts/", "watch?v=");
        }

        if (url.indexOf("youtube.com") != -1) {
            str_pattern_video = "v=";
            video_id = url.substring(url.indexOf(str_pattern_video) + str_pattern_video.length);
        } else if (url.indexOf("youtu.be") != -1) {
            str_pattern_video = "youtu.be/";
            video_id = url.substring(url.indexOf(str_pattern_video) + str_pattern_video.length);
        }
        console.log("youtube video_id: " + video_id);

        if (video_id.length > 1) {
            yt_video_id = video_id;
            video_id = "&v=" + video_id;
            video_YT_obj.setAttribute("data-plyr-provider", "youtube");
            video_YT_obj.setAttribute("data-plyr-embed-id", video_id);
        }

        if (info === true) {
            let api_url = "https://dev-py-svl.minhtamgroup.org/api/v1/youtube/info?url=" + url;
            console.log("api_url: " + api_url);
            $.getJSON(api_url).then(
                function (data) {
                    console.log(data);
                    let title = data["title"];
                    let author_name = data["author_name"];
                    let published_at = data["published_at"];
                    let duration = data["duration"];
                    let viewCount = data["viewCount"];
                    let likeCount = data["likeCount"];
                    let favoriteCount = data["favoriteCount"];
                    let commentCount = data["commentCount"];
                    let description = data["description"];
                    console.log(title + " | " + author_name + " | " + duration);

                    if (title.length > 0 && author_name.length > 0) {
                        document.title = duration + " | " + title + " | " + author_name + " | " + " 👀." + viewCount + " 👍." + likeCount + " 💖." + favoriteCount + " 💬." + commentCount + " | " + published_at;
                        document.getElementById("org_url").innerHTML = duration + " | " + " 👀." + viewCount + " 👍." + likeCount + " 💖." + favoriteCount + " 💬." + commentCount + " | " + title + " | " + author_name + " | " + published_at + "<br/><br/>" + url;

                        // Update URL without reloading page
                        window.history.pushState({}, '', window.location.href);
                    }

                    if (description.length > 0) {
                        document.getElementById("video_description").style.display = "block";
                        document.getElementById('video_description').innerHTML = description.replace(/\n/g, '<br>');
                    }
                }
            );
        }

        if (direct) {
            api_url = "https://dev-py-svl.minhtamgroup.org/api/v1/youtube/audio?url=" + url;
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

            // api_url = "https://svl.minhtamgroup.org/api/v1/download?service=yt&url=" + url;
            // console.log("api_url: " + api_url);
            // $.getJSON(api_url).then(
            //     function (data) {
            //         // console.log(data);
            //         // let direct_link = data.url;
            //         let direct_link = data["direct_link"];
            //         console.log("direct_link: " + direct_link);
            //         if (direct_link.length > 0) {
            //             // window.open(direct_link, '_blank');
            //             document.getElementById("direct_link_yt").innerHTML = direct_link;
            //             document.getElementById("direct_link_yt").href = direct_link;
            //         }
            //     }
            // );
        }
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

function update_ui_url(init=true) {
    console.log("url: " + url);
    if (url.length < 1) {
        document.getElementById("cb_direct").disabled = true;
        document.getElementById("cb_show_yt").disabled = true;

        url = queryString.substring(queryString.indexOf("http"));
        if (url.length === 0) {
            console.log("Invalid URL");
            return;
        }
    }

    url = url.substring(url.indexOf("http"));
    if (url.indexOf(str_pattern_loop) != -1) {
        url = url.replace(str_pattern_loop, "");
    }
    if (url.indexOf(str_pattern_direct) != -1) {
        url = url.replace(str_pattern_direct, "");
    }
    console.log(url);

    document.getElementById("url").value = url;

    new_url = base_url;
    new_url = new_url + "?url=" + url;
    if (repeat === true) {
        new_url = new_url + str_pattern_loop;
    }
    if (direct === true) {
        new_url = new_url + str_pattern_direct;
    }
    console.log(new_url);

    document.getElementById("cb_direct").disabled = false;
    document.getElementById("cb_show_yt").disabled = false;

    if (init === true) {
        document.getElementById("org_url").innerHTML = url;
        document.getElementById("org_url").href = url;
    }

    if (url.length > 1) {
        window.history.pushState({}, '', new_url);
        document.getElementById("mp4_url").innerHTML = new_url;
        document.getElementById("mp4_url").href = new_url;
    }

    video_obj.src = url;
    if (new_init === true) {
        new_init = false;
    }
}

function showEmbedYoutube() {
    const checkbox = document.getElementById("cb_show_yt");

    if (checkbox.checked) {
        hideAllPlayers();
        youtube_frame.src = `https://www.youtube.com/embed/${yt_video_id}`;
        youtube_container.style.display = 'block';
    } else {
        youtube_frame.src = "";
        youtube_container.style.display = "none";
        // Hiện lại video phù hợp
        if (play_yt_vm === true) {
            hideAllPlayers();
            video_YT_obj.style.display = 'block';
            let player_YT = new Plyr('#video_YT', player_cfg);
            window.player = player_YT;
            // player_YT.play();
        } else {
            hideAllPlayers();
            video_obj.style.display = 'block';
            let player = new Plyr('#video', player_cfg);
            window.player = player;
            // player.play();
        }
    }
}

function selectRepeat() {
    url = document.getElementById("url").value;
    if (url.length < 1) {
        return;
    }

    // Get current URL
    let currentUrl = window.location.href;

    const checkbox = document.getElementById("cb_repeat");
    if (checkbox.checked) {
        // Add &loop=true if not exists
        if (!currentUrl.includes(str_pattern_loop)) {
            currentUrl += str_pattern_loop;
            new_url += str_pattern_loop;
        }
    } else {
        // Remove &loop=true if exists
        currentUrl = currentUrl.replace(str_pattern_loop, '');
        new_url = new_url.replace(str_pattern_loop, '');
    }
    document.getElementById("mp4_url").innerHTML = new_url;
    document.getElementById("mp4_url").href = new_url;

    // Update URL without reloading page
    window.history.pushState({}, '', currentUrl);
}

function showDirectLink() {
    url = document.getElementById("url").value;
    if (url.length < 1) {
        return;
    }

    // Get current URL
    let currentUrl = window.location.href;

    const checkbox = document.getElementById("cb_direct");
    if (checkbox.checked) {
        // Add &direct=true if not exists
        if (!currentUrl.includes(str_pattern_direct)) {
            currentUrl += str_pattern_direct;
            get_direct_link(info=false, init=false);
        }
    } else {
        // Remove &direct=true if exists
        currentUrl = currentUrl.replace(str_pattern_direct, '');
        new_url = new_url.replace(str_pattern_direct, '');
        document.getElementById("mp4_url").innerHTML = new_url;
        document.getElementById("mp4_url").href = new_url;
    }

    // Update URL without reloading page
    window.history.pushState({}, '', currentUrl);
}

document.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        document.getElementById("playBtn").click();
    }
});
