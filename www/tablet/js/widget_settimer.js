if(typeof widget_volume == 'undefined') {
    loadplugin('widget_volume');
}

var widget_settimer = $.extend({}, widget_volume, {
    widgetname: 'settimer',
    init: function () {
        base=this;
        this.elements = $('div[data-type="'+this.widgetname+'"]');
        this.elements.each(function(index) {
            var device = $(this).data('device');
            $(this).data('get',             $(this).data('get')             || $(this).data('reading') || 'STATE');
            $(this).data('set',             $(this).data('reading'));
            $(this).data('cmd',             $(this).data('cmd')             || ($(this).data('reading')?'setreading':'set'));
            $(this).data('set-off',         $(this).data('set-off') || $(this).data('off') || 'off');
            $(this).data('running-get',     $(this).data('running-get')     || 'STATE');
            $(this).data('running-get-on',  $(this).data('running-get-on')  || 'running');
            $(this).data('running-blink',   $(this).data('running-blink')   || true);
            $(this).data('running-color',   $(this).data('running-color')   || '#0069aa');
            $(this).data('running-set-off', $(this).data('running-set-off') || $(this).data('set-off'));
            $(this).data('width',           ($(this).attr('data-width')?$(this).data('width'):($(this).hasClass('large')?520:380)));
            
            initReadingsArray($(this).data('running-get'));
            requestFhem($(this).data('running-get'));
            
            var container = $('<div style="position:relative;'+ ($.isNumeric($(this).data('width'))?'width:'+$(this).data('width')+'px':'') +';min-height:60px;" class="widget_'+base.widgetname+'_container"/>').appendTo($(this));
            
            var buttons = $('<div style="position:absolute;top:0;right:0;margin-top:5px;margin-right:25px" class="widget_'+base.widgetname+'_buttons" />').appendTo(container);
            var button_set = $('<div class="widget_'+base.widgetname+'_set" style="display:block" />').appendTo(buttons);
            var button_off = $('<div class="widget_'+base.widgetname+'_off" style="display:block" />').appendTo(buttons);
            
            var knobs = $('<div style="position:absolute;top:0;left:0;margin-top:5px;margin-left:20px" class="widget_'+base.widgetname+'_knobs" />').appendTo(container);
            var knob_hour_wrap = $('<div class="widget_'+base.widgetname+'_hour_wrap" style="display:inline;margin-right:10px !important" />').appendTo(knobs);
            var knob_hour = $('<input class="widget_'+base.widgetname+'_hour" />', {
                type: 'text',
                value: $(this).attr('data-initvalue')||'0',
                disabled : true,
            }).appendTo(knob_hour_wrap);

            var knob_min_wrap = $('<div class="widget_'+base.widgetname+'_hour_wrap" style="display:inline;margin-left:10px !important" />').appendTo(knobs);
            var knob_min = $('<input class="widget_'+base.widgetname+'_minute" />', {
                type: 'text',
                value: $(this).attr('data-initvalue')||'0',
                disabled : true,
            }).appendTo(knob_min_wrap);
            
            
            knob_hour.knob({
                'min': 0,
                'max': 23,
                'lastValue': 0,
                'height': $(this).hasClass('large')?180:120,
                'width': $(this).hasClass('large')?180:120,
                'angleOffset': $(this).attr('data-angleoffset')?$(this).attr('data-angleoffset')*1:-120,
                'angleArc': $(this).attr('data-anglearc')?$(this).attr('data-anglearc')*1:240,
                'bgColor': $(this).data('bgcolor') || 'transparent',
                'fgColor': $(this).data('fgcolor') || '#cccccc',
                'tkColor': $(this).data('tkcolor') || 'DimGray',
                'hdColor': $(this).data('hdcolor') || '#aa6900',
                'thickness': .25,
                'tickdistance': 20,
                'cursor': 6,
                'touchPosition': 'left',
                'draw' : base.drawDial,
                'readOnly' : $(this).hasClass('readonly'),
            });
            knob_min.knob({
                'min': 0,
                'max': 59,
                'lastValue': 0,
                'height': $(this).hasClass('large')?180:120,
                'width': $(this).hasClass('large')?180:120,
                'angleOffset': $(this).attr('data-angleoffset')?$(this).attr('data-angleoffset')*1:-120,
                'angleArc': $(this).attr('data-anglearc')?$(this).attr('data-anglearc')*1:240,
                'bgColor': $(this).data('bgcolor') || 'transparent',
                'fgColor': $(this).data('fgcolor') || '#cccccc',
                'tkColor': $(this).data('tkcolor') || 'DimGray',
                'hdColor': $(this).data('hdcolor') || '#aa6900',
                'thickness': .25,
                'tickdistance': 10,
                'cursor': 6,
                'touchPosition': 'left',
                'draw' : base.drawDial,
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
                    var parent = $(this).parents('div[data-type="'+base.widgetname+'"]');
                    var knob_hour = parent.find('input[class=widget_'+base.widgetname+'_hour]');
                    var knob_min = parent.find('input[class=widget_'+base.widgetname+'_minute]');
                    var hour = knob_hour.val()*1;
                    var min = knob_min.val()*1;
                    
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
                    var parent = $(this).parents('div[data-type="'+widget_settimer.widgetname+'"]');
                    var val = getDeviceValue( $(parent), 'running-get' );
                    var setoff;
                    if(val && val == parent.data('running-get-on')) {
                        setoff = parent.data('running-set-off');
                    } else {
                        setoff = parent.data('set-off');
                    }
                    
                    var cmd = [parent.data('cmd'), device, parent.data('set'), setoff].join(' ');
                    setFhemStatus(cmd);
                    if( device && typeof device != "undefined") {
                        TOAST && $.toast(cmd);
                    }
                },
            });
            button_off.data('off-background-color', button_off.find('#bg').css('color'));
        });
    },
    update: function (dev,par) {
        var deviceElements= this.elements.filter('div[data-device="'+dev+'"]');
        deviceElements.each(function(index) {
            button_off = $(this).find('.widget_settimer_off');
            var button_off_bg = button_off.find('#bg');
            
            if ( $(this).data('get')==par || par =='*'){    
                var val = getDeviceValue( $(this), 'get' );
                var knob_hour = $(this).find('input[class=widget_'+base.widgetname+'_hour]');
                var knob_min = $(this).find('input[class=widget_'+base.widgetname+'_minute]');
                if (val){
                    var v = val.split(':');
                    var hour = v[0];
                    var min = v[0]=='off'?v[0]:v[1];
                    
                    if(hour==$(this).data('running-get-on')) {
                        hour = min = '!';
                    }
                    if(hour==$(this).data('running-set-off')) {
                        hour = min = '#';
                    }
                    
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
            
            if ( $(this).data('running-get')==par || par =='*'){    
                var val = getDeviceValue( $(this), 'running-get' );
                if(val && val == $(this).data('running-get-on')) {
                    button_off_bg.css('color', $(this).data('running-color'));
                    if($(this).data('running-blink')) {
                        button_off.addClass('blink');
                    }
                } else {
                    button_off_bg.css('color', button_off.data('off-background-color'));
                    button_off.removeClass('blink')
                }
            }
            
        });
    }
});