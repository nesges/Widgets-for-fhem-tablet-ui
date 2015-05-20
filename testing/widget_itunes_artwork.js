if(typeof widget_image == 'undefined') {
    dynamicload('js/widget_image.js');
}

var widget_itunes_artwork = $.extend({}, widget_image, {
    widgetname: 'itunes_artwork',
    init_attr: function(elem) {
        elem.data('get',        elem.data('get')        || 'STATE');
        // data-get is an array
        if(! $.isArray(elem.data('get'))) {
            // ..like it or lump it
            elem.data('get', new Array(elem.data('get')));
        }
        // create a data-var for each field of the get-array and subscribe to it's update events
        for(var g=0; g<elem.data('get').length; g++) {
            var get = elem.data('get')[g];
            elem.data(get, get);
            readings[get] = true;
            console.log(this.widgetname, 'init_attr', get);
        }
        
        elem.data('opacity',    elem.data('opacity')    || 1);
        elem.data('size',       elem.data('size')       || 150);
        elem.data('height',     elem.data('size'));
        elem.data('width',      elem.data('size'));
        elem.data('media',      elem.data('media')      || 'music');
        elem.data('entity',     elem.data('entity')     || 'song');
<<<<<<< HEAD
        elem.data('pxratio',    elem.data('pxratio')    || 1);
=======
>>>>>>> dd691a37701d0ec446d7d57b77f9a7bbe9fa3ebd
        elem.data('timeout',    elem.data('timeout')    || 3000);
        elem.data('loadingimg', elem.data('loadingimg') || 'http://vignette1.wikia.nocookie.net/knightsanddragons/images/c/c2/Peanut-butter-jelly-time.gif/revision/latest?cb=20140709170448'); // remember to change this
        elem.data('url',        elem.data('url'));
        elem.data('refresh',    elem.data('refresh')    || 15*60);
        
        elem.find('img').attr('src', elem.data('loadingimg'));
    },
    update_value_cb : function(value) {
        if(value && value.match(/^\d\d\d\d-\d\d-\d\d \d\d:\d\d:\d\d$/)) {
            return '';
        }
        return value;
    },
    itunes: function (elem, val) {
        console.log(this.widgetname, 'itunes.start', val);
        $.ajax({
            url: "https://itunes.apple.com/search",
            dataType: "jsonp",
            data: {
                term:       val.join(' '),
                media:      elem.data('media'),
                entity:     elem.data('entity'),
            },
            base:           this,
            size:           elem.data('size'),
<<<<<<< HEAD
            pxratio:        elem.data('pxratio'),
=======
>>>>>>> dd691a37701d0ec446d7d57b77f9a7bbe9fa3ebd
            img:            elem.find('img'),
            timeout:        elem.data('timeout'),
            beforeSend: function(jqXHR, settings) {
                jqXHR.url = settings.url;
            },
            error: function (jqXHR, textStatus, message) {
                console.log(this.base.widgetname, 'itunes.error', textStatus, message, jqXHR.url);
            },
            success: function (data, textStatus, jqXHR) {
                if($.isArray(data.results) && data.results[0] && data.results[0].artworkUrl100) {
                    var artwork;
                    if(this.size <=60) {
                        artwork = data.results[0].artworkUrl60;
                    } else {
                        artwork = data.results[0].artworkUrl100;
                    }
                    if(artwork) {
<<<<<<< HEAD
                        artwork = artwork.replace(/100x100/, (this.size*this.pxratio)+'x'+(this.size*this.pxratio));
=======
                        artwork = artwork.replace(/100x100/, this.size+'x'+this.size);
>>>>>>> dd691a37701d0ec446d7d57b77f9a7bbe9fa3ebd
                        this.img.attr('src', artwork);
                        console.log(this.base.widgetname, 'itunes.artwork', artwork);
                    } else {
                        console.log(this.base.widgetname, 'itunes.artwork', '-');
                    }
                } else {
                    console.log(this.base.widgetname, 'itunes.results', '-');
                    if(val.length>1) {
                        val.pop();
                        this.base.itunes(elem, val);
                    }
                }
            },
        });
    },
    update: function (dev,par) {
        base = this;
        var deviceElements = this.elements.filter('div[data-device="'+dev+'"]');
        deviceElements.each(function(index) {
<<<<<<< HEAD
            var get = $(this).data('get');
            // check if par is of interest to this device
            var parok=false;
=======
            var done=0;
			var get = $(this).data('get');
            var val = new Array();
>>>>>>> dd691a37701d0ec446d7d57b77f9a7bbe9fa3ebd
            for(var g=0; g<get.length; g++) {
                if(par == get[g]) {
                    parok = true;
                    break;
                }
            }
<<<<<<< HEAD
            if(parok) {
                var done=0;
                var val = new Array();
                for(var g=0; g<get.length; g++) {
                    // get all readings
                    val[g] = getDeviceValue($(this), get[g]);
                    
                    // count read values
                    if(val[g]) {
                        done++;
                    }
                }
                
                // fetch coverimage after all readings are read
                if(val.length == done && ! $(this).data('updateinprogress')) {
			        // try to make it behave
			        $(this).data('updateinprogress', true);
			        // delete timestamp values (workarroud for list-bug in requestFhem)
			        for(var g=0; g<get.length; g++) {
			            val[g] = base.update_value_cb(val[g]);
			        }
                    console.log(base.widgetname, 'update', get, val);
			        $(this).find('img').attr('src', $(this).data('loadingimg'));
			        base.itunes($(this), val);
                }
                $(this).data('updateinprogress', false);
            } else {
                //console.log(base.widgetname, 'ignoring', par, get);
=======
            
            // fetch coverimage after all readings are read
            if(val.length == done && ! $(this).data('updateinprogress')) {
			    // try to make it behave a little
			    $(this).data('updateinprogress', true);
			    // delete timestamp values (workarroud for list-bug in requestFhem)
			    for(var g=0; g<get.length; g++) {
			        val[g] = base.update_value_cb(val[g]);
			    }
                console.log(base.widgetname, 'update', get, val);
			    $(this).find('img').attr('src', $(this).data('loadingimg'));
			    base.itunes($(this), val);
>>>>>>> dd691a37701d0ec446d7d57b77f9a7bbe9fa3ebd
            }
            $(this).data('updateinprogress', false);
	    });
    }
});

// https://www.apple.com/itunes/affiliates/resources/documentation/itunes-store-web-service-search-api.html
