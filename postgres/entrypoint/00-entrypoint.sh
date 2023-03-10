#!/usr/bin/env bash

echo "max_wal_senders = 10" >>/var/lib/postgresql/data/pgdata/postgresql.conf
echo "max_replication_slots = 10" >>/var/lib/postgresql/data/pgdata/postgresql.conf
echo "wal_level = logical" >>/var/lib/postgresql/data/pgdata/postgresql.conf
echo "log_min_messages = fatal" >>/var/lib/postgresql/data/pgdata/postgresql.conf
