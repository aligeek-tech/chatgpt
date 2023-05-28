#!/bin/sh

docker compose -f docker-compose.yml build --no-cache && docker compose -f docker-compose.yml up -d && docker system prune -a -f && docker image prune -a -f && docker container restart $(docker ps -aq)
