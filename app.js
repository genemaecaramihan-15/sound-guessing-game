/**
 * Guess the Sound Challenge
 * Pure HTML5, CSS3 & JavaScript (ES6+)
 * Features: Real Audio Files, Procedural Web Audio Fallback, Live Visualizer,
 * Confetti System, Multiple Difficulty Levels, Educational Trivia & Keyboard Controls.
 */

(() => {
  'use strict';

  // =========================================================
  // 1. SOUND DATABASE (70 level sounds plus feedback sounds)
  // =========================================================
  const SOUND_LIBRARY = [
    // 🐶 Animals
    {
      id: 'dog_bark',
      name: 'Dog Barking',
      icon: '🐶',
      category: 'Animals',
      file: 'audio/dog_bark.wav',
      fact: 'Dogs have 18 ear muscles that can tilt, rotate, and cup their ears independently to pinpoint the exact direction of a sound in milliseconds!',
      clue: 'A loyal four-legged pet known as man\'s best friend.'
    },
    {
      id: 'cat_meow',
      name: 'Cat Meowing',
      icon: '🐱',
      category: 'Animals',
      file: 'audio/cat_meow.wav',
      fact: 'Adult cats rarely meow at other cats! They developed meowing specifically to communicate with humans to ask for food, affection, or attention.',
      clue: 'A nimble feline pet with whiskers that loves purring and naps.'
    },
    {
      id: 'bird_chirp',
      name: 'Bird Chirping',
      icon: '🐦',
      category: 'Animals',
      file: 'audio/bird_chirp.wav',
      fact: 'Birds have a specialized vocal organ called a syrinx, which allows many songbirds to produce two completely independent tones simultaneously!',
      clue: 'A feathered creature singing melodious tunes from tree branches.'
    },
    {
      id: 'cow_moo',
      name: 'Cow Mooing',
      icon: '🐮',
      category: 'Animals',
      file: 'audio/cow_moo.wav',
      fact: 'Scientific acoustic research revealed that cows develop regional accents in their moos depending on the herd and geographic area they live in!',
      clue: 'A gentle farm animal that grazes in green pastures and produces milk.'
    },

    // 🚗 Vehicles
    {
      id: 'car_horn',
      name: 'Car Horn',
      icon: '🚗',
      category: 'Vehicles',
      file: 'audio/car_horn.wav',
      fact: 'Modern dual-tone automotive horns intentionally produce a musical interval (often an F# and A) tuned to penetrate engine noise and alert pedestrians.',
      clue: 'A warning signal found on vehicle steering wheels.'
    },
    {
      id: 'motorcycle',
      name: 'Motorcycle',
      icon: '🏍️',
      category: 'Vehicles',
      file: 'audio/motorcycle.wav',
      fact: 'The iconic throbbing engine roar comes from exhaust gas pulses traveling through tuned exhaust pipes as internal combustion cylinders fire in rapid rhythm.',
      clue: 'A speedy two-wheeled motorized ride that roars on the highway.'
    },
    {
      id: 'airplane',
      name: 'Airplane',
      icon: '✈️',
      category: 'Vehicles',
      file: 'audio/airplane.wav',
      fact: 'Modern jet engines gulp down more than 1.2 million liters of air every single second during takeoff, producing enormous thrust and deep acoustic roar.',
      clue: 'A winged passenger aircraft soaring through the clouds.'
    },
    {
      id: 'train',
      name: 'Train Whistle',
      icon: '🚂',
      category: 'Vehicles',
      file: 'audio/train.wav',
      fact: 'Locomotive train horns blast a distinct warning chord at 96 to 110 decibels, specially designed to carry sound waves over a mile down the railroad tracks!',
      clue: 'A powerful locomotive gliding along steel railroad tracks.'
    },

    // 🎵 Musical Instruments
    {
      id: 'piano',
      name: 'Piano',
      icon: '🎹',
      category: 'Musical Instruments',
      file: 'audio/piano.wav',
      fact: 'A full-size grand piano has over 230 high-tensile steel strings held across a cast-iron plate under an astounding 20 tons of combined tension!',
      clue: 'A classic keyboard instrument with 88 black and white keys.'
    },
    {
      id: 'guitar',
      name: 'Guitar',
      icon: '🎸',
      category: 'Musical Instruments',
      file: 'audio/guitar.wav',
      fact: 'When a guitar string is plucked, the bridge transfers the vibrational kinetic energy directly into the wooden soundboard, radiating acoustic waves.',
      clue: 'A popular six-stringed instrument played by strumming or fingerpicking.'
    },
    {
      id: 'drums',
      name: 'Drums',
      icon: '🥁',
      category: 'Musical Instruments',
      file: 'audio/drums.wav',
      fact: 'Drums are among civilization\'s oldest musical instruments. Ancient membrane drums excavated by archaeologists date back more than 6,000 years!',
      clue: 'Percussion instruments struck with wooden sticks to create rhythmic beats.'
    },
    {
      id: 'flute',
      name: 'Flute',
      icon: '🪈',
      category: 'Musical Instruments',
      file: 'audio/flute.wav',
      fact: 'The flute is an aerophone that produces sound without reeds: the musician blows across an embouchure hole, splitting the air stream into harmonic vortex pulses.',
      clue: 'A slender woodwind instrument known for sweet, high-pitched melodies.'
    },

    // 🌧️ Nature
    {
      id: 'rain',
      name: 'Rain Patter',
      icon: '🌧️',
      category: 'Nature',
      file: 'audio/rain.wav',
      fact: 'The pleasant, refreshing scent that rises when rain droplets hit warm dry soil is called "Petrichor," caused by plant oils and geosmin released from soil microbes.',
      clue: 'Water droplets falling from stormy clouds onto leaves and roofs.'
    },
    {
      id: 'thunder',
      name: 'Thunder Rumble',
      icon: '⚡',
      category: 'Nature',
      file: 'audio/thunder.wav',
      fact: 'A lightning bolt superheats the surrounding air up to 30,000°C (54,000°F)—five times hotter than the sun\'s surface! The rapid thermal expansion explodes as thunder.',
      clue: 'A deep booming shockwave rolling across the sky during a thunderstorm.'
    },
    {
      id: 'ocean_waves',
      name: 'Ocean Waves',
      icon: '🌊',
      category: 'Nature',
      file: 'audio/ocean_waves.wav',
      fact: 'The rhythmic swoosh of ocean waves crashing onto sandy beaches produces soothing pink noise, a frequency spectrum shown to promote deep sleep and relaxation.',
      clue: 'Rolling sea swells rising, breaking into white foam, and receding.'
    },
    {
      id: 'wind',
      name: 'Howling Wind',
      icon: '💨',
      category: 'Nature',
      file: 'audio/wind.wav',
      fact: 'Air itself is practically silent when moving across empty open space; the howling sound is created when wind rushes past obstacles like branches, wires, or chimney flues!',
      clue: 'A forceful gust of moving air whistling through trees and buildings.'
    },

    // 🏠 Everyday Sounds
    {
      id: 'alarm_clock',
      name: 'Alarm Clock',
      icon: '⏰',
      category: 'Everyday Sounds',
      file: 'audio/alarm_clock.wav',
      fact: 'The earliest mechanical alarm clock was invented in 1787 by Levi Hutchins, but it only rang at 4:00 AM—the exact time Hutchins liked to wake up for work!',
      clue: 'A bedside device with beeps or bells designed to wake you in the morning.'
    },
    {
      id: 'telephone',
      name: 'Telephone Ringing',
      icon: '☎️',
      category: 'Everyday Sounds',
      file: 'audio/telephone.wav',
      fact: 'Traditional telephone ringers used dual physical brass bells that were struck alternately by an electromagnetic hammer clapper vibrating at 20 Hz.',
      clue: 'A classic communication device alerting you that someone is calling.'
    },
    {
      id: 'doorbell',
      name: 'Doorbell Chime',
      icon: '🔔',
      category: 'Everyday Sounds',
      file: 'audio/doorbell.wav',
      fact: 'The classic "Ding-Dong" chime uses two tuned steel tone bars: the electric solenoid plunger strikes the higher note when pushed, and the lower note when released!',
      clue: 'A chime button outside a front door notifying you of visitors.'
    },
    {
      id: 'water_pouring',
      name: 'Water Pouring',
      icon: '💧',
      category: 'Everyday Sounds',
      file: 'audio/water_pouring.wav',
      fact: 'When pouring water into a glass, you can tell it\'s almost full with your eyes closed! The pitch rises because the vibrating air cavity inside the container gets shorter.',
      clue: 'Liquid splashing and bubbling as it fills up a drinking glass.'
    },
    {
      id: 'footsteps',
      name: 'Footsteps Walking',
      icon: '👣',
      category: 'Everyday Sounds',
      file: 'audio/footsteps.wav',
      fact: 'The changing rhythm and weight of footsteps can reveal whether someone is walking, running, or approaching.',
      clue: 'A person walking across a hard floor.'
    },
    {
      id: 'keys_jingling',
      name: 'Keys Jingling',
      icon: '🔑',
      category: 'Everyday Sounds',
      file: 'audio/keys_jingling.wav',
      fact: 'A key ring makes a bright rattle as its metal keys collide at many different pitches.',
      clue: 'A small metal ring being shaken.'
    },
    {
      id: 'glass_clink',
      name: 'Glass Clinking',
      icon: '🥂',
      category: 'Everyday Sounds',
      file: 'audio/glass_clink.wav',
      fact: 'Glass rings because it vibrates at bright resonant frequencies after being tapped.',
      clue: 'A light, high-pitched tap on a drinking glass.'
    },
    {
      id: 'clock_ticking',
      name: 'Clock Ticking',
      icon: '🕰️',
      category: 'Everyday Sounds',
      file: 'audio/clock_ticking.wav',
      fact: 'A mechanical clock uses a steady escapement to divide time into regular ticks.',
      clue: 'A steady, repeating sound from a timekeeping device.'
    },
    {
      id: 'zipper',
      name: 'Zipper Closing',
      icon: '🧥',
      category: 'Everyday Sounds',
      file: 'audio/zipper.wav',
      fact: 'A zipper closes by interlocking two rows of small teeth as the slider moves along them.',
      clue: 'A short rasping sound as a jacket or bag is fastened.'
    }
  ];

  SOUND_LIBRARY.push(...window.EXTRA_GAME_SOUNDS);

  // Each progression level draws questions and answer choices only from its own pool.
  const LEVEL_SOUND_IDS = {
    easy: ['dog_bark', 'cat_meow', 'bird_chirp', 'cow_moo', 'rain', 'thunder', 'doorbell', 'car_horn', 'alarm_clock', 'water_pouring'],
    medium: ['motorcycle', 'train', 'telephone', 'wind', 'ocean_waves', 'flute', 'guitar', 'piano', 'drums', 'airplane', 'footsteps', 'keys_jingling', 'glass_clink', 'clock_ticking', 'zipper'],
    hard: window.EXTRA_GAME_SOUNDS.slice(0, 20).map(sound => sound.id),
    all: window.EXTRA_GAME_SOUNDS.slice(20).map(sound => sound.id)
  };
  const LEVEL_SOUNDS = Object.fromEntries(
    Object.entries(LEVEL_SOUND_IDS).map(([level, ids]) => [
      level,
      ids.map(id => SOUND_LIBRARY.find(sound => sound.id === id)).filter(Boolean)
    ])
  );

  // =========================================================
  // 2. WEB AUDIO API PROCEDURAL SYNTHESIZER (ZERO-FAIL ENGINE)
  // Ensures 100% playable sound in every environment
  // =========================================================
  let audioCtx = null;
  let activeMysterySynthMaster = null;

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  // Web Audio Synth Procedural Fallbacks
  const SynthEngine = {
    stopMystery() {
      if (!activeMysterySynthMaster || !audioCtx) return;
      try {
        activeMysterySynthMaster.gain.cancelScheduledValues(audioCtx.currentTime);
        activeMysterySynthMaster.gain.setValueAtTime(0, audioCtx.currentTime);
        activeMysterySynthMaster.disconnect();
      } catch (_) {
        // The sound may already have finished.
      }
      activeMysterySynthMaster = null;
    },
    play(id, volume = 0.8, track = 'effect') {
      if (track === 'mystery') this.stopMystery();
      const ctx = getAudioContext();
      if (!ctx) return;
      const t = ctx.currentTime;
      const master = ctx.createGain();
      master.gain.setValueAtTime(volume, t);
      master.connect(ctx.destination);
      if (track === 'mystery') activeMysterySynthMaster = master;

      switch (id) {
        case 'dog_bark': {
          [0, 0.4].forEach(delay => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(1400, t + delay);

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(450, t + delay);
            osc.frequency.exponentialRampToValueAtTime(160, t + delay + 0.25);

            gain.gain.setValueAtTime(0, t + delay);
            gain.gain.linearRampToValueAtTime(0.9, t + delay + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.28);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(master);
            osc.start(t + delay);
            osc.stop(t + delay + 0.3);
          });
          break;
        }

        case 'cat_meow': {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(360, t);
          osc.frequency.linearRampToValueAtTime(680, t + 0.5);
          osc.frequency.setValueAtTime(680, t + 0.9);
          osc.frequency.exponentialRampToValueAtTime(340, t + 1.6);

          gain.gain.setValueAtTime(0, t);
          gain.gain.linearRampToValueAtTime(0.8, t + 0.2);
          gain.gain.setValueAtTime(0.8, t + 1.0);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 1.6);

          osc.connect(gain);
          gain.connect(master);
          osc.start(t);
          osc.stop(t + 1.6);
          break;
        }

        case 'bird_chirp': {
          [0, 0.16, 0.34, 0.7, 0.86].forEach(delay => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(2600, t + delay);
            osc.frequency.exponentialRampToValueAtTime(4800, t + delay + 0.05);
            osc.frequency.exponentialRampToValueAtTime(3000, t + delay + 0.1);

            gain.gain.setValueAtTime(0, t + delay);
            gain.gain.linearRampToValueAtTime(0.7, t + delay + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.1);

            osc.connect(gain);
            gain.connect(master);
            osc.start(t + delay);
            osc.stop(t + delay + 0.12);
          });
          break;
        }

        case 'cow_moo': {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(105, t);
          osc.frequency.linearRampToValueAtTime(92, t + 1.8);

          const filter = ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(550, t);

          gain.gain.setValueAtTime(0, t);
          gain.gain.linearRampToValueAtTime(0.8, t + 0.3);
          gain.gain.setValueAtTime(0.8, t + 1.4);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 1.9);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(master);
          osc.start(t);
          osc.stop(t + 1.9);
          break;
        }

        case 'car_horn': {
          [0, 0.45].forEach((delay, idx) => {
            const len = idx === 0 ? 0.3 : 0.45;
            [370, 440].forEach(f => {
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.type = 'sawtooth';
              osc.frequency.setValueAtTime(f, t + delay);

              gain.gain.setValueAtTime(0, t + delay);
              gain.gain.linearRampToValueAtTime(0.4, t + delay + 0.02);
              gain.gain.setValueAtTime(0.4, t + delay + len - 0.02);
              gain.gain.linearRampToValueAtTime(0, t + delay + len);

              osc.connect(gain);
              gain.connect(master);
              osc.start(t + delay);
              osc.stop(t + delay + len);
            });
          });
          break;
        }

        case 'motorcycle': {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(45, t);
          osc.frequency.linearRampToValueAtTime(130, t + 0.7);
          osc.frequency.linearRampToValueAtTime(75, t + 1.1);
          osc.frequency.linearRampToValueAtTime(160, t + 1.7);
          osc.frequency.exponentialRampToValueAtTime(50, t + 2.2);

          const filter = ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(800, t);

          gain.gain.setValueAtTime(0.2, t);
          gain.gain.linearRampToValueAtTime(0.8, t + 0.6);
          gain.gain.linearRampToValueAtTime(0.9, t + 1.7);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 2.2);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(master);
          osc.start(t);
          osc.stop(t + 2.2);
          break;
        }

        case 'airplane': {
          // Low roar + turbine whistle
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(2600, t);
          osc.frequency.linearRampToValueAtTime(2400, t + 2.0);

          gain.gain.setValueAtTime(0.01, t);
          gain.gain.linearRampToValueAtTime(0.3, t + 0.8);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 2.2);

          osc.connect(gain);
          gain.connect(master);
          osc.start(t);
          osc.stop(t + 2.2);
          break;
        }

        case 'train': {
          [0, 0.8].forEach(delay => {
            [293.66, 369.99, 440.00].forEach(freq => {
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.type = 'triangle';
              osc.frequency.setValueAtTime(freq, t + delay);

              gain.gain.setValueAtTime(0, t + delay);
              gain.gain.linearRampToValueAtTime(0.3, t + delay + 0.05);
              gain.gain.setValueAtTime(0.3, t + delay + 0.6);
              gain.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.7);

              osc.connect(gain);
              gain.connect(master);
              osc.start(t + delay);
              osc.stop(t + delay + 0.75);
            });
          });
          break;
        }

        case 'piano': {
          [261.63, 329.63, 392.00, 523.25].forEach((freq, idx) => {
            const delay = idx * 0.15;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, t + delay);

            gain.gain.setValueAtTime(0.7, t + delay);
            gain.gain.exponentialRampToValueAtTime(0.001, t + delay + 1.6);

            osc.connect(gain);
            gain.connect(master);
            osc.start(t + delay);
            osc.stop(t + delay + 1.7);
          });
          break;
        }

        case 'guitar': {
          [164.8, 220.0, 293.7, 392.0, 493.9, 659.3].forEach((freq, idx) => {
            const delay = idx * 0.05;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, t + delay);

            gain.gain.setValueAtTime(0.4, t + delay);
            gain.gain.exponentialRampToValueAtTime(0.001, t + delay + 1.5);

            osc.connect(gain);
            gain.connect(master);
            osc.start(t + delay);
            osc.stop(t + delay + 1.6);
          });
          break;
        }

        case 'drums': {
          // Kick + Snare + Hi-Hat pattern
          [0, 0.8].forEach(kickTime => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.frequency.setValueAtTime(140, t + kickTime);
            osc.frequency.exponentialRampToValueAtTime(45, t + kickTime + 0.2);
            gain.gain.setValueAtTime(1.0, t + kickTime);
            gain.gain.exponentialRampToValueAtTime(0.001, t + kickTime + 0.3);
            osc.connect(gain);
            gain.connect(master);
            osc.start(t + kickTime);
            osc.stop(t + kickTime + 0.35);
          });
          [0.4, 1.2].forEach(snareTime => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(180, t + snareTime);
            gain.gain.setValueAtTime(0.7, t + snareTime);
            gain.gain.exponentialRampToValueAtTime(0.001, t + snareTime + 0.2);
            osc.connect(gain);
            gain.connect(master);
            osc.start(t + snareTime);
            osc.stop(t + snareTime + 0.25);
          });
          break;
        }

        case 'flute': {
          [392.00, 493.88, 587.33, 783.99].forEach((freq, idx) => {
            const delay = idx * 0.45;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, t + delay);

            gain.gain.setValueAtTime(0, t + delay);
            gain.gain.linearRampToValueAtTime(0.6, t + delay + 0.05);
            gain.gain.setValueAtTime(0.6, t + delay + 0.35);
            gain.gain.linearRampToValueAtTime(0, t + delay + 0.42);

            osc.connect(gain);
            gain.connect(master);
            osc.start(t + delay);
            osc.stop(t + delay + 0.45);
          });
          break;
        }

        case 'alarm_clock': {
          [0, 0.18, 0.6, 0.78, 1.2, 1.38].forEach(delay => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(1050, t + delay);

            gain.gain.setValueAtTime(0.5, t + delay);
            gain.gain.setValueAtTime(0.5, t + delay + 0.08);
            gain.gain.setValueAtTime(0, t + delay + 0.09);

            osc.connect(gain);
            gain.connect(master);
            osc.start(t + delay);
            osc.stop(t + delay + 0.1);
          });
          break;
        }

        case 'telephone': {
          [0, 1.0].forEach(ringDelay => {
            [440, 480].forEach(freq => {
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.type = 'sine';
              osc.frequency.setValueAtTime(freq, t + ringDelay);

              gain.gain.setValueAtTime(0.3, t + ringDelay);
              gain.gain.setValueAtTime(0.3, t + ringDelay + 0.7);
              gain.gain.exponentialRampToValueAtTime(0.001, t + ringDelay + 0.75);

              osc.connect(gain);
              gain.connect(master);
              osc.start(t + ringDelay);
              osc.stop(t + ringDelay + 0.8);
            });
          });
          break;
        }

        case 'doorbell': {
          // Ding - Dong (E5 -> C5)
          const osc1 = ctx.createOscillator();
          const gain1 = ctx.createGain();
          osc1.frequency.setValueAtTime(659.25, t);
          gain1.gain.setValueAtTime(0.8, t);
          gain1.gain.exponentialRampToValueAtTime(0.001, t + 1.2);
          osc1.connect(gain1);
          gain1.connect(master);
          osc1.start(t);
          osc1.stop(t + 1.2);

          const osc2 = ctx.createOscillator();
          const gain2 = ctx.createGain();
          osc2.frequency.setValueAtTime(523.25, t + 0.6);
          gain2.gain.setValueAtTime(0.9, t + 0.6);
          gain2.gain.exponentialRampToValueAtTime(0.001, t + 2.0);
          osc2.connect(gain2);
          gain2.connect(master);
          osc2.start(t + 0.6);
          osc2.stop(t + 2.0);
          break;
        }

        case 'water_pouring': {
          // Ascending bubble clicks
          for (let i = 0; i < 30; i++) {
            const delay = i * 0.06;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const f = 450 + i * 25 + Math.random() * 50;
            osc.frequency.setValueAtTime(f, t + delay);
            gain.gain.setValueAtTime(0.2, t + delay);
            gain.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.04);
            osc.connect(gain);
            gain.connect(master);
            osc.start(t + delay);
            osc.stop(t + delay + 0.05);
          }
          break;
        }

        case 'correct': {
          // Arpeggio C5 - E5 - G5 - C6
          [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
            const delay = idx * 0.1;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.frequency.setValueAtTime(freq, t + delay);
            gain.gain.setValueAtTime(0.6, t + delay);
            gain.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.5);
            osc.connect(gain);
            gain.connect(master);
            osc.start(t + delay);
            osc.stop(t + delay + 0.55);
          });
          break;
        }

        case 'incorrect': {
          // Womp - womp
          [0, 0.35].forEach((delay, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const startF = idx === 0 ? 250 : 200;
            const endF = idx === 0 ? 190 : 140;
            osc.frequency.setValueAtTime(startF, t + delay);
            osc.frequency.exponentialRampToValueAtTime(endF, t + delay + 0.3);
            gain.gain.setValueAtTime(0.6, t + delay);
            gain.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.32);
            osc.connect(gain);
            gain.connect(master);
            osc.start(t + delay);
            osc.stop(t + delay + 0.35);
          });
          break;
        }

        case 'click': {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.frequency.setValueAtTime(1000, t);
          osc.frequency.exponentialRampToValueAtTime(300, t + 0.04);
          gain.gain.setValueAtTime(0.3, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
          osc.connect(gain);
          gain.connect(master);
          osc.start(t);
          osc.stop(t + 0.05);
          break;
        }

        case 'fanfare': {
          [392.00, 523.25, 659.25, 783.99].forEach((freq, idx) => {
            const delay = idx * 0.16;
            const len = idx === 3 ? 0.9 : 0.2;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, t + delay);
            gain.gain.setValueAtTime(0.7, t + delay);
            gain.gain.setValueAtTime(0.7, t + delay + len - 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, t + delay + len);
            osc.connect(gain);
            gain.connect(master);
            osc.start(t + delay);
            osc.stop(t + delay + len + 0.05);
          });
          break;
        }

        case 'golden': {
          [523.25, 659.25, 783.99, 987.77, 1046.50, 1318.51, 1567.98].forEach((freq, idx) => {
            const delay = idx * 0.1;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, t + delay);
            gain.gain.setValueAtTime(0.5, t + delay);
            gain.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.6);
            osc.connect(gain);
            gain.connect(master);
            osc.start(t + delay);
            osc.stop(t + delay + 0.65);
          });
          break;
        }

        case 'shield': {
          [440, 660, 880].forEach(f => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.frequency.setValueAtTime(f, t);
            gain.gain.setValueAtTime(0.4, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 1.2);
            osc.connect(gain);
            gain.connect(master);
            osc.start(t);
            osc.stop(t + 1.25);
          });
          break;
        }

        default: {
          // Generic chime
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.frequency.setValueAtTime(440, t);
          gain.gain.setValueAtTime(0.5, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.8);
          osc.connect(gain);
          gain.connect(master);
          osc.start(t);
          osc.stop(t + 0.8);
        }
      }
    }
  };

  // =========================================================
  // 3. GAME STATE & SETTINGS
  // =========================================================
  const state = {
    currentScreen: 'welcome', // 'welcome' | 'home' | 'game' | 'results'
    selectedLevel: 'easy',  // 'easy' | 'medium' | 'hard' | 'all'
    highestUnlockedLevel: Math.max(0, Math.min(2, parseInt(localStorage.getItem('guess_sound_unlocked_level_v3') || '0', 10))),
    selectedCategory: 'all',// 'all' | 'animals' | 'vehicles' | 'music' | 'nature' | 'everyday'
    score: 0,
    streak: 0,
    bestStreak: 0,
    currentIndex: 0,
    roundSounds: [],
    currentSound: null,
    currentChoices: [],
    hasListened: false,
    hasAnswered: false,
    isRetryingQuestion: false,
    soundHistory: [], // records { sound, playerAnswer, isCorrect }
    startTime: 0,
    isMuted: false,
    volume: 0.8,
    bestScore: parseInt(localStorage.getItem('guess_sound_best_score') || '0', 10),
    isPlayingAudio: false,
    isGameOver: false,
    gameOverTimer: null
  };

  // Level configuration rules
  const LEVEL_CONFIG = {
    easy: {
      name: 'Easy',
      badgeClass: 'badge-easy',
      rounds: 10,
      desc: 'Iconic, distinct sounds with broad distractors.'
    },
    medium: {
      name: 'Hard',
      badgeClass: 'badge-medium',
      rounds: 15,
      desc: 'Varied sounds with closer distractors across categories.'
    },
    hard: {
      name: 'Difficult',
      badgeClass: 'badge-hard',
      rounds: 20,
      desc: 'Challenging sounds with close distractors within the same category.'
    },
    all: {
      name: 'Full Tour',
      badgeClass: 'badge-all',
      rounds: 25,
      desc: 'All 25 sounds in one championship marathon!'
    }
  };
  const PROGRESSION_LEVELS = ['easy', 'medium', 'hard'];

  // =========================================================
  // 4. DOM ELEMENTS
  // =========================================================
  const DOM = {
    // Nav & Global
    headerHomeBtn: document.getElementById('btn-header-home'),
    headerBestScore: document.getElementById('header-best-score'),
    btnMute: document.getElementById('btn-mute'),
    muteIcon: document.getElementById('mute-icon'),
    volumeSlider: document.getElementById('volume-slider'),
    btnOpenInstructions: document.getElementById('btn-open-instructions'),
    instructionsModal: document.getElementById('instructions-modal'),
    btnCloseModal: document.getElementById('btn-close-modal'),
    btnModalGotIt: document.getElementById('btn-modal-got-it'),
    floatingIcons: document.getElementById('floating-icons'),

    // Screens
    welcomeScreen: document.getElementById('welcome-screen'),
    homeScreen: document.getElementById('home-screen'),
    gameScreen: document.getElementById('game-screen'),
    resultsScreen: document.getElementById('results-screen'),

    // Home elements
    btnGetStarted: document.getElementById('btn-get-started'),
    levelCards: document.querySelectorAll('.level-card'),
    btnStartGame: document.getElementById('btn-start-game'),

    // Game HUD
    hudLevelBadge: document.getElementById('hud-level-badge'),
    hudCategory: document.getElementById('hud-category'),
    hudCurrentIndex: document.getElementById('hud-current-index'),
    hudTotalQuestions: document.getElementById('hud-total-questions'),
    hudProgressPercent: document.getElementById('hud-progress-percent'),
    hudProgressFill: document.getElementById('hud-progress-fill'),
    hudScore: document.getElementById('hud-score'),
    hudStreakPill: document.getElementById('hud-streak-pill'),
    hudStreakCount: document.getElementById('hud-streak-count'),

    // Sound stage
    visualizerCanvas: document.getElementById('visualizer-canvas'),
    visualizerOverlay: document.getElementById('visualizer-overlay'),
    btnPlaySound: document.getElementById('btn-play-sound'),
    playButtonIcon: document.getElementById('play-button-icon'),
    playButtonLabel: document.getElementById('play-button-label'),
    btnHint: document.getElementById('btn-hint'),
    hintText: document.getElementById('hint-text'),
    soundStateNotice: document.getElementById('sound-state-notice'),

    // Answers grid & feedback
    answersGrid: document.getElementById('answers-grid'),
    answerBtns: document.querySelectorAll('.answer-btn'),
    feedbackPanel: document.getElementById('feedback-panel'),
    feedbackBanner: document.getElementById('feedback-banner'),
    feedbackIcon: document.getElementById('feedback-icon'),
    feedbackTitle: document.getElementById('feedback-title'),
    feedbackDetail: document.getElementById('feedback-detail'),
    factSoundTitle: document.getElementById('fact-sound-title'),
    factContent: document.getElementById('fact-content'),
    btnNextSound: document.getElementById('btn-next-sound'),

    // Results screen
    confettiCanvas: document.getElementById('confetti-canvas'),
    resultsTrophy: document.getElementById('results-trophy'),
    resultsGrade: document.getElementById('results-grade'),
    resultsTitle: document.getElementById('results-title'),
    resultsMessage: document.getElementById('results-message'),
    resultsScore: document.getElementById('results-score'),
    resultsGoldenCard: document.getElementById('results-golden-card'),
    resultsMaxScore: document.getElementById('results-max-score'),
    resultsAccuracy: document.getElementById('results-accuracy'),
    resultsCorrectCount: document.getElementById('results-correct-count'),
    resultsTotalCount: document.getElementById('results-total-count'),
    resultsBestStreak: document.getElementById('results-best-streak'),
    resultsTime: document.getElementById('results-time'),
    btnToggleReview: document.getElementById('btn-toggle-review'),
    reviewCount: document.getElementById('review-count'),
    reviewChevron: document.getElementById('review-chevron'),
    reviewList: document.getElementById('review-list'),
    btnPlayAgain: document.getElementById('btn-play-again'),
    btnContinueNext: document.getElementById('btn-continue-next'),
    btnReturnHome: document.getElementById('btn-return-home'),

    // Audio Elements
    audioPlayer: document.getElementById('audio-player'),
    sfxPlayer: document.getElementById('sfx-player')
  };

  // =========================================================
  // 5. AUDIO PLAYBACK & VISUALIZER
  // =========================================================
  let mysteryPlaybackId = 0;
  let fallbackPlaybackId = 0;

  function playMysteryFallback(playbackId, sound, error) {
    if (playbackId !== mysteryPlaybackId || fallbackPlaybackId === playbackId) return;
    fallbackPlaybackId = playbackId;
    console.warn(`Falling back to synthesized audio for ${sound.file}.`, error || 'Audio file failed to load.');
    state.hasListened = true;
    setAudioPlayingState(false);
    DOM.soundStateNotice.textContent = 'Playing a synthesized version of this sound.';
    SynthEngine.play(sound.id, state.isMuted ? 0 : state.volume, 'mystery');
  }

  function playSFX(sfxName) {
    if (state.isMuted) return;
    const path = `audio/${sfxName}.wav`;
    const audio = new Audio(path);
    audio.volume = state.volume;
    audio.play().catch(() => {
      // Seamless Synth Fallback
      SynthEngine.play(sfxName, state.volume);
    });
  }

  function playMysterySound() {
    if (!state.currentSound) return;
    SynthEngine.stopMystery();
    const playbackId = ++mysteryPlaybackId;
    state.hasListened = true;
    setAudioPlayingState(true);

    const sound = state.currentSound;
    DOM.audioPlayer.pause();
    try {
      DOM.audioPlayer.currentTime = 0;
    } catch (_) {
      // A source has not loaded yet.
    }
    DOM.audioPlayer.preload = 'auto';
    DOM.audioPlayer.playsInline = true;
    DOM.audioPlayer.dataset.playbackId = String(playbackId);
    DOM.audioPlayer.src = new URL(sound.file, document.baseURI).href;
    DOM.audioPlayer.volume = state.isMuted ? 0 : state.volume;

    const playPromise = DOM.audioPlayer.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          DOM.soundStateNotice.innerHTML = `🎧 <em>Listening to the mystery sound...</em>`;
        })
        .catch(err => {
          if (playbackId !== mysteryPlaybackId) return;
          playMysteryFallback(playbackId, sound, err);
        });
    }
  }

  function setAudioPlayingState(playing) {
    state.isPlayingAudio = playing;
    if (playing) {
      DOM.btnPlaySound.classList.add('is-playing');
      DOM.visualizerOverlay.parentElement.classList.add('sound-playing');
      DOM.playButtonIcon.textContent = '🔊';
      DOM.playButtonLabel.textContent = 'Playing...';
    } else {
      DOM.btnPlaySound.classList.remove('is-playing');
      DOM.visualizerOverlay.parentElement.classList.remove('sound-playing');
      DOM.playButtonIcon.textContent = '🔊';
      DOM.playButtonLabel.textContent = 'Play Sound';
      DOM.soundStateNotice.innerHTML = `✅ Sound finished. Make your guess below!`;
    }
  }

  DOM.audioPlayer.addEventListener('ended', () => {
    setAudioPlayingState(false);
  });

  DOM.audioPlayer.addEventListener('error', () => {
    if (Number(DOM.audioPlayer.dataset.playbackId) !== mysteryPlaybackId) return;
    const failedFile = state.currentSound ? state.currentSound.file : 'unknown sound';
    playMysteryFallback(Number(DOM.audioPlayer.dataset.playbackId), state.currentSound, `Audio file failed to load: ${failedFile}`);
  });

  // Animated Visualizer on Canvas
  let vizAnimationId = null;
  const vizCanvas = DOM.visualizerCanvas;
  const vizCtx = vizCanvas ? vizCanvas.getContext('2d') : null;

  function renderVisualizer() {
    if (!vizCtx) return;
    const width = vizCanvas.width;
    const height = vizCanvas.height;
    vizCtx.clearRect(0, 0, width, height);

    const isPlaying = state.isPlayingAudio;
    const numBars = 36;
    const barWidth = width / numBars - 4;
    const now = Date.now() / 1000;

    for (let i = 0; i < numBars; i++) {
      let barHeight = 6;
      if (isPlaying) {
        // Dynamic pulsating equalizer waves
        const wave1 = Math.sin(now * 8 + i * 0.45);
        const wave2 = Math.cos(now * 12 + i * 0.7);
        const wave3 = Math.sin(now * 5 + i * 0.2);
        const combined = Math.abs(wave1 * 0.4 + wave2 * 0.4 + wave3 * 0.2);
        barHeight = Math.max(8, combined * (height * 0.85));
      } else {
        // Gentle resting idle breathing wave
        const idleWave = Math.sin(now * 2.5 + i * 0.25);
        barHeight = 6 + (idleWave + 1) * 4;
      }

      const x = i * (barWidth + 4) + 2;
      const y = (height - barHeight) / 2;

      // Gradient color for each bar
      const grad = vizCtx.createLinearGradient(0, y, 0, y + barHeight);
      grad.addColorStop(0, '#ec4899');
      grad.addColorStop(0.5, '#a855f7');
      grad.addColorStop(1, '#6366f1');

      vizCtx.fillStyle = grad;
      vizCtx.beginPath();
      vizCtx.roundRect ? vizCtx.roundRect(x, y, barWidth, barHeight, 4) : vizCtx.rect(x, y, barWidth, barHeight);
      vizCtx.fill();
    }

    vizAnimationId = requestAnimationFrame(renderVisualizer);
  }

  // =========================================================
  // 6. QUESTION & DISTRACTOR GENERATOR
  // =========================================================

  function generateQuestionChoices(correctSound, level) {
    const levelSounds = LEVEL_SOUNDS[level] || LEVEL_SOUNDS.easy;
    const choices = [correctSound];
    const categorySounds = levelSounds.filter(s => s.category === correctSound.category && s.id !== correctSound.id);
    const otherSounds = levelSounds.filter(s => s.category !== correctSound.category && s.id !== correctSound.id);

    let candidates = [];

    if (level === 'hard') {
      // Hard: Pick distractors primarily from the SAME category or closely related nature
      candidates = shuffle([...categorySounds]);
      if (candidates.length < 3) {
        candidates = candidates.concat(shuffle(otherSounds));
      }
    } else if (level === 'medium') {
      // Medium: 1 distractor from same category, 2 from different categories
      const same = shuffle([...categorySounds]);
      const diff = shuffle([...otherSounds]);
      if (same.length > 0) candidates.push(same[0]);
      candidates.push(...diff);
    } else {
      // Easy: use familiar, distinct choices while staying inside the Easy pool.
      candidates = shuffle(levelSounds.filter(s => s.id !== correctSound.id));
    }

    // Ensure 3 unique distractors
    const chosenDistractors = [];
    for (const cand of candidates) {
      if (chosenDistractors.length >= 3) break;
      if (cand.id !== correctSound.id && !chosenDistractors.some(d => d.id === cand.id)) {
        chosenDistractors.push(cand);
      }
    }

    choices.push(...chosenDistractors);
    if (choices.length < 4) {
      for (const candidate of shuffle(levelSounds.filter(sound => sound.id !== correctSound.id && !choices.some(choice => choice.id === sound.id)))) {
        choices.push(candidate);
        if (choices.length === 4) break;
      }
    }
    return shuffle(choices);
  }

  function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // =========================================================
  // 7. GAME PLAY ENGINE & FLOW
  // =========================================================

  function startGame() {
    if (state.selectedLevel === 'all' && state.highestUnlockedLevel < PROGRESSION_LEVELS.length - 1) return;
    playSFX('click');
    const levelKey = state.selectedLevel;
    const config = LEVEL_CONFIG[levelKey] || LEVEL_CONFIG.easy;

    // Build this run only from the selected level's sound pool.
    const pool = [...(LEVEL_SOUNDS[levelKey] || LEVEL_SOUNDS.easy)];

    // Prepare randomized question queue
    const shuffledPool = shuffle(pool);
    const count = Math.min(config.rounds, shuffledPool.length);
    state.roundSounds = shuffledPool.slice(0, count);

    // Reset game state
    if (state.gameOverTimer) {
      clearTimeout(state.gameOverTimer);
      state.gameOverTimer = null;
    }
    mysteryPlaybackId += 1;
    SynthEngine.stopMystery();
    DOM.audioPlayer.dataset.playbackId = String(mysteryPlaybackId);
    state.isGameOver = false;
    state.currentIndex = 0;
    state.score = 0;
    state.streak = 0;
    state.bestStreak = 0;
    state.soundHistory = [];
    state.startTime = Date.now();

    // Update HUD display
    DOM.hudTotalQuestions.textContent = state.roundSounds.length;
    DOM.hudLevelBadge.textContent = config.name;
    DOM.hudLevelBadge.className = `badge ${config.badgeClass}`;
    updateScoreUI();

    // Transition view
    switchScreen('game');
    loadQuestion(0);
  }

  function loadQuestion(index) {
    if (index >= state.roundSounds.length) {
      finishGame(false);
      return;
    }

    if (state.gameOverTimer) {
      clearTimeout(state.gameOverTimer);
      state.gameOverTimer = null;
    }
    mysteryPlaybackId += 1;
    SynthEngine.stopMystery();
    DOM.audioPlayer.dataset.playbackId = String(mysteryPlaybackId);
    state.isGameOver = false;

    // Reset Next button state
    DOM.btnNextSound.className = 'cta-btn primary-btn pulse-next';
    DOM.btnNextSound.innerHTML = `<span>Next Sound</span> <span class="btn-arrow">➡️</span>`;

    state.currentIndex = index;
    state.isRetryingQuestion = false;
    state.currentSound = state.roundSounds[index];
    state.hasAnswered = false;
    state.hasListened = false;
    setAudioPlayingState(false);

    // Stop previous audio if playing
    DOM.audioPlayer.pause();
    DOM.audioPlayer.currentTime = 0;

    // Update HUD
    DOM.hudCurrentIndex.textContent = index + 1;
    const percent = Math.round(((index) / state.roundSounds.length) * 100);
    DOM.hudProgressPercent.textContent = `${percent}%`;
    DOM.hudProgressFill.style.width = `${percent}%`;
    DOM.hudCategory.textContent = `${getCategoryIcon(state.currentSound.category)} ${state.currentSound.category}`;

    // Clue text
    DOM.hintText.textContent = state.currentSound.clue;
    DOM.soundStateNotice.innerHTML = `👉 Click <strong>🔊 Play Sound</strong> or press <kbd>Space</kbd> to listen!`;

    // Reset Buttons & Feedback
    DOM.feedbackPanel.classList.add('hidden');
    DOM.feedbackBanner.className = 'feedback-banner';

    // Generate 4 multiple choices
    state.currentChoices = generateQuestionChoices(state.currentSound, state.selectedLevel);

    DOM.answerBtns.forEach((btn, idx) => {
      const choice = state.currentChoices[idx];
      btn.className = 'answer-btn';
      btn.disabled = false;
      btn.dataset.soundId = choice.id;

      const iconEl = btn.querySelector('.choice-icon');
      const textEl = btn.querySelector('.choice-text');
      if (iconEl) iconEl.textContent = choice.icon;
      if (textEl) textEl.textContent = choice.name;
    });

    // Auto prompt play
    DOM.playButtonLabel.textContent = 'Play Sound';
    DOM.playButtonIcon.textContent = '🔊';
  }

  function handleAnswerChoice(chosenIndex) {
    if (state.hasAnswered || !state.currentSound) return;
    state.hasAnswered = true;

    const chosenSound = state.currentChoices[chosenIndex];
    const isCorrect = chosenSound.id === state.currentSound.id;
    const chosenBtn = DOM.answerBtns[chosenIndex];

    // Update all buttons
    DOM.answerBtns.forEach((btn, idx) => {
      btn.disabled = true;
      const soundId = btn.dataset.soundId;
      if (soundId === state.currentSound.id) {
        btn.classList.add('correct');
      }
    });

    if (isCorrect) {
      state.soundHistory.push({ sound: state.currentSound, playerAnswer: chosenSound, isCorrect: true });
      chosenBtn.classList.add('correct');
      state.score += 10;
      state.streak += 1;
      if (state.streak > state.bestStreak) {
        state.bestStreak = state.streak;
      }
      playSFX('correct');

      DOM.feedbackBanner.className = 'feedback-banner success';
      DOM.feedbackIcon.textContent = '🎉';
      DOM.feedbackTitle.textContent = 'Correct Answer!';
      DOM.feedbackDetail.textContent = `+10 Points! You accurately recognized the sound of ${state.currentSound.name}.`;

      // Next button for correct answer
      DOM.btnNextSound.className = 'cta-btn primary-btn pulse-next';
      DOM.btnNextSound.innerHTML = `<span>Next Sound</span> <span class="btn-arrow">➡️</span>`;
    } else {
      chosenBtn.classList.add('incorrect');
      state.streak = 0;
      state.isGameOver = true;
      state.isRetryingQuestion = false;
      state.soundHistory.push({ sound: state.currentSound, playerAnswer: chosenSound, isCorrect: false });
      playSFX('incorrect');

      DOM.feedbackBanner.className = 'feedback-banner wrong game-over';
      DOM.feedbackIcon.textContent = '💀';
      DOM.feedbackTitle.textContent = 'Not Quite — Try Again';
      DOM.feedbackDetail.textContent = `That was ${state.currentSound.icon} ${state.currentSound.name}. Listen again and retry this question.`;

      // Next button transforms into Game Over button
      DOM.btnNextSound.className = 'cta-btn primary-btn pulse-next game-over-btn';
      DOM.btnNextSound.innerHTML = `<span>💀 Game Over (View Results)</span> <span class="btn-arrow">📊</span>`;

      // Results are shown after the feedback panel is revealed below.
      // Keep the game-over state and results action set above.
    }

    // Display Educational Fun Fact
    DOM.factSoundTitle.textContent = `${state.currentSound.icon} ${state.currentSound.name}`;
    DOM.factContent.textContent = state.currentSound.fact;

    // Update Score & HUD
    updateScoreUI();
    const completedCount = state.currentIndex + (isCorrect ? 1 : 0);
    const percent = Math.round((completedCount / state.roundSounds.length) * 100);
    DOM.hudProgressPercent.textContent = `${percent}%`;
    DOM.hudProgressFill.style.width = `${percent}%`;

    // Reveal Feedback Banner
    DOM.feedbackPanel.classList.remove('hidden');
    if (!isCorrect) {
      // Briefly show the missed answer before opening the Game Over results screen.
      state.gameOverTimer = setTimeout(() => finishGame(true), 900);
    }
    DOM.btnNextSound.focus();
  }

  function nextQuestion() {
    if (state.gameOverTimer) {
      clearTimeout(state.gameOverTimer);
      state.gameOverTimer = null;
    }

    if (state.isRetryingQuestion) {
      playSFX('click');
      loadQuestion(state.currentIndex);
      return;
    }

    if (state.isGameOver) {
      playSFX('click');
      finishGame(true);
      return;
    }

    playSFX('click');
    loadQuestion(state.currentIndex + 1);
  }

  function updateScoreUI() {
    DOM.hudScore.textContent = state.score;
    DOM.hudStreakCount.textContent = state.streak;

    if (state.score > state.bestScore) {
      state.bestScore = state.score;
      localStorage.setItem('guess_sound_best_score', state.bestScore.toString());
      DOM.headerBestScore.textContent = state.bestScore;
    }
  }

  // =========================================================
  // 8. RESULTS SCREEN & CONFETTI
  // =========================================================

  function finishGame(isGameOver = false) {
    if (state.gameOverTimer) {
      clearTimeout(state.gameOverTimer);
      state.gameOverTimer = null;
    }
    DOM.btnContinueNext.classList.add('hidden');
    DOM.resultsGoldenCard.classList.toggle('hidden', isGameOver);

    const totalQuestions = state.roundSounds.length;
    const maxScore = totalQuestions * 10;
    const correctCount = state.soundHistory.filter(h => h.isCorrect).length;
    const totalAnswered = state.soundHistory.length;
    const accuracy = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;
    const durationSeconds = Math.round((Date.now() - state.startTime) / 1000);
    const minutes = Math.floor(durationSeconds / 60);
    const seconds = durationSeconds % 60;
    const timeFormatted = `${minutes > 0 ? minutes + 'm ' : ''}${seconds}s`;

    // Populate Results Screen
    DOM.resultsScore.textContent = state.score;
    DOM.resultsMaxScore.textContent = `/ ${maxScore}`;
    DOM.resultsAccuracy.textContent = `${accuracy}%`;
    DOM.resultsCorrectCount.textContent = correctCount;
    DOM.resultsTotalCount.textContent = totalQuestions;
    DOM.resultsBestStreak.textContent = state.bestStreak;
    DOM.resultsTime.textContent = timeFormatted;

    // Performance Rank & Trophy
    let trophy = '🎧';
    let grade = 'Explorer';
    let title = 'Great Effort!';
    let message = 'Keep training your ears to detect the subtleties of sound!';

    const progressionIndex = PROGRESSION_LEVELS.indexOf(state.selectedLevel);
    const passedLevel = !isGameOver && progressionIndex >= 0;
    const isFinalLevel = progressionIndex === PROGRESSION_LEVELS.length - 1;

    if (isGameOver) {
      trophy = '💀';
      grade = 'GAME OVER';
      title = 'Game Over!';
      message = `You chose the wrong sound! You correctly identified ${correctCount} sound(s) and scored ${state.score} points before missing. Try again to beat your record!`;
      DOM.resultsGrade.className = 'results-badge game-over-badge';
      DOM.btnPlayAgain.innerHTML = '<span>🔄 Try Again</span>';
    } else {
      DOM.resultsGrade.className = 'results-badge';
      DOM.btnPlayAgain.innerHTML = '<span>🔄 Play Again</span>';

      if (accuracy === 100) {
        trophy = '🏆';
        grade = 'Golden Ear Master';
        title = 'Flawless Victory!';
        message = 'Astonishing! You identified every single sound with 100% precision!';
        launchConfetti();
        playSFX('fanfare');
      } else if (accuracy >= 80) {
        trophy = '🥇';
        grade = 'Acoustic Maestro';
        title = 'Outstanding Listening!';
        message = 'Your ears are razor sharp! You caught almost every mystery sound!';
        launchConfetti();
        playSFX('fanfare');
      } else if (accuracy >= 60) {
        trophy = '🥈';
        grade = 'Sound Detective';
        title = 'Good Detective Work!';
        message = 'You have a solid ear! A little more practice and you will be unstoppable.';
        playSFX('correct');
      } else {
        trophy = '🥉';
        grade = 'Sound Apprentice';
        title = 'Practice Makes Perfect!';
        message = 'Every sound has unique harmonics. Give it another spin to beat your score!';
        playSFX('correct');
      }

      if (passedLevel) {
        if (progressionIndex < PROGRESSION_LEVELS.length - 1) {
          state.highestUnlockedLevel = Math.max(state.highestUnlockedLevel, progressionIndex + 1);
          localStorage.setItem('guess_sound_unlocked_level_v3', String(state.highestUnlockedLevel));
          updateLevelCards();
          const nextLevel = PROGRESSION_LEVELS[progressionIndex + 1];
          title = `${LEVEL_CONFIG[state.selectedLevel].name} Level Passed!`;
          message = `Level complete! ${LEVEL_CONFIG[nextLevel].name} Level is unlocked. Replay this level or continue when you are ready.`;
          DOM.btnPlayAgain.innerHTML = `<span>Replay ${LEVEL_CONFIG[state.selectedLevel].name}</span>`;
          DOM.btnContinueNext.innerHTML = `<span>Continue to ${LEVEL_CONFIG[nextLevel].name}</span>`;
          DOM.btnContinueNext.classList.remove('hidden');
        } else if (isFinalLevel) {
          title = 'Congratulations! You Completed All Levels!';
          message = 'You passed Easy, Hard, and Difficult. Incredible listening!';
          DOM.btnPlayAgain.innerHTML = '<span>Replay Difficult</span>';
          DOM.btnContinueNext.innerHTML = '<span>Restart from Easy</span>';
          DOM.btnContinueNext.classList.remove('hidden');
          DOM.btnPlayAgain.innerHTML = '<span>🔄 Restart from Easy</span>';
        }
      }
    }

    if (!isGameOver && isFinalLevel) {
      DOM.btnPlayAgain.innerHTML = '<span>Replay Difficult</span>';
      DOM.btnContinueNext.innerHTML = '<span>Restart from Easy</span>';
      DOM.btnContinueNext.classList.remove('hidden');
    }

    DOM.resultsTrophy.textContent = trophy;
    DOM.resultsGrade.textContent = grade;
    DOM.resultsTitle.textContent = title;
    DOM.resultsMessage.textContent = message;

    // Populate Sound Review Accordion List
    populateReviewList();

    switchScreen('results');
  }

  function populateReviewList() {
    DOM.reviewList.innerHTML = '';
    DOM.reviewCount.textContent = state.soundHistory.length;

    state.soundHistory.forEach((item, idx) => {
      const el = document.createElement('div');
      el.className = 'review-item';

      const statusHtml = item.isCorrect
        ? `<span class="review-status correct">✅ Correct (+10)</span>`
        : `<span class="review-status wrong">❌ Guessed ${item.playerAnswer.name}</span>`;

      el.innerHTML = `
        <div class="review-item-info">
          <span class="review-icon">${item.sound.icon}</span>
          <div>
            <div class="review-name">${item.sound.name}</div>
            ${statusHtml}
          </div>
        </div>
        <button class="review-play-btn" data-sound-id="${item.sound.id}" title="Listen again">
          <span>🔊 Play</span>
        </button>
      `;

      // Listen again button handler
      const playBtn = el.querySelector('.review-play-btn');
      playBtn.addEventListener('click', () => {
        playReviewSound(item.sound);
      });

      DOM.reviewList.appendChild(el);
    });
  }

  function playReviewSound(sound) {
    if (state.isMuted) return;
    const audio = new Audio(sound.file);
    audio.volume = state.volume;
    audio.play().catch(() => {
      SynthEngine.play(sound.id, state.volume);
    });
  }

  // =========================================================
  // 9. CONFETTI CELEBRATION ENGINE
  // =========================================================
  let confettiAnimationId = null;

  function launchConfetti() {
    const canvas = DOM.confettiCanvas;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#6366f1', '#a855f7', '#ec4899', '#3b82f6', '#10b981', '#f59e0b'];
    const particles = [];
    const particleCount = 120;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * -canvas.height * 0.5,
        size: Math.random() * 8 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 4 + 3,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 8
      });
    }

    let frames = 0;
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      });

      frames++;
      if (frames < 240) {
        confettiAnimationId = requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    if (confettiAnimationId) cancelAnimationFrame(confettiAnimationId);
    animate();
  }

  // =========================================================
  // 10. SCREEN SWITCHING & AMBIENT VISUALS
  // =========================================================

  function switchScreen(screenName) {
    state.currentScreen = screenName;
    DOM.welcomeScreen.classList.remove('active');
    DOM.homeScreen.classList.remove('active');
    DOM.gameScreen.classList.remove('active');
    DOM.resultsScreen.classList.remove('active');

    if (screenName === 'welcome') {
      DOM.welcomeScreen.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (screenName === 'home') {
      DOM.homeScreen.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (screenName === 'game') {
      DOM.gameScreen.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (screenName === 'results') {
      DOM.resultsScreen.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function spawnFloatingParticles() {
    if (!DOM.floatingIcons) return;
    const icons = ['🎵', '🎶', '🔊', '🎧', '⚡', '✨', '🐶', '🚗', '🎹', '🌧️', '🔔'];
    DOM.floatingIcons.innerHTML = '';

    for (let i = 0; i < 14; i++) {
      const el = document.createElement('div');
      el.className = 'floating-icon';
      el.textContent = icons[Math.floor(Math.random() * icons.length)];
      el.style.left = `${Math.random() * 95}%`;
      el.style.animationDelay = `${Math.random() * 16}s`;
      el.style.animationDuration = `${14 + Math.random() * 10}s`;
      DOM.floatingIcons.appendChild(el);
    }
  }

  // Helpers
  function getCategoryDisplayName(cat) {
    const map = {
      animals: 'Animals',
      vehicles: 'Vehicles',
      music: 'Musical Instruments',
      nature: 'Nature',
      everyday: 'Everyday Sounds'
    };
    return map[cat] || 'All';
  }

  function getCategoryIcon(catName) {
    if (catName.includes('Animal')) return '🐶';
    if (catName.includes('Vehicle')) return '🚗';
    if (catName.includes('Musical') || catName.includes('Instrument')) return '🎵';
    if (catName.includes('Nature')) return '🌧️';
    if (catName.includes('Everyday')) return '🏠';
    return '🔊';
  }

  // =========================================================
  // 11. EVENT LISTENERS
  // =========================================================

  // Start Game Button
  DOM.btnGetStarted.addEventListener('click', () => {
    playSFX('click');
    switchScreen('home');
  });

  DOM.btnStartGame.addEventListener('click', startGame);

  // Return to Home / Logo Click
  DOM.headerHomeBtn.addEventListener('click', () => {
    playSFX('click');
    DOM.audioPlayer.pause();
    setAudioPlayingState(false);
    switchScreen('home');
  });

  DOM.btnReturnHome.addEventListener('click', () => {
    playSFX('click');
    switchScreen('home');
  });

  DOM.btnContinueNext.addEventListener('click', () => {
    const currentIndex = PROGRESSION_LEVELS.indexOf(state.selectedLevel);
    if (currentIndex === PROGRESSION_LEVELS.length - 1) {
      state.selectedLevel = 'easy';
      state.highestUnlockedLevel = 0;
      localStorage.setItem('guess_sound_unlocked_level_v3', '0');
      updateLevelCards();
      DOM.levelCards.forEach(card => card.classList.toggle('active', card.dataset.level === 'easy'));
      startGame();
      return;
    }
    if (currentIndex < 0 || currentIndex >= PROGRESSION_LEVELS.length - 1) return;
    state.selectedLevel = PROGRESSION_LEVELS[currentIndex + 1];
    DOM.levelCards.forEach(card => card.classList.toggle('active', card.dataset.level === state.selectedLevel));
    startGame();
  });

  // Play Again Button
  DOM.btnPlayAgain.addEventListener('click', () => {
    if (PROGRESSION_LEVELS.indexOf(state.selectedLevel) === PROGRESSION_LEVELS.length - 1 && !state.isGameOver) {
      startGame();
      return;
    }
    startGame();
  });

  // Level Selection Cards
  DOM.levelCards.forEach(card => {
    card.addEventListener('click', () => {
      const levelIndex = PROGRESSION_LEVELS.indexOf(card.dataset.level);
      const isFullTour = card.dataset.level === 'all';
      const fullTourUnlocked = state.highestUnlockedLevel >= PROGRESSION_LEVELS.length - 1;
      if (isFullTour ? !fullTourUnlocked : (levelIndex < 0 || levelIndex > state.highestUnlockedLevel)) return;
      playSFX('click');
      DOM.levelCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      state.selectedLevel = card.dataset.level;
    });
  });

  function updateLevelCards() {
    DOM.levelCards.forEach(card => {
      const levelIndex = PROGRESSION_LEVELS.indexOf(card.dataset.level);
      const isFullTour = card.dataset.level === 'all';
      const fullTourUnlocked = state.highestUnlockedLevel >= PROGRESSION_LEVELS.length - 1;
      const locked = isFullTour ? !fullTourUnlocked : (levelIndex < 0 || levelIndex > state.highestUnlockedLevel);
      card.disabled = locked;
      card.classList.toggle('locked', locked);
      card.setAttribute('aria-disabled', String(locked));
      const rounds = card.querySelector('.level-rounds');
      if (rounds && !rounds.dataset.unlockedLabel) rounds.dataset.unlockedLabel = rounds.textContent.trim();
      if (rounds && locked) rounds.textContent = '🔒 Locked';
    });
  }
  updateLevelCards();

  // Sound Controls
  DOM.btnPlaySound.addEventListener('click', () => {
    playMysterySound();
  });

  // Clue button
  DOM.btnHint.addEventListener('click', () => {
    playSFX('click');
    if (!state.currentSound) return;
    alert(`💡 Sound Clue:\n"${state.currentSound.clue}"`);
  });

  // 4 Option Buttons Click Handlers
  DOM.answerBtns.forEach(btn => {
    btn.addEventListener('click', e => {
      const index = parseInt(btn.dataset.index, 10);
      handleAnswerChoice(index);
    });
  });

  // Next Sound Button
  DOM.btnNextSound.addEventListener('click', nextQuestion);

  // Mute Toggle
  DOM.btnMute.addEventListener('click', () => {
    state.isMuted = !state.isMuted;
    DOM.muteIcon.textContent = state.isMuted ? '🔇' : '🔊';
    DOM.audioPlayer.volume = state.isMuted ? 0 : state.volume;
    DOM.btnMute.title = state.isMuted ? 'Unmute Audio' : 'Mute Audio';
    playSFX('click');
  });

  // Volume Slider
  DOM.volumeSlider.addEventListener('input', e => {
    state.volume = parseFloat(e.target.value);
    if (state.volume === 0) {
      state.isMuted = true;
      DOM.muteIcon.textContent = '🔇';
    } else {
      state.isMuted = false;
      DOM.muteIcon.textContent = '🔊';
    }
    DOM.audioPlayer.volume = state.isMuted ? 0 : state.volume;
  });

  // Instructions Modal
  DOM.btnOpenInstructions.addEventListener('click', () => {
    playSFX('click');
    DOM.instructionsModal.classList.remove('hidden');
  });

  DOM.btnCloseModal.addEventListener('click', () => {
    playSFX('click');
    DOM.instructionsModal.classList.add('hidden');
  });

  DOM.btnModalGotIt.addEventListener('click', () => {
    playSFX('click');
    DOM.instructionsModal.classList.add('hidden');
  });

  DOM.instructionsModal.addEventListener('click', e => {
    if (e.target === DOM.instructionsModal) {
      DOM.instructionsModal.classList.add('hidden');
    }
  });

  // Toggle Sound History Review on Results Screen
  DOM.btnToggleReview.addEventListener('click', () => {
    playSFX('click');
    DOM.reviewList.classList.toggle('hidden');
    const isHidden = DOM.reviewList.classList.contains('hidden');
    DOM.reviewChevron.textContent = isHidden ? '▼' : '▲';
  });

  // Keyboard Shortcuts Support
  window.addEventListener('keydown', e => {
    // Escape closes modal
    if (e.key === 'Escape') {
      DOM.instructionsModal.classList.add('hidden');
      return;
    }

    // Modal is open, don't trigger game shortcuts
    if (!DOM.instructionsModal.classList.contains('hidden')) return;

    // M key: Toggle Mute
    if (e.key === 'm' || e.key === 'M') {
      DOM.btnMute.click();
      return;
    }

    if (state.currentScreen === 'game') {
      // Space or P key: Play sound
      if (e.code === 'Space' || e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        playMysterySound();
        return;
      }

      // Number keys 1 - 4: Choose Answer
      if (['1', '2', '3', '4'].includes(e.key)) {
        const choiceIdx = parseInt(e.key, 10) - 1;
        if (!state.hasAnswered && DOM.answerBtns[choiceIdx]) {
          handleAnswerChoice(choiceIdx);
        }
        return;
      }

      // Enter or N key: Proceed to Next Sound
      if (state.hasAnswered && (e.key === 'Enter' || e.key === 'n' || e.key === 'N')) {
        e.preventDefault();
        nextQuestion();
        return;
      }
    }
  });

  // Handle window resize for canvas
  window.addEventListener('resize', () => {
    if (DOM.confettiCanvas && state.currentScreen === 'results') {
      DOM.confettiCanvas.width = window.innerWidth;
      DOM.confettiCanvas.height = window.innerHeight;
    }
  });

  // =========================================================
  // 12. INITIALIZATION
  // =========================================================
  function init() {
    DOM.headerBestScore.textContent = state.bestScore;
    spawnFloatingParticles();
    renderVisualizer();
    console.log('Guess the Sound Challenge initialized successfully!');
  }

  // Boot up
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

