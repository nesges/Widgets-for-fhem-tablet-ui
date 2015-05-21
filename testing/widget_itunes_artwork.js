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
        
        // reading and reading-value that say "Player has stopped"
        elem.data('get-stopped',        elem.data('get-stopped')        || 'STATE');
        elem.data('get-stopped-value',  elem.data('get-stopped-value')  || 'stop');
        readings[elem.data('get-stopped')] = true;
        
        elem.data('opacity',    elem.data('opacity')    || 1);
        elem.data('size',       elem.data('size')       || 150);
        elem.data('height',     elem.data('size'));
        elem.data('width',      elem.data('size'));
        elem.data('media',      elem.data('media')      || 'music');
        elem.data('entity',     elem.data('entity')     || 'song');
        elem.data('timeout',    elem.data('timeout')    || 3000);
        elem.data('loadingimg', elem.data('loadingimg') || 'http://vignette1.wikia.nocookie.net/knightsanddragons/images/c/c2/Peanut-butter-jelly-time.gif/revision/latest?cb=20140709170448'); // remember to change this
        elem.data('stoppedimg', elem.data('stoppedimg') || 'http://upload.wikimedia.org/wikipedia/commons/7/7b/Canada_Stop_sign.svg'); // remember to change this
        elem.data('notfoundimg',elem.data('notfoundimg')|| 'http://www.dyadmusic.co.uk/wp-content/uploads/2014/01/UnknownCopyrightLicence.png'); // remember to change this
        
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
            elem:           elem,
            val:            val,
            size:           elem.data('size'),
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
                        var pxratiosize = window.devicePixelRatio*this.size;
                        artwork = artwork.replace(/100x100/, pxratiosize+'x'+pxratiosize);
                        
                        // recheck readings, they might have changed in the meantime; this is to handle race conditions
                        //var termsok=true;
                        //var get = elem.data('get');
                        //var reval = new Array();
                        //for(var t=0; t<this.val.length; t++) {
                        //    reval[t] = getDeviceValue(this.elem, get[t]);
                        //    reval[t] = base.update_value_cb(reval[t]);
                        //    if(this.val[t] != reval[t]) {
                        //        termsok = false;
                        //        console.log(this.base.widgetname, 'itunes.termsnotok', this.val[t], reval[t]);
                        //        break;
                        //    }
                        //}
                        //if(termsok) {
                            this.img.attr('src', artwork);
                            console.log(this.base.widgetname, 'itunes.artwork', artwork);
                        //} else {
                        //    //this.img.attr('src', this.elem.data('notfoundimg'));
                        //    console.log(this.base.widgetname, 'ITUNES.OUTDATED', artwork, this.val.join(','), reval.join(','));
                        //    // ..and give it another spin with reval
                        //    this.base.itunes(elem, reval);
                        //}
                    } else {
                        console.log(this.base.widgetname, 'itunes.artwork', '-');
                    }
                } else {
                    // no results found for our search terms
                    console.log(this.base.widgetname, 'itunes.results', '-');
                    this.img.attr('src', this.elem.data('notfoundimg'));
                    // ..shorten the terms by 1 and try again until only one term is left
                    if(val.length>1) {
                        this.val.pop();
                        this.base.itunes(elem, this.val);
                    }
                }
            },
        });
    },
    update: function (dev,par) {
        base = this;
        var deviceElements = this.elements.filter('div[data-device="'+dev+'"]');
        deviceElements.each(function(index) {
            // is the music player stopped?
            var valStopped = getDeviceValue($(this), 'get-stopped');
            if(valStopped == $(this).data('get-stopped-value')) {
                $(this).find('img').attr('src', $(this).data('stoppedimg'));
                console.log(base.widgetname, 'stopped', $(this).data('get-stopped'), valStopped);
            } else {
                var get = $(this).data('get');
                // check if par is of interest to this device
                var parok=false;
                for(var g=0; g<get.length; g++) {
                    if(par == get[g]) {
                        parok = true;
                        break;
                    }
                }

                if(parok && ! $(this).data('updateinprogress')) {
                    $(this).data('updateinprogress', true);
                    // there's a timing issue with readings updates in MPD
                    var timedUpdate = setTimeout($.proxy(function() {
                        base = widget_itunes_artwork; // this shouldn't be necessary -> get rid of it
                        var get = $(this).data('get');
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
                        //
                        //// fetch coverimage after all readings are read
                        if(val.length == done) {
			                // delete timestamp values (workarroud for list-bug in requestFhem)
			                for(var g=0; g<get.length; g++) {
			                    val[g] = base.update_value_cb(val[g]);
			                }
                            console.log(base.widgetname, 'update', get, val);
			                $(this).find('img').attr('src', $(this).data('loadingimg'));
			                base.itunes($(this), val);
                        }
                        
                        $(this).data('updateinprogress', false);
                    }, this), 300);
                } else {
                    // console.log(base.widgetname, 'ignoring', par);
                }
            }       
	    });         
    }               
});                 
                    
// https://www.apple.com/itunes/affiliates/resources/documentation/itunes-store-web-service-search-api.html
                    
                    
                    