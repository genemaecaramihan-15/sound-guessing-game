const fs = require('fs');
const path = require('path');
const EXTRA_GAME_SOUNDS = require('./extra_sounds.js');

const SAMPLE_RATE = 44100;
const audioDir = path.join(__dirname, 'audio');
if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, { recursive: true });
}

function writeWav(filename, samples) {
  // Normalize
  let max = 0;
  for (let i = 0; i < samples.length; i++) {
    const abs = Math.abs(samples[i]);
    if (abs > max) max = abs;
  }
  const normFactor = max > 0 ? 0.9 / max : 1.0;

  const buffer = Buffer.alloc(44 + samples.length * 2);
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + samples.length * 2, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // subchunk1size (PCM = 16)
  buffer.writeUInt16LE(1, 20);  // format = 1 (PCM)
  buffer.writeUInt16LE(1, 22);  // channels = 1 (mono)
  buffer.writeUInt32LE(SAMPLE_RATE, 24);
  buffer.writeUInt32LE(SAMPLE_RATE * 2, 28); // byte rate
  buffer.writeUInt16LE(2, 32);  // block align
  buffer.writeUInt16LE(16, 34); // bits per sample
  buffer.write('data', 36);
  buffer.writeUInt32LE(samples.length * 2, 40);

  for (let i = 0; i < samples.length; i++) {
    const val = Math.max(-1, Math.min(1, samples[i] * normFactor));
    buffer.writeInt16LE(val < 0 ? val * 0x8000 : val * 0x7FFF, 44 + i * 2);
  }

  const filePath = path.join(audioDir, filename);
  fs.writeFileSync(filePath, buffer);
  console.log(`Generated: ${filename} (${(samples.length / SAMPLE_RATE).toFixed(2)}s)`);
}

// Biquad filter helper
function applyBiquad(samples, type, freq, q = 1, gainDb = 0) {
  const out = new Float32Array(samples.length);
  const w0 = 2 * Math.PI * freq / SAMPLE_RATE;
  const alpha = Math.sin(w0) / (2 * q);
  const cosW0 = Math.cos(w0);

  let b0 = 0, b1 = 0, b2 = 0, a0 = 1, a1 = 0, a2 = 0;

  if (type === 'lowpass') {
    b0 = (1 - cosW0) / 2;
    b1 = 1 - cosW0;
    b2 = (1 - cosW0) / 2;
    a0 = 1 + alpha;
    a1 = -2 * cosW0;
    a2 = 1 - alpha;
  } else if (type === 'highpass') {
    b0 = (1 + cosW0) / 2;
    b1 = -(1 + cosW0);
    b2 = (1 + cosW0) / 2;
    a0 = 1 + alpha;
    a1 = -2 * cosW0;
    a2 = 1 - alpha;
  } else if (type === 'bandpass') {
    b0 = alpha;
    b1 = 0;
    b2 = -alpha;
    a0 = 1 + alpha;
    a1 = -2 * cosW0;
    a2 = 1 - alpha;
  }

  b0 /= a0; b1 /= a0; b2 /= a0; a1 /= a0; a2 /= a0;

  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  for (let i = 0; i < samples.length; i++) {
    const x0 = samples[i];
    const y0 = b0 * x0 + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2;
    out[i] = y0;
    x2 = x1; x1 = x0;
    y2 = y1; y1 = y0;
  }
  return out;
}

// White noise generator
function noise(len) {
  const s = new Float32Array(len);
  for (let i = 0; i < len; i++) {
    s[i] = Math.random() * 2 - 1;
  }
  return s;
}

// -------------------------------------------------------------
// 1. ANIMALS
// -------------------------------------------------------------

// Dog Barking: Two vigorous "woof! woof!" barks
function generateDog() {
  const dur = 1.8;
  const len = Math.floor(SAMPLE_RATE * dur);
  const out = new Float32Array(len);

  function bark(startTime, length, pitchStart, pitchEnd) {
    const startIdx = Math.floor(startTime * SAMPLE_RATE);
    const count = Math.floor(length * SAMPLE_RATE);
    let phase = 0;

    for (let i = 0; i < count; i++) {
      const t = i / count;
      const freq = pitchStart * (1 - t) + pitchEnd * t;
      phase += (2 * Math.PI * freq) / SAMPLE_RATE;

      // Pulse wave with formants
      let s = Math.sin(phase) + 0.6 * Math.sin(phase * 2) + 0.3 * Math.sin(phase * 3) + 0.2 * Math.sin(phase * 4);
      // throaty rasp
      s += (Math.random() * 2 - 1) * 0.35;
      // soft distortion
      s = Math.tanh(s * 1.8);

      // Envelope: fast attack, exponential body decay
      let env = 0;
      if (t < 0.1) {
        env = t / 0.1;
      } else {
        env = Math.exp(-(t - 0.1) * 6.5);
      }

      if (startIdx + i < len) {
        out[startIdx + i] += s * env * 0.8;
      }
    }
  }

  bark(0.1, 0.45, 460, 220); // First bark
  bark(0.75, 0.55, 490, 210); // Second slightly deeper bark

  return applyBiquad(out, 'lowpass', 2400, 1.2);
}

// Cat Meowing: Classic "Meeeee-oww"
function generateCat() {
  const dur = 2.0;
  const len = Math.floor(SAMPLE_RATE * dur);
  const out = new Float32Array(len);

  let phase = 0;
  for (let i = 0; i < len; i++) {
    const t = i / SAMPLE_RATE;
    if (t < 0.15 || t > 1.85) continue;
    const catT = (t - 0.15) / 1.7; // 0 to 1

    // Pitch contour: rise from 380Hz to 680Hz ("Meee"), plateau with vibrato, drop to 320Hz ("owww")
    let freq = 380;
    if (catT < 0.35) {
      freq = 380 + (catT / 0.35) * 300;
    } else if (catT < 0.65) {
      freq = 680 + Math.sin(2 * Math.PI * 5.5 * catT) * 22; // vibrato
    } else {
      const dropT = (catT - 0.65) / 0.35;
      freq = 680 - dropT * 360;
    }

    phase += (2 * Math.PI * freq) / SAMPLE_RATE;

    // Rich nasal harmonic series
    let s = Math.sin(phase) +
            0.7 * Math.sin(phase * 2) +
            0.4 * Math.sin(phase * 3) +
            0.25 * Math.sin(phase * 4) +
            0.15 * Math.sin(phase * 5);

    // Mouth formant resonance simulation
    const formantFilter = Math.sin(phase * (catT < 0.5 ? 3 : 2)) * 0.3;
    s += formantFilter;

    // Volume envelope
    let env = 0;
    if (catT < 0.2) env = catT / 0.2;
    else if (catT < 0.7) env = 1.0;
    else env = 1.0 - (catT - 0.7) / 0.3;

    out[i] = s * env * 0.75;
  }
  return applyBiquad(out, 'lowpass', 3200, 1.0);
}

