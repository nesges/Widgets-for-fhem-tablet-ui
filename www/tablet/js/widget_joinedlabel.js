if(typeof widget_widget == 'undefined') {
    loadplugin('widget_widget');
}

var widget_joinedlabel = $.extend({}, widget_widget, {
    widgetname:"joinedlabel",
    init_attr: function(elem) {
        elem.data('__device',   elem.data('device'));
        elem.data('get',        elem.data('get')        || 'STATE');
        elem.data('glue',       elem.data('glue')       || ' ');
        elem.data('mask',       elem.data('mask')       || '');
        
        if(! $.isArray(elem.data('get'))) {
            elem.data('get', new Array(elem.data('get')));
        }
        for(var g=0; g<elem.data('get').length; g++) {
            var get = elem.data('get')[g];

            var device = elem.data('device');
            var reading = get;
            
            // advanced stuff: you could specify readings of different devices by
            // specifiing device:reading in the get-array
            // but this is limited by how ftui requests data from fhem: ftui collects
            // "interesting" devices by running over data-device tags and requests data
            // only for these. so you'd have to make shure that your devices are found 
            // in the html code. Try this:
            //
            // <div data-type="joinedlabel"
            //      data-device="DEVICE1"
            //      data-get='["DEVICE1:readingA","DEVICE2:readingB","DEVICE3:readingC"]'
            // ></div>
            // <div data-device="DEVICE2"></div>
            // <div data-device="DEVICE3"></div>
            
            if(get.match(/:/)) {
                get = get.split(':');
                device = get[0];
                reading = get[1];
            }
            
            // create a data-var with the name of the reading
            elem.data(reading, reading);
            // subscribe to the reading
            readings[reading] = true;
            
            // save the readings device
            elem.data('_device'+g, device);
        }            
    },
    init: function () {
        base=this;
        this.elements = $('div[data-type="'+this.widgetname+'"]');
        this.elements.each(function(index) {
            base.init_attr($(this));
        });
    },
    update_value_cb : function(value) {
        return value;
    },
    update: function (dev,par) {
        base=this;
        var deviceElements= this.elements.filter('div[data-device="'+dev+'"]');
        deviceElements.each(function(index) {
            var get = $(this).data('get');
            var val = new Array();
            
            // check if par is of interest to this device
            var parok=false;
            if($.isArray(get)) {
                for(var g=0; g<get.length; g++) {
                    if(par == get[g]) {
                        parok = true;
                        break;
                    }
                }
            }
            if(parok) {
                for(var g=0; g<get.length; g++) {
                    var device = $(this).data('_device'+g);
                    var reading = get[g];
                    if(get[g].match(/:/)) {
                        var temp = get[g].split(':');
                        device = temp[0];
                        reading = temp[1];
                    }
                    
                    // set device
                    $(this).data('device', device);
                    
                    // get reading
                    var value = getDeviceValue($(this), reading);
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
                if($(this).data('substitution') && $(this).data('substitution').match(/^s/)) {
                    var substitution = $(this).data('substitution');
                    var f = substitution.substr(1,1);
                    var subst = substitution.split(f);
                    html = html.replace(new RegExp(subst[1],subst[3]), subst[2]);
                }
                $(this).html(html);
                
                $(this).data('device', $(this).data('__device'));
            }
        });
    }
});