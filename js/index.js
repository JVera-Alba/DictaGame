console.clear();
var started = false;
var nivel = 1;
var repeticion = 0;
var notas = [];
var notaPulsada = 0;
var acierto = true;
var tiempoRetardoNivel = 1000; // Tiempo entre nivel y nivel. A este retardo va incluido 1 seg mÃ¡s, que es el tiempo que tarda en dejar de sonar la nota. 
// Tiempo total de retardo = tiempoRetardo + 1seg

$(document).ready(function() {
    $('#btnIniciar').click(() => {
        if (started) {
            console.log('Ya esta iniciado');
            return;
        }
        $('#nivel').text('Nivel: ' + (nivel - 1).toString());
        $('#nivel').css('color', 'black');
        started = true;
        $('#btnIniciar').hide();
        var $inputs = document.querySelectorAll('input'),
            chords = [
                'C1', 'D1', 'E1',
                'F1', 'G1', 'A1', 'B1'
            ].
        map(formatChords);
        var chordIdx = randomChord();
        var step = 0;

        var synth = new Tone.Synth();
        var gain = new Tone.Gain(0.9);
        synth.oscillator.type = 'sine';
        gain.toMaster();
        synth.connect(gain);

        Array.from($inputs).forEach(function($input) {
            $input.addEventListener('change', function() {
                if (acierto) {
                    setTimeout(function() {
                        $('.tecla').prop('checked', false);
                        setTimeout(function() {
                            repeticion = 0;
                            handleChord(randomChord());
                            acierto = false;
                        }, tiempoRetardoNivel);
                    }, 1000);

                }
            });
        });

        function handleChord(valueString) {
            chordIdx = parseInt(valueString) - 1;
        }

        Tone.Transport.scheduleRepeat(onRepeat, '4n');
        Tone.Transport.start();
        Tone.Transport.bpm.value = 90;

        function onRepeat(time) {
            if (repeticion < nivel && started) {
                $('#chord-' + notas[repeticion]).prop('checked', true);
                var chord = chords[notas[repeticion] - 1];
                if (chord === undefined) {
                    return;
                }
                var note = chord[step % chord.length];
                synth.triggerAttackRelease(note, '4n', time);
                step++;
                repeticion++;
            } else {
                $('.tecla').prop('checked', false);
            }
        }

        // DOWN THE LINE THIS WILL MAKE THINGS EASIER
        function formatChords(chordString) {
            var chord = chordString.split(' ');
            var arr = [];
            for (var i = 0; i < 1; i++) {
                for (var j = 0; j < chord.length; j++) {
                    var noteOct = chord[j].split(''),
                        note = noteOct[0];
                    var oct = noteOct[1] === '0' ? i + 4 : i + 5;
                    note += oct;
                    arr.push(note);
                }
            }
            return arr;
        }

        function randomChord() {
            const maximo = 7;
            const minimo = 1;
            const nota = Math.floor(Math.random() * (maximo - minimo + 1)) + minimo;
            notas.push(nota);
            return nota;
        }
    });

    $('#btnReiniciar').click(() => {
        location.reload();
    });

    $('.nota').click(function() {
        // Hacemos sonar la nota pulsada
        const synth = new Tone.Synth();
        var gain = new Tone.Gain(0.9);
        synth.oscillator.type = 'sine';
        gain.toMaster();
        synth.connect(gain);
        const acordes = ['C5', 'D5', 'E5', 'F5', 'G5', 'A5', 'B5'];
        synth.triggerAttackRelease(acordes[this.id - 1], "4n");
        //
        if (notaPulsada > notas.length) {
            return;
        } else {
            if (this.id == notas[notaPulsada]) {
                notaPulsada++;
                if (notaPulsada == nivel) {
                    notaPulsada = 0;
                    nivel++;
                    $('#nivel').text('Nivel: ' + (nivel - 1).toString());
                    acierto = true;
                }
            } else {
                $('#nivel').text('HAS FALLADO :( - Has alcanzado el nivel: ' + (nivel - 1).toString());
                $('#nivel').css('color', 'red');
                alert('Has fallado!');
                inicializar();
            }
        }

    });

});

function inicializar() {
    started = false;
    nivel = 1;
    repeticion = 0;
    notas = [];
    notaPulsada = 0;
    acierto = true;
}