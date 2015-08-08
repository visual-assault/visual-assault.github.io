#!/usr/bin/env bash
# visual assault website run wrapper script.
# Author Ron. A <@0xADADA>
# Copyright (c) 2015 visual assault, LLC

# echo "Running Sass..."
sass --watch static/all.scss:static/stylesheets/all.min.css --style compressed --precision 8 &

# Run your new jekyll site, locally
echo "Running Jekyll..."
bundle exec jekyll serve
