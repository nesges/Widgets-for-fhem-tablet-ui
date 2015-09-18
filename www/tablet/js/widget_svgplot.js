if(typeof widget_image == 'undefined') {
    loadplugin('widget_image');
}

var widget_svgplot = $.extend({}, widget_image, {
    widgetname : 'svgplot',
    init_attr: function(elem) {
        elem.data('gplotfile', elem.data('gplotfile')   || elem.data('device'));
        elem.data('logdevice', elem.data('logdevice')   || '');
        elem.data('logfile',   elem.data('logfile')     || 'CURRENT');
        elem.data('refresh',   elem.data('refresh')     || 300);
    },
    init: function () {
        this.elements = $('div[data-type="'+this.widgetname+'"]');
        this.elements.each(function(index) {
            widget_svgplot.init_attr($(this));

            var spinner = $('<div />').appendTo($(this));
            spinner.famultibutton({
                mode: 'signal',
                icon: 'fa-spinner fa-spin',
                backgroundIcon: null,
                offColor: '#aa6900',
            });
            
            var device = $(this).data('device');
            var gplot = $(this).data('gplotfile');
            var logdev = $(this).data('logdevice');
            var logfile = $(this).data('logfile');
            
            if(gplot && logdev && logfile) {
                $(this).empty();
                var fhemweb = $("meta[name='fhemweb_url']").attr("content") || "/fhem";
                var src = fhemweb + '/SVG_showLog?dev='+device+'&logdev='+logdev+'&gplotfile='+gplot+'&logfile='+logfile+'&_=1';
                var img =  $('<img/>', {
                    alt: logfile,
                    src: src,
                }).appendTo($(this));
                img.css({
                    'height':'auto',
                    'width': '100%',
                });

                var refresh = $(this).data('refresh');
                var counter=0;
                setInterval(function() {
                        counter++;
                        if(counter == refresh) {
                            counter = 0;
                            var src = img.attr('src')
                            if(src.match(/_=\d+/)) {
                                src = widget_image.addurlparam(src, '_', new Date().getTime());
                            }
                            img.attr('src', src);
                        }
                    }, 1000);
            }
        });
    },
    update: function (dev,par) {
    }
});