#!/bin/bash

if [ '' == "$1" ]
then
  echo 'invalid webhook'
  exit
else
  echo "webhook_url=$1"
fi
webhook_url=$1
ipv6_data_file=/mnt/user/nas_share/server-app/ipv6.txt
if [ ! -e $ipv6_data_file ]
then
  touch $ipv6_data_file
fi
ipv6_old=$(cat $ipv6_data_file)
ipv6=$( curl -s http://v6.ipv6-test.com/api/myip.php)
if [ '' == "$ipv6" ]
then
  echo 'ipv6 unavailable'
  exit
fi

if [ "$ipv6_old" == "$ipv6" ]
then
  echo "ipv6 not change ipv6_old=$ipv6_old, ipv6=$ipv6"
  exit
fi

echo "$ipv6" > $ipv6_data_file
echo "ipv6=$ipv6"

msgContent="
        {
         	\"msgtype\": \"text\",
         	\"text\": {
             	\"content\":
             	\"当前主机时间：$(date '+%Y-%m-%d %H:%M:%S')\n远程主机的IP地址为:\n${ipv6}\n\nJellyfin服务链接：\nhttp://[${ipv6}]:8096\n\nqbittorent服务链接：\nhttp://[${ipv6}]:8081\n\nnginx服务链接：\nhttp://[${ipv6}]:82"
         	}
        }
        "

echo "$msgContent"

curl -s "$webhook_url" \
   -H 'Content-Type: application/json' \
   -d "$msgContent"