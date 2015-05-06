if(typeof widget_famultibutton == 'undefined') {
    loadplugin('widget_famultibutton');
}

var widget_multistatebutton = $.extend({}, widget_famultibutton, {
    widgetname : 'multistatebutton',
    toggle : function(elem) {
        if(this._doubleclicked(elem, 'on')) {
            var device = elem.data('device');
            var set = elem.data('set');
            var state = getDeviceValue(elem, 'get');

            var states=elem.data('get-on');
            if($.isArray(states)) {
                var sets =elem.data('set')
                if(!$.isArray(sets)) {
                    sets = new Array(sets);
                }
                var s = states.indexOf(state);
                if(s>=0) {
                    set = typeof sets[s] != 'undefined' ? sets[s] : sets[0];
                } else {
                    set = elem.data('set-default')
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
            $(this).data('get-on',                  $(this).data('get-on')                  || new Array('on', 'off'));
            $(this).data('set',                     $(this).data('set'));
            if(typeof $(this).data('set') == 'undefined') {
                var set = $(this).data('get-on').slice();
                set.push(set.shift());
                $(this).data('set', set);
            }
            $(this).data('set-default',             $(this).data('set-default')             || $(this).data('set')[0] );
            $(this).data('icon',                    $(this).data('icon')                    || 'fa-power-off');
            $(this).data('background-icon',         $(this).data('background-icon')         || 'fa-circle');
            $(this).data('on-color',                $(this).data('on-color')                || $(this).data('on-color')                 || '#2a2a2a');
            $(this).data('off-color',               $(this).data('on-color')                || $(this).data('off-color')                || $(this).data('on-color'));
            $(this).data('on-background-color',     $(this).data('background-color')        || $(this).data('on-background-color')      || '#aa6900');
            $(this).data('off-background-color',    $(this).data('background-color')        || $(this).data('off-background-color')     || $(this).data('on-background-color'));
            
            $(this).data('on-colors',               $(this).data('colors')                  || $(this).data('on-colors')                || new Array($(this).data('on-color')) );
            $(this).data('on-background-colors',    $(this).data('background-colors')       || $(this).data('on-background-colors')     || new Array($(this).data('on-background-color')) );
            $(this).data('icons',                   $(this).data('icons')                                                               || new Array($(this).data('icon')) );
            
            console.log($(this).data('get-on'));
            console.log($(this).data('set'));
            
            base.init_attr($(this));
            base.init_ui($(this));
        });
    },
});
