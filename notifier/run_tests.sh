
#!/bin/bash
passed=true

for test_file in $(find src -name 'test_*.py');
do
    cd $(dirname $test_file)
    test=$(basename $test_file)
    python3 -m pytest $test
    if ! [ $? -eq 0 ]; then
        passed=false
    fi
    cd -
done

if [ $passed = false ]; then
    echo Python Tests Failed!
    exit -1
fi
