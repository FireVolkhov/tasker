#!/bin/sh
bower install
cd ./libs/angular-ui-bootstrap/
npm install
grunt build
cd ./../../