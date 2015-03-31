var widget_weather = {
    _weather: null,
    elements: null,
    weathermap: {
        // Weather (YAHOO) en
        'tornado' :                     '9',
        'tropical storm' :              '&',
        'hurricane' :                   '!',
        'severe thunderstorms' :        '&',
        'thunderstorms' :               '0',
        'mixed rain and snow' :         'V',
        'mixed rain and sleet' :        'X',
        'mixed snow and sleet' :        'X',
        'freezing drizzle' :            'W',
        'drizzle' :                     'R',
        'freezing rain':                'W',
        'showers' :                     'Q',
        'snow flurries' :               'U',
        'light snow showers' :          'U',
        'blowing snow' :                'W',
        'snow' :                        'W',
        'hail' :                        'X',
        'sleet' :                       'X',
        'dust' :                        'E',
        'foggy' :                       'F',
        'haze' :                        'L',
        'smoky' :                       'M',
        'blustery' :                    '!',
        'windy' :                       'S',
        'cold' :                        'G',
        'cloudy' :                      '5',
        'mostly cloudy' :               'N',
        'partly cloudy' :               'H',
        'clear' :                       'B',
        'sunny' :                       'B',
        'fair' :                        'B',
        'mixed rain and hail' :         'X',
        'hot' :                         'B',
        'isolated thunderstorms' :      'Z',
        'scattered thunderstorms' :     'Z',
        'scattered showers' :           'Q',
        'heavy snow' :                  '#',
        'scattered snow showers' :      'V',
        'partly cloudy' :               'H',
        'thundershowers' :              '8',
        'snow showers' :                '$',
        'isolated thundershowers' :     'R',
       
        // Weather (YAHOO) de
        'Tornado' :                     ':tornado',
        'schwerer Sturm' :              ':tropical storm',
        'Orkan' :                       ':hurricane',
        'schwere Gewitter' :            ':severe thunderstorms',
        'Gewitter' :                    ':thunderstorms',
        'Regen und Schnee' :            ':mixed rain and snow',
        'Regen und Graupel' :           ':mixed rain and sleet',
        'Schnee und Graupel' :          ':mixed snow and sleet',
        'Eisregen' :                    ':freezing drizzle',
        'Nieselregen' :                 ':drizzle',
        'gefrierender Regen' :          ':freezing rain',
        'Schauer' :                     ':showers',
        'Schneetreiben' :               ':snow flurries',
        'leichte Schneeschauer' :       ':light snow showers',
        'Schneeverwehungen' :           ':blowing snow',
        'Schnee' :                      ':snow',
        'Hagel' :                       ':hail',
        'Graupel' :                     ':sleet',
        'Staub' :                       ':dust',
        'Nebel' :                       ':foggy',
        'Dunst' :                       ':haze',
        'Smog' :                        ':smoky',
        'Sturm' :                       ':blustery',
        'windig' :                      ':windy',
        'kalt' :                        ':cold',
        'wolkig' :                      ':cloudy',
        'Ã¼berwiegend wolkig' :         ':mostly cloudy',
        'teilweise wolkig' :            ':partly cloudy',
        'klar' :                        ':clear',
        'sonnig' :                      ':sunny',
        'heiter' :                      ':fair',
        'Regen und Hagel' :             ':mixed rain and hail',
        'heiÃŸ' :                       ':hot',
        'einzelne Gewitter' :           ':isolated thunderstorms',
        'vereinzelt Gewitter' :         ':scattered thunderstorms',
        'vereinzelt Schauer' :          ':scattered showers',
        'starker Schneefall' :          ':heavy snow',
        'vereinzelt Schneeschauer' :    ':scattered snow showers',
        'teilweise wolkig' :            ':partly cloudy',
        'Gewitterregen' :               ':thundershowers',
        'Schneeschauer' :               ':snow showers',
        'vereinzelt Gewitter' :         ':isolated thundershowers',
        
        // PROPLANTA
        "heiter":"H",
        "wolkig":"N",
        "Regenschauer":"Q",
        "stark bewoelkt":"Y",
        "Regen":"R",
        "bedeckt":"N",
        "sonnig":"B",
        "Schnee":"U"
    },
  
    init: function () {
        _weather=this;
        _weather.elements = $('div[data-type="weather"]');
        _weather.elements.each(function(index) {
            $(this).data('get', $(this).data('get') || 'STATE');
            readings[$(this).data('get')] = true;
            $(this).addClass('weather');
        });
    },
    
    update: function (dev,par) {
        var deviceElements;
        if ( dev == '*' )
            deviceElements= _weather.elements;
        else
            deviceElements= _weather.elements.filter('div[data-device="'+dev+'"]');
        
        deviceElements.each(function(index) {
            if ( $(this).data('get')==par || par =='*'){
                var value = getDeviceValue( $(this), 'get' );
                if (value){
                    var part =  $(this).data('part') || -1;
                    var val = getPart(value,part);

                    //wheater icons
                    $(this).empty();
                    var mapped = _weather.weathermap[val];
                    // values starting with : are mapped again
                    while(typeof mapped != "undefined" && mapped.match(/^:/)) {
                        mapped = _weather.weathermap[mapped.replace(/^:/, '')];
                    }
                    $(this).attr('data-icon', mapped);
                 }
            }
        });
    }
};
