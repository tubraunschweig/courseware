define(['assets/js/student_view', 'assets/js/url'], function (StudentView, helper) {
    
    'use strict';
    
    return StudentView.extend({
        events: {
            "click button[name=play]":   "playAudioFile",
            "click button[name=stop]":   "stopAudioFile"
        },
        
        initialize: function(options) {
        },

        render: function() {
            return this; 
        },
        
        postRender: function() {
            var $view =  this,
                $player = $view.$(".cw-audio-player"),
                $duration = parseInt($player.prop("duration")),
                $playbutton = $view.$(".cw-audio-playbutton"),
                $range = $view.$(".cw-audio-range"),
                $time = $view.$(".cw-audio-time"),
                $music = $player[0];
            
            $time.html($view.displayTimer(0, $duration));

            $range.slider({
                range: "max",
                min: 0,
                max: parseInt($player.prop("duration")),
                value: 0,
                slide: function( event, ui ) {
                    $player.prop("currentTime",ui.value);
                    $time.html($view.displayTimer(ui.value, $duration));
                }
            });
            
            $player.find("source").each(function(){
                var $source = $(this).prop("src");
                if ($source.indexOf("ogg") > -1) {
                    $(this).prop("type", "audio/ogg")
                }
                if ($source.indexOf("wav") > -1) {
                    $(this).prop("type", "audio/wav")
                }
                // default: type="audio/mpeg"
            });
            
            $music.addEventListener("timeupdate",function() {
                var $current = parseInt($player.prop("currentTime"));
                $range.slider( "option", "value", $current );
                $time.html($view.displayTimer($current, $duration));
            }, false);
            
            $music.addEventListener("ended", function() {
                $playbutton.removeClass('cw-audio-playbutton-playing');
                $player.prop("currentTime",0);
            }, false);

        },

        playAudioFile: function() {
            var $view =  this,
                $player = $view.$(".cw-audio-player"),
                $playbutton = $view.$(".cw-audio-playbutton");

            if (!$playbutton.hasClass("cw-audio-playbutton-playing")) {
                 $playbutton.addClass('cw-audio-playbutton-playing');
                 $player.trigger("play");
            } else {
                 $playbutton.removeClass('cw-audio-playbutton-playing');
                 $player.trigger("pause");
            }
            if ($playbutton.attr("played") != "1") {
                helper
                    .callHandler(this.model.id, "play", {})
                    .then(
                        // success
                        function () {
                            $playbutton.attr("played", "1");
                        },

                        // error
                        function (error) {
                            var errorMessage = 'Could not update the block: '+jQuery.parseJSON(error.responseText).reason;
                            alert(errorMessage);
                            console.log(errorMessage, arguments);
                        })
                    .done();
            }
        },

        stopAudioFile: function() {
            var $view =  this,
                $playbutton = $view.$(".cw-audio-playbutton"),
                $player = $view.$(".cw-audio-player");
            $playbutton.removeClass('cw-audio-playbutton-playing');
            $player.trigger("pause");
            $player.prop("currentTime",0);
        },
       
        displayTimer: function($current, $duration) {
            return this.seconds2time($current)+"/"+this.seconds2time($duration);
        },

        seconds2time: function (seconds) {
            var hours   = Math.floor(seconds / 3600),
                minutes = Math.floor((seconds - (hours * 3600)) / 60),
                seconds = seconds - (hours * 3600) - (minutes * 60),
                time = "";

            if (hours != 0) {
              time = hours+":";
            }
            if (minutes != 0 || time !== "") {
              minutes = (minutes < 10 && time !== "") ? "0"+minutes : String(minutes);
              time += minutes+":";
            }
            if (time === "") {
              time = (seconds < 10) ? "0:0"+seconds : "0:"+seconds;
            }
            else {
              time += (seconds < 10) ? "0"+seconds : String(seconds);
            }
            return time;
        }

    });
});


