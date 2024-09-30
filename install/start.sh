#!/bin/bash

ip=$(ipconfig getifaddr en1) docker compose -f docker-compose.yml up --build --detach
