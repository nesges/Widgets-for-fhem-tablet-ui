if(typeof widget_famultibutton == 'undefined') {
    loadplugin('widget_famultibutton');
}

var widget_tripush = $.extend({}, widget_famultibutton, {
    widgetname : 'tripush',
    toggle : function(elem) {
        if(this._doubleclicked(elem, 'on')) {
            var device = elem.data('device');
            var set = elem.data('set-on');
            var state = getDeviceValue(elem, 'get');

            var states=elem.data('get-on');
            if($.isArray(states)) {
                var sets =elem.data('set-on')
                if(!$.isArray(sets)) {
                    sets = new Array(sets);
                }
                var s = states.indexOf(state);
                if(s>=0) {
                    set = typeof sets[s] != 'undefined' ? sets[s] : sets[0];
                } else {
                    set = elem.data('set-off')
                }
            }

            var cmd = [elem.data('cmd'), device, set].join(' ');
            setFhemStatus(cmd);              
            if( device && typeof device != "undefined" && device !== " ") {
                TOAST && $.toast(cmd);
            }
        }
    },
    init_ui : function(elem) {
        var base = this;
        elem.famultibutton({
            mode: elem.data('mode'),
            toggleOn: function() { base.toggle(elem) },
            toggleOff: function() { base.toggle(elem) },
        });
        return elem;
    },
    init: function () {
        var base = this;
        this.elements = $('div[data-type="'+this.widgetname+'"]');
        this.elements.each(function(index) {
            $(this).data('off-color',       $(this).data('off-color')       || '#505050');
            $(this).data('background-icon', $(this).data('background-icon') || 'fa-circle-thin');
            $(this).data('on-background-color',        $(this).data('on-background-color')        || $(this).data('off-color'));
            $(this).data('off-background-color',        $(this).data('off-background-color')      || $(this).data('off-color'));
            base.init_attr($(this));
            base.init_ui($(this));
        });
    },
});
