#!/bin/bash
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
node ${SCRIPT_DIR}/../notifier-script.js > ${SCRIPT_DIR}/../logs.txt 2> ${SCRIPT_DIR}/../errors.txt