// Bird Chirping: Cheerful triplet chirp bursts
function generateBird() {
  const dur = 2.0;
  const len = Math.floor(SAMPLE_RATE * dur);
  const out = new Float32Array(len);

  function chirp(startTime, fStart, fPeak, fEnd, duration) {
    const startIdx = Math.floor(startTime * SAMPLE_RATE);
    const count = Math.floor(duration * SAMPLE_RATE);
    let phase = 0;

    for (let i = 0; i < count; i++) {
      const t = i / count;
      let freq;
      if (t < 0.4) {
        freq = fStart + (fPeak - fStart) * (t / 0.4);
      } else {
        freq = fPeak - (fPeak - fEnd) * ((t - 0.4) / 0.6);
      }
      phase += (2 * Math.PI * freq) / SAMPLE_RATE;

      const env = Math.sin(Math.PI * t);
      // Pure crystalline tone with slight FM flutter
      const flutter = Math.sin(2 * Math.PI * 45 * (i / SAMPLE_RATE)) * 0.15;
      const s = Math.sin(phase + flutter);

      if (startIdx + i < len) {
        out[startIdx + i] += s * env * 0.8;
      }
    }
  }

  // Chirp phrase 1
  chirp(0.15, 2600, 4200, 2900, 0.12);
  chirp(0.32, 2800, 4600, 3100, 0.13);
  chirp(0.50, 3100, 5200, 3400, 0.16);

  // Chirp phrase 2 (rapid response)
  chirp(1.05, 3000, 4800, 3200, 0.11);
  chirp(1.20, 3200, 5100, 3300, 0.12);
  chirp(1.36, 3400, 5600, 3600, 0.18);

  return out;
}

// Cow Mooing: Deep resonant "Mooooooo"
function generateCow() {
  const dur = 2.4;
  const len = Math.floor(SAMPLE_RATE * dur);
  const out = new Float32Array(len);

  let phase = 0;
  for (let i = 0; i < len; i++) {
    const t = i / SAMPLE_RATE;
    if (t < 0.2 || t > 2.2) continue;
    const mooT = (t - 0.2) / 2.0;

    // Pitch: start at ~108Hz, dip slightly to 92Hz
    const freq = 108 - Math.sin(mooT * Math.PI) * 16;
    phase += (2 * Math.PI * freq) / SAMPLE_RATE;

    // Rich harmonic spectrum for bovine vocal tract
    let s = Math.sin(phase) +
            0.8 * Math.sin(phase * 2) +
            0.6 * Math.sin(phase * 3) +
            0.5 * Math.sin(phase * 4) +
            0.35 * Math.sin(phase * 5) +
            0.25 * Math.sin(phase * 6);

    // Warm envelope
    let env = 0;
    if (mooT < 0.15) env = mooT / 0.15;
    else if (mooT < 0.75) env = 1.0;
    else env = 1.0 - (mooT - 0.75) / 0.25;

    out[i] = s * env * 0.7;
  }

  // Resonant lowpass/bandpass to simulate chest & mouth cavity
  const filtered = applyBiquad(out, 'lowpass', 750, 2.5);
  return filtered;
}

// -------------------------------------------------------------
// 2. VEHICLES
// -------------------------------------------------------------

// Car Horn: Classic dual-tone "Beep-Beep!"
function generateCarHorn() {
  const dur = 1.5;
  const len = Math.floor(SAMPLE_RATE * dur);
  const out = new Float32Array(len);

  function beep(startTime, duration) {
    const startIdx = Math.floor(startTime * SAMPLE_RATE);
    const count = Math.floor(duration * SAMPLE_RATE);
    let p1 = 0, p2 = 0;
    const f1 = 370; // F#4
    const f2 = 440; // A4 (standard dual automotive tone)

    for (let i = 0; i < count; i++) {
      const t = i / count;
      p1 += (2 * Math.PI * f1) / SAMPLE_RATE;
      p2 += (2 * Math.PI * f2) / SAMPLE_RATE;

      // Dual harmonic tones
      let s = 0.5 * (Math.sin(p1) + 0.3 * Math.sin(p1 * 2)) +
              0.5 * (Math.sin(p2) + 0.3 * Math.sin(p2 * 2));
      // Saturation for metallic horn blare
      s = Math.tanh(s * 1.5);

      // Trapezoid envelope
      let env = 1.0;
      if (t < 0.05) env = t / 0.05;
      else if (t > 0.9) env = (1.0 - t) / 0.1;

      if (startIdx + i < len) {
        out[startIdx + i] += s * env * 0.75;
      }
    }
  }

  beep(0.15, 0.38);
  beep(0.65, 0.55);

  return out;
}

// Motorcycle: Throaty engine revs "Vrooom, vrooooom!"
function generateMotorcycle() {
  const dur = 2.4;
  const len = Math.floor(SAMPLE_RATE * dur);
  const out = new Float32Array(len);

  let phase = 0;
  for (let i = 0; i < len; i++) {
    const t = i / SAMPLE_RATE;
    // RPM profile: idle -> rev 1 -> drop -> rev 2 (louder)
    let rpm;
    if (t < 0.4) {
      rpm = 38;
    } else if (t < 1.0) {
      const p = (t - 0.4) / 0.6;
      rpm = 38 + p * 85;
    } else if (t < 1.3) {
      const p = (t - 1.0) / 0.3;
      rpm = 123 - p * 60;
    } else if (t < 2.0) {
      const p = (t - 1.3) / 0.7;
      rpm = 63 + p * 90;
    } else {
      const p = (t - 2.0) / 0.4;
      rpm = 153 - p * 110;
    }

    phase += (2 * Math.PI * rpm) / SAMPLE_RATE;

    // Combustion cylinder firing pulses (asymmetric sawtooth + noise pops)
    const sawtooth = 2 * (phase / (2 * Math.PI) - Math.floor(0.5 + phase / (2 * Math.PI)));
    const pulse = Math.pow(Math.max(0, Math.sin(phase)), 4);
    const exhaustPop = (Math.random() * 2 - 1) * pulse * 0.6;

    let s = sawtooth * 0.5 + pulse * 0.4 + exhaustPop;
    s = Math.tanh(s * 1.6);

    out[i] = s * 0.8;
  }

  return applyBiquad(out, 'lowpass', 1100, 1.5);
}

