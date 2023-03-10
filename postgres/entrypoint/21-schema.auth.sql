--
-- PostgreSQL database dump
--

-- Dumped from database version 14.0 (Debian 14.0-1.pgdg110+1)
-- Dumped by pg_dump version 14.1 (Ubuntu 14.1-1.pgdg21.10+1)

-- Started on 2021-12-18 11:39:30 MSK

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP SCHEMA IF EXISTS auth CASCADE;
CREATE SCHEMA IF NOT EXISTS auth;

GRANT ALL ON SCHEMA auth TO "ADMIN";

GRANT ALL ON SCHEMA auth TO PUBLIC;

GRANT ALL ON SCHEMA auth TO "USER";

GRANT ALL ON SCHEMA auth TO pgp2;

--
-- TOC entry 988 (class 1247 OID 16610)
-- Name: email_verify; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.email_verify AS (
	email text,
	"emailCode" text,
	"emailAt" timestamp with time zone,
	success boolean,
  info text
);

--
-- TOC entry 988 (class 1247 OID 16610)
-- Name: email_verify; Type: TYPE; Schema: auth; Owner: -
--

DROP TYPE IF EXISTS auth.login_attemts CASCADE;
CREATE TYPE auth.login_attemts AS (
	"attemts" integer,
	"attemtsAt" timestamp with time zone
);

--
-- TOC entry 979 (class 1247 OID 16598)
-- Name: roles; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.roles AS ENUM (
    'GUEST',
    'USER',
    'ADMIN'
);


--
-- TOC entry 982 (class 1247 OID 16607)
-- Name: token; Type: TYPE; Schema: auth; Owner: -
--

DROP TYPE IF EXISTS auth.token CASCADE;
CREATE TYPE auth.token AS (
	role auth.roles,
	id uuid,
  exp integer
);

--
-- TOC entry 361 (class 1255 OID 16613)
-- Name: user_email_code(text); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE OR REPLACE FUNCTION auth.user_email_code(email text, test boolean DEFAULT false) RETURNS auth.email_verify
    LANGUAGE plpgsql STRICT SECURITY DEFINER
    AS $_$
DECLARE
    email_verify_info auth.email_verify;
BEGIN
  UPDATE auth.users u 
    SET "emailCode" = public.uuid_generate_v4()::text, "emailAt" = now()
      WHERE u.email = $1
    RETURNING u.email, u."emailCode", u."emailAt", false INTO email_verify_info;
  RETURN email_verify_info::auth.email_verify;
END;
$_$;


--
-- TOC entry 369 (class 1255 OID 17333)
-- Name: user_email_verify(text, text, boolean); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE OR REPLACE FUNCTION auth.user_email_verify(email text, code text, recover boolean DEFAULT false) RETURNS boolean
    LANGUAGE plpgsql STRICT SECURITY DEFINER
    AS $_$
BEGIN
  PERFORM u.email FROM auth.users AS u WHERE u.email = $1 AND left(u."emailCode", 8) = $2;
  IF FOUND THEN 
    UPDATE auth.users uu SET "emailVerified" = true WHERE uu.email = $1;
    RETURN true; 
  ELSE
    RETURN false; 
  END IF;
END;
$_$;

COMMENT ON FUNCTION auth.user_email_verify(text, text, boolean) IS '@resultFieldName success';


SET default_table_access_method = heap;

--
-- TOC entry 217 (class 1259 OID 16622)
-- Name: users; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE IF NOT EXISTS auth.users
(
    id uuid NOT NULL DEFAULT public.uuid_generate_v4(),
    "createdAt" timestamp with time zone DEFAULT now(),
    "updatedAt" timestamp with time zone DEFAULT now(),
    password text COLLATE pg_catalog."default" NOT NULL,
    email text COLLATE pg_catalog."default" NOT NULL,
    "emailVerified" boolean DEFAULT false,
    role auth.roles DEFAULT 'USER'::auth.roles,
    username text COLLATE pg_catalog."default" NOT NULL,
    "emailAt" timestamp with time zone DEFAULT now(),
    "platformId" uuid,
    "emailCode" text COLLATE pg_catalog."default" DEFAULT (public.uuid_generate_v4())::text,
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_username UNIQUE (username)
);

