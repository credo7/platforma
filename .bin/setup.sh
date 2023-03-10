#!/usr/bin/env bash

sudo echo USE SUDO ONLY!

# cp -n .env.dist .env
# set -a && . .env && set +a

yarn() {
    sudo apt-get update
    sudo apt-get install npm
    sudo npm install --global yarn

    echo yarn installed
}

docker() {
    sudo curl -fsSL https://get.docker.com -o ./bin/get-docker.sh
    sudo sh ./bin/get-docker.sh

    sudo apt-get install -y uidmap
    sudo curl -sSL https://get.docker.com/rootless | sh
    # sudo dockerd-rootless-setuptool.sh install
    # sudo usermod -aG docker $USER

    sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose

    sudo chmod +x /usr/local/bin/docker-compose

    echo docker and docker-compose installed
}

postgres() {
    sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt-get $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
    sudo wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
    sudo apt-get update
    sudo apt-get install postgresql-14

    echo postgres installed

    sudo apt-get update
    sudo apt-get install postgresql-14-wal2json

    echo "max_wal_senders = 10" >>/etc/postgresql/13/main/postgresql.conf
    echo "max_replication_slots = 10" >>/etc/postgresql/13/main/postgresql.conf
    echo "wal_level = logical" >>/etc/postgresql/13/main/postgresql.conf
    echo "log_min_messages = fatal" >>/etc/postgresql/13/main/postgresql.conf

    sudo systemctl restart postgresql.service

    echo wal2json installed
}

pgadmin() {
    curl https://www.pgadmin.org/static/packages_pgadmin_org.pub | sudo apt-key add
    sudo sh -c 'echo "deb https://ftp.postgresql.org/pub/pgadmin/pgadmin4/apt/$(lsb_release -cs) pgadmin4 main" > /etc/apt/sources.list.d/pgadmin4.list && apt-get update'

    sudo apt-get install pgadmin4

    sudo /usr/pgadmin4/bin/setup-web.sh

    echo pgadmin installed
}

certbot() {
    sudo apt-get install certbot
    sudo apt-get install python3-certbot-nginx

    sudo certbot --nginx

    sudo certbot renew --dry-run

    echo certbot installed
}

nginx() {
    sudo apt-get install nginx

    sudo cp -f nginx/* /etc/nginx
    sudo nginx -s reload

    echo nginx installed
}

ssh-keygen() {
    sudo ssh-keygen -t rsa -b 4096

    echo ssh-key generated
}

keygen() {
    sudo openssl rand 60 | openssl base64 -A

    echo key generated
}

yarn:audit() {
    npm i --package-lock-only
    rm yarn.lock
    npm audit fix
    yarn import
    rm package-lock.json
}

dc:rm() {
    echo -n "Sure? [y/N]: "
    read SURE

    if [ "$SURE" == "y" ]; then
        sudo docker-compose down -v --remove-orphans
        sudo docker-compose rm -s -v $(sudo docker-compose ps -a -q)
        sudo docker rmi -f $(sudo docker images -q)

        # sudo rm -r data api/dist api/node_modules web/build web/node_modules

        echo docker killed
    fi
}

db:backup() {
    sudo mkdir -p ./data/backup
    pg_dump "postgres://$POSTGRES_USER:$POSTGRES_PASSWORD@$POSTGRES_HOST:$POSTGRES_PORT/$POSTGRES_DB" | gzip >./data/backup/backup.sql.gz
}

db:restore() {
    gunzip -c ./data/backup/backup.sql.gz | psql "postgres://$POSTGRES_USER:$POSTGRES_PASSWORD@$POSTGRES_HOST:$POSTGRES_PORT/$POSTGRES_DB"
}

db:update() {
    psql "postgres://$POSTGRES_USER:$POSTGRES_PASSWORD@$POSTGRES_HOST:$POSTGRES_PORT/$POSTGRES_DB" <./db/migrations/update.sql
}

node_modules() {
    yarn --cwd api_auth
    yarn --cwd api_play
    yarn --cwd web_auth
    yarn --cwd web_play
}

clean() {
    sudo docker rm -f $(sudo docker ps -aq)
    sudo docker rmi -f $(sudo docker images -q)
    sudo docker volume rm -f $(sudo docker volume ls -q)
    sudo docker network rm $(sudo docker network ls -q)
}

$1
