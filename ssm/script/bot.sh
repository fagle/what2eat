#!/bin/bash

if [ '' == "$1" ]
then
  echo 'invalid webhook'
  exit
else
  echo "webhook_url=$1"
fi
webhook_url=$1
aliddnsipv6_ak=$2  #换成你阿里去AccessKdy的ID
aliddnsipv6_sk=$3  #换成你阿里云AccessKey的密码
aliddnsipv6_name1='@'  #换成你的二级域名（随便填，自已记住就行）
aliddnsipv6_domain='ifiz.xyz'  #换成你在阿里云注册的域名
aliddnsipv6_ttl="600"
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
             	\"当前主机时间：$(date '+%Y-%m-%d %H:%M:%S')\n远程主机的IP地址为:\n${ipv6}\n\nJellyfin服务链接：\nhttp://[${ipv6}]:8096\n\nqbittorent服务链接：\nhttp://[${ipv6}]:8081\n\nnginx服务链接：\nhttp://[${ipv6}]:82\"
         	}
        }
        "

echo "$msgContent"

curl -s "$webhook_url" \
   -H 'Content-Type: application/json' \
   -d "$msgContent"

if [ "$aliddnsipv6_name1" = "@" ]
then
  aliddnsipv6_name=$aliddnsipv6_domain
else
  aliddnsipv6_name=$aliddnsipv6_name1.$aliddnsipv6_domain
fi

timestamp=`date -u "+%Y-%m-%dT%H%%3A%M%%3A%SZ"`


urlencode() {
    # urlencode <string>
    out=""
    while read -n1 c
    do
        case $c in
            [a-zA-Z0-9._-]) out="$out$c" ;;
            *) out="$out`printf '%%%02X' "'$c"`" ;;
        esac
    done
    echo -n $out
}
enc() {
    echo -n "$1" | urlencode
}
send_request() {
    local args="AccessKeyId=$aliddnsipv6_ak&Action=$1&Format=json&$2&Version=2015-01-09"
    # shellcheck disable=SC2155
    local hash=$(echo -n "GET&%2F&$(enc "$args")" | openssl dgst -sha1 -hmac "$aliddnsipv6_sk&" -binary | openssl base64)
    curl -s "http://alidns.aliyuncs.com/?$args&Signature=$(enc "$hash")"
}
get_recordid() {
    grep -Eo '"RecordId":"[0-9]+"' | cut -d':' -f2 | tr -d '"'
}
query_recordid() {
    send_request "DescribeSubDomainRecords" "SignatureMethod=HMAC-SHA1&SignatureNonce=$timestamp&SignatureVersion=1.0&SubDomain=$aliddnsipv6_name&Timestamp=$timestamp&Type=AAAA"
}
update_record() {
    send_request "UpdateDomainRecord" "RR=$(enc $aliddnsipv6_name1)&RecordId=$1&SignatureMethod=HMAC-SHA1&SignatureNonce=$timestamp&SignatureVersion=1.0&TTL=$aliddnsipv6_ttl&Timestamp=$timestamp&Type=AAAA&Value=$(enc $ipv6)"
}
add_record() {
    send_request "AddDomainRecord&DomainName=$aliddnsipv6_domain" "RR=$(enc $aliddnsipv6_name1)&SignatureMethod=HMAC-SHA1&SignatureNonce=$timestamp&SignatureVersion=1.0&TTL=$aliddnsipv6_ttl&Timestamp=$timestamp&Type=AAAA&Value=$(enc $ipv6)"
}
#add support */%2A and @/%40 record
if [ "$aliddnsipv6_record_id" = "" ]
then
    aliddnsipv6_record_id=`query_recordid | get_recordid`
    echo '-----------------' $aliddnsipv6_record_id
fi
if [ "$aliddnsipv6_record_id" = "" ]
then
    aliddnsipv6_record_id=`add_record | get_recordid`
    echo "added record $aliddnsipv6_record_id"
else
    update_record $aliddnsipv6_record_id
    echo "updated record $aliddnsipv6_record_id"
fi