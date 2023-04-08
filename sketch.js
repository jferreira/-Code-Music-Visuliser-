const s = (p) => {
  let song;
  let fft;
  let started = false;

  p.preload = () => {
    song = p.loadSound('audio/Monolink - A1 Laura - Album_Master_V2_MP3.mp3');
  };

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    fft = new p5.FFT();
    if (song) {
      song.setVolume(0.5);
    }
  };

  p.draw = () => {
    if (!started) {
      return;
    }

    p.background(0);
    let spectrum = fft.analyze();
    p.noStroke();

    for (let i = 0; i < spectrum.length; i++) {
      let x = p.map(i, 0, spectrum.length, 0, p.width);
      let h = -p.height + p.map(spectrum[i], 0, 255, p.height, 0);
      p.fill(255, i / 2, 255);
      p.rect(x, p.height, p.width / spectrum.length, h);
    }
  };

  p.getStarted = () => {
    return started;
  };

  p.setStarted = (value) => {
    started = value;
  };

  p.playSong = () => {
    // Resume the AudioContext after a user gesture
    if (p.getAudioContext().state !== 'running') {
      p.getAudioContext().resume();
    }
    song.play();
  };
};

let myp5 = new p5(s);

function startVisualizer() {
  if (!myp5.getStarted()) {
    myp5.playSong();
    myp5.setStarted(true);
  }
}
