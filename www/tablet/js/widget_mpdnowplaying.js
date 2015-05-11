if(typeof widget_widget == 'undefined') {
    loadplugin('widget_widget');
}

var widget_mpdnowplaying = $.extend({}, widget_widget, {
    widgetname:"mpdnowplaying",
    init: function () {
        base=this;
        this.elements = $('div[data-type="'+this.widgetname+'"]');
        this.elements.each(function(index) {
            $(this).data('album', $(this).data('album') || 'album');
            readings[$(this).data('album')] = true;
            
            $(this).data('artist', $(this).data('artist') || 'artist');
            readings[$(this).data('artist')] = true;
            
            $(this).data('name', $(this).data('name') || 'name');
            readings[$(this).data('name')] = true;
            
            $(this).data('title', $(this).data('title') || 'title');
            readings[$(this).data('title')] = true;
            
            $(this).data('track', $(this).data('track') || 'track');
            readings[$(this).data('track')] = true;
        });
    },
    
    update: function (dev,par) {
        var deviceElements= this.elements.filter('div[data-device="'+dev+'"]');
        deviceElements.each(function(index) {
            var album       = getDeviceValue($(this), 'album');
            var artist      = getDeviceValue($(this), 'artist');
            var name        = getDeviceValue($(this), 'name');
            var title       = getDeviceValue($(this), 'title');
            var track       = getDeviceValue($(this), 'track');
            
            // getDeviceValue might return a timestamp which is the readings updatetime
            // this is a bug in requestFhem not yet solved
            // check values which most likely would not contain a timestamp and empty them
            if(album && album.match(/^\d\d\d\d-\d\d-\d\d \d\d:\d\d:\d\d$/)) {
                album='';
            }
            if(artist && artist.match(/^\d\d\d\d-\d\d-\d\d \d\d:\d\d:\d\d$/)) {
                artist='';
            }
            if(title && title.match(/^\d\d\d\d-\d\d-\d\d \d\d:\d\d:\d\d$/)) {
                title='';
            }
            if(track && track.match(/^\d\d\d\d-\d\d-\d\d \d\d:\d\d:\d\d$/)) {
                track='';
            }

            $(this).empty();
            $(this).html(
                  (name                ? ' <span class="'+$(this).data('class-name')       +'">'   +name+' - </span>'                                :'')
                + (artist              ? ' <span class="'+$(this).data('class-artist')     +'">'   +artist+' - </span>'                              :'')
                + (album               ? ' <span class="'+$(this).data('class-album')      +'">'   +album+' - </span>'                               :'')
                + (track               ? ' <span class="'+$(this).data('class-track')      +'">'   +track+' </span>'                                 :'')
                + (title               ? ' <span class="'+$(this).data('class-title')      +'">'   +title+ '</span> '                                :'')
            );
        });
    }
});