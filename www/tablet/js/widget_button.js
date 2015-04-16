var widget_button = {
    widgetname : 'button',
    clicked: function(target, type) {
        // this code may be harmfull if target must contain urlencoded parts.
        // but it shouldn't since it checks for unencoded chars first
        // anyways it should be removed after a while
        if(target.match(/[{ }?\&$§"',;:#]/)) {
            // definitely not urlencoded
        } else if(target.match(/%(7B|7D|20|3F)/)) {
            // probably urlencoded
            _target = decodeURIComponent(target);
            console.log('widget_button: urlencoding the target of '+type+' is deprecated. decoding '+target+' to '+_target);
            target = _target;
        }

        switch(type) {
            case 'url':
                document.location.href = target;
                break;
            case 'url-xhr':
                $.get(target);
                break;
            case 'fhem-cmd':
                setFhemStatus(target);
                break;
        }
    },
    init: function () {
        base = this;
        this.elements = $('div[data-type="'+this.widgetname+'"]');
        this.elements.each(function(index) {
            var device = $(this).data('device');
            $(this).data('get', $(this).data('get') || 'STATE');
            $(this).data('get-on', $(this).attr('data-get-on') || 'on');
            $(this).data('get-off', $(this).attr('data-get-off') || 'off');
            
            if($(this).attr('data-color') || $(this).attr('data-offcolor')) {
                console.log('Attributes data-color/data-offcolor are deprecated in widget "'+this.widgetname+'" on ' + document.location 
                    + ($(this).attr('data-device')?' device: '+$(this).attr('data-device'):'')
                    + ($(this).attr('data-url')?' url: '+$(this).attr('data-url'):'')
                    + ($(this).attr('data-url-xhr')?' url-xhr: '+$(this).attr('data-url-xhr'):'')
                    + ($(this).attr('data-fhem-cmd')?' fhem-cmd: '+$(this).attr('data-fhem-cmd'):'')
                    + ' use any of data-on-color, data-off-color, data-on-background-color, data-off-background-color instead'
                );
            }
            var elem = $(this).famultibutton({
                icon: 'fa-check-circle',
                backgroundIcon: 'fa-circle',
                onBackgroundColor:($(this).attr('data-color')?$(this).data('color'):'#aa6900'),
                offBackgroundColor:($(this).attr('data-offcolor')?$(this).data('offcolor'):'#505050'),
                offColor: '#2A2A2A',
                onColor: '#2A2A2A',
            
                // Called in toggle on state.
                toggleOn: function( ) {
                    if($(this).attr('data-url')) {
                        widget_button.clicked($(this).attr('data-url'), 'url');
                    } else if($(this).attr('data-url-xhr')) {
                        widget_button.clicked($(this).attr('data-url-xhr'), 'url-xhr');
                    } else if($(this).attr('data-fhem-cmd')) {
                        widget_button.clicked($(this).attr('data-fhem-cmd'), 'fhem-cmd');
                    }
                    setInterval(function() {elem.setOff()}, 200);
                },
                toggleOff: function( ) {
                    if($(this).attr('data-url')) {
                        widget_button.clicked($(this).attr('data-url'), 'url');
                    } else if($(this).attr('data-url-xhr')) {
                        widget_button.clicked($(this).attr('data-url-xhr'), 'url-xhr');
                    } else if($(this).attr('data-fhem-cmd')) {
                        widget_button.clicked($(this).attr('data-fhem-cmd'), 'fhem-cmd');
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
        var deviceElements= this.elements.filter('div[data-device="'+dev+'"]');
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
                        } else if ( state.match(RegExp('^' + $(this).data('get-on') + '$')) ) {
                            $(this).data('famultibutton').setOn();
                        } else if ( state.match(RegExp('^' + $(this).data('get-off') + '$')) ) {
                            $(this).data('famultibutton').setOff();
                        } else if ( $(this).data('get-off')=='!on' && state != $(this).data('get-on') ) {
					        $(this).data('famultibutton').setOff();
                        } else if ( $(this).data('get-on')=='!off' && state != $(this).data('get-off') ) {
                            $(this).data('famultibutton').setOn();
                        }
                    }
                }
            }
        });
    }       
};
