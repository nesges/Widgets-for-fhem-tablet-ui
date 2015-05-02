if(typeof widget_widget == 'undefined') {
    dynamicload('js/widget_widget.js');
}

if(typeof ion == 'undefined' || typeof ion.sound == 'undefined') {
    dynamicload('lib/ion.sound/ion.sound.min.js');
}

/* this function should go to fhem-tablet-ui.js */
function dynamicload(file, success, error, async) {
    var dir = $('script[src$="fhem-tablet-ui.js"]').attr('src');
    var name = dir.split('/').pop(); 
    dir = dir.replace('/'+name,"");
    $.ajax({
        url: dir + '/../' + file,
        dataType: "script",
        cache: true,
        async: async || false,
        context:{name: name},
        success: success||function(){ return true },
        error: error||function(){ return false },
    });
}

var widget_clicksound = $.extend({}, widget_widget, {
    widgetname: 'clicksound',
    selector: function(selector) {
        var resolved = new Array();
        var selectors = $.map(selector.split(','), $.trim);
        for(var s=0; s<selectors.length; s++) {
            switch(selectors[s]) {
                case '+buttons':
                    resolved.push('[data-type=famultibutton]:not(.readonly),[data-type=button]:not(.readonly),[data-type=switch]:not(.readonly),[data-type=push]:not(.readonly)'); 
                    break;
                case '+knobs':
                    resolved.push('[data-type=volume],[data-type=thermostat]'); 
                    break;
                case '+circlemenu':
                    resolved.push('.circlemenu li'); 
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

            var sound = $(this).data('sound');
            var path;
            if(sound.match(/^ion-/)) {
                sound =  sound.replace(/^ion-/, '').replace(/-/g, '_');
                
                var dir = $('script[src$="fhem-tablet-ui.js"]').attr('src');
                var name = dir.split('/').pop(); 
                path = dir.replace('/'+name, '') + '/../lib/ion.sound/sounds/';
            } else {
                var matches = sound.match(/^(.*\/)(.*?)\.(?:mp3|ogg|aac|mp4|wav)$/);
                if(matches) {
                    path = matches[1];
                    sound = matches[2];
                } else {
                    console.log(base.widgetname+' ERROR: unsupported soundfile');
                }
            }
            
            ion.sound({
                sounds : [{
                    name:sound,
                    sprite: {
                        "short": [0,($(this).data('length')/1000)]
                    }
                }],
                preload: true,
                path : path,
                volume: $(this).data('volume')/100,
            });

            if($(this).data('bind-play-to')) {
                $(base.selector($(this).data('bind-play-to'))).click({elem:this}, function(event){
                    ion.sound.play($(this).data('src'), {part:'short'});
                });
            }
            if(base.selector($(this).data('bind-pause-to'))) {
                $($(this).data('bind-pause-to')).click({elem:this}, function(event){
                    ion.sound.pause($(this).data('sound'));
                });
            }
        });
        
    },
    update: function (dev,par) {}
});
