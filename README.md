# Widgets-for-fhem-tablet-ui

## klimatrend

klimatrend wandelt Daten aus dem [statistics-Modul](http://fhem.de/commandref.html#statistics) in einen Pfeil um, der den aktuellen Trend anzeigt. Steigender Wert: Pfeil nach oben; Fallender Wert: Pfeil nach unten. Dazu farbcodiert und mit Extra-Icon versehene Marken für steile Bewegungen im Trend. 


### Voraussetzung: [statistics-Modul](http://fhem.de/commandref.html#statistics)

    define STATISTICS statistics W_HUMID
    attr STATISTICS ignoreDefaultAssignments 1
    attr STATISTICS tendencyReadings temperature,humidity

Dadurch werden u.a. Readings in folgender Form erzeugt:

    statTemperatureTendency 1h: +1.3 2h: +0.3 3h: +0.1 6h: +1.4
    statHumidityTendency 1h: +1 2h: -2 3h: -1 6h: -1

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
