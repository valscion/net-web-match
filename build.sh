#!/usr/bin/env bash

set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

[ -a deploy ] || mkdir deploy

echo "Copying assets to deploy dir..."

ASSET_FILES=$(git ls-files -- source/assets/ source/maps/)

for asset in $ASSET_FILES
do
  without_source=${asset#source/}
  target_path="deploy/$without_source"
  target_dir=$(dirname "$target_path")
  [ -a $target_dir ] || mkdir -p $target_dir
  echo "Copying $without_source to $target_path"
  cp -R "$asset" "$target_path"
done

echo
echo "Assets copied!"
echo "Deploying IGE..."
echo

cd ige

node ./server/ige -deploy ../source -to ../deploy

cd ..

echo
echo "DONE!"
