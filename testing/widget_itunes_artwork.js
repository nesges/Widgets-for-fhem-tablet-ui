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
        }
        
        elem.data('opacity',    elem.data('opacity')    || 1);
        elem.data('size',       elem.data('size')       || 150);
        elem.data('height',     elem.data('size'));
        elem.data('width',      elem.data('size'));
        elem.data('media',      elem.data('media')      || 'music');
        elem.data('entity',     elem.data('entity')     || 'song');
        elem.data('url',        elem.data('url'));
        elem.data('refresh',    elem.data('refresh')    || 15*60);
    },
    update_value_cb : function(value) {
        if(value && value.match(/^\d\d\d\d-\d\d-\d\d \d\d:\d\d:\d\d$/)) {
            return '';
        }
        return value;
    },
    update: function (dev,par) {
        base = this;
        var deviceElements = this.elements.filter('div[data-device="'+dev+'"]');
        deviceElements.each(function(index) {
            var img = $(this).find('img');

            var done=0;
			var get = $(this).data('get');
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
            if(val.length == done) {
			    // delete timestamp values (workarroud for list-bug in requestFhem)
			    for(var g=0; g<get.length; g++) {
			        val[g] = base.update_value_cb(val[g]);
			    }

			    $.ajax({
                    url: "https://itunes.apple.com/search",
                    dataType: "jsonp",
                    data: {
                        term:     val.join(' '),
                        media:    $(this).data('media'),
                        entity:   $(this).data('entity'),
                    },
                    size: $(this).data('size'),
                    error: function (jqXHR, textStatus, message) {
                        console.log(message);
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
			                    artwork = artwork.replace(/100x100/, this.size+'x'+this.size);
			                    console.log(artwork);
			                    img.attr('src', artwork);
			                }
			            }
                    },
                });
            }
	    });
    }
});

// https://www.apple.com/itunes/affiliates/resources/documentation/itunes-store-web-service-search-api.html