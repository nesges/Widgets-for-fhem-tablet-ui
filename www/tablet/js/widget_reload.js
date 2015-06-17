if(typeof widget_widget == 'undefined') {
    loadplugin('widget_widget');
}

var widget_reload = $.extend({}, widget_widget, {
    widgetname : 'reload',
    init_attr: function(elem) {
        elem.data('device',     elem.data('device'));
        elem.data('get',        elem.data('get')        ||                              'STATE');
        elem.data('get-on',     elem.data('get-on')     || elem.data('reload-on')    || 1);
        elem.data('get-off',    elem.data('get-off')    || elem.data('reset-to')     || 0);
    },
    init: function () {
        var base = this;
        this.elements = $('div[data-type="'+this.widgetname+'"]');
        this.elements.each(function(index) {
            base.init_attr($(this));
        });
    },
    update: function (dev,par) {
        var base = this;
        var deviceElements= this.elements.filter('div[data-device="'+dev+'"]');
        deviceElements.each(function(index) {
            if ( $(this).data('get')==par){
                var value = getDeviceValue($(this), 'get');
                if(value == $(this).data('get-on')) {
                    setFhemStatus("set "+$(this).data('device')+" "+$(this).data('get')+" "+$(this).data('get-off'));
                    location.reload();
                }
            }
        });
    }
});