// Airplane: Heavy jet engine roar with turbine whine
function generateAirplane() {
  const dur = 2.5;
  const len = Math.floor(SAMPLE_RATE * dur);
  const rawNoise = noise(len);

  // Bandpass noise for jet exhaust rumble
  const lowRoar = applyBiquad(rawNoise, 'lowpass', 180, 1.2);
  const midRush = applyBiquad(rawNoise, 'bandpass', 650, 0.8);

  const out = new Float32Array(len);
  let turbinePhase = 0;

  for (let i = 0; i < len; i++) {
    const t = i / SAMPLE_RATE;
    // Turbine whine frequency
    const turbineFreq = 2400 + Math.sin(t * 1.5) * 200;
    turbinePhase += (2 * Math.PI * turbineFreq) / SAMPLE_RATE;
    const turbineWhine = Math.sin(turbinePhase) * 0.12;

    let env = 1.0;
    if (t < 0.4) env = t / 0.4;
    else if (t > 2.0) env = (2.5 - t) / 0.5;

    out[i] = (lowRoar[i] * 1.4 + midRush[i] * 0.7 + turbineWhine) * env;
  }

  return out;
}

// Train: Classic steam/diesel train whistle horn "Choo-choo!"
function generateTrain() {
  const dur = 2.4;
  const len = Math.floor(SAMPLE_RATE * dur);
  const out = new Float32Array(len);

  function hornBlast(startTime, duration) {
    const startIdx = Math.floor(startTime * SAMPLE_RATE);
    const count = Math.floor(duration * SAMPLE_RATE);
    let p1 = 0, p2 = 0, p3 = 0;
    // Classic triad: D4 (293.7), F#4 (370.0), A4 (440.0)
    const f1 = 293.7;
    const f2 = 370.0;
    const f3 = 440.0;

    for (let i = 0; i < count; i++) {
      const t = i / count;
      p1 += (2 * Math.PI * f1) / SAMPLE_RATE;
      p2 += (2 * Math.PI * f2) / SAMPLE_RATE;
      p3 += (2 * Math.PI * f3) / SAMPLE_RATE;

      let s = (Math.sin(p1) + 0.3 * Math.sin(p1 * 2)) * 0.4 +
              (Math.sin(p2) + 0.3 * Math.sin(p2 * 2)) * 0.35 +
              (Math.sin(p3) + 0.3 * Math.sin(p3 * 2)) * 0.35;
      // Slight steam air hissing
      s += (Math.random() * 2 - 1) * 0.12;

      let env = 1.0;
      if (t < 0.1) env = t / 0.1;
      else if (t > 0.85) env = (1.0 - t) / 0.15;

      if (startIdx + i < len) {
        out[startIdx + i] += s * env * 0.8;
      }
    }
  }

  hornBlast(0.15, 0.7);
  hornBlast(1.05, 0.95);

  return out;
}

// -------------------------------------------------------------
// 3. MUSICAL INSTRUMENTS
// -------------------------------------------------------------

// Piano: Acoustic piano chord (C Major: C4 - E4 - G4 - C5)
function generatePiano() {
  const dur = 2.4;
  const len = Math.floor(SAMPLE_RATE * dur);
  const out = new Float32Array(len);

  const notes = [
    { freq: 261.63, delay: 0.05, amp: 1.0 },  // C4
    { freq: 329.63, delay: 0.12, amp: 0.85 }, // E4
    { freq: 392.00, delay: 0.19, amp: 0.85 }, // G4
    { freq: 523.25, delay: 0.26, amp: 0.9 }   // C5
  ];

  for (const note of notes) {
    const start = Math.floor(note.delay * SAMPLE_RATE);
    let phase = 0;
    for (let i = start; i < len; i++) {
      const t = (i - start) / SAMPLE_RATE;
      phase += (2 * Math.PI * note.freq) / SAMPLE_RATE;

      // Piano strike harmonics (fundamental + decaying overtones)
      const h1 = Math.sin(phase);
      const h2 = Math.sin(phase * 2) * 0.5 * Math.exp(-t * 2.5);
      const h3 = Math.sin(phase * 3) * 0.25 * Math.exp(-t * 4.0);
      const h4 = Math.sin(phase * 4) * 0.15 * Math.exp(-t * 6.0);

      // Acoustic piano percussive hammer strike transient
      const hammer = (Math.random() * 2 - 1) * Math.exp(-t * 45) * 0.4;

      const envelope = Math.exp(-t * 1.4);
      out[i] += (h1 + h2 + h3 + h4 + hammer) * envelope * note.amp * 0.35;
    }
  }

  return out;
}

// Guitar: Acoustic Karplus-Strong string pluck strum
function generateGuitar() {
  const dur = 2.5;
  const len = Math.floor(SAMPLE_RATE * dur);
  const out = new Float32Array(len);

  // Strum chords: E3, A3, D4, G4, B4, E5 (Standard E minor chord)
  const freqs = [164.8, 220.0, 293.7, 392.0, 493.9, 659.3];

  freqs.forEach((freq, idx) => {
    const delay = idx * 0.045; // Strum sweep delay
    const startIdx = Math.floor(delay * SAMPLE_RATE);
    const n = Math.round(SAMPLE_RATE / freq);
    const ringBuffer = new Float32Array(n);

    // Initialize ring buffer with noise (the pick)
    for (let i = 0; i < n; i++) {
      ringBuffer[i] = Math.random() * 2 - 1;
    }

    let bIdx = 0;
    for (let i = startIdx; i < len; i++) {
      const prev = ringBuffer[bIdx];
      const nextIdx = (bIdx + 1) % n;
      const nextVal = ringBuffer[nextIdx];

      // Karplus-Strong lowpass feedback
      const newVal = (prev + nextVal) * 0.5 * 0.993;
      ringBuffer[bIdx] = newVal;
      bIdx = nextIdx;

      out[i] += newVal * 0.3;
    }
  });

  return out;
}

