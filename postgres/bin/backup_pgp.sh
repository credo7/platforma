#!/usr/bin/env bash

TYPE=$1

if [ "$TYPE" == "" ]; then
    echo "cmd: backup.sh (day|month)"
    exit $?
fi

DESDIR=$HOME/backups/$TYPE
SRCDIR=$HOME/pgp
TIME=$(date +%F_%H-%M-%S)
FILENAME=data-$TIME.tar.gz

# folder
[ -d $DESDIR ] || mkdir -p $DESDIR

# data
sudo tar -czf $DESDIR/$FILENAME $SRCDIR/data

# public
sudo cp -rn $SRCDIR/public $DESDIR
