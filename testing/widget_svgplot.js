if(typeof widget_image == 'undefined') {
    loadplugin('widget_image');
}

var widget_svgplot = $.extend({}, widget_image, {
    widgetname : 'svgplot',
    init: function () {
        var base=this;
        this.elements = $('div[data-type="'+this.widgetname+'"]');
        this.elements.each(function(index) {
            readings['+GPLOTFILE']=true;
            readings['+LOGDEVICE']=true;
            readings['+LOGFILE']=true;
            
            var spinner = $('<div />').appendTo($(this));
            spinner.famultibutton({
                mode: 'signal',
                icon: 'fa-spinner fa-spin',
                backgroundIcon: null,
                offColor: '#aa6900',
            });
        });
    },
    update: function (dev,par) {
        var deviceElements= this.elements.filter('div[data-device="'+dev+'"]');
        var base=this;
	    deviceElements.each(function(index) {
            var device = $(this).data('device');
            if(device && deviceStates[device]) {
                //var gplot = getDeviceValue( $(this), '+GPLOTFILE' );
                var gplot = deviceStates[device]['+GPLOTFILE']; 
                var logdev = deviceStates[device]['+LOGDEVICE'];
                var logfile = deviceStates[device]['+LOGFILE'];
                
                if(gplot && logdev && logfile) {
                    $(this).empty();
                    var src = '/fhem/SVG_showLog?dev='+device+'&logdev='+logdev.val+'&gplotfile='+gplot.val+'&logfile='+logfile.val;
                    var img =  $('<img/>', {
                        alt: base.widgetname,
                        src: src,
                    }).appendTo($(this));
                    img.css({
                        'height':'auto',
                        'width': '100%',
                    });
                }
            }
        });
    }
});