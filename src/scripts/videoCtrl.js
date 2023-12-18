let videoSources = document.getElementById("videoSources");
let audioSources = document.getElementById("audioSources");

// Controls buttons and audio/video elements
let preview = document.getElementById("preview");
let recording = document.getElementById("record");
let startButton = document.getElementById("startBtn");
let stopButton = document.getElementById("stopBtn")

function setAudioSources() {
  // Feed the select with audio sources
  navigator.mediaDevices.enumerateDevices().then((devices) => {
    devices.forEach((device) => {
      if (device.kind === "audioinput") {
        let lastSpaceIndex = device.label.lastIndexOf('(');
        let label = device.label.substring(0, lastSpaceIndex - 1);
  
        let option = document.createElement("option");
        option.text = label;
        option.value = device.deviceId;
        if (device.deviceId === "default") {
          option.selected = true;
        }
  
        audioSources.appendChild(option);
      }
    });
  });
}

// Feed the select with video sources
window.videoEvent.setVideoSources((sources) => {
  sources.forEach((source) => {
    let option = document.createElement("option");
    option.text = source.name;
    option.value = source.id;
    if (source.id === "screen:0:0") {
      option.selected = true;
    }
    videoSources.appendChild(option);
  });

  setAudioSources();
  changePreview();
});


let mediaRecorder = null;
let recordedChunks = [];

videoSources.addEventListener("change", async () => {
  changePreview();
});

async function changePreview() {
  // Get the selected video source
  let videoSource = videoSources.options[videoSources.selectedIndex].value;

  // Get the stream
  let stream = await navigator.mediaDevices.getUserMedia({
    audio: {
      mandatory: {
        chromeMediaSource: 'desktop',
      }
    },
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
startButton.addEventListener("click", async () => {
  // Disable start button
  startButton.disabled = true;
  // Enable stop button
  stopButton.disabled = false;

  await changePreview()
  
  // Listen to dataavailable event which gets triggered whenever we have
  // an audio blob available
  mediaRecorder.addEventListener("dataavailable", (event) => {
    recordedChunks.push(event.data);
  });

  // Start recording
  mediaRecorder.start(1000);
});

// Stop recording
stopButton.addEventListener("click", () => {
  // Disable stop button
  stopButton.disabled = true;
  // Enable start button
  startButton.disabled = false;

  // Stop recording
  mediaRecorder.stop();

  // Save the video to the disk
  saveVideo();
});

// Save video file on disk
async function saveVideo() {
  // Convert the recorded chunks into a single blob
  const blob = new Blob(recordedChunks, {
    type: "video/mp4",
  });

  // Generate a video filename
  const fileName = "test";

  // Generate a video file from the blob as mp4
  const file = new File([blob], fileName + ".mp4", {
    type: "video/mp4",
  });

  // Create a URL from the file
  const url = URL.createObjectURL(file);

  // Create a new video element
  const a = document.createElement("a");

  // Set the href and download attributes for the anchor element
  // Use the generated file name for the download attribute
  a.href = url;
  a.download = file.name;

  // Click handler on the anchor element
  // Simulates a click on the anchor element
  // This will download the file
  a.click();

  // Wait for 0.5 seconds
  await new Promise((r) => setTimeout(r, 500));

  // Revoke the URL
  URL.revokeObjectURL(url);

  // Reset the recorded chunks
  recordedChunks = [];
}
