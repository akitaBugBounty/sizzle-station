/* WebAudio sounds for Sizzle Station: short synthesized bleeps only. */
/* No audio files are loaded; every sound is built with oscillators. */

export function createSounds(state) {
  let ctx = null;
  const sounds = {
    ensure: function () {
      if (ctx) {
        if (ctx.state === 'suspended') {
          ctx.resume();
        }
        return ctx;
      }
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) {
        return null;
      }
      ctx = new AudioCtx();
      return ctx;
    },
    beep: function (freq, duration, type, volume, slideTo) {
      if (state.muted) {
        return;
      }
      const audio = sounds.ensure();
      if (!audio) {
        return;
      }
      const now = audio.currentTime;
      const osc = audio.createOscillator();
      const gain = audio.createGain();
      osc.type = type || 'sine';
      osc.frequency.setValueAtTime(freq, now);
      if (slideTo) {
        osc.frequency.exponentialRampToValueAtTime(slideTo, now + duration);
      }
      gain.gain.setValueAtTime(volume || 0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      osc.connect(gain);
      gain.connect(audio.destination);
      osc.start(now);
      osc.stop(now + duration + 0.02);
    },
    click: function () {
      sounds.beep(660, 0.07, 'triangle', 0.1);
    },
    chop: function () {
      sounds.beep(190, 0.09, 'square', 0.14, 90);
      sounds.beep(1200, 0.04, 'triangle', 0.06);
    },
    sizzle: function () {
      sounds.beep(3200, 0.18, 'sawtooth', 0.03, 2400);
      sounds.beep(180, 0.22, 'sine', 0.08, 120);
    },
    ready: function () {
      sounds.beep(740, 0.1, 'triangle', 0.12);
      setTimeout(function () {
        sounds.beep(988, 0.14, 'triangle', 0.12);
      }, 80);
    },
    ding: function () {
      sounds.beep(880, 0.16, 'sine', 0.14);
      setTimeout(function () {
        sounds.beep(1320, 0.22, 'sine', 0.12);
      }, 90);
    },
    buzzer: function () {
      sounds.beep(160, 0.28, 'sawtooth', 0.12, 110);
    },
    trash: function () {
      sounds.beep(420, 0.12, 'triangle', 0.1, 160);
    },
    toggleMute: function () {
      state.muted = !state.muted;
      return state.muted;
    }
  };
  return sounds;
}
