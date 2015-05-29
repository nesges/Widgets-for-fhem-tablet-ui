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
        elem.data('device',         elem.data('device'));
        elem.data('get',            elem.data('get')            || 'STATE');
        elem.data('get-refresh',    elem.data('get-refresh'));
        elem.data('check',          elem.attr('data-check')?elem.data('check'):true);
        elem.data('value-url',      elem.data('value-url')      || false);
        DEBUG && console.log('INIT ATTR : ', elem.data('value-url') );
    },
    init_ui: function(elem) {
        if(elem.data('check')) {
            elem.empty();
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
        } else {
            elem.empty();
            var style = '';
            if(elem.data('fill')=='yes') {
                style = 'position:absolute;left:0;top:0;height:100%;width:100%;';
            } else {
                style = 'height:'+elem.data('height')+'px;width:'+elem.data('width')+'px;';
            }
            $("<iframe src='"+elem.data('src')+"' style='"+style+"border:none' scrolling='"+elem.data('scrolling')+"'/>").appendTo(elem);
        }
    },
    init: function () {
        var base = this;
        this.elements = $('div[data-type="'+this.widgetname+'"]');
        this.elements.each(function(index) {
            base.init_attr($(this));
            base.init_ui($(this));
        });
    },
    update: function (dev,par) {
        base = this;
        var deviceElements= this.elements.filter('div[data-device="'+dev+'"]');
        deviceElements.each(function(index) {
            if ( $(this).data('get')==par || par =='*') {   
                var value = getDeviceValue( $(this), 'get' );
                if (value) {
                    if (  $(this).data('value-url') ) {
                       $(this).data('src', value);
                      DEBUG && console.log('Got URL on update',value);
                    }
                    if ( value == $(this).data('get-refresh') )
                        base.init_ui($(this))
                    else if ( value.match(RegExp('^' + $(this).data('get-refresh') + '$')) )
                        base.init_ui($(this))
                    else if (!$(this).data('get-refresh') && $(this).data('value') != value )
                        base.init_ui($(this))
                }
                $(this).data('value', value);
            }
        });
    }
});
