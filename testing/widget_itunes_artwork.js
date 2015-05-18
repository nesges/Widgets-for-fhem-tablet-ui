if(typeof widget_image == 'undefined') {
    dynamicload('js/widget_image.js');
}

var widget_itunes_artwork = $.extend({}, widget_image, {
    widgetname: 'itunes_artwork',
    update: function (dev,par) {
        var deviceElements = this.elements.filter('div[data-device="'+dev+'"]');
        deviceElements.each(function(index) {
            var img = $(this).find('img');
            if ( $(this).data('get')==par) {
			    var value = getDeviceValue( $(this), 'get' );
			    
			    $.ajax({
                    "url": "https://itunes.apple.com/search",
                    "dataType": "jsonp",
                    "data": {
                        "term": value,
                        "media": "music",
                        "entity": "album",
                    },
                    "error": function (jqXHR, textStatus, message) {
                        console.log(message);
                    },
                    "success": function (data, textStatus, jqXHR) {
                        if($.isArray(data.results) && data.results[0] && data.results[0].artworkUrl100) {
                            var artwork = data.results[0].artworkUrl100;
                            if(artwork) {
			                    console.log(artwork);
			                    img.attr('src', artwork);
			                }
			            }
                    }
                });
            }
	    });
    }
});