// Drums: Punchy Kick Drum, Snare hit, and Hi-Hat pattern
function generateDrums() {
  const dur = 2.2;
  const len = Math.floor(SAMPLE_RATE * dur);
  const out = new Float32Array(len);

  function kick(startTime) {
    const start = Math.floor(startTime * SAMPLE_RATE);
    const count = Math.floor(0.4 * SAMPLE_RATE);
    let phase = 0;
    for (let i = 0; i < count; i++) {
      const t = i / SAMPLE_RATE;
      // Pitch drop: 150Hz -> 45Hz
      const freq = 45 + 105 * Math.exp(-t * 30);
      phase += (2 * Math.PI * freq) / SAMPLE_RATE;
      const env = Math.exp(-t * 9);
      if (start + i < len) {
        out[start + i] += Math.sin(phase) * env * 1.1;
      }
    }
  }

  function snare(startTime) {
    const start = Math.floor(startTime * SAMPLE_RATE);
    const count = Math.floor(0.35 * SAMPLE_RATE);
    let phase = 0;
    for (let i = 0; i < count; i++) {
      const t = i / SAMPLE_RATE;
      // Tonal body 180Hz
      phase += (2 * Math.PI * 180) / SAMPLE_RATE;
      const body = Math.sin(phase) * Math.exp(-t * 20);
      // Snare rattle noise
      const rattle = (Math.random() * 2 - 1) * Math.exp(-t * 12);
      if (start + i < len) {
        out[start + i] += (body * 0.6 + rattle * 0.7) * 0.9;
      }
    }
  }

  function hihat(startTime) {
    const start = Math.floor(startTime * SAMPLE_RATE);
    const count = Math.floor(0.08 * SAMPLE_RATE);
    for (let i = 0; i < count; i++) {
      const t = i / SAMPLE_RATE;
      const noiseVal = (Math.random() * 2 - 1) * Math.exp(-t * 60);
      if (start + i < len) {
        out[start + i] += noiseVal * 0.35;
      }
    }
  }

  // Groove pattern:
  // 0.0s: Kick + HiHat
  // 0.25s: HiHat
  // 0.5s: Snare + HiHat
  // 0.75s: HiHat
  // 1.0s: Kick + Kick (1.15s)
  // 1.5s: Snare + HiHat
  kick(0.05); hihat(0.05);
  hihat(0.3);
  snare(0.55); hihat(0.55);
  hihat(0.8);
  kick(1.05); hihat(1.05);
  kick(1.22);
  snare(1.55); hihat(1.55);

  return out;
}

// Flute: Expressive, breathy woodwind melody
function generateFlute() {
  const dur = 2.4;
  const len = Math.floor(SAMPLE_RATE * dur);
  const out = new Float32Array(len);

  // 4 cheerful melodic notes: G4 (392Hz), B4 (493.88Hz), D5 (587.33Hz), G5 (783.99Hz)
  const notes = [
    { freq: 392.00, start: 0.1, len: 0.45 },
    { freq: 493.88, start: 0.6, len: 0.45 },
    { freq: 587.33, start: 1.1, len: 0.45 },
    { freq: 783.99, start: 1.6, len: 0.65 }
  ];

  for (const n of notes) {
    const startIdx = Math.floor(n.start * SAMPLE_RATE);
    const count = Math.floor(n.len * SAMPLE_RATE);
    let phase = 0;

    for (let i = 0; i < count; i++) {
      const t = i / SAMPLE_RATE;
      // Vibrato
      const vibrato = Math.sin(2 * Math.PI * 5.0 * t) * 6;
      phase += (2 * Math.PI * (n.freq + vibrato)) / SAMPLE_RATE;

      // Pure tone + breath air
      const sine = Math.sin(phase) + 0.15 * Math.sin(phase * 2);
      const breath = (Math.random() * 2 - 1) * 0.08;

      let env = 1.0;
      if (t < 0.08) env = t / 0.08;
      else if (t > n.len - 0.08) env = (n.len - t) / 0.08;

      if (startIdx + i < len) {
        out[startIdx + i] += (sine + breath) * env * 0.8;
      }
    }
  }

  return out;
}

// -------------------------------------------------------------
// 4. NATURE
// -------------------------------------------------------------

// Rain: Continuous soothing patter with distinct raindrop impulses
function generateRain() {
  const dur = 2.8;
  const len = Math.floor(SAMPLE_RATE * dur);
  const rawNoise = noise(len);

  // Pinkish filtered background rainfall
  const bgRain = applyBiquad(rawNoise, 'bandpass', 1400, 0.6);
  const out = new Float32Array(len);

  // Add background
  for (let i = 0; i < len; i++) {
    const t = i / SAMPLE_RATE;
    let fade = 1.0;
    if (t < 0.3) fade = t / 0.3;
    else if (t > 2.5) fade = (2.8 - t) / 0.3;
    out[i] = bgRain[i] * 0.5 * fade;
  }

  // Add individual pitter-patter drop impulses
  const numDrops = 180;
  for (let d = 0; d < numDrops; d++) {
    const dropTime = Math.random() * 2.6 + 0.1;
    const dropFreq = 1600 + Math.random() * 2400;
    const start = Math.floor(dropTime * SAMPLE_RATE);
    const dropLen = Math.floor(0.015 * SAMPLE_RATE);

    for (let i = 0; i < dropLen; i++) {
      const t = i / SAMPLE_RATE;
      const s = Math.sin(2 * Math.PI * dropFreq * t) * Math.exp(-t * 280);
      if (start + i < len) {
        out[start + i] += s * 0.25;
      }
    }
  }

  return out;
}

// Thunder: Sharp crack followed by deep rolling resonant rumble
function generateThunder() {
  const dur = 3.0;
  const len = Math.floor(SAMPLE_RATE * dur);
  const rawNoise = noise(len);
  const out = new Float32Array(len);

  // Initial thunder crackle
  const crackle = applyBiquad(rawNoise, 'bandpass', 800, 1.2);
  // Deep bass rumble (sub-bass frequencies)
  const deepRumble = applyBiquad(rawNoise, 'lowpass', 110, 2.0);

  for (let i = 0; i < len; i++) {
    const t = i / SAMPLE_RATE;

    // Crack transient: early spike around 0.1s - 0.4s
    let crackEnv = 0;
    if (t > 0.1 && t < 0.6) {
      crackEnv = Math.exp(-(t - 0.1) * 8) * 1.2;
    }

    // Heavy rolling rumble envelope
    let rumbleEnv = 0;
    if (t > 0.15) {
      const rt = t - 0.15;
      rumbleEnv = Math.exp(-rt * 0.9) * (0.8 + 0.3 * Math.sin(rt * 8));
    }

    out[i] = crackle[i] * crackEnv + deepRumble[i] * rumbleEnv * 2.2;
  }

  return out;
}

