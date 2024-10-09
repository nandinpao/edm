#!/bin/bash

rm -fr data/

docker compose -f docker-compose-cluster.yml down

ip=$(ipconfig getifaddr en1) docker compose -f docker-compose-cluster.yml up  -d --build
