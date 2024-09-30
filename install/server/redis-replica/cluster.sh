
#!/bin/bash

rm -fr data

ip=$(ipconfig getifaddr en1) docker compose up -d --build

