if(typeof widget_widget == 'undefined') {
    loadplugin('widget_widget');
}

var widget_javascript = $.extend({}, widget_widget, {
    widgetname : 'reload',
    init_attr: function(elem) {
        elem.data('device',     elem.data('device'));
        elem.data('get',        elem.data('get')    ||  'STATE');
    },
    init: function () {
        base = this;
        this.elements = $('div[data-type="'+this.widgetname+'"]');
        this.elements.each(function(index) {
            base.init_attr($(this));
        });
    },
    update: function (dev,par) {
        base = this;
        var deviceElements= this.elements.filter('div[data-device="'+dev+'"]');
        deviceElements.each(function(index) {
            if ( $(this).data('get')==par){
                var value = getDeviceValue($(this), 'get');
                eval(value);
            }
        });
    }
});