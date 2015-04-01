function widget_button_clicked(target, type) {
    switch(type) {
        case 'url':
            document.location.href = target;
            break;
        case 'url-xhr':
            $.get(target) + '&XHR=1';
            break;
        case 'fhem-cmd':
            var fhem = $("meta[name='fhemweb_url']").attr("content") || "../fhem/";
            $.get(fhem + '?cmd='+ target +'&XHR=1');
            break;
    }
    return 1;
}

var widget_button = {
    _button: null,
    elements: null,
    init: function () {
        _button=this;
        _button.elements = $('div[data-type="button"]');
        _button.elements.each(function(index) {
            var device = $(this).data('device');
            $(this).data('get', $(this).data('get') || 'STATE');
            $(this).data('get-on', $(this).attr('data-get-on') || 'on');
            $(this).data('get-off', $(this).attr('data-get-off') || 'off');
            
            var elem = $(this).famultibutton({
                icon: 'fa-check-circle',
                backgroundIcon: 'fa-circle',
                onBackgroundColor:$(this).data('color')||'#aa6900',
                offBackgroundColor:$(this).data('offcolor')||'#505050',
                offColor: '#2A2A2A',
                onColor: '#2A2A2A',
            
                // Called in toggle on state.
                toggleOn: function( ) {
                    if($(this).attr('data-url')) {
                        widget_button_clicked($(this).attr('data-url'), 'url');
                    } else if($(this).attr('data-url-xhr')) {
                        widget_button_clicked($(this).attr('data-url-xhr'), 'url-xhr');
                    } else if($(this).attr('data-fhem-cmd')) {
                        widget_button_clicked($(this).attr('data-fhem-cmd'), 'fhem-cmd');
                    }
                    setInterval(function() {elem.setOff()}, 200);
                },
                toggleOff: function( ) {
                    if($(this).attr('data-url')) {
                        widget_button_clicked($(this).attr('data-url'), 'url');
                    } else if($(this).attr('data-url-xhr')) {
                        widget_button_clicked($(this).attr('data-url-xhr'), 'url-xhr');
                    } else if($(this).attr('data-fhem-cmd')) {
                        widget_button_clicked($(this).attr('data-fhem-cmd'), 'fhem-cmd');
                    }
                    setInterval(function() {elem.setOn()}, 200);
                },
            });
            if(! $(this).data('device')) {
                elem.setOn();
            }
        });
    },
  
    update: function (dev,par) {
        var deviceElements;
        if ( dev == '*' )
            deviceElements= _button.elements;
        else
            deviceElements= _button.elements.filter('div[data-device="'+dev+'"]');
        
        deviceElements.each(function(index) {
            if ( $(this).data('get')==par || par =='*'){    
                if(! $(this).data('device')) {
                    $(this).data('famultibutton').setOn();
                } else {
                    var value = getDeviceValue( $(this), 'get' );
                    var part =  $(this).data('part') || -1;
				    var state = getPart(value,part);
                    if (state) {
                        if ( state == $(this).data('get-on') ) {
                            $(this).data('famultibutton').setOn();
                        } else if ( state == $(this).data('get-off') ) {
                            $(this).data('famultibutton').setOff();
                        }else if ( state.match(RegExp('^' + $(this).data('get-on') + '$')) ) {
                            $(this).data('famultibutton').setOn();
                        } else if ( state.match(RegExp('^' + $(this).data('get-off') + '$')) ) {
                            $(this).data('famultibutton').setOff();
                        }
                    }
                }
            }
        });
    }       
};
