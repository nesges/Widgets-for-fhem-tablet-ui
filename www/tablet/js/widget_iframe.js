if(typeof widget_widget == 'undefined') {
    loadplugin('widget_widget');
}

var widget_iframe = $.extend({}, widget_widget, {
    widgetname : 'iframe',
    init_attr: function(elem) {
        elem.data('src',            elem.data('src'));
        elem.data('check-src',      elem.data('check-src')      || elem.data('src'));
        elem.data('timeout',        elem.data('timeout')        || 3000);
        elem.data('scrolling',      elem.data('scrolling')      || 'no');
        elem.data('fill',           elem.data('fill')           || 'no');
        elem.data('height',         elem.data('height')         || 100);
        elem.data('width',          elem.data('width')          || 100);
        elem.data('icon-spinner',   elem.data('icon-spinner')   || 'fa-spinner fa-spin');
        elem.data('color-spinner',  elem.data('color-spinner')  || '#aa6900');
        elem.data('icon-error',     elem.data('icon-error')     || 'fa-frown-o');
        elem.data('color-error',    elem.data('color-error')    || '#505050');
    },
    init_ui: function(elem) {
        var spinner = $('<div />').appendTo(elem);
        spinner.famultibutton({
            mode: 'signal',
            icon: elem.data('icon-spinner'),
            backgroundIcon: null,
            offColor: elem.data('color-spinner'),
        });
        $.ajax({
            type: 'HEAD',
            url: elem.data('check-src'),
            timeout: elem.data('timeout'),
            success: function(){
                elem.empty();
                var style = '';
                if(elem.data('fill')=='yes') {
                    style = 'position:absolute;left:0;top:0;height:100%;width:100%;';
                } else {
                    style = 'height:'+elem.data('height')+'px;width:'+elem.data('width')+'px;';
                }
                $("<iframe src='"+elem.data('src')+"' style='"+style+"border:none' scrolling='"+elem.data('scrolling')+"'/>").appendTo(elem);
            },
            error: function(x,t,m) {
                elem.empty();
                console.log('Error trying to load '+elem.data('src')+':',t,'-',m);
                var spinner = $('<div />').appendTo(elem);
                spinner.famultibutton({
                    mode: 'signal',
                    icon: elem.data('icon-error'),
                    backgroundIcon: null,
                    offColor: elem.data('color-error'),
                });
            }
        });
    },
    init: function () {
        var base = this;
        this.elements = $('div[data-type="'+this.widgetname+'"]');
        this.elements.each(function(index) {
            base.init_attr($(this));
            base.init_ui($(this));
        });
    },
    update: function () {}
});
