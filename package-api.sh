#!/bin/bash

TEMP_DIR=".temp"
DIST_DIR="dist"
API_DIST_ZIP="dist/api-src.zip"
TEMP_PATH="$TEMP_DIR/python"

PYTHON_SITE_PACKAGES_DIR=$(python -c 'import site;import re; print(list(filter(re.compile("site-packages").search, site.getsitepackages()))[0])')

# Setup
rm -rf $TEMP_PATH
mkdir -p $TEMP_PATH


# Package api
cp -r api/src/* $TEMP_PATH
rm -rf $TEMP_PATH/endpoints
cp -r $PYTHON_SITE_PACKAGES_DIR/* $TEMP_PATH
mkdir -p $DIST_DIR
cd $TEMP_DIR
zip -rq ../$API_DIST_ZIP python
cd ..


# Cleanup
rm -rf $TEMP_PATH
