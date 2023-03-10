CREATE EXTENSION IF NOT EXISTS postgres_fdw;

DROP SERVER IF EXISTS old CASCADE;
CREATE SERVER old
    FOREIGN DATA WRAPPER postgres_fdw
    OPTIONS (host 'db', port '5432', dbname 'pgp');

CREATE USER MAPPING FOR pgp2 SERVER old
    OPTIONS ("user" 'pgp', password 'pgp');

DROP SCHEMA IF EXISTS old CASCADE;
CREATE SCHEMA old;

-- TRIGGERS
CREATE OR REPLACE FUNCTION disable_triggers(a boolean, nsp character varying)
  RETURNS void AS
$BODY$
declare 
act character varying;
r record;
begin
    if(a is true) then
        act = 'disable';
    else
        act = 'enable';
    end if;

    for r in select c.relname from pg_namespace n
        join pg_class c on c.relnamespace = n.oid and c.relhastriggers = true
        where n.nspname = nsp
    loop
        execute format('alter table %I.%I %s trigger all', nsp,r.relname, act); 
    end loop;
end;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;

-- column_names
-- CREATE OR REPLACE FUNCTION old.column_names(
-- 	name text DEFAULT 'users'::text)
--     RETURNS text
--     LANGUAGE 'sql'
--     COST 100
--     VOLATILE PARALLEL UNSAFE
-- AS $BODY$
-- 	SELECT
--         concat('"', string_agg(column_name, '","'), '"')
--     FROM
--         information_schema.columns
--     WHERE
--         table_name = name
--         AND table_schema = 'old';
-- $BODY$;

-- table_names
-- CREATE OR REPLACE FUNCTION old.table_names(
-- 	name text DEFAULT 'users'::text)
--     RETURNS text
--     LANGUAGE 'sql'
--     COST 100
--     VOLATILE PARALLEL UNSAFE
-- AS $BODY$
--     SELECT table_name FROM information_schema.tables
--             WHERE table_type = 'BASE TABLE' 
--             AND table_schema = 'public';

-- 	SELECT
--         concat('"', string_agg(table_name, '","'), '"')
--     FROM
--         information_schema.columns
--     WHERE
--         table_name = name
--         AND table_schema = 'old';
-- $BODY$;