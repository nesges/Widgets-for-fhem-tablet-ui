if(typeof widget_widget == 'undefined') {
    loadplugin('widget_widget');
}

var widget_joinedlabel = $.extend({}, widget_widget, {
    widgetname:"joinedlabel",
    init: function () {
        base=this;
        this.elements = $('div[data-type="'+this.widgetname+'"]');
        this.elements.each(function(index) {
            $(this).data('__device', $(this).data('device'));
            
            $(this).data('get', $(this).data('get') || 'STATE');
            if(! $.isArray($(this).data('get'))) {
                $(this).data('get', new Array($(this).data('get')));
            }
            for(var g=0; g<$(this).data('get').length; g++) {
                var get = $(this).data('get')[g];

                var device = $(this).data('device');
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
                $(this).data(reading, reading);
                // subscribe to the reading
                readings[reading] = true;
                
                // save the readings device
                $(this).data('_device'+g, device);
            }
            
            $(this).data('glue', $(this).data('glue') || ' ');
        });
    },
    
    update: function (dev,par) {
        base=this;
        var deviceElements= this.elements.filter('div[data-device="'+dev+'"]');
        deviceElements.each(function(index) {
            var get = $(this).data('get');
            var val = new Array();
            
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
                
                val[g] = '<span class="' + base.widgetname + '_get_' + g + '">' + value + '</span>';
            }

            $(this).empty();
            $(this).html(val.join($(this).data('glue')));
            $(this).data('device', $(this).data('__device'));
        });
    }
});