// Ocean Waves: Rhythmic rolling sea surf swell and foam
function generateOceanWaves() {
  const dur = 3.2;
  const len = Math.floor(SAMPLE_RATE * dur);
  const rawNoise = noise(len);
  const out = new Float32Array(len);

  // We simulate a big wave cresting at ~1.4s
  const lowPass = applyBiquad(rawNoise, 'lowpass', 450, 0.8);
  const spray = applyBiquad(rawNoise, 'bandpass', 1800, 0.7);

  for (let i = 0; i < len; i++) {
    const t = i / SAMPLE_RATE;

    // Wave swell curve
    const swell = Math.sin(Math.PI * (t / 3.2));
    // Surf foam crash around 1.3s - 2.0s
    let foam = 0;
    if (t > 1.0 && t < 2.5) {
      foam = Math.sin(Math.PI * ((t - 1.0) / 1.5));
    }

    out[i] = (lowPass[i] * Math.pow(swell, 1.5) * 1.2 + spray[i] * foam * 0.6) * 0.85;
  }

  return out;
}

// Wind: Howling whistling wind gust
function generateWind() {
  const dur = 2.8;
  const len = Math.floor(SAMPLE_RATE * dur);
  const rawNoise = noise(len);
  const out = new Float32Array(len);

  // Whistling resonant bandpass filter sweeping up and down
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;

  for (let i = 0; i < len; i++) {
    const t = i / SAMPLE_RATE;
    // Sweeping wind center frequency: 350Hz up to 850Hz and down
    const centerFreq = 380 + Math.sin(t * 1.8) * 280 + Math.sin(t * 3.7) * 90;
    const q = 3.5; // High Q makes it whistle/howl!

    const w0 = 2 * Math.PI * centerFreq / SAMPLE_RATE;
    const alpha = Math.sin(w0) / (2 * q);
    const cosW0 = Math.cos(w0);

    const b0 = alpha / (1 + alpha);
    const b2 = -alpha / (1 + alpha);
    const a1 = (-2 * cosW0) / (1 + alpha);
    const a2 = (1 - alpha) / (1 + alpha);

    const x0 = rawNoise[i];
    const y0 = b0 * x0 + b2 * x2 - a1 * y1 - a2 * y2;
    x2 = x1; x1 = x0;
    y2 = y1; y1 = y0;

    let env = 1.0;
    if (t < 0.4) env = t / 0.4;
    else if (t > 2.4) env = (2.8 - t) / 0.4;

    out[i] = y0 * env * 2.2;
  }

  return out;
}

// -------------------------------------------------------------
// 5. EVERYDAY SOUNDS
// -------------------------------------------------------------

// Alarm Clock: Urgent double-beeps "Beep-beep! Beep-beep! Beep-beep!"
function generateAlarmClock() {
  const dur = 2.2;
  const len = Math.floor(SAMPLE_RATE * dur);
  const out = new Float32Array(len);

  function pulse(startTime) {
    const startIdx = Math.floor(startTime * SAMPLE_RATE);
    const count = Math.floor(0.1 * SAMPLE_RATE);
    let phase = 0;
    const freq = 1100;

    for (let i = 0; i < count; i++) {
      phase += (2 * Math.PI * freq) / SAMPLE_RATE;
      const s = Math.sin(phase) + 0.3 * Math.sin(phase * 3);
      if (startIdx + i < len) {
        out[startIdx + i] += s * 0.7;
      }
    }
  }

  // 3 pairs of beeps
  pulse(0.15); pulse(0.32);
  pulse(0.75); pulse(0.92);
  pulse(1.35); pulse(1.52);

  return out;
}

// Telephone Ringing: Vintage dual-frequency telephone bell "Brrrrring!"
function generateTelephone() {
  const dur = 2.4;
  const len = Math.floor(SAMPLE_RATE * dur);
  const out = new Float32Array(len);

  function ring(startTime, duration) {
    const startIdx = Math.floor(startTime * SAMPLE_RATE);
    const count = Math.floor(duration * SAMPLE_RATE);
    let p1 = 0, p2 = 0;
    // Standard telecom tones: 440Hz + 480Hz modulated by 20Hz hammer clapper
    const f1 = 440;
    const f2 = 480;

    for (let i = 0; i < count; i++) {
      const t = i / SAMPLE_RATE;
      p1 += (2 * Math.PI * f1) / SAMPLE_RATE;
      p2 += (2 * Math.PI * f2) / SAMPLE_RATE;

      const clapper = 0.5 + 0.5 * Math.sin(2 * Math.PI * 22 * t);
      const tone = (Math.sin(p1) + Math.sin(p2)) * 0.5;

      if (startIdx + i < len) {
        out[startIdx + i] += tone * clapper * 0.8;
      }
    }
  }

  ring(0.15, 0.9);
  ring(1.30, 0.9);

  return out;
}

// Doorbell: Classic Westminster two-tone chime "Ding - Dong!"
function generateDoorbell() {
  const dur = 2.4;
  const len = Math.floor(SAMPLE_RATE * dur);
  const out = new Float32Array(len);

  function chime(startTime, freq, duration, amp) {
    const startIdx = Math.floor(startTime * SAMPLE_RATE);
    const count = Math.floor(duration * SAMPLE_RATE);
    let phase = 0;

    for (let i = 0; i < count; i++) {
      const t = i / SAMPLE_RATE;
      phase += (2 * Math.PI * freq) / SAMPLE_RATE;

      // Bell harmonics
      const s = Math.sin(phase) +
                0.35 * Math.sin(phase * 2.76) * Math.exp(-t * 2) +
                0.2 * Math.sin(phase * 5.4) * Math.exp(-t * 4);
      const env = Math.exp(-t * 1.8);

      if (startIdx + i < len) {
        out[startIdx + i] += s * env * amp;
      }
    }
  }

  // "Ding" (E5 = 659.25Hz)
  chime(0.1, 659.25, 1.2, 0.85);
  // "Dong" (C5 = 523.25Hz)
  chime(0.9, 523.25, 1.4, 0.9);

  return out;
}

