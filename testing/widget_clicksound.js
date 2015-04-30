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
    init_attr: function(elem) {
        elem.data('bind-play-to',       elem.data('bind-play-to')   || elem.data('bind-to')     ||  '');
        elem.data('bind-pause-to',      elem.data('bind-pause-to')  || '');
        elem.data('sound',              elem.data('sound')          || 'ion-button-tiny');
        elem.data('volume',             elem.data('volume')         || 1);
    },
    init: function () {
        base = this;
        this.elements = $('div[data-type="'+this.widgetname+'"]');
        this.elements.each(function(index) {
            base.init_attr($(this));

            var sound = $(this).data('sound');
            var path;
            if(sound.match(/^ion-/)) {
                sound =  sound.replace(/^ion-/, '').replace(/-/, '_');
                
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
                sounds : [{name:sound}],
                preload: true,
                path : path,
                volume: $(this).data('volume'),
            });

            if($(this).data('bind-play-to')) {
                $($(this).data('bind-play-to')).click({elem:this}, function(event){
                    ion.sound.play($(this).data('src'));
                });
            }
            if($(this).data('bind-pause-to')) {
                $($(this).data('bind-pause-to')).click({elem:this}, function(event){
                    ion.sound.pause($(this).data('sound'));
                });
            }
        });
        
    },
    update: function (dev,par) {}
});
