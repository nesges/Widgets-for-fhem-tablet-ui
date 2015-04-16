#!/bin/bash   
rm controls_widgets-for-fhem-tablet-ui.txt

find ./www/tablet -type d \( ! -iname ".*" \) -print0 | while IFS= read -r -d '' f; 
    do
        out="DIR $f"
        echo ${out//.\//} >> controls_widgets-for-fhem-tablet-ui.txt
    done

find ./www -type f \( ! -iname ".*" \) -print0 | while IFS= read -r -d '' f; 
    do
        out="UPD `stat --format "%z %s" README.md | sed -e "s#\([0-9-]*\)\ \([0-9:]*\)\.[0-9]*\ [+0-9]*#\1_\2#"` $f"
        echo ${out//.\//} >> controls_widgets-for-fhem-tablet-ui.txt
    done

# CHANGED file
echo "FHEM Widgets for Fhem Tablet UI last change:" > CHANGED
echo $(date +"%Y-%m-%d") >> CHANGED
echo " - $(git log -1 --pretty=%B)" >> CHANGED