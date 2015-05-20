if(typeof widget_joinedlabel == 'undefined') {
    loadplugin('widget_joinedlabel');
}

var widget_mpdnowplaying = $.extend({}, widget_joinedlabel, {
    widgetname:"mpdnowplaying",
    init: function () {
        base=this;
        this.elements = $('div[data-type="'+this.widgetname+'"]');
        this.elements.each(function(index) {
            var album   =  typeof $(this).data('album')  != 'undefined' ? $(this).data('album')  : 'album';
            var artist  =  typeof $(this).data('artist') != 'undefined' ? $(this).data('artist') : 'artist';
            var name    =  typeof $(this).data('name')   != 'undefined' ? $(this).data('name')   : 'name';
            var title   =  typeof $(this).data('title')  != 'undefined' ? $(this).data('title')  : 'title';
            var track   =  typeof $(this).data('track')  != 'undefined' ? $(this).data('track')  : 'track';
            
            $(this).data('get', new Array(name, artist, album, track, title));
            $(this).data('mask', $(this).data('mask') || "[$1<br>][$2 - ][ $3 - ][ $4: ][ $5]");
            
            base.init_attr($(this));
        });
    },
    update_value_cb : function(value) {
        if(value && value.match(/^\d\d\d\d-\d\d-\d\d \d\d:\d\d:\d\d$/)) {
            return '';
        }
        return value;
    }
});