#!/usr/bin/env bash
# visual assault website initialization script.
# Author Ron. A <@0xADADA>
# Copyright (c) 2015 visual assault, LLC

# Install Ruby bundler Gem if not installed.
if [ -z `gem list bundler | grep -q bundler` ]; then
    echo "Installing a Ruby gem: 'bundler'..."
    gem install bundler
fi

# Install Ruby gem dependencies.
echo "Installing dependencies..."
ARCHFLAGS="-arch x86_64" \
    gem install nokogiri

# brew install libxml2 libxslt libiconv
# #NOKOGIRI_USE_SYSTEM_LIBRARIES=1
# gem install nokogiri -- --use-system-libraries \
#     --with-iconv-dir="$(brew --prefix libiconv)" \
#     --with-xml2-config="$(brew --prefix libxml2)/bin/xml2-config" \
#     --with-xslt-config="$(brew --prefix libxslt)/bin/xslt-config"

echo "Installing GitHub pages dependencies..."
bundle install

# Run your new jekyll site, locally
echo "Try running Jekyll now:"
echo "$ ./bin/run.sh"
