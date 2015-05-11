// idea by michiatlnx
// http://forum.fhem.de/index.php/topic,34233.msg281124.html#msg281124

if(typeof widget_volume == 'undefined') {
    loadplugin('widget_volume');
}

var widget_wind_direction = $.extend({}, widget_volume, {
    widgetname: 'wind_direction',
    init: function () {
        base=this;
        this.elements = $('div[data-type="'+this.widgetname+'"]');
        this.elements.each(function(index) {
            var knob_elem =  jQuery('<input/>', {
                type: 'text',
                value: '0',
                disabled : true,
            }).appendTo($(this));
            
            var device = $(this).data('device');
            $(this).data('direction', $(this).data('direction') || $(this).data('get') || 'wind_direction');
            $(this).data('speed', $(this).data('speed') || 'wind_speed');
            readings[$(this).data('direction')] = true;
            readings[$(this).data('speed')] = true;
            
            // height and width can't be different
            $(this).data('size', 1*$(this).attr('data-height')||1*$(this).attr('data-width')||1*$(this).attr('data-size')||150);
            if($(this).hasClass('small')) {
                $(this).data('size', 100);
            } else if($(this).hasClass('mini')) {
                $(this).data('size', 52);
            } else if($(this).hasClass('tiny')) {
                $(this).data('size', 12);
            }
            
            $(this).data('compass', {
                "N"     : 0    ,    // 360/16 * 0
                "NNO"   : 22.5 ,    // 360/16 * 1
                "NO"    : 45   ,    // 360/16 * 2
                "ONO"   : 67.5 ,    // 360/16 * 3
                "O"     : 90   ,    // 360/16 * 4
                "OSO"   : 112.5,    // ...
                "SO"    : 135  ,
                "SSO"   : 157.5,
                "S"     : 180  ,
                "SSW"   : 202.5,
                "SW"    : 225  ,
                "WSW"   : 247.5,
                "W"     : 270  ,
                "WNW"   : 292.5,
                "NW"    : 315  ,
                "NNW"   : 337.5,
                "N2"    : 360
            });
            
            knob_elem.knob({
                'min': 0,
                'max': 360,
                'height':$(this).data('size'),
                'width':$(this).data('size'),
                'angleOffset': $(this).attr('data-angleoffset')?$(this).attr('data-angleoffset')*1:0,
                'angleArc': 360,
                'bgColor': $(this).data('bgcolor') || 'transparent',
                'fgColor': $(this).data('fgcolor') || '#cccccc',
                'tkColor': $(this).data('tkcolor') || '#696969',
                'hdColor': $(this).data('hdcolor') || '#aa6900',
                'tiny': $(this).hasClass('tiny'),
                'thickness': $(this).hasClass('tiny')?0.5:0.25,
                'tickdistance': $(this).data('tickstep') || ($(this).hasClass('tiny')?90:45),
                'mode': 0,
                'cursor': $(this).hasClass('tiny')?18:6,
                'draw' : base.drawDial,
                'readOnly' : true,
                'change' : function (v) { 
                      startPollInterval();
                }
            });
        });
    },
    update: function (dev,par) {
        var deviceElements= this.elements.filter('div[data-device="'+dev+'"]');
        deviceElements.each(function(index) {
            if ( $(this).data('direction')==par || par =='*'){    
                var value = getDeviceValue( $(this), 'direction');
                var part = $(this).data('part') || $(this).data('direction-part') || -1;
                var val = getPart(value,part);

                var speed = getDeviceValue( $(this), 'speed');
                var speed_part = $(this).data('speed-part') || -1;
                speed = getPart(speed, part);
                
                var knob_elem = $(this).find('input');
                if (val) {
                    var compass = $(this).data('compass');

                    if(!$.isNumeric(val)) {
                        // if the reading is something like 'NNO', fetch it's numerical representation from compass
                        val = (val in compass?compass[val]:-1);
                    }
                    if ( knob_elem.val() != val ){
                        // set value and redraw 
                        knob_elem.val( val ).trigger('change');
                    }
                    if($(this).hasClass('tiny')) {
                        // don't display val in the middle of the widget
                        knob_elem.val('');
                    } else {
                        var valt='WTF';
                        if(val < 0) {
                            valt='ERR';
                            console.log(base.widgetname, ($(this).attr('data-device')?'('+$(this).attr('data-device')+')':'') + ': ' + getPart(value,part)+' is invalid');
                        } else if(!speed || speed==0) {
                            valt=$(this).data('calm')||'-';
                        } else {
                            if(!$(this).data('display-numeric')) {
                                // search compass for the literal representation to val
                                var ckeys=Object.keys(compass);
                                for(var k=0; k<ckeys.length; k++) {
                                    var key = ckeys[k];
                                    var kev = compass[key];
                                    // the compass is divided into 16 sections, which are split into 11,25 degrees before val and 11,25 degrees after val
                                    // iow: val is the middle of a 22,5 degree wide section of the compass
                                    if(val > kev - 360/32 && val <= kev + 360/32 ) {
                                        valt=key;
                                        break;
                                    }
                                }
                            } else {
                                valt = val;
                            }
                        }
                        knob_elem.val(valt=="N2"?"N":valt);
                    }
                }
                knob_elem.css({visibility:'visible'});
            }
        });
    }
});