// Water Pouring: Gurgling bubbling liquid stream filling a container
function generateWaterPouring() {
  const dur = 2.6;
  const len = Math.floor(SAMPLE_RATE * dur);
  const rawNoise = noise(len);
  const out = new Float32Array(len);

  // Background liquid splash
  const splash = applyBiquad(rawNoise, 'bandpass', 1200, 0.8);

  for (let i = 0; i < len; i++) {
    const t = i / SAMPLE_RATE;
    let env = 1.0;
    if (t < 0.2) env = t / 0.2;
    else if (t > 2.3) env = (2.6 - t) / 0.3;
    out[i] = splash[i] * 0.35 * env;
  }

  // Adding resonant liquid bubbles that rise in pitch as the vessel fills
  const numBubbles = 140;
  for (let b = 0; b < numBubbles; b++) {
    const bubbleTime = 0.15 + (b / numBubbles) * 2.2 + (Math.random() - 0.5) * 0.08;
    // Pitch rises from 450Hz to 1100Hz as glass fills up
    const startFreq = 450 + (b / numBubbles) * 650 + (Math.random() - 0.5) * 120;
    const startIdx = Math.floor(bubbleTime * SAMPLE_RATE);
    const bubbleLen = Math.floor((0.02 + Math.random() * 0.03) * SAMPLE_RATE);

    let phase = 0;
    for (let i = 0; i < bubbleLen; i++) {
      const t = i / SAMPLE_RATE;
      // Bubble frequency sweeps upward rapidly during pop
      const freq = startFreq * (1 + t * 15);
      phase += (2 * Math.PI * freq) / SAMPLE_RATE;
      const env = Math.sin(Math.PI * (i / bubbleLen));

      if (startIdx + i < len) {
        out[startIdx + i] += Math.sin(phase) * env * 0.35;
      }
    }
  }

  return out;
}

// -------------------------------------------------------------
// UI & FEEDBACK SOUNDS
// -------------------------------------------------------------

// Correct Answer: Joyful celebratory chime arpeggio (C5 - E5 - G5 - C6)
// Additional hard-level cues. These are synthesized effects, not field recordings.
function generateFootsteps() {
  const len = Math.floor(SAMPLE_RATE * 2.8);
  const out = new Float32Array(len);
  const grit = applyBiquad(noise(len), 'lowpass', 1300, 0.8);
  [0.2, 0.62, 1.04, 1.46, 1.88, 2.3].forEach((start, step) => {
    const offset = Math.floor(start * SAMPLE_RATE);
    const count = Math.floor(0.2 * SAMPLE_RATE);
    let phase = 0;
    for (let j = 0; j < count && offset + j < len; j++) {
      const t = j / SAMPLE_RATE;
      const env = Math.exp(-t * 20);
      phase += 2 * Math.PI * (step % 2 ? 72 : 92) / SAMPLE_RATE;
      out[offset + j] += (Math.sin(phase) * 0.7 + grit[offset + j] * 0.7) * env;
    }
  });
  return out;
}

function generateKeysJingling() {
  const len = Math.floor(SAMPLE_RATE * 2.4);
  const out = new Float32Array(len);
  [0.18, 0.3, 0.48, 0.76, 0.9, 1.15, 1.44, 1.62, 1.94, 2.12].forEach((start, index) => {
    const offset = Math.floor(start * SAMPLE_RATE);
    const count = Math.floor(0.28 * SAMPLE_RATE);
    const freqs = [1180 + index * 29, 1930 + index * 17, 2870 - index * 21];
    for (let j = 0; j < count && offset + j < len; j++) {
      const t = j / SAMPLE_RATE;
      const ring = Math.exp(-t * (13 + (index % 3) * 3));
      out[offset + j] += freqs.reduce((sum, f, k) => sum + Math.sin(2 * Math.PI * f * t) * (0.45 / (k + 1)), 0) * ring;
    }
  });
  return out;
}

function generateGlassClink() {
  const len = Math.floor(SAMPLE_RATE * 2.2);
  const out = new Float32Array(len);
  const offset = Math.floor(0.18 * SAMPLE_RATE);
  for (let j = 0; j < len - offset; j++) {
    const t = j / SAMPLE_RATE;
    const ring = Math.exp(-t * 2.7) * Math.min(1, t / 0.006);
    out[offset + j] = (Math.sin(2 * Math.PI * 1040 * t) + 0.62 * Math.sin(2 * Math.PI * 1675 * t) + 0.3 * Math.sin(2 * Math.PI * 2780 * t)) * ring;
  }
  return out;
}

function generateClockTicking() {
  const len = Math.floor(SAMPLE_RATE * 2.6);
  const out = new Float32Array(len);
  const tickNoise = noise(len);
  [0.18, 0.68, 1.18, 1.68, 2.18].forEach((start, index) => {
    const offset = Math.floor(start * SAMPLE_RATE);
    const count = Math.floor(0.055 * SAMPLE_RATE);
    for (let j = 0; j < count && offset + j < len; j++) {
      const t = j / SAMPLE_RATE;
      const env = Math.exp(-t * 90);
      const body = Math.sin(2 * Math.PI * (index % 2 ? 1450 : 1900) * t);
      out[offset + j] += (body * 0.7 + tickNoise[offset + j] * 0.3) * env;
    }
  });
  return out;
}

function generateZipper() {
  const len = Math.floor(SAMPLE_RATE * 2.0);
  const rasp = applyBiquad(noise(len), 'bandpass', 2600, 0.7);
  const out = new Float32Array(len);
  for (let i = 0; i < len; i++) {
    const position = (i / SAMPLE_RATE - 0.25) / 1.2;
    if (position < 0 || position > 1) continue;
    const pulse = 0.72 + 0.28 * Math.sin(position * Math.PI * 44);
    const fade = Math.min(1, position * 12, (1 - position) * 12);
    out[i] = rasp[i] * pulse * fade * 1.5;
  }
  return out;
}

// Additional hard-level cues. These are synthesized effects, not field recordings.
function generateFootsteps() {
  const len = Math.floor(SAMPLE_RATE * 2.8);
  const out = new Float32Array(len);
  const grit = applyBiquad(noise(len), 'lowpass', 1300, 0.8);
  [0.2, 0.62, 1.04, 1.46, 1.88, 2.3].forEach((start, step) => {
    const offset = Math.floor(start * SAMPLE_RATE);
    const count = Math.floor(0.2 * SAMPLE_RATE);
    let phase = 0;
    for (let j = 0; j < count && offset + j < len; j++) {
      const t = j / SAMPLE_RATE;
      const env = Math.exp(-t * 20);
      phase += 2 * Math.PI * (step % 2 ? 72 : 92) / SAMPLE_RATE;
      out[offset + j] += (Math.sin(phase) * 0.7 + grit[offset + j] * 0.7) * env;
    }
  });
  return out;
}

