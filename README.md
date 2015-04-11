# Widgets for fhem-tablet-ui

Die Widgets dieser Sammlung sind zur Verwendung in [fhem-tablet-ui](https://github.com/knowthelist/fhem-tablet-ui/). Zur Installation werden die js-Dateien dieser Sammlung ins Verzeichnis "js" der fhem-tablet-ui-Installation kopiert.

Widgets:

* [klimatrend](#klimatrend)
* [kodinowplaying](#kodinowplaying)
* [button] (#button)
* [clock] (#clock)
* [weather] (#weather)
* [wind_direction] (#wind_direction)
* [settimer] (#settimer)

## klimatrend

![klimatrend screenshot](/../screenshots/screenshots/klimatrend.png?raw=true)

klimatrend wandelt Daten aus dem [statistics-Modul](http://fhem.de/commandref.html#statistics) in einen Pfeil um, der den aktuellen Trend anzeigt. Steigender Wert: Pfeil nach oben; Fallender Wert: Pfeil nach unten. Dazu farbcodiert und mit Extra-Icon versehene Marken für steile Bewegungen im Trend. 


### Voraussetzung: [statistics-Modul](http://fhem.de/commandref.html#statistics)

    define STATISTICS statistics W_HUMID
    attr STATISTICS ignoreDefaultAssignments 1
    attr STATISTICS tendencyReadings temperature,humidity

Dadurch werden im Device W_HUMID u.a. Readings in folgender Form erzeugt:

    statTemperatureTendency 1h: +1.3 2h: +0.3 3h: +0.1 6h: +1.4
    statHumidityTendency 1h: +1 2h: -2 3h: -1 6h: -1

Diese Readings werden im klimatrend-Widget verwendet. Das statistics-Modul direkt wird nicht ausgewertet.

### HTML-Code:

    <div data-type="klimatrend" data-device="W_HUMID" data-get="statTemperatureTendency"></div>

Dadurch wird (mit den Beispieldaten) ein leuchtend roter Doppelpfeil nach oben erzeugt, der einen steilen Anstieg der Temperatur in der letzten Stunde symbolisiert. Ein vollständiger HTML-Code mit allen möglichen Attributen:

    <div data-type="klimatrend"
        data-device="W_HUMID"
        data-get="statTemperatureTendency"
        data-refperiod="1"
        data-stagnating-color="rgb(80,80,80)"
        data-icon="fa-angle"
        data-rising-color="rgb(180,80,80)"
        data-falling-color="rgb(80,80,180)"
        data-highmark="1"
        data-highmark-icon="fa-angle-double"
        data-highmark-rising-color="rgb(255,80,80)"
        data-highmark-falling-color="rgb(80,80,255)"
        ></div>

### Attribute

#### device
Name eines Devices mit statistics-Werten. Kein Default.

#### get
Name des Readings mit statistics-Werten. Default ist "statTemperatureTendency". Die Standardbelegung für data-get funktioniert derzeit nur, wenn ein gleichnamiges Reading auch einmal explizit im HTML-Code notiert wird. 

#### refperiod
Referenzzeitraum mit dem der aktuelle Wert verglichen werden soll. statistics liefert die Werte für 1h, 2h, 3h und 6h. refperiod wird entsprechend mit 1,2,3,6 angegeben. Alternativ kann auch data-part 2,4,6,8 verwendet werden. Default ist 1

#### stagnating-color
Farbcode für unveränderten Wert. Default ist rgb(80,80,80)

#### icon
Font-Awesome-Icon das zur Darstellung benutzt werden soll. Default ist: "fa-angle"

#### rising-color
Farbcode für ansteigenden Trend. Default ist rgb(180,80,80)

#### falling-color
Farbcode für fallenden Trend. Default ist rgb(80,80,180)

#### highmark
Wertunterschied ab der der Trend als "steil" gilt und entsprechend gekennzeichnet ist. Default ist "1" für Temperaturwerte und "5" für Humidity-Werte. 

#### highmark-icon
Font-Awesome-Icon das zur Darstellung oberhalb der highmark benutzt werden soll. Default ist: "fa-angle-double"

#### highmark-rising-color
Farbcode für steil ansteigenden Trend. Default ist rgb(255,80,80)

#### highmark-falling-color
Farbcode für steil fallenden Trend. Default ist rgb(80,80,255)

## kodinowplaying
![kodinowplaying screenshot](/../screenshots/screenshots/kodinowplaying_music.png?raw=true)
![kodinowplaying screenshot](/../screenshots/screenshots/kodinowplaying_tvshow_paused.png?raw=true)

kodinowplaying zeigt Informationen zu grade in KODI gespielten Medien in Form eines Labels an. Die Screenshots zeigen das Standardformat. Alle einzelnen Felder sind abschaltbar und durch Zuweisung
von CSS-Klassen stylebar.

### HTML-Code

    <div data-type="kodinowplaying" data-device="W_XBMC"></div>
    
"W_XBMC" ist ein Device vom [Modul XBMC](http://fhem.de/commandref.html#XBMC). Dadurch wird ein Label erzeugt, dass Informationen zu den grade in der zugehörigen KODI-Installation abgespielten
Medien anzeigt. In der Standardkonfiguration wird angezeigt

bei Musik:

    Artist - Album - Titel [ Zeit(MM:SS) / Gesamtzeit(MM:SS) ] (paused/stopped)

bei Serien:

    Serie S(Season)E(Episode) Episodentitel [ Zeit(HH:MM:SS) / Gesamtzeit(HH:MM:SS) ] (paused/stopped)

bei Filmen:

    Titel [ Zeit(HH:MM:SS) / Gesamtzeit(HH:MM:SS) ] (paused/stopped)

Ein vollständiger HTML-Code mit allen möglichen Attributen:  

    <div data-type="kodinowplaying" 
        data-device="W_XBMC" 
        data-show="yes"
        data-season="yes"
        data-episode="yes"
        data-title="yes"
        data-artist="yes"
        data-album="yes"
        data-time="yes"
        data-totaltime="yes"
        data-playstatus="yes"
        data-class-show=""
        data-class-season=""
        data-class-episode=""
        data-class-title=""
        data-class-artist=""
        data-class-album=""
        data-class-time=""
        data-class-totaltime=""
        data-class-playstatus=""
        data-timeformat="HH:MM:SS"
        data-playstatus-pauseonly="yes"
        class="titleonly|short|notime"
        ></div>

### Klassen

#### titleonly

Alle Felder ausser title werden ausgeblendet

#### short

Alle Felder ausser show, title und time werden ausgeblendet

#### notime

Wie das Standardformat, aber ohne time und totaltime

### Attribute

#### device

Name eines Devices vom [Modul XBMC](http://fhem.de/commandref.html#XBMC).

#### show

Anzeige des Show-Titles bei Fernsehsendungen. Default yes.

#### season

Anzeige der Seasonnummer bei Fernsehsendungen. Default yes.

#### episode

Anzeige der Episodennummer bei Fernsehsendungen. Default yes.

#### title

Anzeige des Titels. Default yes.

#### artist

Anzeige des Künstlers bei Musik. Default yes.

#### album

Anzeige des Albums bei Musik. Default yes.

#### time

Anzeige des aktuellen Zeitpunktes. Achtung: Wird nur bei Ã„nderung des Playstatus o.ä. aktualisiert. Default yes.

#### totaltime

Anzeige der Gesamtzeit. Default yes.

#### timeformat

Format für die Anzeige von time und totaltime in der Form "HH:MM:SS". Default "MM:SS" für Musik und "HH:MM" für andere Medien.

#### playstatus

Anzeige des playstatus. Default yes.

#### playstatus-pauseonly

Playstatusanzeige nur bei Pause und Stop. Default yes.

#### class-show|season...

CSS-Klasse für das enstprechende Feld. Die Klasse wird auf ein span-Element das das Feld umschliesst angewendet. Kein Default.

## button
Variante der push und switch Widgets, die entweder einen URL ansteuern oder einen Fhem-Befehl absetzen kann.

### HTML-Code

    <div data-type="button" data-url="wohnzimmer.html"></div>

Wechselt zu der Seite wohnzimmer.html. 

    <div data-type="button" data-url-xhr="http://server/?action=do"></div>

Ruft den URL http://server/?action=do als XMLHttpRequest im Hintergrund auf. D.h. es wird nicht zu dieser Seite gewechselt, sondern sie wird nur "getriggert".

    <div data-type="button" data-fhem-cmd="set+MILIGHT_Zone1_Wohnzimmer+hue+50" data-icon="fa-paint-brush" data-color="hsl(50,100%,50%)" class="cell"></div>
    
Sendet den Befehl "set MILIGHT_Zone1_Wohnzimmer hue 50" an fhem. Als Icon wird ein Malpinsel auf gelbem (HUE 50) Hintergrund angezeigt. Der Befehl muss urlencoded notiert werden. Fhem wird über den Metatag fhemweb_url lokalisiert, ist der Metatag nicht gesetzt wird "/fhem" als Default angenommen.
    
### Attribute

#### url

URL zu dem beim Klick auf den Button gewechselt werden soll.

#### url-xhr

URL die beim Klick auf den Button im Hintergrund per XMLHttpRequest aufgerufen werden soll.

#### fhem-cmd

Fhem-Befehl der beim Klick auf den Button gesetzt werden soll. fhem-cmd und url können nicht gleichzeitig verwendet werden. url hat Vorrang, wenn beide notiert werden.

#### color

Hintergrundfarbe des Buttons im Status "on". Default #aa6900.

#### offColor

Hintergrundfarbe des Buttons im Status "off". Default #aa6900.
                
#### icon

Icon zur Anzeige auf dem Button. Default fa-check-circle

#### device

Optional kann ein Device angegeben werden, dessen Status mit dem Button angezeigt wird. Es können keine Befehle an dieses Device gesendet werden.

#### get

Reading des Devices dass gelesen werden soll um den Status zu ermitteln. Default: STATE

#### get-on

Wert des o.g. Readings für den Status "on". Default "on"

#### get-off

Wert des o.g. Readings für den Status "off". Default "off"


## clock

![clock screenshot](/../screenshots/screenshots/clock.png?raw=true)

Das Widget "clock" stellt eine einfach Uhr zur verfügung.

### HTML

    <div data-type="clock"></div>

Zeigt eine Uhr in der Form HH:MM:SS an, die sekündlich aktualisiert wird.

    <div data-type="clock" data-format="Y-m-d H:i:s"></div>

Zeigt eine Uhr in der Form YYYY-MM-DD HH:MM:SS an, die sekündlich aktualisiert wird.

    <div data-type="clock" data-format="Y-m-d H:i:s.u" data-interval="1"></div>

Zeigt eine Uhr in der Form YYYY-MM-DD HH:MM:SS.MILI an, die im Milisekundentakt aktualisiert wird.

    <div data-type="clock" data-format="U"></div>

Zeigt eine Uhr im UNIX-Timestamp Format an.

### Attribute

#### format

Die Formatangabe nutzt die gleichen Kennzeichner wie php date(), unterstützt aber nur die folgenden:

    Y: Jahreszahl, vierstellig
    y: Jahreszahl, zweistellig
    m: Monatszahl, mit führender Null
    n: Monatszahl, ohne führende Null
    d: Tag des Monats, mit führender Null
    j: Tag des Monats, ohne führende Null
    H: Stunde des Tages, mit führender Null
    G: Stunde im 24-Stunden-Format, ohne führender Null
    i: Minute der Stunde, mit führender Null
    s: Sekunde der Minute, mit führender Null
    w: Wochentagszahl (Sonntag = 0)
    u: Millisekunden mit führender Null
    O: Zeitunterschied zur Greenwich time (GMT) in Stunden
    U: Sekunden seit Beginn der UNIX-Epoche (January 1 1970 00:00:00 GMT)
    
Das Format wird als String angegeben, Kennzeichner werden ersetzt, die übrigen Zeichen bleiben stehen. Default "H:i:s"

#### interval

Das Aktualisierungsinterval in Milisekunden. Default 1000.

## weather

![weather screenshot](/../screenshots/screenshots/weather-demo.png?raw=true)

**Achtung:** "weather" wird mittlerweile mit fhem-tablet-ui ausgeliefert. Die hier noch vorhandene Version ist als Testversion für Neuerungen zu betrachten.

Das Widget "weather" wandelt Bezeichnungen von Wetterlagen verschiedener Wetter-Module in Icons um. Der Screenshot zeigt neben dem eigentlichen "weather"-Widget verschiedene Labels. Der vollständige Code zur Erzeugung dieser Ansicht ist in [weather-demo](weather-demo.html) zu finden. Das "weather"-Widget ist die angezeigte Wolke.

Insbesondere das Modul Weather liefert eine wesentlich differenziertere Beschreibung der Wetterlage, als mit diesem Widget darstellbar ist. Es sollte daher grundsätzlich zusammen mit einem normalen "label"-Widget verwendet werden, das die genaue Bezeichnung darstellt.

### HTML

In Verbindung mit dem Modul [Weather](http://fhem.de/commandref.html#Weather) zB:

    <div data-type="weather" 
        data-device="WEATHER"
        data-get="condition"></div>

In Verbindung mit dem Modul [PROPLANTA](http://fhem.de/commandref.html#PROPLANTA) zB:

    <div data-type="weather" 
        data-device="WEATHER_PROPLANTA"
        data-get="fc0_weatherEvening"></div>

### Attribute

#### device

Ein Device von einem der unterstützten Typen. Aktuell sind Weather, PROPLANTA und (eingeschränkt) OPENWEATHER möglich.

#### get

Reading dessen Wettertext in ein Icon umgewandelt werden soll. Möglich sind alle Readings, die eine textuelle Beschreibung der Wetterlage enthalten. zB condition, fc#_condition, fc#_weather(Morning|Day|Evening|Night). Für das OPENWEATHER Modul können auch die weatherCode-Readings verwendet werden.

#### imageset

Bildsammlung mit der die Wetterlagen dargestellt werden sollen. Zur Wahl stehen [meteocons](http://www.alessioatzeni.com/meteocons/) (wird mit fhem-tablet-ui geliefert) und [kleinklima](http://kleinklima.de/) (wird mit fhem geliefert). Default: meteocons


## wind_direction

![wind_direction screenshot](/../screenshots/screenshots/wind_direction.png?raw=true)

Zeigt die Windrichtung auf einer Windrose an. Benötigt ein Reading mit einer Textdarstellung der Windrichtung in der Form "N", "NNW" etc. oder mit der Gradzahl der Windrichtung (0-360). Kann zusätzlich die Windgeschwindigkeit auswerten um Windstille statt Windrichtung anzuzeigen.

### HTML

    <div data-type="wind_direction" 
        data-device="WETTERCOM"
        data-direction="fc0_windDir"></div>

Zeigt die Windrichtung anhand der Gradzahl im Reading fc0_windDir eines Device vom Modul [OPENWEATHER](http://fhem.de/commandref.html#OPENWEATHER) an.

    <div data-type="wind_direction" 
        data-device="YAHOO"
        data-direction="wind_condition"
        data-part="2"></div>

Zeigt die Windrichtung anhand der Textdarstellung im Reading wind_condition eines Device vom Modul [Weather](http://fhem.de/commandref.html#Weather) an.

    <div data-type="wind_direction" 
        data-device="YAHOO"
        data-direction="wind_direction"
        data-speed="wind_speed"
        data-calm="-"
        data-size="150"
        data-tickstep="45"
        data-angleoffset="0"></div>

Zeigt die Windrichtung anhand der Gradzahl im Reading wind_direction eines Device vom Modul [Weather](http://fhem.de/commandref.html#Weather) an. 

### Attribute

#### direction

Reading mit der Windrichtung. Kann numerisch (0-360) oder in Textform ("NO") angegeben sein. Default: wind_direction

#### speed

Reading mit der Windgeschwindigkeit. Wird nur verwendet um Windstille zu erkennen und entsprechend anzuzeigen. Default: wind_speed

#### calm

Anzeigewert für Windstille. Default: -

#### size

Größe des Widgets in Pixeln. Höhe und Breite sind immer gleich. Default: 150

#### tickstep

Abstand der Ticks in Grad auf der Compassrosette. Aus dem Abstand ergibt sich die Anzahl der Ticks. Default: 45 (8 Ticks)

#### angleoffset

Drehung der Compassrosette in Grad. Default: 0

### Klassen

#### small

Voreinstellung für size=100

#### mini

Voreinstellung für size=52

#### tiny

Voreinstellung für size=12 und tickstep=90. Die Textdarstellung in der Mitte des Widgets wird bei class "tiny" nicht angezeigt.

## settimer

![widget_settimer screenshot](/../screenshots/screenshots/widget_settimer.png?raw=true)

Controll zum Anzeigen/Einstellen einer Uhrzeit. Die Einstellung der Uhrzeit wird mit den Knob-Elementen vorgenommen (links Stunde, rechts Minute) und mit dem oberen Button abgesendet. Dazu werden Stunde und Uhrzeit mit Doppelpunkt verbunden und ggf. mit führender Null versehen (9+13 = 09:13). Der untere Button sendet ein "off" Kommando.

### HTML

    <div data-type="settimer"
        data-device="WECKER"></div>

Liest und sendet die Uhrzeit aus STATE des Device WECKER.

    <div data-type="settimer"
        data-device="WECKER"
        data-reading="time">

Liest und sendet die Uhrzeit aus dem Reading time des Device WECKER.

    <div data-type="settimer"
        data-device="WECKER"
        data-get="time"
        data-cmd="setreading"
        data-set="time"></div>
        
Liest und sendet die Uhrzeit aus dem Reading time des Device WECKER.

### Attribute

#### device

Device das gelesen/beschickt werden soll. Typischerweise ein dummy-Device.

#### reading

Reading aus dem gelesen, bzw. das beschickt werden soll. Die Uhrzeit wird in der Form HH:MM erwartet und gesendet. Wird reading gesetzt, werden get, cmd und set automatisch richtig initialisiert (get=reading, set=reading, cmd=setreading)

#### get

Reading aus dem gelesen werden soll. Die Uhrzeit wird in der Form HH:MM erwartet. Default: STATE

#### set

Reading das beschickt werden soll. Die Uhrzeit wird in der Form HH:MM gesendet. Default: STATE

#### cmd

Befehl mit dem Änderungen an Fhem gesendet werden. Default: set

#### off

Wert der Anstelle der eingestellten Uhrzeit als off-Kommando mit dem unteren Button gesendet werden soll. Default: off
