// Get the elements
var isAudio = document.getElementById('isAudio');
var isVideo = document.getElementById('isVideo');

// Add event listeners
isAudio.addEventListener('click', checkCheckboxes);
isVideo.addEventListener('click', checkCheckboxes);

// Function to check if both checkboxes are unchecked
function checkCheckboxes() {
  if (!isAudio.checked && !isVideo.checked) {
    startBtn.disabled = true;
  } else {
    startBtn.disabled = false;
  }
}

checkCheckboxes();

// Controls buttons and audio/video elements
let preview = document.getElementById("preview");
let recording = document.getElementById("record");
let startButton = document.getElementById("startBtn");
let stopButton = document.getElementById("stopBtn");
let audioSource = document.getElementById("audioSource");

let mediaDevices = navigator.mediaDevices;

// log only audio input devices
mediaDevices.enumerateDevices().then((devices) => {
  devices.forEach((device) => {
    if (device.kind === "audioinput") {
      let lastSpaceIndex = device.label.lastIndexOf('(');
      let label = device.label.substring(0, lastSpaceIndex - 1);
      // Add option element to select
      let option = document.createElement("option");
      option.text = label;
      option.value = device.deviceId;
      audioSource.appendChild(option);
    }
  });
});

// let mediaRecorder = null;
// let audioData = []

// startButton.addEventListener("click", recordAudio);
// stopButton.addEventListener("click", stopRecording);
// // startScreenButton.addEventListener("click", recordSCreen);

// function createMediaElement(fileType, audioData) {
//   const blob = new Blob(audioData, {
//     type: fileType,
//   });
//   const mediaURL = window.URL.createObjectURL(blob);
//   const element = document.getElementById("record");
//   element.src = mediaURL;
//   mediaRecorder = null;
//   audioData = [];
// }

// function recordAudio() {
//   navigator.mediaDevices
//     .getUserMedia({ audio: true })
//     .then((stream) => {
//       mediaRecorder = new MediaRecorder(stream);
//       mediaRecorder.ondataavailable = (e) => {
//         audioData.push(e.data);
//       };
//       mediaRecorder.onstop = (e) => {
//         createMediaElement("audio/mp3", audioData);
//       };
//       mediaRecorder.onerror = (e) => {
//         createMediaElement("audio/mp3", audioData);
//         console.log(e);
//       };
//       mediaRecorder.start(500);
//     })
// }

// function stopRecording() {
//   if (mediaRecorder)
//   {
//     mediaRecorder.stop();
//   }
// }

// function recordSCreen() {
//   // ...code
// }
