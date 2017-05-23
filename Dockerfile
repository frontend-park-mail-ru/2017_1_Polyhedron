FROM nginx:1.13.0-alpine

RUN apk add --update bash

COPY ./nginx.conf /etc/nginx
COPY ./html /usr/share/nginx/site/html
COPY ./dist /usr/share/nginx/site/dist
COPY ./static/fonts /usr/share/nginx/site/static/fonts
COPY ./static/images /usr/share/nginx/site/static/images
COPY ./static/cached_urls /usr/share/nginx/site
COPY ./core/client_side/site_service/offline_mode/worker_script.js /usr/share/nginx/site
COPY ./core/client_side/site_service/offline_mode/worker_module.js /usr/share/nginx/site

RUN mkdir /usr/share/nginx/logs

EXPOSE 7000

CMD /bin/bash -c "echo \"listen $PORT;\" > /etc/nginx/listen.conf && nginx -g 'daemon off;'"
