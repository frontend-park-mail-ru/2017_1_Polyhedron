#!/bin/bash

export REGISTRY=registry.heroku.com

docker login --username=_ --password=$(echo $API_KEY) $REGISTRY
docker build -t $REGISTRY/$APP_NAME/web .
docker push $REGISTRY/$APP_NAME/web

