document.getElementById("speed").value = parseFloat(1.0).toFixed(1);

(function localFileVideoPlayerInit(win) {
    var URL = win.URL || win.webkitURL,
        displayMessage = (function displayMessageInit() {
            var node = document.querySelector('#message');

            return function displayMessage(message, isError) {
                node.innerHTML = message;
                node.className = isError ? 'error' : 'info';
            };
        }()),
        playSelectedFile = function playSelectedFileInit(event) {
            var file = this.files[0];
            var type = file.type;
            console.log(file.name);
            if (file.name.length > 0) {
                document.title = file.name + " - Offline Files Player | www.minhtamgroup.org";
            }

            var speed = parseFloat(document.getElementById("speed").value);
            if (speed < 0) {
                speed = 1.0;
                document.getElementById("speed").value = parseFloat(speed).toFixed(1);
            }

            var repeat = document.getElementById("cb_repeat").checked;
            // console.log("repeat: " + repeat);

            // var videoNode = document.querySelector('#video');
            var videoNode = document.getElementById('video');
            var canPlay = videoNode.canPlayType(type);

            canPlay = (canPlay === '' ? 'no' : canPlay);

            var message = 'Can play type "' + type + '": ' + canPlay;
            var isError = canPlay === 'no';

            displayMessage(message, isError);

            if (isError) {
                return;
            }

            var fileURL = URL.createObjectURL(file);

            videoNode.src = fileURL;
            videoNode.playbackRate = speed;
            videoNode.loop = repeat;
        },
        inputNode = document.querySelector('#file');

    if (!URL) {
        displayMessage('Your browser is not supported !!!', true);
        return;
    }

    inputNode.addEventListener('change', playSelectedFile, false);
}(window));
