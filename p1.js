/* p1.js Piano music player.
There is only 1 function: p1
You call it without parenthesis.

EXAMPLE, PLAY JINGLE BELLS:
p1`c-c-c---|c-c-c---|c-f-Y--a|c-------|d-d-d--d|d-c-c-cc|f-f-d-a-|Y---f---`

TO STOP:
p1``

WITH BASS TRACK:
p1`
|V-Y-c-V-|d---c-a-|
|M-------|R-------|
`

Bass track can be shorter and will repeat.

WITH CUSTOM TEMPO (in milliseconds per note):
p1`70
V-Y-c-V-d---c-a-
M-------R-------`

Vertical bars are ingored and don't do anything.
Dashes make the note held longer.
Spaces are silent space.

Supports 52 notes (4 octaves)
How to convert from piano notes to p1 letters:
|Low C      |Tenor C    |Middle C   |Treble C   |High C
C#D#EF#G#A#BC#D#EF#G#A#BC#D#EF#G#A#BC#D#EF#G#A#BC#D#
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz
*/
!function() {
	var buffers = {},
		contexts = [...Array(24).keys()].map(_=>new AudioContext),
		tracks,
		trackLen,
		interval,
		// Modulation. Generates a sample of a sinusoidal signal with a specific frequency and amplitude.
		b = (note, add) => Math.sin(note*6.28 + add),
		// Instrument synthesis.
		pianoify = (note) => b(note, b(note,0)**2 + b(note,.25)*.75 + b(note,.5)*.1)
	
	var makeNote = (note, seconds, sampleRate) => {
		var key = note+''+seconds
		var buffer = buffers[key]
		//console.log("makeNote", note, seconds, buffer)
		if(note>=0 && !buffer) {
			
			// Calculate frequency/pitch. "Low C" is 65.406
			note = 65.406 * 1.06 ** note / sampleRate
			
			var i = sampleRate * seconds | 0,
				sampleRest = sampleRate * (seconds - .002),
				bufferArray
			buffer = buffers[key] = contexts[0].createBuffer(1, i, sampleRate)
			bufferArray = buffer.getChannelData(0)
			
			// Fill the samples array
			for(;i--;) {
				bufferArray[i] =
					// The first 88 samples represent the note's attack
					(i < 88 ?
						i / 88.2
						// The other samples represent the rest of the note
						: (1 - (i - 88.2) / sampleRest) ** ((Math.log(1e4 * note) / 2) ** 2)
					) * pianoify(i * note)
			}
		}
		return buffer
	}
	
	p1 = (params) => {
		var tempo = 125
		tracks = params[trackLen = 0].replace(/[\!\|]/g,'').split('\n').map(track => {
			if(!track) {
				return 0
			}
			if(track*1) { 
				tempo = track*1
				return 0
			}
			
			return track.split('').map((letter, i) => {
				var duration = 1,
					note = letter.charCodeAt(0)
				note -= note>90 ? 71 : 65
				while(track[i+duration]=='-') {
					duration++
				}
				if(trackLen<i)trackLen=i+1
				return makeNote(note, duration/2*tempo/125, 44100)
			})
		})
		
		noteI = 0
		clearInterval(interval)
		interval = setInterval(j => {
			tracks.map((track,trackI) => {
				if(track[j = noteI % track.length]) {
					var context = contexts[noteI%4+trackI*4],
						source = context.createBufferSource()
					source.buffer = track[j]
					source.connect(context.destination)
					source.start()
				}
			})
			noteI++
			noteI %= trackLen
		}, tempo)
	}
}()
