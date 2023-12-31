let isAudio = document.getElementById("is-audio");
let videoSources = document.getElementById("videoSources");

// Controls buttons and audio/video elements
let preview = document.getElementById("preview");
let ctrlRecord = document.getElementById("ctrl-container");
let startButton = document.getElementById("startBtn");
let stopButton = document.getElementById("stopBtn")

isAudio.addEventListener("click", () => {
  isAudio.classList.toggle("active");
});

// Feed the select with video sources
window.videoEvent.setVideoSources((sources) => {
  sources.forEach((source) => {
    let option = document.createElement("option");
    option.text = source.name;
    if (option.text.length > 20) {
      option.text = option.text.slice(0, 20) + '...';
    }
    option.value = source.id;
    videoSources.appendChild(option);
  });

  changePreview();
});

videoSources.addEventListener("change", async () => {
  changePreview();
});

let mediaRecorder = null;
let recordedChunks = [];

async function changePreview() {
  mediaRecorder = null;

  // Get the selected video source
  let videoSource = videoSources.options[videoSources.selectedIndex].value;

  // Get the stream
  // Audio only if isAudio classList contain active
  let stream = await navigator.mediaDevices.getUserMedia({
    audio: isAudio.classList.contains("active") ? 
      {
        mandatory: {
          chromeMediaSource: 'desktop',
        }
      } : false,
    video: {
      mandatory: {
        chromeMediaSource: 'desktop',
        chromeMediaSourceId: videoSource,
      }
    },
  });

  // Create the Media Recorder
  mediaRecorder = new MediaRecorder(stream, {
    mimeType: "video/webm; codecs=vp9",
  });

  preview.srcObject = stream;
  preview.play();
}

// Start recording
let clock = document.getElementById("time");
let time = 0;
let interval = null;

ctrlRecord.addEventListener("click", async () => {
  if (!startButton.disabled) {
    startButton.disabled = true;
    stopButton.disabled = false;
    ctrlRecord.classList.toggle("recording");
    ctrlRecord.classList.toggle("idle");
    
    await changePreview()
    mediaRecorder.addEventListener("dataavailable", (event) => {
      recordedChunks.push(event.data);
    });
    mediaRecorder.start(100);

    // Add clock to the preview
    interval = setInterval(() => {
      time++;
      clock.innerHTML = timeToClock(time);
    }, 1000);
  }
  else {
    ctrlRecord.classList.toggle("recording");
    ctrlRecord.classList.toggle("idle");

    stopButton.disabled = true;
    startButton.disabled = false;
    
    mediaRecorder.stop();
    time = 0;
    interval = clearInterval(interval);
    clock.innerHTML = "00:00:00";
    saveVideo();
  }
});

// Save video file on disk
async function saveVideo() {
  // Convert the recorded chunks into a single blob
  const blob = new Blob(recordedChunks, {
    type: "video/mp4",
  });

  // Mock file name
  const fileName = new Date().toISOString().replace(/:/g, "-").split('.')[0] + "-record";

  // Generate a video file from the blob as mp4
  const file = new File([blob], fileName + ".mp4", {
    type: "video/mp4",
  });

  // Create a URL from the file
  const url = URL.createObjectURL(file);

  const a = document.createElement("a");

  // Set the href and download attributes for the anchor element
  // Use the generated file name for the download attribute
  a.href = url;
  a.download = file.name;

  // Click handler on the anchor element
  // Simulates a click on the anchor element
  // This will download the file
  a.click();

  await new Promise((r) => setTimeout(r, 500));

  // Revoke the URL
  URL.revokeObjectURL(url);

  // Reset the recorded chunks
  recordedChunks = [];
  mediaRecorder = null;
}

function timeToClock(time) {
  let hours = Math.floor(time / 3600);
  let minutes = Math.floor((time - (hours * 3600)) / 60);
  let seconds = time - (hours * 3600) - (minutes * 60);

  if (hours < 10) {
    hours = "0" + hours;
  }
  if (minutes < 10) {
    minutes = "0" + parseInt(minutes);
  }
  if (seconds < 10) {
    seconds = "0" + parseInt(seconds);
  }

  return hours + ":" + minutes + ":" + seconds;
}
