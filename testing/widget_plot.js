var widget_plot = {
  _plot: null,
  elements: null,
  init: function () {
  	_plot=this;
  	_plot.elements = $('div[data-type="plot"]');
 	_plot.elements.each(function(index) {
 	
	 	$(this).data('get', 'DEF');
	 	readings['DEF'] = true;
		var elem =  jQuery('<img/>', {
				alt: 'img',
			}).appendTo($(this));
		elem.css({'height':'auto',
				'width': '100%',
				'max-width': $(this).data('size') || '50%',
		});
	});
  },
  update: function (dev,par) {

	var deviceElements;
	if ( dev == '*' )
		deviceElements= _plot.elements;
	else
   		deviceElements= _plot.elements.filter('div[data-device="'+dev+'"]');

	deviceElements.each(function(index) {
		
		if ( $(this).data('get')==par || par =='*'){	
			var value = getDeviceValue( $(this), 'get' );
			console.log(value);
			if (value){
				var img = $(this).find('img');
				if (img)
					var fhem = $("meta[name='fhemweb_url']").attr("content") || "../fhem/";
					var v= value.split(':');
					var device = $(this).data('device');
					var logdev = v[0];
					var gplot = v[1];
					var logfile = v[2];

					imgurl = fhem + 'SVG_showLog?dev=' + device + '&logdev=' + logdev + '&gplotfile=' + gplot + '&logfile='+logfile+'&pos=';
					
					console.log(imgurl);
                    img.attr('src', imgurl);
			 }
		}
	});
   }
			 
};