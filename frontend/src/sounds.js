// ── Sound Effects (Web Audio API) ─────────────────────────────────────────────
// All sounds are synthesised on-the-fly — no audio files required.

function ctx() {
  if (!window.AudioContext && !window.webkitAudioContext) return null
  if (!ctx._instance) ctx._instance = new (window.AudioContext || window.webkitAudioContext)()
  return ctx._instance
}

function beep({ frequency = 440, type = 'sine', duration = 0.15, gain = 0.3, delay = 0 } = {}) {
  const ac = ctx()
  if (!ac) return
  const osc = ac.createOscillator()
  const vol = ac.createGain()
  osc.connect(vol)
  vol.connect(ac.destination)
  osc.type = type
  osc.frequency.setValueAtTime(frequency, ac.currentTime + delay)
  vol.gain.setValueAtTime(gain, ac.currentTime + delay)
  vol.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + delay + duration)
  osc.start(ac.currentTime + delay)
  osc.stop(ac.currentTime + delay + duration + 0.01)
}

/** Ascending double-ding when stock goes up */
export function playQtyIncrease() {
  beep({ frequency: 660, type: 'sine', duration: 0.12, gain: 0.25 })
  beep({ frequency: 880, type: 'sine', duration: 0.12, gain: 0.2, delay: 0.1 })
}

/** Lower single tone when stock goes down */
export function playQtyDecrease() {
  beep({ frequency: 330, type: 'sine', duration: 0.15, gain: 0.25 })
}

/** Cheerful three-note fanfare when a new product is added */
export function playProductAdded() {
  beep({ frequency: 523, type: 'triangle', duration: 0.12, gain: 0.3 })
  beep({ frequency: 659, type: 'triangle', duration: 0.12, gain: 0.3, delay: 0.12 })
  beep({ frequency: 784, type: 'triangle', duration: 0.2, gain: 0.3, delay: 0.24 })
}

/** Soft two-note chime when a product is updated */
export function playProductUpdated() {
  beep({ frequency: 600, type: 'sine', duration: 0.12, gain: 0.22 })
  beep({ frequency: 750, type: 'sine', duration: 0.14, gain: 0.2, delay: 0.1 })
}

/** Descending sweep when a product is deleted */
export function playProductDeleted() {
  const ac = ctx()
  if (!ac) return
  const osc = ac.createOscillator()
  const vol = ac.createGain()
  osc.connect(vol)
  vol.connect(ac.destination)
  osc.type = 'sawtooth'
  osc.frequency.setValueAtTime(440, ac.currentTime)
  osc.frequency.exponentialRampToValueAtTime(110, ac.currentTime + 0.35)
  vol.gain.setValueAtTime(0.25, ac.currentTime)
  vol.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.35)
  osc.start(ac.currentTime)
  osc.stop(ac.currentTime + 0.36)
}

/** Short warning buzz for errors */
export function playError() {
  beep({ frequency: 220, type: 'square', duration: 0.08, gain: 0.2 })
  beep({ frequency: 180, type: 'square', duration: 0.1, gain: 0.2, delay: 0.1 })
}
