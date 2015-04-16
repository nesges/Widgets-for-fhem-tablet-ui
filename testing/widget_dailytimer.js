if(typeof widget_settimer == 'undefined') {
    loadplugin('widget_settimer');
}

var widget_dailytimer = $.extend({}, widget_settimer, {
    widgetname : 'dailytimer',
    daytab : function(elem, reading) {
        return '<div id="tab-'+reading+'">'
                + '<div style="position:relative;height:'+elem.data('height')+'px;'+ ($.isNumeric(elem.data('width'))?'width:'+elem.data('width')+'px':'') +'" class="widget_'+this.widgetname+'_container">'
                    + '<div style="position:absolute;top:0;right:0;margin-top:5px;margin-right:25px" class="widget_'+this.widgetname+'_buttons">'
                        + '<div class="widget_'+this.widgetname+'_set" style="display:block" data-reading="'+reading+'" />'
                        + '<div class="widget_'+this.widgetname+'_off" style="display:block" data-reading="'+reading+'" />'
                    + '</div>'
                    + '<div style="position:absolute;top:0;left:0;margin-top:5px;margin-left:20px" class="widget_'+this.widgetname+'_knobs">'
                        + '<div class="widget_'+this.widgetname+'_hour_wrap" style="display:inline;margin-right:10px !important">'
                            + '<input class="widget_'+this.widgetname+'_hour" type="text" value="'+(elem.attr('data-initvalue')||'0')+'" disabled="true">'
                        + '</div>'
                        + '<div class="widget_'+this.widgetname+'_hour_wrap" style="display:inline;margin-left:10px !important">'
                            + '<input class="widget_'+this.widgetname+'_minute" type="text" value="'+(elem.attr('data-initvalue')||'0')+'" disabled="true">'
                        + '</div>'
                    + '</div>'
                + '</div>'
             + '</div>';
    },
    init_html: function(elem) {
        $('<div class="tabs">'
                + '<ul>'
                    + '<li><a href="#tab-'+elem.data('monday'   )+'">'+elem.data('monday-alias'   )+'</a></li>'
                    + '<li><a href="#tab-'+elem.data('tuesday'  )+'">'+elem.data('tuesday-alias'  )+'</a></li>'
                    + '<li><a href="#tab-'+elem.data('wednesday')+'">'+elem.data('wednesday-alias')+'</a></li>'
                    + '<li><a href="#tab-'+elem.data('thursday' )+'">'+elem.data('thursday-alias' )+'</a></li>'
                    + '<li><a href="#tab-'+elem.data('friday'   )+'">'+elem.data('friday-alias'   )+'</a></li>'
                    + '<li><a href="#tab-'+elem.data('saturday' )+'">'+elem.data('saturday-alias' )+'</a></li>'
                    + '<li><a href="#tab-'+elem.data('sunday'   )+'">'+elem.data('sunday-alias'   )+'</a></li>'
                + '</ul>'
                + this.daytab(elem, elem.data('monday'   ))
                + this.daytab(elem, elem.data('tuesday'  ))
                + this.daytab(elem, elem.data('wednesday'))
                + this.daytab(elem, elem.data('thursday' ))
                + this.daytab(elem, elem.data('friday'   ))
                + this.daytab(elem, elem.data('saturday' ))
                + this.daytab(elem, elem.data('sunday'   ))
            + '</div>'
            + (elem.data('overview')?
                '<style>td {text-align:left; padding-left:10px !important}</style>'
                + '<table width="100%">'
                    + '<tbody>'
                        + '<tr>'
                            + '<td style="color:#aa6900">' + elem.data('monday-alias') + ':</td>'
                            + '<td><div data-type="label" class="widget_'+this.widgetname+'_day_'+elem.data('monday')+'" /></td>'
                            + '<td style="color:#aa6900">' + elem.data('tuesday-alias') + ':</td>'
                            + '<td><div data-type="label" class="widget_'+this.widgetname+'_day_'+elem.data('tuesday')+'" /></td>'
                        + (elem.data('overview-lines')==4?'</tr><tr>':'')
                            + '<td style="color:#aa6900">' + elem.data('wednesday-alias') + ':</td>'
                            + '<td><div data-type="label" class="widget_'+this.widgetname+'_day_'+elem.data('wednesday')+'" /></td>'
                        + (elem.data('overview-lines')==3?'</tr><tr>':'')
                            + '<td style="color:#aa6900">' + elem.data('thursday-alias') + ':</td>'
                            + '<td><div data-type="label" class="widget_'+this.widgetname+'_day_'+elem.data('thursday')+'" /></td>'
                        + (elem.data('overview-lines')==2||elem.data('overview-lines')==4?'</tr><tr>':'')
                            + '<td style="color:#aa6900">' + elem.data('friday-alias') + ':</td>'
                            + '<td><div data-type="label" class="widget_'+this.widgetname+'_day_'+elem.data('friday')+'" /></td>'
                        + (elem.data('overview-lines')==3||elem.data('overview-lines')==4?'</tr><tr>':'')
                            + '<td style="color:#aa6900">' + elem.data('saturday-alias') + ':</td>'
                            + '<td><div data-type="label" class="widget_'+this.widgetname+'_day_'+elem.data('saturday')+'" /></td>'
                            + '<td style="color:#aa6900">' + elem.data('sunday-alias') + ':</td>'
                            + '<td><div data-type="label" class="widget_'+this.widgetname+'_day_'+elem.data('sunday')+'" /></td>'
                        + '</tr>'
                    + '</tbody>'
                + '</table>'
            :'')
        ).appendTo(elem);
    },
    init: function () {
        base = this;
        this.elements = $('div[data-type="'+this.widgetname+'"]');
        this.elements.each(function(index) {
            base.init_attr($(this));
            $(this).data('cmd', 'setreading');
            
            $(this).data('monday-alias',      $(this).data('monday-alias')      || $(this).data('monday')      || 'Mo');   
            $(this).data('tuesday-alias',     $(this).data('tuesday-alias')     || $(this).data('tuesday')     || 'Di');  
            $(this).data('wednesday-alias',   $(this).data('wednesday-alias')   || $(this).data('wednesday')   || 'Mi');
            $(this).data('thursday-alias',    $(this).data('thursday-alias')    || $(this).data('thursday')    || 'Do'); 
            $(this).data('friday-alias',      $(this).data('friday-alias')      || $(this).data('friday')      || 'Fr');   
            $(this).data('saturday-alias',    $(this).data('saturday-alias')    || $(this).data('saturday')    || 'Sa'); 
            $(this).data('sunday-alias',      $(this).data('sunday-alias')      || $(this).data('sunday')      || 'So');   
            
            $(this).data('monday',      $(this).data('monday')      || 'monday');
            $(this).data('tuesday',     $(this).data('tuesday')     || 'tuesday');
            $(this).data('wednesday',   $(this).data('wednesday')   || 'wednesday');
            $(this).data('thursday',    $(this).data('thursday')    || 'thursday');
            $(this).data('friday',      $(this).data('friday')      || 'friday');
            $(this).data('saturday',    $(this).data('saturday')    || 'saturday');
            $(this).data('sunday',      $(this).data('sunday')      || 'sunday');
            readings[$(this).data('monday')] = true;
            readings[$(this).data('tuesday')] = true;
            readings[$(this).data('wednesday')] = true;
            readings[$(this).data('thursday')] = true;
            readings[$(this).data('friday')] = true;
            readings[$(this).data('saturday')] = true;
            readings[$(this).data('sunday')] = true;
            
            base.init_html($(this));
            base.init_ui($(this));
            
            var tabs = $(this).find('div[class=tabs]');
            tabs.tabs();
        });
    },
    update: function (dev,par) {
        base = this;
        var deviceElements;
        if ( dev == '*' )
            deviceElements= this.elements;
        else
            deviceElements= this.elements.filter('div[data-device="'+dev+'"]');
        
        deviceElements.each(function(index) {
            var days = new Array($(this).data('monday'), $(this).data('tuesday'), $(this).data('wednesday'), $(this).data('thursday'), $(this).data('friday'), $(this).data('saturday'), $(this).data('sunday'));
            for(var d=0; d<days.length; d++) {
                var day = days[d];
                if($(this).data(day)==par || par =='*'){    
                    var val = getDeviceValue($(this), day);
                    if(val){
                        var v = val.split(':');
                        var hour = v[0];
                        var min = v[0]=='off'?v[0]:v[1];
                        
                        var knob_hour = $(this).find('div[id=tab-'+day+'] input[class=widget_'+base.widgetname+'_hour]');
                        var knob_min = $(this).find('div[id=tab-'+day+'] input[class=widget_'+base.widgetname+'_minute]');
                        if ( knob_hour.val() != hour ){
                            knob_hour.val( hour ).trigger('change');
                            knob_hour.val( hour );
                        }
                        if ( knob_min.val() != min ){
                            knob_min.val( min ).trigger('change');
                            knob_min.val( min );
                        }
                        knob_hour.css({visibility:'visible'});
                        knob_min.css({visibility:'visible'});
                        
                        var label =  $(this).find('div[class=widget_'+base.widgetname+'_day_'+day+']');
                        label.html(val);
                    }
                }
            }
        });
    }
});