--
-- TOC entry 217 (class 1259 OID 16622)
-- Name: users; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE IF NOT EXISTS auth."usersLogin"
(
    id uuid NOT NULL DEFAULT public.uuid_generate_v4(),
    attemts integer DEFAULT 0,
    "createAt" timestamp with time zone DEFAULT now(),
    "updateAt" timestamp with time zone DEFAULT now(),
    email text COLLATE pg_catalog."default" NOT NULL,
    "attemtsAt" timestamp with time zone DEFAULT now(),
    CONSTRAINT "userLogin_pkey" PRIMARY KEY (id),
    CONSTRAINT "usersLogin_email" UNIQUE (email)
);


--
-- TOC entry 368 (class 1255 OID 17255)
-- Name: user_id(); Type: FUNCTION; Schema: auth; Owner: -
--

DROP FUNCTION IF EXISTS auth.user_id() CASCADE;
CREATE FUNCTION auth.user_id() RETURNS text
    LANGUAGE plpgsql STABLE PARALLEL UNSAFE
    AS $$
BEGIN
    RETURN nullif(current_setting('jwt.claims.id', TRUE), '');
END;
$$;

--
-- TOC entry 384 (class 1255 OID 17696)
-- Name: get_token(); Type: FUNCTION; Schema: public; Owner: -
--

DROP FUNCTION IF EXISTS auth.get_token();
CREATE FUNCTION auth.get_token() RETURNS auth.token
    LANGUAGE plpgsql STABLE
    AS $$
DECLARE
        token_info auth.token;
BEGIN
    SELECT * FROM json_populate_record(null::token, current_setting('jwt.claims.token', TRUE)::json) 
      INTO token_info;
    RETURN token_info;
END;
$$;

--
-- TOC entry 362 (class 1255 OID 16615)
-- Name: user_login(text, text); Type: FUNCTION; Schema: auth; Owner: -
--

DROP FUNCTION IF EXISTS auth.user_login(email text, password text);
CREATE FUNCTION auth.user_login(email text, password text) RETURNS auth.token
    LANGUAGE plpgsql STRICT SECURITY DEFINER
    AS $_$
DECLARE
        token_info auth.token;
BEGIN
    SELECT 
        u.role, u.id,
        extract(epoch from (now() + interval '1 year')) AS exp_info
      INTO token_info 
      FROM auth.users AS u 
        WHERE (u.email = $1 OR u.username = $1) 
          AND u.password = public.crypt($2, u.password)
        ORDER BY u.email ASC
        LIMIT 1;

    RETURN token_info::auth.token;
END;
$_$;


--
-- TOC entry 362 (class 1255 OID 16615)
-- Name: user_login(text, text); Type: FUNCTION; Schema: auth; Owner: -
--

DROP FUNCTION IF EXISTS auth.user_login_attemts(text);
CREATE FUNCTION auth.user_login_attemts(_email text) RETURNS auth.login_attemts
    LANGUAGE plpgsql STRICT SECURITY DEFINER
    AS $_$
DECLARE
  ret auth.login_attemts;
BEGIN
  INSERT INTO auth."usersLogin" AS ul
 		  ("email", "attemts", "attemtsAt") 
    VALUES ($1, 1, now()) 
	ON CONFLICT ("email") DO UPDATE 
  		SET "attemts" = ul."attemts" + 1, 
      		"attemtsAt" = now()
  RETURNING ul."attemts", ul."attemtsAt" INTO ret;
    
  RETURN ret;
END;
$_$;

--
-- TOC entry 363 (class 1255 OID 16616)
-- Name: user_logout(text); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.user_logout() RETURNS boolean
    LANGUAGE plpgsql STRICT SECURITY DEFINER
    AS $$
BEGIN
    RETURN true;
