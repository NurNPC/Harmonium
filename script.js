const audioContext = new (window.AudioContext || window.webkitAudioContext)();

const noteFrequencies = {
    'C4': 261.63,
    'C#4': 277.18,
    'D4': 293.66,
    'D#4': 311.13,
    'E4': 329.63,
    'F4': 349.23,
    'F#4': 369.99,
    'G4': 392.00,
    'G#4': 415.30,
    'A4': 440.00,
    'A#4': 466.16,
    'B4': 493.88,
    'C5': 523.25,
    'C#5': 554.37,
    'D5': 587.33,
    'D#5': 622.25,
    'E5': 659.25,
    'F5': 698.46,
    'F#5': 739.99,
    'G5': 783.99,
    'G#5': 830.61,
    'A5': 880.00,
    'A#5': 932.33,
    'B5': 987.77,
    'C6': 1046.50,
    'C#6': 1108.73,
    'D6': 1174.66,
    'D#6': 1244.51,
    'E6': 1318.51,
    'F6': 1396.91,
    'F#6': 1479.98,
    'G6': 1567.98,
    'G#6': 1661.22,
    'A6': 1760.00,
    'A#6': 1864.66,
    'B6': 1975.53
};

let oscillators = {};

function playNote(note) {
    if (!oscillators[note]) {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(noteFrequencies[note], audioContext.currentTime);
        oscillator.start();
        oscillators[note] = { oscillator, gainNode };
    }
}

function stopNote(note) {
    if (oscillators[note]) {
        const { oscillator, gainNode } = oscillators[note];
        gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.5);
        oscillator.stop(audioContext.currentTime + 0.5);
        delete oscillators[note];
    }
}

document.querySelectorAll('.white-key, .black-key').forEach(key => {
    key.addEventListener('mousedown', () => {
        const note = key.getAttribute('data-note');
        if (note && noteFrequencies[note]) {
            playNote(note);
        }
    });

    key.addEventListener('mouseup', () => {
        const note = key.getAttribute('data-note');
        if (note && noteFrequencies[note]) {
            stopNote(note);
        }
    });

    key.addEventListener('mouseleave', () => {
        const note = key.getAttribute('data-note');
        if (note && noteFrequencies[note]) {
            stopNote(note);
        }
    });
});

document.addEventListener('mouseup', () => {
    for (let note in oscillators) {
        stopNote(note);
    }
});

const harmoniumKeys = {
    'A': 'C4', 'W': 'C#4', 'S': 'D4', 'E': 'D#4', 'D': 'E4',
    'F': 'F4', 'T': 'F#4', 'G': 'G4', 'Y': 'G#4', 'H': 'A4',
    'U': 'A#4', 'J': 'B4', 'K': 'C5', 'O': 'C#5', 'L': 'D5',
    'P': 'D#5'
};

document.addEventListener('keydown', function(event) {
    const key = event.key.toUpperCase();
    if (harmoniumKeys[key]) {
        const note = harmoniumKeys[key];
        const button = document.querySelector(`[data-note="${note}"]`);
        if (button) {
            simulateButtonClick(button);
        }
    }
});

function simulateButtonClick(button) {
    button.classList.add('pressed');
    // Optionally trigger sound or any other action
    setTimeout(() => {
        button.classList.remove('pressed');
    }, 100); // Adjust delay as needed
}