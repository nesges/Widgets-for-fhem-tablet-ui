if(typeof widget_widget == 'undefined') {
    loadplugin('widget_widget');
}

var widget_countdown = $.extend({}, widget_widget, {
    widgetname : 'countdown',
    init_attr: function(elem) {
        elem.initData('get'             , 'STATE');
        elem.initData('readymessage'    , '00:00:00');
        elem.initData('readyclass'      , null);
        elem.initData('resettimeout'    , -1);
        elem.initData('resetmessage'    , '');
        elem.initData('interval'        , 1000);
    },
    remainingtime(f) {
        var value = f.value;
        var timeparts = value.split(":");
        
        now = new Date();
        var end;
        
        var year = now.getFullYear();
        var month = now.getMonth();
        var day = now.getDate();
        var hour = 0;
        var min = 0;
        var sec = 0;
        
        // hh:mm:ss
        if(timeparts.length == 3) {
            hour = timeparts[0];
            min = timeparts[1];
            sec = timeparts[2];
            end = new Date(year, month, day, hour, min, sec);
        // hh:mm
        } else if(timeparts.length == 2) {
            hour = timeparts[0];
            min = timeparts[1];
            end = new Date(year, month, day, hour, min, sec);
        // full datestring; see https://wiki.selfhtml.org/wiki/JavaScript/Objekte/Date
        } else {
            end = new Date(value);
        }
        
        // d is the differnce between now and endtime
        var d = end - now;
        if(d < 0) {
            clearInterval(f.elem.data('__timer'));
            f.elem.text(f.elem.data('readymessage'));
            if(f.elem.data('readyclass') != null) {
                f.elem.addClass(f.elem.data('readyclass'));
            }
            if(f.elem.data('resettimeout')>=0) {
                $(this).data('__timer', setInterval(function(){
                    console.log('reset');
                    f.elem.removeClass(f.elem.data('readyclass'));
                    f.elem.text(f.elem.data('resetmessage'));
                }, f.elem.data('resettimeout')));
            } else {
                console.log(f.elem.data('readytimeout'));
            }
        } else {
            // if time is set back after countdown was ready 
            if(f.elem.hasClass(f.elem.data('readyclass'))) {
                f.elem.removeClass(f.elem.data('readyclass'));
            }
            
            if(!d) {
                remaining = '';
            } else {
                // make d human readable
                var r_day   = Math.floor( d / (24*60*60*1000));
                var r_hour  = ('00' + (Math.floor((d % (24*60*60*1000)) / (60*60*1000))) ).substr(-2,2);
                var r_min   = ('00' + (Math.floor((d % (60*60*1000))    / (60*1000)))    ).substr(-2,2);
                var r_sec   = ('00' + (Math.floor((d % (60*1000))       / (1000)))       ).substr(-2,2);
                
                var remaining = r_hour+':'+r_min+':'+r_sec;
                if(r_day) {
                    remaining = r_day + ', ' + remaining;
                }
            }
            f.elem.text(remaining);
        }
    },
    init: function () {
        base = this;
        this.elements = $('div[data-type="'+this.widgetname+'"]');
        this.elements.each(function(index) {
            widget_countdown.init_attr($(this));
            var f = function() {
                widget_countdown.remainingtime(f);
            };
            f.elem = $(this);
            f.value = $(this).getReading('get').val;
            
            $(this).data('__timer', setInterval(f, 1000));
        });
    },
    update: function (dev,par) {
        var base = this;
        // update from normal state reading
        this.elements.filterDeviceReading('get',dev,par).each(function(index) {
            var f = function() {
                widget_countdown.remainingtime(f);
            };
            f.elem = $(this);
            f.value = $(this).getReading('get').val;

            clearInterval($(this).data('__timer'));
            $(this).data('__timer', setInterval(f, 1000));
        });
    }
});