function generateKeysJingling() {
  const len = Math.floor(SAMPLE_RATE * 2.4);
  const out = new Float32Array(len);
  [0.18, 0.3, 0.48, 0.76, 0.9, 1.15, 1.44, 1.62, 1.94, 2.12].forEach((start, index) => {
    const offset = Math.floor(start * SAMPLE_RATE);
    const count = Math.floor(0.28 * SAMPLE_RATE);
    const freqs = [1180 + index * 29, 1930 + index * 17, 2870 - index * 21];
    for (let j = 0; j < count && offset + j < len; j++) {
      const t = j / SAMPLE_RATE;
      const ring = Math.exp(-t * (13 + (index % 3) * 3));
      out[offset + j] += freqs.reduce((sum, f, k) => sum + Math.sin(2 * Math.PI * f * t) * (0.45 / (k + 1)), 0) * ring;
    }
  });
  return out;
}

function generateGlassClink() {
  const len = Math.floor(SAMPLE_RATE * 2.2);
  const out = new Float32Array(len);
  const offset = Math.floor(0.18 * SAMPLE_RATE);
  for (let j = 0; j < len - offset; j++) {
    const t = j / SAMPLE_RATE;
    const ring = Math.exp(-t * 2.7) * Math.min(1, t / 0.006);
    out[offset + j] = (Math.sin(2 * Math.PI * 1040 * t) + 0.62 * Math.sin(2 * Math.PI * 1675 * t) + 0.3 * Math.sin(2 * Math.PI * 2780 * t)) * ring;
  }
  return out;
}

function generateClockTicking() {
  const len = Math.floor(SAMPLE_RATE * 2.6);
  const out = new Float32Array(len);
  const tickNoise = noise(len);
  [0.18, 0.68, 1.18, 1.68, 2.18].forEach((start, index) => {
    const offset = Math.floor(start * SAMPLE_RATE);
    const count = Math.floor(0.055 * SAMPLE_RATE);
    for (let j = 0; j < count && offset + j < len; j++) {
      const t = j / SAMPLE_RATE;
      const env = Math.exp(-t * 90);
      const body = Math.sin(2 * Math.PI * (index % 2 ? 1450 : 1900) * t);
      out[offset + j] += (body * 0.7 + tickNoise[offset + j] * 0.3) * env;
    }
  });
  return out;
}

function generateZipper() {
  const len = Math.floor(SAMPLE_RATE * 2.0);
  const rasp = applyBiquad(noise(len), 'bandpass', 2600, 0.7);
  const out = new Float32Array(len);
  for (let i = 0; i < len; i++) {
    const position = (i / SAMPLE_RATE - 0.25) / 1.2;
    if (position < 0 || position > 1) continue;
    const pulse = 0.72 + 0.28 * Math.sin(position * Math.PI * 44);
    const fade = Math.min(1, position * 12, (1 - position) * 12);
    out[i] = rasp[i] * pulse * fade * 1.5;
  }
  return out;
}

function generateCorrect() {
  const dur = 1.2;
  const len = Math.floor(SAMPLE_RATE * dur);
  const out = new Float32Array(len);

  const notes = [
    { freq: 523.25, time: 0.05 }, // C5
    { freq: 659.25, time: 0.18 }, // E5
    { freq: 783.99, time: 0.31 }, // G5
    { freq: 1046.50, time: 0.44 } // C6
  ];

  for (const n of notes) {
    const startIdx = Math.floor(n.time * SAMPLE_RATE);
    let phase = 0;
    for (let i = startIdx; i < len; i++) {
      const t = (i - startIdx) / SAMPLE_RATE;
      phase += (2 * Math.PI * n.freq) / SAMPLE_RATE;
      const s = Math.sin(phase) + 0.3 * Math.sin(phase * 2);
      const env = Math.exp(-t * 5.0);
      out[i] += s * env * 0.5;
    }
  }

  return out;
}

// Incorrect Answer: Gentle, friendly, cartoon "womp-womp"
function generateIncorrect() {
  const dur = 1.0;
  const len = Math.floor(SAMPLE_RATE * dur);
  const out = new Float32Array(len);

  function womp(startTime, startFreq, endFreq) {
    const startIdx = Math.floor(startTime * SAMPLE_RATE);
    const count = Math.floor(0.35 * SAMPLE_RATE);
    let phase = 0;

    for (let i = 0; i < count; i++) {
      const t = i / count;
      const freq = startFreq * (1 - t) + endFreq * t;
      phase += (2 * Math.PI * freq) / SAMPLE_RATE;
      const s = Math.sin(phase) + 0.3 * Math.sin(phase * 2);
      const env = Math.sin(Math.PI * t);
      if (startIdx + i < len) {
        out[startIdx + i] += s * env * 0.7;
      }
    }
  }

  womp(0.05, 260, 190);
  womp(0.45, 210, 150);

  return out;
}

// Button Click: Crisp tactile wooden/bubble pop
function generateClick() {
  const dur = 0.1;
  const len = Math.floor(SAMPLE_RATE * dur);
  const out = new Float32Array(len);

  let phase = 0;
  for (let i = 0; i < len; i++) {
    const t = i / SAMPLE_RATE;
    const freq = 1200 * Math.exp(-t * 60);
    phase += (2 * Math.PI * freq) / SAMPLE_RATE;
    const env = Math.exp(-t * 70);
    out[i] = Math.sin(phase) * env * 0.6;
  }

  return out;
}

// Victory Fanfare: Triumphant fanfare jingle
function generateFanfare() {
  const dur = 2.0;
  const len = Math.floor(SAMPLE_RATE * dur);
  const out = new Float32Array(len);

  const notes = [
    { freq: 392.00, time: 0.05, len: 0.15 }, // G4
    { freq: 523.25, time: 0.22, len: 0.15 }, // C5
    { freq: 659.25, time: 0.39, len: 0.15 }, // E5
    { freq: 783.99, time: 0.56, len: 0.75 }  // G5 long
  ];

  for (const n of notes) {
    const startIdx = Math.floor(n.time * SAMPLE_RATE);
    const count = Math.floor(n.len * SAMPLE_RATE);
    let phase = 0;
    for (let i = 0; i < count; i++) {
      const t = i / count;
      phase += (2 * Math.PI * n.freq) / SAMPLE_RATE;
      // Trumpet-like brass harmonic richness
      let s = Math.sin(phase) + 0.6 * Math.sin(phase * 2) + 0.4 * Math.sin(phase * 3) + 0.2 * Math.sin(phase * 4);
      let env = 1.0;
      if (t < 0.1) env = t / 0.1;
      else if (t > 0.8) env = (1.0 - t) / 0.2;
      if (startIdx + i < len) {
        out[startIdx + i] += s * env * 0.6;
      }
    }
  }

  return out;
}

