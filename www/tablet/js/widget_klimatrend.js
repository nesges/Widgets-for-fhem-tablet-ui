var widget_klimatrend = {
    _klimatrend: null,
    elements: null,
    init: function () {
        _klimatrend=this;
        _klimatrend.elements = $('div[data-type="klimatrend"]');
        _klimatrend.elements.each(function(index) {
            $(this).data('get', $(this).data('get') || 'statTemperatureTendency'); 
            readings[$(this).data('get')] = true;
        });
    },
    update: function (dev,par) {
        var deviceElements= this.elements.filter('div[data-device="'+dev+'"]');
        deviceElements.each(function(index) {
            if ( $(this).data('get')==par || par =='*'){
                var value = getDeviceValue( $(this), 'get' );
                if (value){
                    var part = 0;
                    if($(this).data('refperiod')) {
                        if(String($(this).data('refperiod')).match(/^[123]$/)) {
                            part=$(this).data('refperiod')*2;
                        } else if($(this).data('refperiod')=="6") {
                            part=8;
                        } else {
                            part=-1;
                            console.log("ERROR: data-refperiod='"+$(this).data('refperiod')+"' is invalid");
                        }
                    }
                    if(part==0) {
                        if($(this).data('part')) {
                            if(String($(this).data('part')).match(/^[2468]$/)) {
                                part =  $(this).data('part');
                            } else {
                                console.log("ERROR: data-part='"+$(this).data('part')+"' is invalid");
                            }
                        } else {
                            part = 2;
                        }
                    }

                    var timespan = getPart(value,part-1);
                    var text = getPart(value,part).replace(/[\r\n]+$/, '');
                    var number = 1*text.replace(/[^0-9.]/g, '');
                    var sign = text.replace(/^([+-]).*/, '$1');
                    var reading = $(this).data('get');
                    var highmark = 0;
                    if($(this).data('highmark')) {
                        highmark = $(this).data('highmark');
                    } else {
                        if(reading.match(/humidity/i)) {
                            highmark=5;
                        } else if(reading.match(/temperature/i)) {
                            highmark=1;
                        }
                    }
                    var icon = $(this).data("icon") || "fa-angle";
                    var stagnatingColor= $(this).data("stagnating-color") || 'rgb(80,80,80)';
                    var risingColor = $(this).data("rising-color") || 'rgb(180,80,80)';
                    var fallingColor = $(this).data("falling-color") || 'rgb(80,80,180)';

                    if(number >= highmark) {
                        icon = $(this).data("highmark-icon") || "fa-angle-double";
                        risingColor = $(this).data("highmark-rising-color") || 'rgb(255,80,80)';
                        fallingColor = $(this).data("highmark-falling-color") || 'rgb(80,80,255)';
                    }
        
                    $(this).text('');
                    if(text.match(/^-\s/)) {
                        $(this).text(' - ')
                    } else if(number == 0) {
                        $(this).prepend('<span style="color:'+stagnatingColor+'" title="'+timespan+' '+text+'"> = </span>');
                    } else if(sign=="+") {
                        $(this).prepend('<i id="fg" class="fa '+icon+'-up" style="color:'+risingColor+';" title="'+timespan+' '+text+'"></i>');
                    } else if(sign=="-") {
                        $(this).prepend('<i id="fg" class="fa '+icon+'-down" style="color:'+fallingColor+';" title="'+timespan+' '+text+'"></i>');
                    }
                }
            }
        });
    }
};
