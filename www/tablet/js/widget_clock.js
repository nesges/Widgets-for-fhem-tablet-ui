if(typeof widget_widget == 'undefined') {
    loadplugin('widget_widget');
}

var widget_clock = $.extend({}, widget_widget, {
    widgetname : 'clock',
    init_attr: function(elem) {
        elem.data('format',             elem.data('format')             || 'H:i:s');
        elem.data('interval',           elem.data('interval')           || 1000);
        elem.data('shortday-length',    elem.data('shortday-length')    || 3);
        elem.data('days',               elem.data('days')               || new Array("Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"));
        elem.data('shortmonth-length',  elem.data('shortmonth-length')  || 3);
        elem.data('months',             elem.data('months')             || new Array("Januar", "Februar", "MÃ¤rz", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"));
        
        
        if(!$.isArray(elem.data('days'))) {
            if(elem.data('days').match(/englisc?h/)) {
                elem.data('days', new Array("Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"));
            } else {
                console.log(this.widgetname, 'init_attr', 'ERROR: data-days must be an array');
            }
        }
        
        
        if(!$.isArray(elem.data('months'))) {
            if(elem.data('months').match(/englisc?h/)) {
                elem.data('months', new Array("January","February","March","April","May","June","July","August","September","October","November","December"));
            } else {
                console.log(this.widgetname, 'init_attr', 'ERROR: data-months must be an array');
            }
        }
        
    },
    init_datearray: function(elem) {
        var d = new Array();
        now = new Date();
        // Y: Jahreszahl, vierstellig
        // y: Jahreszahl, zweistellig
        // m: Monatszahl, mit fÃ¼hrender Null
        // n: Monatszahl, ohne fÃ¼hrende Null
        // d: Tag des Monats, mit fÃ¼hrender Null
        // j: Tag des Monats, ohne fÃ¼hrende Null
        // H: Stunde des Tages, mit fÃ¼hrender Null
        // G: Stunde im 24-Stunden-Format, ohne fÃ¼hrender Null
        // i: Minute der Stunde, mit fÃ¼hrender Null
        // s: Sekunde der Minute, mit fÃ¼hrender Null
        // u: Millisekunden mit fÃ¼hrender Null
        // O: Zeitunterschied zur Greenwich time (GMT) in Stunden
        // U: Sekunden seit Beginn der UNIX-Epoche (January 1 1970 00:00:00 GMT)
        // w: Wochentagszahl (Sonntag = 0, Samstag = 6)
        // N: Wochentagszahl nach ISO-8601 (Montag = 1, Sonntag = 7)
        // l: Wochentag
        // D: Wochentag gekürzt
        // S: Anhang der englischen Aufzählung für einen Monatstag, zwei Zeichen
        // F: Monat als ganzes Wort, wie January oder March
        // M: Monatsname gekürzt
        // g: Stunde im 12-Stunden-Format, ohne führende Nullen
        // h: Stunde im 12-Stunden-Format, mit führenden Nullen
        // a: am/pm
        // A: AM/PM
        // W: ISO-8601 Wochennummer des Jahres
        
        // TODO:
        // z: Der Tag des Jahres
                       
        d['Y'] = now.getFullYear();
        d['n'] = now.getMonth()+1;
        d['j'] = now.getDate();
        d['G'] = now.getHours();
        d['i'] = now.getMinutes();
        d['s'] = now.getSeconds();
        d['w'] = now.getDay();
        d['u'] = now.getMilliseconds();
        d['O'] = now.getTimezoneOffset()/60;
        d['U'] = Math.floor(now.getTime()/1000);
        
        d['y'] = d['Y']-2000;
        d['d'] = d['j']<10?'0'+d['j']:d['j'];
        d['m'] = d['n']<10?'0'+d['n']:d['n'];
        d['H'] = d['G']<10?'0'+d['G']:d['G'];
        d['i'] = d['i']<10?'0'+d['i']:d['i'];
        d['s'] = d['s']<10?'0'+d['s']:d['s'];
        d['u'] = d['u']<10?'000'+d['u']:d['u']<100?'00'+d['u']:d['u']<1000?'0'+d['u']:d['u'];
        d['N'] = d['w']==0?7:d['w'];
        d['l'] = elem.data('days')[(Number(d['N'])-1)];
        d['D'] = d['l'].substr(0,elem.data('shortday-length'));
        d['S'] = String(d['j']).match(/[23]?1$/)?'st':String(d['j']).match(/[23]?2$/)?'nd':String(d['j']).match(/[23]?3$/)?'rd':'th';
        d['F'] = elem.data('months')[(Number(d['n'])-1)];
        d['M'] = d['F'].substr(0,elem.data('shortmonth-length'));
        d['g'] = d['G']<=12?d['G']:d['G']-12;
        d['h'] = d['g']<10?'0'+d['g']:d['g'];
        d['a'] = d['G']<=12?'am':'pm';
        d['A'] = d['a'].toUpperCase();
        // 'W' by mc-hollin http://forum.fhem.de/index.php/topic,34233.msg304630.html#msg304630
        var onejan = new Date(now.getFullYear(), 0, 1);
        var kw = Math.ceil((((now - onejan) / 86400000) + onejan.getDay() + 1) / 7);
        d['W'] = kw<10?'0'+kw:kw;
        
        return d;
    },
    init_datetext: function(format, d) {
        // split formatstring into it's letters and replace one after the other
        var datearr = format.split('');
        for(l=0; l<datearr.length; l++) {
            for ( var key in d ) {
                if(datearr[l] == key) {
                    datearr[l] = d[key];
                    // stop replacing after a match
                    break;
                }
            }
        }
        return datearr.join('');
    },
    init: function () {
        var base = this;
        this.elements = $('div[data-type="'+this.widgetname+'"]');
        this.elements.each(function(index) {
            widget_clock.init_attr($(this));
            var f = function() {
                if(f.elem.data('days') == null) {return} // http://forum.fhem.de/index.php/topic,36122.msg299306.html#msg299306

                var d = base.init_datearray(f.elem);
                var text = base.init_datetext(f.format, d);
                f.elem.text(text);
            };
            f.elem = $(this);
            f.format = $(this).data('format');
            setInterval(f, $(this).data('interval'));
        });
    },
    update: function (dev,par) {}
});
