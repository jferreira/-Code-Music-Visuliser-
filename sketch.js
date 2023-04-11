// Song titles
const songTitles = ["song1.mp3"];

// Songs array
let songs = [];
let myBuffer = new Array(200);
let myPointer = 0;

// Load the songs and set the current song
let song, currentSongKey;
let myFont; // Define myFont variable
function preload() {
  p5.prototype._checkFileFormats = function() {};
  fft = new p5.FFT();
  myFont = loadFont("fonts/Poppins/Poppins-Medium.ttf");
  songTitles.forEach(function(songTitle, songKey) {
    songs[songKey] = loadSound("songs/song1.mp3", function() {
      if (songKey === 0) {
        currentSongKey = songKey;
        song = songs[currentSongKey];
        song.loop();
      }
    });
  });
}

// Setup function
function setup() {
  // Create canvas
  let canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  canvas.parent("#canvas-container");
  canvas.style("display", "block");
  canvas.style("margin", "auto");
  canvas.style("margin-top", "20px");
  // Set framerate
  frameRate(60);
  textFont(myFont);
}

// DRAW LOOP --------------------------------------------------------------
// Processing calls draw method according to the frame rate we specified earlier.
function draw() {
  let specSize = fft.specSize();
  background(0);
  lights();

  // TEXT --------------------------------------------------------------------------------------
  fill(255, 255, 255, 225);
  textSize(48);
  text(
    "Song: " +
      songTitles[currentSongKey].substring(
        0,
        songTitles[currentSongKey].lastIndexOf(".")
      ),
    width / 2,
    200,
    -1200
  );

  fill(255, 255, 255, 225);
  textSize(34);
  text(
    pad(Math.floor(song.position() / 60000), 2) +
      ":" +
      pad(Math.floor((song.position() / 1000) % 60), 2) +
      "." +
      pad(song.position() % 1000, 3),
    width / 2,
    300,
    -1200
  );

  push();
  translate(0, 0, 1600);
  fill(255, 255, 255, 225);
  textSize(22);
  text("[ >> ]", width / 2, 550, -1200);
  pop();

  //--------------------------------------------------------------------------------------------

  // MILLISECONDS
  let cal = new Date();
  let remainder = ((cal.getMilliseconds()) + (cal.getSeconds() * 1000)) % 20001;

  // TRANSLATE
  translate(width/2, 0, 0);
  rotateY(map(remainder, 0, 20000, 0, 2 * PI));
  
  fft.setInput(song);
  fft.analyze();

  // draw the spectrum as a series of vertical lines
  strokeWeight(2);
  let myAmps = new Array(specSize);
  for (let iterationCount = 0; iterationCount < specSize; iterationCount += 20) {
    myAmps[iterationCount] = fft.getFreq(iterationCount);
  }
  myBuffer[myPointer] = myAmps;
  myPointer++;
  myPointer %= myBuffer.length;

  for (let shiftX = 0; shiftX < specSize; shiftX += 20) {
    for (let i = 0; i < myBuffer.length; i++) {
      let j = i + myPointer;
      j %= myBuffer.length;
      let amplitude = 0;
      if (myBuffer[j] != null) {
        amplitude = myBuffer[j][shiftX];
      }
      let amplitudeNormalised1 = 180 * amplitude / (height / 2);
      let deGrade = (70 - Math.abs(i - 60)) / 70;
      let deGrade2 = deGrade * deGrade;
      let amplitudeNormalised = amplitudeNormalised1 * deGrade;
      let displace = 0;

      if (i < 31) {
        displace = (31 - i) * 10;
      } else if (i > 31) {
        displace = (i - 31) * -10;
      } else {
        displace = 0;
      }

 // FREQUENCY BARS ------------------------------------------------
  //TOP - RIGHT
  stroke(255, 255, 255, 200*deGrade2);
  line(shiftX/4, height/3, displace, shiftX/4, height/3 - amplitudeNormalised, displace);
  //TOP - LEFT
  stroke(255, 255, 255, 200*deGrade2);
  line(-shiftX/4, height/3, displace, -shiftX/4, height/3 - amplitudeNormalised, displace);

  //Bottom - LEFT
  stroke(255, 255, 255, 50*deGrade2);
  line(shiftX/4, height/3, displace, shiftX/4, height/3 + amplitudeNormalised, displace);
  //Bottom - RIGHT
  stroke(255, 255, 255, 50*deGrade2);
  line(-shiftX/4, height/3, displace, -shiftX/4, height/3 + amplitudeNormalised, displace);
}
}
}

function pad(num, size) {
  let s = String(num);
  while (s.length < size) s = '0' + s;
  return s;
}


// Window resized event listener
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

loadSound("v2/songs/song1.mp3", function() {
  if (songKey === 0) {
    currentSongKey = songKey;
    song = songs[currentSongKey];
    song.loop();
  }
});
