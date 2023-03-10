#!/usr/bin/env bash

sudo clear

# старт
start() {
    # переменные
    sudo cp -n .env.dist .env
    set -a && . .env && set +a

    export XRUNS=(logs up down restart ps)
    export EVN_NODES=(development production)

    export PROJECT=$(basename $(pwd))

    if [ "$1" == "" ]; then
        d_menu RUN ${XRUNS[@]}
        d_menu SERVICE ${SERVICES[@]}
        d_menu CONFIG ${CONFIGS[@]}
        d_menu EVN_NODE ${EVN_NODES[@]}
    else
        export RUN=$1
        export SERVICE=$2
        export CONFIG=$3
        export EVN_NODE=$4
    fi

    printf "__________________________________________________________________\n"

    [ "$RUN" == "up" ] && d_net create $DC_NET
    [ "$SERVICE" == "ALL" ] && local CSERVICES=${SERVICES[@]/ALL/} || local CSERVICES=$SERVICE

    for CSERVICE in $CSERVICES; do
        printf "\nCMD: $RUN $CSERVICE $CONFIG $EVN_NODE \n"

        [[ "$RUN" == "up" ]] && dc_env $RUN $CSERVICE $CONFIG $EVN_NODE

        dc_run $RUN $CSERVICE $CONFIG $EVN_NODE

        [[ "$RUN" == "down" ]] && dc_env $RUN $CSERVICE $CONFIG $EVN_NODE
    done

    [ "$RUN" == "down" ] && d_net rm $DC_NET

    sudo rm .env
}

# копирование файлов env
dc_env() {
    local CRUN=$1
    local CSERVICE=$2
    local CCONFIG=$3
    local CNODE=$4

    IFS='-' read -ra UNITS <<<"$CSERVICE"
    local CSERVICE=${UNITS[0]}
    local CUNIT=${UNITS[1]}

    local CONFIGS_DIR=$CSERVICE/.configs

    local ENV_SRC=$CONFIGS_DIR/.env.$CCONFIG.$CNODE
    local ENV_DEST=$CSERVICE/.env

    if [[ "$CRUN" == "up" ]]; then
        [ -f "$ENV_SRC" ] && sudo cp $ENV_SRC $ENV_DEST
    fi

    if [ "$CRUN" == "down" ]; then
        [ -f "$ENV_DEST" ] && sudo rm $ENV_DEST
    fi
}

# запуск команды из сервиса
dc_run() {
    local CRUN=$1
    local CSERVICE=$2
    local CCONFIG=$3
    local CNODE=$4

    IFS='-' read -ra UNITS <<<"$CSERVICE"
    local CSERVICE=${UNITS[0]}
    local CUNIT=${UNITS[1]}

    # [ -n "$CUNIT" ] && yarn config set UNIT_ENV $CUNIT

    cd $CSERVICE
    dc:config:$CSERVICE
    dc:$CRUN
    # dc:logs:info $CSERVICE
    cd ..
}

# запуск команды сети
d_net() {
    local CRUN=$1
    local CSERVICE=$2

    sudo docker network $CRUN $CSERVICE
}

# динамическое меню
d_menu() {
    local RET_NAME=$1 && shift && local ELS=($@)

    printf "\n______________\n"
    printf "\nChoose:\n"
    for EL in ${ELS[@]}; do
        local NUM=$(($NUM + 1))
        printf "$NUM. $EL\n"
    done

    printf "\nEnter num: " && read -r VAR

    local NUM_EL=$(($VAR - 1))
    local RET=${ELS[$NUM_EL]}
    export $RET_NAME=$RET

    printf "Choooosed: $RET\n"
}

dc:up() {
    sudo docker-compose up --build -d
}
dc:down() {
    sudo docker-compose down --remove-orphans
    # sudo docker-compose down --remove-orphans -v
}
dc:restart() {
    sudo docker-compose restart
}
dc:build() {
    sudo docker-compose build --no-cache
}
dc:ps() {
    sudo docker-compose ps -a
}
dc:logs() {
    sudo docker-compose logs -f --tail=50
}
dc:logs:info() {
    sudo docker-compose logs --tail=25 $1
}
dc:config:pgadmin() {
    sudo mkdir -p data/pgadmin
    sudo chown -R 5050:5050 data/pgadmin
}

# запуск
start
echo