// Golden Challenge Sound: Sparkling magical golden chime
function generateGolden() {
  const dur = 1.8;
  const len = Math.floor(SAMPLE_RATE * dur);
  const out = new Float32Array(len);

  // Sparkly arpeggio: C5, E5, G5, B5, C6, E6, G6
  const freqs = [523.25, 659.25, 783.99, 987.77, 1046.50, 1318.51, 1567.98];
  freqs.forEach((freq, idx) => {
    const delay = idx * 0.12;
    const startIdx = Math.floor(delay * SAMPLE_RATE);
    let phase = 0;
    for (let i = startIdx; i < len; i++) {
      const t = (i - startIdx) / SAMPLE_RATE;
      // High bell chime
      phase += (2 * Math.PI * freq) / SAMPLE_RATE;
      const chime = Math.sin(phase) + 0.3 * Math.sin(phase * 2.76);
      const sparkle = (Math.random() * 2 - 1) * 0.05 * Math.exp(-t * 8);
      const env = Math.exp(-t * 4.5);
      out[i] += (chime + sparkle) * env * 0.45;
    }
  });

  return out;
}

// Shield Activation Sound: Crystal forcefield gong
function generateShield() {
  const dur = 1.6;
  const len = Math.floor(SAMPLE_RATE * dur);
  const out = new Float32Array(len);

  let phase = 0;
  for (let i = 0; i < len; i++) {
    const t = i / SAMPLE_RATE;
    // Rising protective shimmer frequency
    const f = 580 + Math.sin(t * 12) * 40;
    phase += (2 * Math.PI * f) / SAMPLE_RATE;

    const fundamental = Math.sin(phase);
    const octave = Math.sin(phase * 2) * 0.4;
    const pulse = Math.sin(2 * Math.PI * 30 * t) * 0.2;
    const env = Math.exp(-t * 2.2);

    out[i] = (fundamental + octave + pulse) * env * 0.6;
  }

  return out;
}

// -------------------------------------------------------------
// EXECUTE GENERATION
// -------------------------------------------------------------

function generateLevelExclusiveSound(sound, seed) {
  const duration = 1.45 + (seed % 4) * 0.16;
  const length = Math.floor(SAMPLE_RATE * duration);
  const samples = new Float32Array(length);
  const phaseOffset = seed * 0.731;
  const pulseRate = 2.2 + (seed % 7) * 1.13;
  const sweepPower = 0.65 + (seed % 5) * 0.22;

  for (let i = 0; i < length; i++) {
    const t = i / SAMPLE_RATE;
    const progress = t / duration;
    const sweep = Math.pow(progress, sweepPower);
    const frequency = sound.lowFrequency + (sound.highFrequency - sound.lowFrequency) * sweep;
    const phase = 2 * Math.PI * (sound.lowFrequency * t + (sound.highFrequency - sound.lowFrequency) * Math.pow(t, sweepPower + 1) / ((sweepPower + 1) * duration ** sweepPower));
    const pulse = 0.52 + 0.48 * Math.sin(2 * Math.PI * pulseRate * t + phaseOffset);
    const attack = Math.min(1, t * (sound.style === 1 ? 45 : 8));
    const release = Math.min(1, Math.max(0, (duration - t) * (sound.style === 1 ? 2.1 : 3.4)));
    const envelope = attack * release;
    const tone = Math.sin(phase) + 0.34 * Math.sin(phase * (1.48 + (seed % 4) * 0.18) + phaseOffset);
    const harmonic = Math.sin(phase * 2.01 + phaseOffset) * (sound.style === 4 ? 0.18 : 0.32);
    const noise = (Math.random() * 2 - 1) * (sound.style === 2 || sound.style === 5 ? 0.3 : 0.055);
    const transient = Math.sin(2 * Math.PI * (frequency * 1.8) * t) * Math.exp(-t * (3 + seed % 4)) * (sound.style === 1 ? 0.55 : 0.12);
    const texture = sound.style === 3 ? pulse : sound.style === 5 ? Math.abs(pulse) : 0.72 + 0.28 * pulse;
    samples[i] = (tone + harmonic + noise + transient) * envelope * texture;
  }

  return applyBiquad(samples, sound.style === 2 || sound.style === 5 ? 'bandpass' : 'lowpass', Math.min(6000, sound.highFrequency * 2.2), 0.8 + (seed % 3) * 0.25);
}

console.log('Generating game audio assets...');

if (process.argv.includes('--level-exclusive-assets')) {
  EXTRA_GAME_SOUNDS.forEach((sound, index) => {
    writeWav(`${sound.id}.wav`, generateLevelExclusiveSound(sound, index + 1));
  });
  console.log(`Generated ${EXTRA_GAME_SOUNDS.length} level-exclusive sound assets.`);
} else if (process.argv.includes('--new-hard-assets')) {
  writeWav('footsteps.wav', generateFootsteps());
  writeWav('keys_jingling.wav', generateKeysJingling());
  writeWav('glass_clink.wav', generateGlassClink());
  writeWav('clock_ticking.wav', generateClockTicking());
  writeWav('zipper.wav', generateZipper());
  console.log('Generated five additional hard-level sound assets.');
} else {
// 20 Game Sounds
writeWav('dog_bark.wav', generateDog());
writeWav('cat_meow.wav', generateCat());
writeWav('bird_chirp.wav', generateBird());
writeWav('cow_moo.wav', generateCow());

writeWav('car_horn.wav', generateCarHorn());
writeWav('motorcycle.wav', generateMotorcycle());
writeWav('airplane.wav', generateAirplane());
writeWav('train.wav', generateTrain());

writeWav('piano.wav', generatePiano());
writeWav('guitar.wav', generateGuitar());
writeWav('drums.wav', generateDrums());
writeWav('flute.wav', generateFlute());

writeWav('rain.wav', generateRain());
writeWav('thunder.wav', generateThunder());
writeWav('ocean_waves.wav', generateOceanWaves());
writeWav('wind.wav', generateWind());

writeWav('alarm_clock.wav', generateAlarmClock());
writeWav('telephone.wav', generateTelephone());
writeWav('doorbell.wav', generateDoorbell());
writeWav('water_pouring.wav', generateWaterPouring());

// 6 Feedback & UI Sounds
writeWav('correct.wav', generateCorrect());
writeWav('incorrect.wav', generateIncorrect());
writeWav('click.wav', generateClick());
writeWav('fanfare.wav', generateFanfare());
writeWav('golden.wav', generateGolden());
writeWav('shield.wav', generateShield());

console.log('All audio files successfully generated in /audio directory!');
}

