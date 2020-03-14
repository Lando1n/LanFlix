
for test_file in $(find src -name 'test_*.py');
do
    cd $(dirname $test_file)
    python3 -m pytest $(basename $test_file)
    cd -
done
