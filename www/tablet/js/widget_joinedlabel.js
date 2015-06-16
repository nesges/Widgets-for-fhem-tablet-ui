if(typeof widget_label == 'undefined') {
    loadplugin('widget_label');
}

var widget_joinedlabel = $.extend({}, widget_label, {
    widgetname:"joinedlabel",
    init_attr: function(elem) {
        widget_label.init_attr(elem);
        elem.data('glue',       elem.data('glue')       || ' ');
        elem.data('mask',       elem.data('mask')       || '');
    },
    init: function () {
        this.elements = $('div[data-type="'+this.widgetname+'"]');
        this.elements.each(function(index) {
            widget_joinedlabel.init_attr($(this));
        });
    },
    update_value_cb : function(value) {
        return value;
    },
    update: function (dev,par) {
        var base=this;
        var deviceElements= this.elements;
        deviceElements.each(function(index) {
            var get = $(this).data('get');
            var part = $(this).data('part');
            var val = new Array();
            // check if par is of interest to this device
            if(hasSubscription($(this), par)) {
                for(var g=0; g<get.length; g++) {
                    var device = $(this).data('device');
                    var reading = get[g];
                    if(get[g].match(/:/)) {
                        var temp = get[g].split(':');
                        device = temp[0];
                        reading = temp[1];
                    }
                    
                    // get reading
                    var value = getDeviceValueByName(device, reading);
                    value = getPart(value,part);
                    value = base.update_value_cb(value);
                    
                    if(value) {
                        val[g] = '<span class="' + base.widgetname + '_get_' + g + '">' + value + '</span>';
                    }
                }
                
                var html;
                $(this).empty();
                if(! $(this).data('mask')) {
                    html = val.join($(this).data('glue'));
                } else {
                    var mask = $(this).data('mask');
                    for(var g=0; g<get.length; g++) {
                        v=1*g+1;
                        // "[ pre $1 suf ]" 
                        // is replaced with 
                        // " pre " + val[1] + " suf "
                        mask = mask.replace(new RegExp('\\[(.*?)\\$'+v+'(.*?)\\]'), (val[g]?'$1'+val[g]+'$2':''));
                        // "$1"
                        // is replaced with 
                        // val[1]
                        mask = mask.replace(new RegExp('\\$'+v), val[g]);
                    }
                    
                    html = mask;
                }
                html = widget_label.update_substitution(html, $(this).data('substitution'));
                html = widget_label.update_fix(html, $(this).data('fix'));
                    
                var unit = $(this).data('unit');
                if(unit) {
                    html += "<span style='font-size: 50%;'>"+unit+"</span>";
                }
                
                $(this).html(html);
                
                widget_label.update_colorize(html, $(this));
            }
        });
    }
});