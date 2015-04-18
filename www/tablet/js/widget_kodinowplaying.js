var widget_kodinowplaying = {
    _kodinowplaying: null,
    elements: null,
    init: function () {
        _kodinowplaying=this;
        _kodinowplaying.elements = $('div[data-type="kodinowplaying"]');
        _kodinowplaying.elements.each(function(index) {
            if($(this).hasClass('titleonly')){
                $(this).attr('data-show', 'no');
                $(this).attr('data-season', 'no');
                $(this).attr('data-episode', 'no');
                $(this).attr('data-title', 'yes');
                $(this).attr('data-artist', 'no');
                $(this).attr('data-album', 'no');
                $(this).attr('data-time', 'no');
                $(this).attr('data-totaltime', 'no');
                $(this).attr('data-playstatus', 'no');
            } else if($(this).hasClass('short')){
                $(this).attr('data-show', 'yes');
                $(this).attr('data-season', 'no');
                $(this).attr('data-episode', 'no');
                $(this).attr('data-title', 'yes');
                $(this).attr('data-artist', 'no');
                $(this).attr('data-album', 'no');
                $(this).attr('data-time', 'yes');
                $(this).attr('data-totaltime', 'no');
                $(this).attr('data-playstatus', 'no');
            } else if($(this).hasClass('notime')){
                $(this).attr('data-show', 'yes');
                $(this).attr('data-season', 'yes');
                $(this).attr('data-episode', 'yes');
                $(this).attr('data-title', 'yes');
                $(this).attr('data-artist', 'yes');
                $(this).attr('data-album', 'yes');
                $(this).attr('data-time', 'no');
                $(this).attr('data-totaltime', 'no');
                $(this).attr('data-playstatus', 'yes');
            }
            
            // readings for KODI devices
            $(this).data('type', 'type');
            readings['type'] = true;
            
            if(!$(this).attr('data-show') || $(this).attr('data-show')=='yes') {
                $(this).data('currentShowtitle', 'currentShowtitle');
                readings['currentShowtitle'] = true;
            }
            if(!$(this).attr('data-season') || $(this).attr('data-season')=='yes') {
                $(this).data('season', 'season');
                readings['season'] = true;
            }
            if(!$(this).attr('data-episode') || $(this).attr('data-episode')=='yes') {
                $(this).data('episode', 'episode');
                readings['episode'] = true;
            }
            if(!$(this).attr('data-title') || $(this).attr('data-title')=='yes') {
                $(this).data('currentTitle', 'currentTitle');
                readings['currentTitle'] = true;
            }
            if(!$(this).attr('data-artist') || $(this).attr('data-artist')=='yes') {
                $(this).data('currentArtist', 'currentArtist');
                readings['currentArtist'] = true;
            }
            if(!$(this).attr('data-album') || $(this).attr('data-album')=='yes') {
                $(this).data('currentAlbum', 'currentAlbum');
                readings['currentAlbum'] = true;
            }
            if(!$(this).attr('data-time') || $(this).attr('data-time')=='yes') {
                $(this).data('time', 'time');
                readings['time'] = true;
            }
            if(!$(this).attr('data-totaltime') || $(this).attr('data-totaltime')=='yes') {
                $(this).data('totaltime', 'totaltime');
                readings['totaltime'] = true;
            }
            if(!$(this).attr('data-playstatus') || $(this).attr('data-playstatus')=='yes') {
                $(this).data('playStatus', 'playStatus');
                readings['playStatus'] = true;
            }
        });
    },
    
    update: function (dev,par) {
        var deviceElements= this.elements.filter('div[data-device="'+dev+'"]');
        deviceElements.each(function(index) {
            var type        = getDeviceValue($(this), 'type');
            var show        = getDeviceValue($(this), 'currentShowtitle');
            var season      = getDeviceValue($(this), 'season');
            var episode     = getDeviceValue($(this), 'episode');
            var title       = getDeviceValue($(this), 'currentTitle');
            var artist      = getDeviceValue($(this), 'currentArtist');
            var album       = getDeviceValue($(this), 'currentAlbum');
            var time        = getDeviceValue($(this), 'time');
            var totaltime   = getDeviceValue($(this), 'totaltime');
            var playStatus  = getDeviceValue($(this), 'playStatus');
            
            console.log(show);
            
            var dateformat = $(this).attr('data-timeformat');
            
            if(!dateformat) {
                switch(type) {
                    case "song": dateformat = 'MM:SS'; break;
                    default: dateformat = 'HH:MM:SS'; break;
                }
            }
            
            var subst = '';
            if(dateformat) {
                switch(dateformat.toUpperCase()) {
                    case "HH":          subst = '$1'; break;
                    case "HH:MM":       subst = '$1:$2'; break;
                    default:            
                    case "HH:MM:SS":    subst = '$1:$2:$3'; break;
                    case "MM:SS":       subst = '$2:$3'; break;
                    case "SS":          subst = '$3'; break;
                }
            }
            
            if(subst) {
                if(time) {
                    time = time.replace(/^(\d\d):(\d\d):(\d\d).(.*)/, subst);
                }
                if(totaltime) {
                    totaltime = totaltime.replace(/^(\d\d):(\d\d):(\d\d).(.*)/, subst);
                }
            }
            
            $(this).empty();
            $(this).html(
                  (show                 ? ' <span class="'+$(this).data('class-show')       +'">'   +show+'</span> '                                    :'')
                + (show && !season&&!episode ? ' - ' :'')
                + (season               ? ' <span class="'+$(this).data('class-season')     +'">S'  +(season.match(/^\d\d/)?'':'0')+season+'</span>'    :'')
                + (episode              ?  '<span class="'+$(this).data('class-episode')    +'">E'  +(episode.match(/^\d\d/)?'':'0')+episode+'</span> ' :'')
                + (artist               ? ' <span class="'+$(this).data('class-artist')     +'">'   +artist+' - </span>'                                :'')
                + (album                ? ' <span class="'+$(this).data('class-album')      +'">'   +album+' - </span>'                                 :'')
                + (title                ? ' <span class="'+$(this).data('class-title')      +'">'   +title+ '</span> '                                  :'')
                + (time || totaltime    ? ' [ ' : '')
                + (time                 ?  '<span class="'+$(this).data('class-time')       +'">'   +time+'</span>'                                     :'') 
                + (time && totaltime    ?  ' / ' : '') 
                + (totaltime            ?  '<span class="'+$(this).data('class-totaltime')  +'">'   +totaltime+'</span>'                                :'')
                + (time || totaltime    ? ' ] ' : '')
                + (playStatus && playStatus!="playing"? ' <span class="'+$(this).data('class-playstatus') +'">(' +playStatus+')</span> '                :'')
            );
        });
    }
};
