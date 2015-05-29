if(typeof widget_famultibutton == 'undefined') {
    loadplugin('widget_famultibutton');
}

var widget_button = $.extend({}, widget_famultibutton, {
    widgetname : 'button',

    toggleOn : function(elem) {
        if(this._doubleclicked(elem, 'on')) {
            this.clicked(elem);
            if(! elem.data('device')) {
                setInterval(function() {elem.setOff()}, 200);
            }
        }
    },

    toggleOff : function(elem) {
        if(this._doubleclicked(elem, 'off')) {
            this.clicked(elem);
            if(! elem.data('device')) {
                setInterval(function() {elem.setOn()}, 200);
            }
        }
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
            
            $(this).data('off-color', $(this).data('off-color') || '#2A2A2A');
            $(this).data('off-background-color', $(this).data('off-background-color') || '#505050');
            $(this).data('on-color', $(this).data('on-color') || '#2A2A2A');
            $(this).data('on-background-color', $(this).data('on-background-color') || '#aa6900');
            
            base.init_ui($(this));
        });
    },
    clicked: function(elem) {
        var target;
        var type;
        
        if(elem.attr('data-url')) {
            target = elem.attr('data-url');
            type = 'url';
        } else if(elem.attr('data-url-xhr')) {
            target = elem.attr('data-url-xhr');
            type = 'url-xhr';
        } else if(elem.attr('data-fhem-cmd')) {
            target = elem.attr('data-fhem-cmd');
            type = 'fhem-cmd';
        } else if(elem.attr('data-cmd')) {
            target = elem.attr('data-cmd');
            type = 'fhem-cmd';
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
    update_cb : function(elem,state) {
        if (elem.hasClass('warn') || elem.children().filter('#fg').hasClass('warn'))
            this.showOverlay(elem,state);
        else
            this.showOverlay(elem,"");
    },
});
