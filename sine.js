var demo = demo || {};

(function () {
    var PI2 = Math.PI * 2.0;
    var context = typeof(window.AudioContext) !== "undefined" ? new AudioContext() : new webkitAudioContext();
    var isPlaying = false;
    
    demo.sinOsc = function (inputs) {
        var that = {
            context: context,
            inputs: inputs || {},
            phase: 0.0
        };
        
        that.play = function () {
            that.jsNode.connect(context.destination);
        };
        
        that.pause = function () {
            that.jsNode.disconnect(context.destination);
        };
        
        that.generateSamples = function (e) {
            var output = e.outputBuffer.getChannelData(0);
            var theta = PI2 * that.inputs.freq;
            for (var i = 0; i < output.length; i++) {
                output[i] = Math.sin(that.phase) * that.inputs.amp;
                that.phase = (that.phase + that.inputs.freq / that.context.sampleRate * PI2) % theta;
            }
        };
    
        that.init = function () {
            that.jsNode = context.createJavaScriptNode(1024, 1, 1);
            that.jsNode.onaudioprocess = that.generateSamples;
        
            // Set default values.
            that.inputs.freq = typeof (that.inputs.freq) === "undefined" ? 440 : that.inputs.freq;
            that.inputs.amp = typeof (that.inputs.amp) === "undefined" ? 0.5 : that.inputs.amp;
        };
    
        that.init();
        return that;
    };

    demo.bindPlayButton = function () {
        var button = document.querySelector(".playButton");
        var sinOsc = demo.sinOsc({
            freq: 440,
            amp: 0.5
        });
        
        button.addEventListener("click", function () {
            if (!isPlaying) {
                sinOsc.play();
                isPlaying = true;
                button.innerHTML = "Pause";
            } else {
                sinOsc.pause();
                isPlaying = false;
                button.innerHTML = "Play"
            }
        }, true);
    };

}());
