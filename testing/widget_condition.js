if(typeof widget_widget == 'undefined') {
    loadplugin('widget_widget');
}

var widget_condition = $.extend({}, widget_widget, {
    widgetname : 'condition',
    init_attr: function(elem) {
        elem.data('condition-type',         elem.data('condition-type')         || 'device'); /* device, src */
        
        elem.data('condition-src',          elem.data('condition-src'));
        elem.data('condition-src-timeout',  elem.data('condition-src-timeout')  || 3000);
        
        elem.data('condition-device',       elem.data('condition-device'));
        elem.data('condition-get',          elem.data('condition-get')          || 'STATE');
        elem.data('condition-get-true',     elem.data('condition-get-true')     || 'on');
        elem.data('condition-get-false',    elem.data('condition-get-false')    || '!true');
        
        readings[elem.data('condition-get')]=true;
        devices[elem.data('condition-device')])true;
    },
    init: function () {
        var base = this;
        this.elements = $('div[data-type="'+this.widgetname+'"]');
        this.elements.each(function(index) {
            base.init_attr($(this));
        });
    },
    comply: function () {
        switch($(this).data('condition-type')) {
            case 'device':
                var org_device = $(this).data('device');
                $(this).data('device', $(this).data('condition-device'));
                var value = getDeviceValue( $(this), 'condition-get' );
                $(this).data('device', org_device);
                
                if (value) {
                    if ( value == $(this).data('condition-get-true') )
                        return true;
                    else if ( value == $(this).data('condition-get-false') )
                        return false;
                    else if ( value.match(new RegExp('^' + $(this).data('condition-get-true') + '$')) )
                        return true;
                    else if ( value.match(new RegExp('^' + $(this).data('condition-get-false') + '$')) )
                        return false;
                    else if ( $(this).data('condition-get-false')=='!true' && state != $(this).data('condition-get-true') )
                        return false;
                    else if ( $(this).data('condition-get-true')=='!false' && state != $(this).data('condition-get-false') )
                        return true;
                }
                return false;
            
            case 'src':
                elem.data('_condition-src-result', null);
                $.ajax({
                    async: false,
                    type: 'HEAD',
                    url: elem.data('condition-src'),
                    timeout: elem.data('condition-src-timeout'),
                    success: function(){
                        elem.data('_condition-src-result', true);
                    },
                    error: function(x,t,m) {
                        elem.data('_condition-src-result', false);
                    }
                });
                return elem.data('_condition-src-result');
        }
    }
    update: function (dev,par) {}
});
