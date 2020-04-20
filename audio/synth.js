/* Copyright 2013 Chris Wilson
   Copyright 2020 Tiago Matos

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

var context=null;		// the Web Audio "context" object
var oscillator=null;	// the single oscillator
var envelope=null;		// the envelope for the single oscillator
var attack=0.05;		// attack speed
var release=0.05;		// release speed
var portamento=0.01;	// portamento/glide speed
var activeNotes = [];	// the stack of actively-pressed keys

var volume=0.7;

var lpf = null;             // filtro passa baixa (LPF)
var lpf_min_cutoff = 60;    // freq. de corte minima do LPF em Hertz

window.addEventListener('load', function() {
    // patch up prefixes
    window.AudioContext=window.AudioContext||window.webkitAudioContext;

    context = new AudioContext();

    // set up the basic oscillator chain, muted to begin with.
    oscillator = context.createOscillator();
    oscillator.frequency.setValueAtTime(110, 0);
    lpf = context.createBiquadFilter();
    lpf.type = 'lowpass';
    lpf.frequency.value = Math.pow(2, Math.log2(lpf_min_cutoff) + 0.7*( Math.log2(lpf.frequency.maxValue) - Math.log2(lpf_min_cutoff) ) );
    envelope = context.createGain();
    oscillator.connect(lpf);
    lpf.connect(envelope)
    envelope.connect(context.destination);
    envelope.gain.value = 0.0;  // Mute the sound

    oscillator.start(0);  // Go ahead and start up the oscillator
} );

function frequencyFromNoteNumber( note ) {
    return 440 * Math.pow(2,(note-69)/12);
}

function noteOn(noteNumber) {
    activeNotes.push( noteNumber );
    oscillator.frequency.cancelScheduledValues(0);
    oscillator.frequency.setTargetAtTime( frequencyFromNoteNumber(noteNumber), 0, portamento );
    envelope.gain.cancelScheduledValues(0);
    envelope.gain.setTargetAtTime(volume, 0, attack);
}

function noteOff(noteNumber) {
    var position = activeNotes.indexOf(noteNumber);
    if (position!=-1) {
        activeNotes.splice(position,1);
    }
    if (activeNotes.length==0) {	// shut off the envelope
        envelope.gain.cancelScheduledValues(0);
        envelope.gain.setTargetAtTime(0.0, 0, release );
    } else {
        oscillator.frequency.cancelScheduledValues(0);
        oscillator.frequency.setTargetAtTime( frequencyFromNoteNumber(activeNotes[activeNotes.length-1]), 0, portamento );
    }
}
