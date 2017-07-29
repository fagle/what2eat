#!/bin/bash
cd ~
echo current dir:
pwd
#svn update /d/allm3/allm3-doc/config_data-tw/

#srv='/d/allm3/allm3-doc/config_data-tw/HotUpdate/srv/'
#localize='/d/allm3/allm3-doc/config_data-tw/HotUpdate/localize.tw/'
#rsync -rlpgoD -cp --progress --delete -e "ssh -p 20460" $srv dev@203.66.32.48:/home/dev/gg-review/logic/config/
#rsync -rlpgoD -cp --progress --delete -e "ssh -p 20460" $srv dev@203.66.32.48:/home/dev/gg-review/center/config/
#rsync -rlpgoD -cp --progress --delete -e "ssh -p 20460" $srv dev@203.66.32.48:/home/dev/gg-review/match/config/
#rsync -rlpgoD -cp --progress --delete -e "ssh -p 20460" $srv dev@203.66.32.48:/home/dev/gg-review/recharge/config/
#rsync -rlpgoD -cp --progress --delete -e "ssh -p 20460" $localize dev@203.66.32.48:/home/dev/gg-review/logic/localize.tw/
#rsync -rlpgoD -cp --progress --delete -e "ssh -p 20460" $localize dev@203.66.32.48:/home/dev/gg-review/center/localize.tw/
doc='config_data_ios-tw/Review'
srv=${doc}'/srv/'
localize=${doc}'/localize.tw/'
if [ ! -d ${doc} ]; then
    svn checkout https://192.168.110.39:18080/svn/allm3-doc-stable/config_data_ios-tw
fi
svn update ${doc}

server_name='gg-review'
rsync -rlpgoD -cp --progress --delete -e "ssh -p 20460" ${srv} dev@203.66.32.48:/home/dev/${server_name}/logic/config/
rsync -rlpgoD -cp --progress --delete -e "ssh -p 20460" ${srv} dev@203.66.32.48:/home/dev/${server_name}/center/config/
rsync -rlpgoD -cp --progress --delete -e "ssh -p 20460" ${srv} dev@203.66.32.48:/home/dev/${server_name}/match/config/
rsync -rlpgoD -cp --progress --delete -e "ssh -p 20460" ${srv} dev@203.66.32.48:/home/dev/${server_name}/recharge/config/
rsync -rlpgoD -cp --progress --exclude "*.xls*" --delete -e "ssh -p 20460" ${localize} dev@203.66.32.48:/home/dev/${server_name}/logic/localize.tw/localize.0/
rsync -rlpgoD -cp --progress --exclude "*.xls*" --delete -e "ssh -p 20460" ${localize} dev@203.66.32.48:/home/dev/${server_name}/center/localize.tw/localize.0/
ssh -p 20460 dev@203.66.32.48 "cd /home/dev/${server_name}/;./stopall.sh;./startall.sh"
date