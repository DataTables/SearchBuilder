#!/bin/sh

DT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )/../.."
if [ "$1" = "debug" ]; then
    DEBUG="debug"
else
    OUT_DIR=$1
    DEBUG=$2
fi

# If not run from DataTables build script, redirect to there
if [ -z "$DT_BUILD" ]; then
    cd $DT_DIR/build
    ./make.sh extension SearchBuilder $DEBUG
    cd -
    exit
fi

# Change into script's own dir
cd $(dirname $0)

DT_SRC=$(dirname $(dirname $(pwd)))
DT_BUILT="${DT_SRC}/built/DataTables"
. $DT_SRC/build/include.sh

# Copy CSS
rsync -r css $OUT_DIR
css_frameworks searchBuilder $OUT_DIR/css

if [ ! -d "node_modules" ]; then
    npm install
fi

# Copy images
#rsync -r images $OUT_DIR
node_modules/typescript/bin/tsc src/searchBuilder.ts --module ES6
node_modules/typescript/bin/tsc src/index.ts --module ES6
node_modules/typescript/bin/tsc src/criteria.ts --module ES6

# Copy JS
HEADER="$(head -n 3 src/index.ts)"

rsync -r src/*.js $OUT_DIR/js
js_frameworks searchBuilder $OUT_DIR/js

./node_modules/rollup/bin/rollup $OUT_DIR/js/index.js \
    --format iife \
    --banner "$HEADER" \
    --file $OUT_DIR/js/dataTables.searchBuilder.js

rm \
    $OUT_DIR/js/index.js \
    $OUT_DIR/js/searchBuilder.js \
    $OUT_DIR/js/criteria.js \


js_compress $OUT_DIR/js/dataTables.searchBuilder.js

# Copy and build examples
rsync -r examples $OUT_DIR
examples_process $OUT_DIR/examples

# Readme and license
cp Readme.md $OUT_DIR
cp License.txt $OUT_DIR

