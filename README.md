# 🎧 Guess the Sound Challenge

A fun, interactive, and educational web-based audio quiz game built with pure **HTML5, CSS3, and JavaScript**. Players listen to mystery audio clips, test their auditory perception, and guess the source from multiple-choice options.

---

## 🌟 Game Highlights & Features

- **🎮 Homepage**: Modern glassmorphic hero interface with sound visualizers, difficulty selector, category filter, instructions, and high-score tracking.
- **🔊 Real Audio Clips**: 20 distinct high-quality sound effects across 5 categories, plus tactile UI sounds (correct chime, buzz, clicks, victory fanfare).
- **🛡️ Dual-Engine Audio Reliability**:
  1. **Direct HTML5 Audio**: Plays 44.1kHz `.wav` audio files stored locally in the `audio/` directory.
  2. **Zero-Fail Web Audio API Procedural Synthesizer**: Built right into `app.js` as an instant fallback, guaranteeing 100% playable sound in every environment (including offline or direct `file:///` browser launches).
- **✨ Live Audio Visualizer**: Real-time canvas equalizer bars and animated ripple rings that react dynamically during audio playback.
- **🧠 Educational "Did You Know?" Facts**: Every sound reveals fascinating scientific or historical trivia after answering!
- **🏆 Comprehensive Scoring & Levels**:
  - **Easy (Beginner Ear)**: 6 iconic sounds with distinct cross-category choices.
  - **Medium (Sound Detective)**: 10 sounds with nuanced distractors.
  - **Hard (Audio Master)**: 15 tricky sounds with closely related distractors.
  - **Grand Marathon**: All 20 sounds in one hearing championship!
  - **+10 Points** per correct answer, streak tracking, accuracy percentage, and end-game performance trophies.
- **💀 Sudden Death Game Over**: Choosing an incorrect answer ends the run immediately with a **Game Over** screen, scoring points for sounds identified prior to the mistake and offering a **Try Again** option.
- **🎧 Sound History Review**: At the end of the round, inspect every sound you encountered, check your answers, and click a mini **Play** button to listen again!
- **⌨️ Keyboard Accessibility**: Full keyboard support (`Space` to play, `1-4` to answer, `Enter`/`N` for next sound, `M` to mute).
- **📱 Fully Responsive**: Fluid layout for desktop PCs, laptops, tablets, and mobile phones.

---

## 📂 Project Structure

```text
games/
├── index.html            # Main semantic HTML5 markup & HUD
├── style.css             # Modern stylesheet with animations & responsive queries
├── app.js                # Game engine, procedural audio synth, visualizer & events
├── generate_sounds.js    # Node.js generator script for creating the WAV audio files
├── README.md             # Documentation & instructions
└── audio/                # Local audio files directory
    ├── dog_bark.wav          # 🐶 Animals
    ├── cat_meow.wav
    ├── bird_chirp.wav
    ├── cow_moo.wav
    ├── car_horn.wav          # 🚗 Vehicles
    ├── motorcycle.wav
    ├── airplane.wav
    ├── train.wav
    ├── piano.wav             # 🎵 Musical Instruments
    ├── guitar.wav
    ├── drums.wav
    ├── flute.wav
    ├── rain.wav              # 🌧️ Nature
    ├── thunder.wav
    ├── ocean_waves.wav
    ├── wind.wav
    ├── alarm_clock.wav       # 🏠 Everyday Sounds
    ├── telephone.wav
    ├── doorbell.wav
    ├── water_pouring.wav
    ├── correct.wav           # 🎉 Feedback & UI
    ├── incorrect.wav
    ├── click.wav
    └── fanfare.wav
```

---

## 🚀 How to Run the Game

1. **Quickest Method**:
   - Double-click `index.html` to open it in Google Chrome, Microsoft Edge, Mozilla Firefox, or Safari.
2. **Local HTTP Server (Optional)**:
   ```bash
   # Using Node.js
   npx serve .
   # OR using Python (if available)
   python -m http.server 8000
   ```
3. **Regenerating Audio Files**:
   If you ever want to re-synthesize or regenerate the 24 audio files in the `audio/` folder:
   ```bash
   node generate_sounds.js
   ```

---

## 🗂️ Sound Categories & Tracklist

| Category | Sound Name | Audio Filename | Acoustic Character |
| :--- | :--- | :--- | :--- |
| 🐶 **Animals** | Dog Barking | `dog_bark.wav` | Dual woof bark with formant rasp |
| 🐶 **Animals** | Cat Meowing | `cat_meow.wav` | Pitch glide rising to 680Hz and falling |
| 🐶 **Animals** | Bird Chirping | `bird_chirp.wav` | Triplet frequency chirps with flutter |
| 🐶 **Animals** | Cow Mooing | `cow_moo.wav` | Deep 105Hz resonant chest formant |
| 🚗 **Vehicles** | Car Horn | `car_horn.wav` | Dual automotive interval (370Hz + 440Hz) |
| 🚗 **Vehicles** | Motorcycle | `motorcycle.wav` | Accelerating cylinder combustion revs |
| 🚗 **Vehicles** | Airplane | `airplane.wav` | Jet exhaust roar with high turbine whine |
| 🚗 **Vehicles** | Train Whistle | `train.wav` | Triad chord locomotive chime blasts |
| 🎵 **Instruments** | Piano | `piano.wav` | C major arpeggio with hammer attack |
| 🎵 **Instruments** | Guitar | `guitar.wav` | Karplus-Strong acoustic string strum |
| 🎵 **Instruments** | Drums | `drums.wav` | Kick drum, snare rattle & hi-hat groove |
| 🎵 **Instruments** | Flute | `flute.wav` | Sweet 4-note woodwind melody with vibrato |
| 🌧️ **Nature** | Rain | `rain.wav` | Shower patter with distinct drop impulses |
| 🌧️ **Nature** | Thunder | `thunder.wav` | Sharp shockwave crackle & deep sub-bass rumble |
| 🌧️ **Nature** | Ocean Waves | `ocean_waves.wav` | Swelling surf cresting into sandy foam |
| 🌧️ **Nature** | Wind | `wind.wav` | Resonant whistling gust sweeping through trees |
| 🏠 **Everyday** | Alarm Clock | `alarm_clock.wav` | Urgent digital double-beep alert pulses |
| 🏠 **Everyday** | Telephone | `telephone.wav` | Dual-tone bell ring with 22Hz clapper |
| 🏠 **Everyday** | Doorbell | `doorbell.wav` | Westminster two-tone chime (Ding-Dong) |
| 🏠 **Everyday** | Water Pouring | `water_pouring.wav` | Liquid stream with rising bubble resonance |

---

## ⌨️ Keyboard Shortcuts

- <kbd>Space</kbd> or <kbd>P</kbd>: Play mystery sound
- <kbd>1</kbd> - <kbd>4</kbd>: Select answers 1 to 4
- <kbd>Enter</kbd> or <kbd>N</kbd>: Proceed to next sound
- <kbd>M</kbd>: Mute / Unmute
- <kbd>Esc</kbd>: Close instructions modal