END;
$$;

COMMENT ON FUNCTION auth.user_logout() IS '@resultFieldName success';

--
-- TOC entry 364 (class 1255 OID 16617)
-- Name: user_password_recover(text, text, text); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.user_password_recover(email text, code text, new_password text) RETURNS boolean
    LANGUAGE plpgsql STRICT SECURITY DEFINER
    AS $_$
BEGIN
  UPDATE auth.users u
      SET "password" = public.crypt($3, public.gen_salt('bf', 12))
          WHERE u.email = $1 AND left(u."emailCode", 8) = $2;
  
  IF FOUND THEN 
    RETURN true; 
  ELSE
    RETURN false; 
  END IF;
END;
$_$;

COMMENT ON FUNCTION auth.user_password_recover(text, text, text) IS '@resultFieldName success';

--
-- TOC entry 364 (class 1255 OID 16617)
-- Name: user_password_recover(text, text, text); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE OR REPLACE FUNCTION auth.user_update(email text, password text, field text, value text) RETURNS boolean
    LANGUAGE plpgsql STRICT SECURITY DEFINER
    AS $_$
BEGIN
    
    IF $3 = 'password' THEN 
      UPDATE auth.users u 
        SET "password" = public.crypt($4, public.gen_salt('bf', 12))
        WHERE u.email = $1 AND u.password = public.crypt($2, u.password);

    END IF;

    IF $3 = 'email' THEN 
      UPDATE auth.users AS u 
        SET "email" = $4, "emailVerified" = false
        WHERE u.email = $1 AND u.password = public.crypt($2, u.password);
    END IF;

    IF $3 = 'username' THEN 
      UPDATE auth.users AS u 
        SET "username" = $4
        WHERE u.email = $1 AND u.password = public.crypt($2, u.password);
    END IF;

    IF FOUND THEN 
        RETURN true; 
    ELSE
        RETURN false; 
    END IF;
END;
$_$;

COMMENT ON FUNCTION auth.user_update(text, text, text, text) IS '@resultFieldName success';

--
-- TOC entry 366 (class 1255 OID 16619)
-- Name: user_register(text, text, text); Type: FUNCTION; Schema: auth; Owner: -
--

DROP FUNCTION IF EXISTS auth.user_register(email text, username text, password text);
CREATE FUNCTION auth.user_register(email text, username text, password text) RETURNS boolean
    LANGUAGE plpgsql STRICT SECURITY DEFINER
    AS $_$
BEGIN
    INSERT INTO auth.users AS u ("email", "password", "username") 
        VALUES ($1, public.crypt($3, public.gen_salt('bf', 12)), $2);
    
     IF FOUND THEN 
        RETURN true; 
    ELSE
        RETURN false; 
    END IF;
END;
$_$;

COMMENT ON FUNCTION auth.user_register(text, text, text) IS '@resultFieldName success';

