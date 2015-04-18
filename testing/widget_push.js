if(typeof widget_famultibutton == 'undefined') {
    loadplugin('widget_famultibutton');
}

var widget_push = $.extend({}, widget_famultibutton, {
    widgetname : 'push',
    init: function () {
        var base = this;
        this.elements = $('div[data-type="'+this.widgetname+'"]');
        this.elements.each(function(index) {
            base.init_attr($(this));
            $(this).data('off-color', $(this).data('off-color') || '#505050');
            $(this).data('on-color', $(this).data('on-color') || '#aa6900');
            $(this).data('background-icon', $(this).data('background-icon') || 'fa-circle-thin');
            $(this).data('mode', 'push');
            base.init_ui($(this));
        });
    },
    update: function (dev,par) {
    },
});
