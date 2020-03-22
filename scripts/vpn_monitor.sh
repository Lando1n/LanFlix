#!/bin/bash
parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )

email_count=1
max_emails=5

echo -e "\e[42mMonitoring the VPN connection!\e[0m"
while :
do
    OUTPUT="$(ifconfig tun0 2> /dev/null)"
    if [[ "$OUTPUT" == *"00-00-00-00-00-00-00-00-00-00-00-00-00-00-00-00"* ]]; then
        if [[ $email_count -ne 1 ]]; then
            echo Connection has been recovered!
            email_count=1
        fi
        continue
    else
        if [[ $email_count -le $max_emails ]]; then
            echo $(date): ERROR: VPN not connected! Sending email warning $email_count/$max_emails
            node src/notifier/vpn-notify.js
            email_count=$(($email_count+1))
        fi
    fi
    sleep 600
done