--
-- TOC entry 367 (class 1255 OID 16621)
-- Name: graphql_subscription(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.graphql_subscription() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO '$user', 'auth'
    AS $_$
declare
  v_process_new bool = (TG_OP = 'INSERT' OR TG_OP = 'UPDATE');
  v_process_old bool = (TG_OP = 'UPDATE' OR TG_OP = 'DELETE');
  v_event text = TG_ARGV[0];
  v_topic_template text = TG_ARGV[1];
  v_attribute text = TG_ARGV[2];
  v_record record;
  v_sub text;
  v_topic text;
  v_i int = 0;
  v_last_topic text;
begin
  for v_i in 0..1 loop
    if (v_i = 0) and v_process_new is true then
      v_record = new;
    elsif (v_i = 1) and v_process_old is true then
      v_record = old;
    else
      continue;
    end if;
     if v_attribute is not null then
      execute 'select $1.' || quote_ident(v_attribute)
        using v_record
        into v_sub;
    end if;
    if v_sub is not null then
      v_topic = replace(v_topic_template, '$1', v_sub);
    else
      v_topic = v_topic_template;
    end if;
    if v_topic is distinct from v_last_topic then
      
      v_last_topic = v_topic;
      perform pg_notify(v_topic, json_build_object(
        'event', v_event,
        'subject', v_sub
      )::text);
    end if;
  end loop;
  return v_record;
end;
$_$;


--
-- TOC entry 3387 (class 2606 OID 16633)
-- Name: users users_email; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_email UNIQUE (email);


--
-- TOC entry 3389 (class 2606 OID 16635)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

-- ALTER TABLE ONLY auth.users
--     ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 3391 (class 2606 OID 16637)
-- Name: users users_username; Type: CONSTRAINT; Schema: auth; Owner: -
--

-- ALTER TABLE ONLY auth.users
--     ADD CONSTRAINT users_username UNIQUE (username);

-- ROW LEVEL SECURITY
ALTER TABLE IF EXISTS auth.users
    ENABLE ROW LEVEL SECURITY;
    
DROP POLICY IF EXISTS all_to_user ON auth.users;
CREATE POLICY all_to_user
    ON auth.users
    AS PERMISSIVE
    FOR ALL
    TO "USER"
    USING (((id)::text = auth.user_id()))
    WITH CHECK (((id)::text = auth.user_id()));

DROP POLICY IF EXISTS all_to_admin ON auth.users;
CREATE POLICY all_to_admin
    ON auth.users
    AS PERMISSIVE
    FOR ALL
    TO "ADMIN"
    USING (((id)::text ~~ '%%'::text));

DROP POLICY IF EXISTS all_to_auth ON auth.users;
CREATE POLICY all_to_auth
    ON auth.users
    AS PERMISSIVE
    FOR ALL
    TO pgp2
    USING (((id)::text ~~ '%%'::text));

CREATE TABLE IF NOT EXISTS auth.platforms
(
    id uuid NOT NULL DEFAULT public.uuid_generate_v4(),
    "createdAt" timestamp with time zone DEFAULT now(),
    "updatedAt" timestamp with time zone DEFAULT now(),
    name character varying(255) COLLATE pg_catalog."default",
    url text COLLATE pg_catalog."default",
    callback text COLLATE pg_catalog."default",
    CONSTRAINT platforms_pkey PRIMARY KEY (id),
    CONSTRAINT platforms_name UNIQUE (name)
        DEFERRABLE
);

-- ALTER TABLE IF EXISTS auth.users
--     ADD COLUMN "platformId" uuid;

-- Completed on 2022-02-20 07:00:00 MSK

--
-- PostgreSQL database dump complete
--



----------------------------------------------------------------------

TRUNCATE auth.platforms CASCADE;

-- PLATFORMS
INSERT INTO auth.platforms 
  (id, "createdAt", "updatedAt", name, url, callback) 
VALUES (
  '7b5e85a5-61a5-47cb-84df-59189bef40af',	
  '2021-12-18 12:37:58.787082+00',	
  '2021-12-18 12:37:58.787082+00',	
  'pgp',	
  'http://localhost:5000',	
  'http://localhost:4100');

TRUNCATE auth.users CASCADE;

SELECT auth.user_register('admin', 'admin', 'admin1@');
SELECT auth.user_register('user0', 'user0', 'user0@');
SELECT auth.user_register('user1', 'user1', 'user1@');
SELECT auth.user_register('user2', 'user2', 'user2@');
SELECT auth.user_register('user3', 'user3', 'user3@');
SELECT auth.user_register('user4', 'user4', 'user4@');
SELECT auth.user_register('user5', 'user5', 'user5@');
SELECT auth.user_register('user6', 'user6', 'user6@');
SELECT auth.user_register('user7', 'user7', 'user7@');
SELECT auth.user_register('user8', 'user8', 'user8@');
SELECT auth.user_register('user9', 'user9', 'user9@');

UPDATE auth.users t SET "emailVerified" = true FROM auth.users f;
UPDATE auth.users SET "role" = 'ADMIN' WHERE username = 'admin';