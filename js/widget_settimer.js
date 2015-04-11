var widget_settimer = {
    _settimer: null,
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
            c.strokeStyle = this.o.tkColor;//'#4477ff';
            
            w = tick_w;
            w *= (c.strokeStyle != this.o.tkColor) ? 2 : 1;
                
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
        _settimer=this;
        _settimer.elements = $('div[data-type="settimer"]');
        _settimer.elements.each(function(index) {
            var device = $(this).data('device');
            $(this).data('get', $(this).data('get') || 'STATE');
            readings[$(this).data('get')] = true;
            
            $(this).data('cmd', $(this).data('cmd')||'set');
            $(this).data('set', $(this).data('set')||$(this).data('get'));
            $(this).data('off', $(this).data('off')||'off');

            
            var container = $('<div style="position:relative"/>').appendTo($(this));
            
            var buttons = $('<div style="position:absolute;top:0;right:0" class="widget_settimer_buttons" />').appendTo(container);
            var button_set = $('<div class="widget_settimer_set" style="display:block" />').appendTo(buttons);
            var button_off = $('<div class="widget_settimer_off" style="display:block" />').appendTo(buttons);
            
            var knobs = $('<div style="position:absolute;top:0;left:0" class="widget_settimer_knobs" />').appendTo(container);
            var knob_hour_wrap = $('<div class="widget_settimer_hour_wrap" style="display:inline;margin-right:10px !important" />').appendTo(knobs);
            var knob_hour = $('<input class="widget_settimer_hour" />', {
                type: 'text',
                value: $(this).attr('data-initvalue')||'0',
                disabled : true,
            }).appendTo(knob_hour_wrap);
            
            var knob_min_wrap = $('<div class="widget_settimer_hour_wrap" style="display:inline;margin-left:10px !important" />').appendTo(knobs);
            var knob_min = $('<input class="widget_settimer_minute" />', {
                type: 'text',
                value: $(this).attr('data-initvalue')||'0',
                disabled : true,
            }).appendTo(knob_min_wrap);
            
            
            knob_hour.knob({
                'min': 0,
                'max': 23,
                'lastValue': 0,
                'height':120,
                'width':120,
                'angleOffset': $(this).attr('data-angleoffset')?$(this).attr('data-angleoffset')*1:-120,
                'angleArc': $(this).attr('data-anglearc')?$(this).attr('data-anglearc')*1:240,
                'bgColor': $(this).data('bgcolor') || 'transparent',
                'fgColor': $(this).data('fgcolor') || '#cccccc',
                'tkColor': $(this).data('tkcolor') || '#696969',
                'hdColor': $(this).data('hdcolor') || '#aa6900',
                'thickness': .25,
                'tickdistance': 20,
                'cursor': 6,
                'touchPosition': 'left',
                'draw' : _settimer.drawDial,
                'readOnly' : $(this).hasClass('readonly'),
            });
            knob_min.knob({
                'min': 0,
                'max': 59,
                'lastValue': 0,
                'height':120,
                'width':120,
                'angleOffset': $(this).attr('data-angleoffset')?$(this).attr('data-angleoffset')*1:-120,
                'angleArc': $(this).attr('data-anglearc')?$(this).attr('data-anglearc')*1:240,
                'bgColor': $(this).data('bgcolor') || 'transparent',
                'fgColor': $(this).data('fgcolor') || '#cccccc',
                'tkColor': $(this).data('tkcolor') || '#696969',
                'hdColor': $(this).data('hdcolor') || '#aa6900',
                'thickness': .25,
                'tickdistance': 10,
                'cursor': 6,
                'touchPosition': 'left',
                'draw' : _settimer.drawDial,
                'readOnly' : $(this).hasClass('readonly'),
            });
            
            button_set.famultibutton({
                backgroundIcon: 'fa-circle',
                offBackgroundColor: '#aa6900',
                icon: 'fa-clock-o',
                offColor: '#2a2a2a',
                mode: 'push', 
                // Called in toggle on state.
                toggleOn: function( ) {
                    var parent = $(this).parents('div[data-type="settimer"]');
                    var knob_hour = parent.find('input[class=widget_settimer_hour]');
                    var knob_min = parent.find('input[class=widget_settimer_minute]');
                    var hour = knob_hour.val();
                    var min = knob_min.val();
                    
                    hour = hour<10?'0'+hour:hour;
                    min = min<10?'0'+min:min;
                    
                    var v = hour+':'+min;
                    if(hour==parent.data('off') || min==parent.data('off') ) {
                        v = parent.data('off');
                    }

                    var cmd = [parent.data('cmd'), device, parent.data('set'), v].join(' ');
                    setFhemStatus(cmd);
                    if( device && typeof device != "undefined") {
                        TOAST && $.toast(cmd);
                    }
                },
            });
            
            button_off.famultibutton({
                backgroundIcon: 'fa-circle',
                icon: 'fa-power-off',
                mode: 'push', 
                // Called in toggle on state.
                toggleOn: function( ) {
                    var parent = $(this).parents('div[data-type="settimer"]');
                    var cmd = [parent.data('cmd'), device, parent.data('set'), parent.data('off')].join(' ');
                    console.log(cmd);
                    setFhemStatus(cmd);
                    if( device && typeof device != "undefined") {
                        TOAST && $.toast(cmd);
                    }
                },
            });
        });
    },
    update: function (dev,par) {
        var deviceElements;
        if ( dev == '*' )
            deviceElements= _settimer.elements;
        else
            deviceElements= _settimer.elements.filter('div[data-device="'+dev+'"]');
        
        deviceElements.each(function(index) {
            if ( $(this).data('get')==par || par =='*'){    
                var val = getDeviceValue( $(this), 'get' );
                var knob_hour = $(this).find('input[class=widget_settimer_hour]');
                var knob_min = $(this).find('input[class=widget_settimer_minute]');
                if (val){
                    var v = val.split(':');
                    var hour = v[0];
                    var min = v[0]=='off'?v[0]:v[1];
                    
                    if ( knob_hour.val() != hour ){
                        knob_hour.val( hour ).trigger('change');
                        knob_hour.val( hour );
                    }
                    if ( knob_min.val() != min ){
                        knob_min.val( min ).trigger('change');
                        knob_min.val( min );
                    }
                }
                knob_hour.css({visibility:'visible'});
                knob_min.css({visibility:'visible'});
            }
        });
    }           
};
