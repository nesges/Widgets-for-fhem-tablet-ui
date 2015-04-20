if(typeof widget_famultibutton == 'undefined') {
    loadplugin('widget_famultibutton');
}

var widget_button = $.extend({}, widget_famultibutton, {
    widgetname : 'button',

    toggleOn : function(elem) {
        if(elem.attr('data-url')) {
            widget_button.clicked(elem.attr('data-url'), 'url');
        } else if(elem.attr('data-url-xhr')) {
            widget_button.clicked(elem.attr('data-url-xhr'), 'url-xhr');
        } else if(elem.attr('data-fhem-cmd')) {
            widget_button.clicked(elem.attr('data-fhem-cmd'), 'fhem-cmd');
        }
        setInterval(function() {elem.setOff()}, 200);
    },

    toggleOff : function(elem) {
        if(elem.attr('data-url')) {
            widget_button.clicked(elem.attr('data-url'), 'url');
        } else if(elem.attr('data-url-xhr')) {
            widget_button.clicked(elem.attr('data-url-xhr'), 'url-xhr');
        } else if(elem.attr('data-fhem-cmd')) {
            widget_button.clicked(elem.attr('data-fhem-cmd'), 'fhem-cmd');
        }
        setInterval(function() {elem.setOn()}, 200);
    },

    init_ui : function(elem) {
        var base = this;
        elem.famultibutton({
            mode: elem.data('mode'),
            toggleOn: function() { base.toggleOn(elem) },
            toggleOff: function() { base.toggleOff(elem) },
        });
        
        if(! elem.data('device')) {
            elem.setOn();
        }
    },

    init: function () {
        var base = this;
        this.elements = $('div[data-type="'+this.widgetname+'"]');
        this.elements.each(function(index) {
            base.init_attr($(this));
            
            if($(this).attr('data-color') || $(this).attr('data-offcolor')) {
                console.log('Attributes data-color/data-offcolor are deprecated in widget "'+this.widgetname+'" on ' + document.location 
                    + ($(this).attr('data-device')?' device: '+$(this).attr('data-device'):'')
                    + ($(this).attr('data-url')?' url: '+$(this).attr('data-url'):'')
                    + ($(this).attr('data-url-xhr')?' url-xhr: '+$(this).attr('data-url-xhr'):'')
                    + ($(this).attr('data-fhem-cmd')?' fhem-cmd: '+$(this).attr('data-fhem-cmd'):'')
                    + ' use any of data-on-color, data-off-color, data-on-background-color, data-off-background-color instead'
                );
            }


            $(this).data('off-color', $(this).data('off-color') || '#2A2A2A');
            $(this).data('off-background-color', $(this).data('off-background-color') || '#505050');
            $(this).data('on-color', $(this).data('on-color') || '#2A2A2A');
            $(this).data('on-background-color', $(this).data('on-background-color') || '#aa6900');
            
            base.init_ui($(this));
        });
    },
    clicked: function(target, type) {
        // this code may be harmfull if target must contain urlencoded parts.
        // but it shouldn't since it checks for unencoded chars first
        // anyways it should be removed after a while
        if(target.match(/[{ }?\&$§"',;:#]/)) {
            // definitely not urlencoded
        } else if(target.match(/%(7B|7D|20|3F)/)) {
            // probably urlencoded
            _target = decodeURIComponent(target);
            console.log('widget_button: urlencoding the target of '+type+' is deprecated. decoding '+target+' to '+_target);
            target = _target;
        }

        switch(type) {
            case 'url':
                document.location.href = target;
                break;
            case 'url-xhr':
                $.get(target);
                TOAST && $.toast(target);
                break;
            case 'fhem-cmd':
                setFhemStatus(target);
                TOAST && $.toast(target);
                break;
        }
    },
});