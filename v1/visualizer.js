export function startStopVisualizer(p5, myp5) {
    if (!myp5.started) {
      myp5.started = true;
      document.getElementById("startStopButton").innerHTML = "Stop";
    } else {
      myp5.started = false;
      document.getElementById("startStopButton").innerHTML = "Start";
    }
  
    if (myp5.started) {
      if (myp5.useMic) {
        myp5.mic.start();
        myp5.fft.setInput(myp5.mic);
      } else {
        myp5.playSong();
      }
    } else {
      myp5.mic.stop();
      myp5.song.stop();
    }
  }
  
  export function toggleAudioSource(myp5) {
    myp5.useMic = !myp5.useMic;
  
    if (myp5.started) {
      if (myp5.useMic) {
        myp5.song.stop();
        myp5.mic.start();
        myp5.fft.setInput(myp5.mic);
      } else {
        myp5.mic.stop();
        myp5.playSong();
      }
  
      // Update the button text
      if (myp5.useMic) {
        document.getElementById("toggleButton").innerHTML = "Using Mic";
      } else {
        document.getElementById("toggleButton").innerHTML = "Using Music Folder";
      }
    } else {
      // Update the button text
      if (myp5.useMic) {
        document.getElementById("toggleButton").innerHTML = "Using Mic";
      } else {
        document.getElementById("toggleButton").innerHTML = "Using Music Folder";
      }
    }
  }
  
  export function keyPressed(event, startStopVisualizer) {
    if (event.key === ' ') {
      startStopVisualizer();
    }
  }
  