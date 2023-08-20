# p1
1kb piano music player from a string of notes.

There is only 1 function: p1
You call it without parenthesis.

EXAMPLE, PLAY JINGLE BELLS:
```
p1`c-c-c---|c-c-c---|c-f-Y--a|c-------|d-d-d--d|d-c-c-cc|f-f-d-a-|Y---f---`
```


TO STOP:
```
p1``
```

WITH BASS TRACK:
```
p1`
|V-Y-c-V-|d---c-a-|
|M-------|R-------|
`
```

Bass track can be shorter and will repeat.


WITH CUSTOM TEMPO (in milliseconds per note):
```
p1`70
V-Y-c-V-d---c-a-
M-------R-------`
```

Vertical bars are ingored and don't do anything.
Dashes make the note held longer.
Spaces are silent space.

Supports 52 notes (4 octaves)
How to convert from piano notes to p1 letters:
```
|Low C      |Tenor C    |Middle C   |Treble C   |High C
C#D#EF#G#A#BC#D#EF#G#A#BC#D#EF#G#A#BC#D#EF#G#A#BC#D#
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz
```
