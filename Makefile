DOCKER_COMPOSE_PATH	= ./docker-compose.yml

DATA_PATH			= /Users/gcrocett/Desktop/Data
DB_PATH				= $(DATA_PATH)/backend/
F_PATH				= $(DATA_PATH)/frontend/
B_PATH				= $(DATA_PATH)/db/

all: start

#  up		Create and start containers
#  build	Build or rebuild services
start:
	@ sudo mkdir -p $(DB_PATH) $(F_PATH) $(B_PATH)
	@ sudo docker-compose -f $(DOCKER_COMPOSE_PATH) up --build

#  down		Stop and remove containers, networks, images, and volumes
stop:
	@ sudo docker-compose -f $(DOCKER_COMPOSE_PATH) down

#  docker system prune		remove all unused containers, networks, images (both dangling and unreferenced), and optionally, volumes.
#  --all	Remove all unused images not just dangling ones
#  --force  do not prompt for confirmation
clean: stop
	@ docker system prune --all --force

re: clean all

.PHONY: all start stop clean re
