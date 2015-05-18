if(typeof widget_widget == 'undefined') {
    dynamicload('js/widget_widget.js');
}

if(typeof ion == 'undefined' || typeof ion.sound == 'undefined') {
    dynamicload('lib/ion.sound/ion.sound.min.js');
}

var widget_clicksound = $.extend({}, widget_widget, {
    widgetname: 'clicksound',
    selector: function(selector) {
        var resolved = new Array();
        var selectors = $.map(selector.split(','), $.trim);
        for(var s=0; s<selectors.length; s++) {
            switch(selectors[s]) {
                case '+button':
                    resolved.push(':not(.circlemenu li) > [data-type=famultibutton]:not(.readonly),:not(.circlemenu li) > [data-type=button]:not(.readonly),:not(.circlemenu li) > [data-type=switch]:not(.readonly),:not(.circlemenu li) > [data-type=push]:not(.readonly)'); 
                    break;
                case '+slider':
                case '+dimmer':
                    resolved.push('[data-type=slider],[data-type=dimmer]'); 
                    break;
                case '+knob':
                    resolved.push('[data-type=volume],[data-type=thermostat]'); 
                    break;
                case '+circlemenu':
                    resolved.push('.circlemenu li'); 
                    break;
                case '+circlemenu-center':
                    resolved.push('.circlemenu li:first-child'); 
                    break;
                case '+circlemenu-outer':
                    resolved.push('.circlemenu li:not(:first-child)'); 
                    break;
                case '+widgets':
                    resolved.push('[data-type]'); 
                    break;
                case '+everything':
                    resolved.push('*'); 
                    break;
                default:
                    resolved.push(selectors[s]); 
                    break;
            }
        }
        return resolved.join(',');
    },
    init_attr: function(elem) {
        elem.data('bind-play-to',       elem.data('bind-play-to')   || elem.data('bind-to')     ||  '');
        elem.data('bind-pause-to',      elem.data('bind-pause-to')  || '');
        elem.data('sound',              elem.data('sound')          || 'ion-button-tiny');
        elem.data('volume',             elem.data('volume')         || 100);
        elem.data('length',             elem.data('length')         || 200);
    },
    init: function () {
        base = this;
        this.elements = $('div[data-type="'+this.widgetname+'"]');
        this.elements.each(function(index) {
            $(this).css("display","none");

            base.init_attr($(this));

            var path;
            var sounds = $(this).data('sound');
            var _sounds = new Array();
            if(!$.isArray(sounds)) {
                sounds = new Array(sounds);
            }
            
            var length = $(this).data('length');
            if(!$.isArray(length)) {
                length = new Array(length);
            }
            for(var s=0; s<sounds.length; s++) {
                if(typeof length[s] == 'undefined') {
                    length[s]=length[s>0?s-1:0];
                }
            }
            
            var bindPlayTo = $(this).data('bind-play-to');
            if(!$.isArray(bindPlayTo)) {
                bindPlayTo = new Array(bindPlayTo);
            }
            var bindPauseTo = $(this).data('bind-pause-to');
            if(!$.isArray(bindPauseTo)) {
                bindPauseTo = new Array(bindPauseTo);
            }
            
            for(var s=0; s<sounds.length; s++) {
                var sound = sounds[s];
                if(sound.match(/^ion-/)) {
                    sound =  sound.replace(/^ion-/, '').replace(/-/g, '_');
                    if(typeof path=='undefined') {
                        var dir = $('script[src$="fhem-tablet-ui.js"]').attr('src');
                        var name = dir.split('/').pop(); 
                        path = dir.replace('/'+name, '') + '/../lib/ion.sound/sounds/';
                    }
                } else {
                    var matches = sound.match(/^(.*\/)(.*?)\.(?:mp3|ogg|aac|mp4|wav)$/);
                    if(matches) {
                        if(typeof path=='undefined') {
                            path = matches[1];
                        }
                        sound = matches[2];
                    } else {
                        console.log(base.widgetname+' ERROR: unsupported soundfile', sound);
                    }
                }
                _sounds.push({
                    name:sound,
                    sprite: { "short": [0,((length[s]||200)/1000)] }
                });
                
                if(typeof bindPlayTo[s] != 'undefined') {
                    $(base.selector(bindPlayTo[s])).click({sound:sound}, function(event){
                        ion.sound.play(event.data.sound, {part:'short'});
                    });
                }
                if(typeof bindPauseTo[s] != 'undefined') {
                    $(base.selector(bindPauseTo[s])).click({sound:sound}, function(event){
                        ion.sound.play(event.data.sound, {part:'short'});
                    });
                }
            }
            
            ion.sound({
                sounds: _sounds,
                preload: true,
                multiplay: true,
                path : path,
                volume: $(this).data('volume')/100,
            });
        });
        
    },
    update: function (dev,par) {}
});
