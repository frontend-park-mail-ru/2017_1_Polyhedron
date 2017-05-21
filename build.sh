#!/bin/bash

if [ $TRAVIS_BRANCH == 'master' ]
then
    docker login --username=_ --password=$(echo $API_KEY) registry.heroku.com
    docker build -t registry.heroku.com/polyhedron/web .
    docker push registry.heroku.com/polyhedron/web
else
    docker login --username=_ --password=$(echo $API_KEY) registry.heroku.com
    docker build -t registry.heroku.com/polyhedron/web .
    docker push registry.heroku.com/polyhedron/web
fi

