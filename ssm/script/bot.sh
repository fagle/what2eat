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

curl_no_proxy_ipv6() {
  env -u http_proxy -u https_proxy -u all_proxy -u HTTP_PROXY -u HTTPS_PROXY -u ALL_PROXY \
    curl -6 -s --noproxy '*' --connect-timeout 5 "$1"
}

get_public_ipv6() {
  default_ipv6_dev=$(ip -6 route show default 2>/dev/null | awk '{ for (i = 1; i <= NF; i++) if ($i == "dev") { print $(i + 1); exit } }')
  if [ -n "$default_ipv6_dev" ]; then
    ip=$(ip -6 addr show dev "$default_ipv6_dev" scope global 2>/dev/null | awk '/inet6 / && $2 ~ /\/64$/ && $0 !~ /deprecated/ && $0 !~ /temporary/ { sub(/\/.*/, "", $2); print $2; exit }')
    if echo "$ip" | grep -Eq '^[0-9a-fA-F:]+$' && echo "$ip" | grep -q ':'; then
      echo "$ip"
      return 0
    fi
  fi

  for url in \
    "https://6.ipw.cn" \
    "https://api6.ipify.org" \
    "https://v6.ident.me" \
    "https://ipv6.icanhazip.com" \
    "https://ifconfig.co/ip"
  do
    ip=$(curl_no_proxy_ipv6 "$url" | tr -d '[:space:]')
    if echo "$ip" | grep -Eq '^[0-9a-fA-F:]+$' && echo "$ip" | grep -q ':'; then
      echo "$ip"
      return 0
    fi
  done

  if [ -n "$default_ipv6_dev" ]; then
    ip=$(ip -6 addr show dev "$default_ipv6_dev" scope global 2>/dev/null | awk '/inet6 / && $0 !~ /deprecated/ { sub(/\/.*/, "", $2); print $2; exit }')
    if echo "$ip" | grep -Eq '^[0-9a-fA-F:]+$' && echo "$ip" | grep -q ':'; then
      echo "$ip"
      return 0
    fi
  fi

  return 1
}

ipv6=$(get_public_ipv6)
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
