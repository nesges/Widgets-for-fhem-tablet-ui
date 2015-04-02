// idea by michiatlnx
// http://forum.fhem.de/index.php/topic,34233.msg281124.html#msg281124

var widget_wind_direction = {
    _wind_direction: null,
    elements: null,
    drawDial: function () {
        var c = this.g, // context
        a = this.arc(this.cv), // Arc
        r = 1;
        
        c.lineWidth = this.lineWidth;
        c.lineCap = this.lineCap;
        if (this.o.bgColor !== "none") {
            c.beginPath();
            c.strokeStyle = this.o.bgColor;
            c.arc(this.xy, this.xy, this.radius, this.endAngle - 0.00001, this.startAngle + 0.00001, true);
            c.stroke();
        }
        
        var tick_w = (2 * Math.PI) / 360;
        var step =  (this.o.max - this.o.min) / this.angleArc;
        var acAngle = ((this.o.isValue - this.o.min) / step) + this.startAngle;
        var dist = this.o.tickdistance || 4;
        
        // draw ticks
        for (tick = this.startAngle; tick < this.endAngle + 0.00001; tick+=tick_w*dist) {
            i = step * (tick-this.startAngle)+this.o.min;
            c.beginPath();
            // draw normal ticks
            c.strokeStyle = this.o.tkColor;
            w = tick_w;
            w *= (c.strokeStyle != this.o.tkColor) ? 2 : (this.o.tiny?6:1);
            c.arc( this.xy, this.xy, this.radius, tick, tick+w , false);
            c.stroke();
        }
        
        // draw selection cursor
        c.beginPath();
            
        c.strokeStyle = this.o.hdColor;
        c.lineWidth = this.lineWidth * 2;
        c.arc(this.xy, this.xy, this.radius-this.lineWidth/2, a.s, a.e, a.d);
        c.stroke();

        return false;
    },
    init: function () {
        _wind_direction=this;
        _wind_direction.elements = $('div[data-type="wind_direction"]');
        _wind_direction.elements.each(function(index) {
            var knob_elem =  jQuery('<input/>', {
                type: 'text',
                value: '0',
                disabled : true,
            }).appendTo($(this));
            
            var device = $(this).data('device');
            $(this).data('get', $(this).data('get') || 'STATE');
            readings[$(this).data('get')] = true;
            
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
                'draw' : _wind_direction.drawDial,
                'readOnly' : true,
                'change' : function (v) { 
                      startInterval();
                }
            });
        });
    },
    update: function (dev,par) {
        var deviceElements;
        if ( dev == '*' )
            deviceElements= _wind_direction.elements;
        else
            deviceElements= _wind_direction.elements.filter('div[data-device="'+dev+'"]');
        
        deviceElements.each(function(index) {
            if ( $(this).data('get')==par || par =='*'){    
                var value = getDeviceValue( $(this), 'get');
                var part =  $(this).data('part') || -1;
				var val = getPart(value,part);
                
                var knob_elem = $(this).find('input');
                if (val) {
                    var compass = $(this).data('compass');

                    if(!$.isNumeric(val)) {
                        // if the reading ist something like 'NNO', fetch it's numerical representation from compass
                        val = compass[val]||0;
                    }
                    if ( knob_elem.val() != val ){
                        knob_elem.val( val ).trigger('change');
                        if($(this).hasClass('tiny')) {
                            // don't display val in the middle of the widget
                            knob_elem.val('');
                        } else {
                            // search compass for the literal representation to val
                            var ckeys=Object.keys(compass);
                            var valt='WTF';
                            for(var k=0; k<ckeys.length; k++) {
                                var key = ckeys[k];
                                var kev = compass[key];
                                // the compass is divided into 16 section, which are split into 11,25 degrees before val and 11,25 degrees after val
                                // iow: val is in the middle of a 22,5 degree wide section of the compass
                                if(val > kev - 360/32 && val <= kev + 360/32 ) {
                                    valt=key;
                                    break;
                                }
                            }
                            knob_elem.val(valt=="N2"?"N":valt);
                        }
                    }   
                }
                knob_elem.css({visibility:'visible'});
            }
        });
    }
};
