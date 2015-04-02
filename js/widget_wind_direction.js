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
                var val = getDeviceValue( $(this), 'get' );
                var knob_elem = $(this).find('input');
                if (val){
                    if ( knob_elem.val() != val ){
                        knob_elem.val( val ).trigger('change');
                        if($(this).hasClass('tiny')) {
                            knob_elem.val('');
                        } else {
                            var valt='';
                            if(val < 23+45*0) {
                                valt='N'
                            } else if(val < 23+45*1) {
                                valt='NO'
                            } else if(val < 23+45*2) {
                                valt='O'
                            } else if(val < 23+45*3) {
                                valt='SO'
                            } else if(val < 23+45*4) {
                                valt='S'
                            } else if(val < 23+45*5) {
                                valt='SW'
                            } else if(val < 23+45*6) {
                                valt='W'
                            } else if(val < 23+45*7) {
                                valt='NW'
                            } else if(val < 23+45*8) {
                                valt='N'
                            } else {
                                valt='WTF';
                            }
                            knob_elem.val(valt);
                        }
                    }   
                }
                knob_elem.css({visibility:'visible'});
            }
        });
    }
};
