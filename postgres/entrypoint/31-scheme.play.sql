--
-- PostgreSQL database dump
--

-- Dumped from database version 14.0 (Debian 14.0-1.pgdg110+1)
-- Dumped by pg_dump version 14.1 (Ubuntu 14.1-1.pgdg21.10+1)

-- Started on 2022-01-12 11:31:25 MSK

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

DROP SCHEMA IF EXISTS play CASCADE;
CREATE SCHEMA IF NOT EXISTS play;

GRANT ALL ON SCHEMA play TO "ADMIN";

GRANT ALL ON SCHEMA play TO PUBLIC;

GRANT ALL ON SCHEMA play TO "USER";

GRANT ALL ON SCHEMA play TO pgp2;

--
-- TOC entry 1030 (class 1247 OID 16545)
-- Name: emailType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE play."emailType" AS ENUM (
    'VERIFY',
    'RECOVER'
);


--
-- TOC entry 1174 (class 1247 OID 17687)
-- Name: roles; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE play.roles AS ENUM (
    'GUEST',
    'USER',
    'ADMIN'
);


--
-- TOC entry 1177 (class 1247 OID 17695)
-- Name: token; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE play.token AS (
	role play.roles,
	id uuid,
	email text,
	"emailVerified" boolean,
	"updatedAt" timestamp with time zone,
	username character varying(255)
);


--
-- TOC entry 1033 (class 1247 OID 16553)
-- Name: tournamentFormat; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE play."tournamentFormat" AS ENUM (
    'SOLO',
    'TEAM'
);


--
-- TOC entry 1036 (class 1247 OID 16558)
-- Name: tournamentStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE play."tournamentStatus" AS ENUM (
    'UPCOMING',
    'REGISTRATION',
    'CONFIRMATION',
    'LIVE',
    'FINISHED'
);


--
-- TOC entry 1183 (class 1247 OID 17708)
-- Name: walletsCardsWhere; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE play."walletsCardsWhere" AS ENUM (
    'PHONE',
    'CARD'
);


--
-- TOC entry 1186 (class 1247 OID 17714)
-- Name: walletsTransactionsStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE play."walletsTransactionsStatus" AS ENUM (
    'STARTED',
    'PROCESSED',
    'COMPLETED'
);

--
-- TOC entry 380 (class 1255 OID 16579)
-- Name: admin_notifications(text, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION play.admin_notifications(title text, message text) RETURNS boolean
    LANGUAGE plpgsql STRICT SECURITY DEFINER
    AS $_$

BEGIN
    insert into play.notifications("userId", "title", "message" )
    select id, $1, $2 from users;
RETURN true;
END;
$_$;


--
-- TOC entry 4242 (class 0 OID 0)
-- Dependencies: 380
-- Name: FUNCTION admin_notifications(title text, message text); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION play.admin_notifications(title text, message text) IS '@resultFieldName success';


--
-- TOC entry 379 (class 1255 OID 16580)
-- Name: chat_roster_read(uuid, uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION play.chat_roster_read("userId" uuid, "roomId" uuid) RETURNS boolean
    LANGUAGE plpgsql
    AS $_$
BEGIN
PERFORM "chatRosters"."toUserId", read FROM "chatRosters" WHERE "chatRosters"."toUserId" = $1 AND "chatRosters"."roomId" = $2 AND read = false;

IF FOUND THEN
	UPDATE "chatRosters" SET read = true WHERE "chatRosters"."toUserId" = $1 AND "chatRosters"."roomId" = $2 AND read = false;
	RETURN true;
END IF;

RETURN false;
END;
$_$;


--
-- TOC entry 382 (class 1255 OID 17679)
-- Name: create_chat_rooms_users(uuid, uuid[]); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION play.create_chat_rooms_users("roomId" uuid, "userIds" uuid[]) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
DECLARE
	"userId" uuid;
BEGIN

FOREACH "userId" IN ARRAY "userIds"
LOOP
	INSERT INTO play."chatRoomsUsers" ("roomId", "userId")
     	VALUES ("roomId", "userId");
END LOOP;

RETURN true;
END;
$$;


--
-- TOC entry 4243 (class 0 OID 0)
-- Dependencies: 382
-- Name: FUNCTION create_chat_rooms_users("roomId" uuid, "userIds" uuid[]); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION play.create_chat_rooms_users("roomId" uuid, "userIds" uuid[]) IS '@resultFieldName success';


--
-- TOC entry 381 (class 1255 OID 16581)
-- Name: get_enum(text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION play.get_enum(_typname text) RETURNS TABLE(name name)
    LANGUAGE plpgsql STABLE
    AS $_$
BEGIN
   RETURN QUERY
   SELECT e.enumlabel
  FROM pg_enum e
  JOIN pg_type t ON e.enumtypid = t.oid
  WHERE t.typname = $1;
END
$_$;

--
-- TOC entry 368 (class 1255 OID 17255)
-- Name: user_id(); Type: FUNCTION; Schema: auth; Owner: -
--

DROP FUNCTION IF EXISTS play.user_id();
CREATE FUNCTION play.user_user_id() RETURNS text
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

CREATE FUNCTION play.get_token() RETURNS play.token
    LANGUAGE plpgsql STABLE
    AS $$
DECLARE
        token_info token;
BEGIN
    SELECT * FROM json_populate_record(null::token, current_setting('jwt.claims.token', TRUE)::json) 
      INTO token_info;
    RETURN token_info;
END;
$$;


--
-- TOC entry 375 (class 1255 OID 16583)
-- Name: graphql_subscription(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION play.graphql_subscription() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO '$user', 'public'
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
  -- On UPDATE sometimes topic may be changed for NEW record,
  -- so we need notify to both topics NEW and OLD.
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
      -- This if statement prevents us from triggering the same notification twice
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


SET default_table_access_method = heap;

--
-- TOC entry 214 (class 1259 OID 16584)
-- Name: teamsPlayers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE play."teamsPlayers" (
    "teamId" uuid NOT NULL,
    "playerId" uuid NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL
);


--
-- TOC entry 376 (class 1255 OID 16590)
-- Name: teamsPlayers_isCaptain(play."teamsPlayers"); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION play."teamsPlayers_isCaptain"(tp play."teamsPlayers") RETURNS boolean
    LANGUAGE sql STABLE
    AS $$
	SELECT true as isCaptain 
	FROM play.teams tt
	WHERE tt."captainId" = tp.id
$$;


--
-- TOC entry 383 (class 1255 OID 17685)
-- Name: update_updated_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION play.update_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW."updatedAt" := now();
    RETURN NEW;
END;
$$;


--
-- TOC entry 215 (class 1259 OID 16591)
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE play.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    username character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    image text,
    language character varying(2) DEFAULT 'ru'::character varying,
    vbalance integer DEFAULT 0,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
    "blockChat" boolean DEFAULT false,
    rotate integer DEFAULT 0,
    online boolean DEFAULT false NOT NULL,
    "gameId" character varying
);


--
-- TOC entry 377 (class 1255 OID 16609)
-- Name: users_friends_invited(play.users); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION play.users_friends_invited(users play.users) RETURNS bigint
    LANGUAGE sql STABLE
    AS $$
  SELECT ((
	SELECT COUNT(*) 
	FROM play."friendsInvites" fi 
	WHERE fi."userId" = users.id
		and fi.status = 'INVITED'
) + (
	SELECT COUNT(*) 
	FROM play."friendsInvites" fi 
	WHERE fi."friendId" = users.id
		and fi.status = 'INVITED'
)) as friendsInvited
$$;


--
-- TOC entry 378 (class 1255 OID 16610)
-- Name: users_teams_invited(play.users); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION play.users_teams_invited(users play.users) RETURNS bigint
    LANGUAGE sql STABLE
    AS $$
	SELECT COUNT(*) as teamssInvited
	FROM play."teamsInvites" ti 
	WHERE ti."playerId" = users.id
		and ti.status = 'INVITED'
$$;


--
-- TOC entry 216 (class 1259 OID 16611)
-- Name: chatMessages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE play."chatMessages" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    text text NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 217 (class 1259 OID 16619)
-- Name: chatRooms; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE play."chatRooms" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
    name character varying NOT NULL,
    enc text DEFAULT public.uuid_generate_v4() NOT NULL
);


--
-- TOC entry 218 (class 1259 OID 16628)
-- Name: chatRoomsUsers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE play."chatRoomsUsers" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now(),
    "updatedAt" timestamp without time zone DEFAULT now(),
    "roomId" uuid NOT NULL,
    "userId" uuid NOT NULL,
    "isBlocked" boolean DEFAULT false NOT NULL
);


--
-- TOC entry 219 (class 1259 OID 16635)
-- Name: chatRosters; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE play."chatRosters" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "messageId" uuid NOT NULL,
    read boolean DEFAULT false NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
    "fromUserId" uuid NOT NULL,
    "toUserId" uuid NOT NULL,
    "roomId" uuid NOT NULL
);


--
-- TOC entry 220 (class 1259 OID 16642)
-- Name: countdowns; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE play.countdowns (
    id uuid NOT NULL,
    type character varying(255) NOT NULL,
    "teamId" uuid,
    "userId" uuid,
    "expiresAt" timestamp with time zone,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- TOC entry 221 (class 1259 OID 16654)
-- Name: friends; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE play.friends (
    "userId" uuid NOT NULL,
    "friendId" uuid NOT NULL,
    accepted boolean DEFAULT false,
    blocked boolean DEFAULT false,
    active boolean DEFAULT false,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
    "blockedBy" uuid,
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL
);


--
-- TOC entry 222 (class 1259 OID 16663)
-- Name: friendsInvites; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE play."friendsInvites" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "userId" uuid NOT NULL,
    "friendId" uuid NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now(),
    "updatedAt" timestamp with time zone DEFAULT now(),
    status character varying DEFAULT 'INVITED'::character varying
);


--
-- TOC entry 223 (class 1259 OID 16672)
-- Name: games; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE play.games (
    id character varying(255) DEFAULT 'newGame'::character varying NOT NULL,
    name character varying(255) DEFAULT 'newGame'::character varying NOT NULL,
    descirption character varying(255),
    icon character varying(255) DEFAULT 'https://via.placeholder.com/80'::character varying,
    image character varying(255) DEFAULT 'https://via.placeholder.com/300x500'::character varying,
    card character varying(255) DEFAULT 'https://via.placeholder.com/300x500'::character varying,
    "position" integer,
    status character varying(255) DEFAULT 'published'::character varying,
    url character varying(255) DEFAULT 'published'::character varying,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
    active boolean DEFAULT false,
    "teamLimit" integer
);


--
-- TOC entry 224 (class 1259 OID 16687)
-- Name: gamesMaps; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE play."gamesMaps" (
    id uuid NOT NULL,
    "gameId" character varying(255) NOT NULL,
    "mapName" character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- TOC entry 225 (class 1259 OID 16692)
-- Name: gamesRegions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE play."gamesRegions" (
    id uuid NOT NULL,
    "gameId" character varying(255) NOT NULL,
    "regionId" uuid NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- TOC entry 226 (class 1259 OID 16695)
-- Name: memberships; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE play.memberships (
    id character varying(255) DEFAULT 'free'::character varying NOT NULL,
    type character varying(255) DEFAULT 'free'::character varying NOT NULL,
    "desc" text DEFAULT ''::text
);


--
-- TOC entry 227 (class 1259 OID 16703)
-- Name: membershipsCosts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE play."membershipsCosts" (
    id integer NOT NULL,
    "membershipId" character varying(255) NOT NULL,
    period integer DEFAULT 1 NOT NULL,
    "costUSD" integer DEFAULT 0 NOT NULL,
    "costRUB" integer DEFAULT 0 NOT NULL,
    "costByPeriodUSD" integer DEFAULT 0 NOT NULL,
    "costByPeriodRUB" integer DEFAULT 0 NOT NULL,
    discount integer DEFAULT 0 NOT NULL,
    ezpoints integer DEFAULT 0 NOT NULL,
    tournaments boolean DEFAULT false NOT NULL,
    "multiGames" boolean DEFAULT false NOT NULL,
    locale_ezpoints_en character varying(255) DEFAULT '+X% ezpoints more'::character varying NOT NULL,
    locale_ezpoints_ru character varying(255) DEFAULT 'на +X% ezpoints больше'::character varying NOT NULL,
    locale_tournaments_en character varying(255) DEFAULT 'Premium Tournaments'::character varying NOT NULL,
    locale_tournaments_ru character varying(255) DEFAULT 'Премиум турниры'::character varying NOT NULL,
    "locale_multiGames_en" character varying(255) DEFAULT 'All Games'::character varying NOT NULL,
    "locale_multiGames_ru" character varying(255) DEFAULT 'На все игры'::character varying NOT NULL
);


--
-- TOC entry 228 (class 1259 OID 16723)
-- Name: membershipsCosts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE play."membershipsCosts_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4244 (class 0 OID 0)
-- Dependencies: 228
-- Name: membershipsCosts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE play."membershipsCosts_id_seq" OWNED BY play."membershipsCosts".id;


--
-- TOC entry 229 (class 1259 OID 16724)
-- Name: notifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE play.notifications (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "userId" uuid NOT NULL,
    type character varying(255),
    title character varying(255),
    message character varying(255),
    read boolean DEFAULT false,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 230 (class 1259 OID 16733)
-- Name: notificationsMatches; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE play."notificationsMatches" (
    id uuid NOT NULL,
    "notificationId" uuid NOT NULL,
    "matchId" uuid NOT NULL
);


--
-- TOC entry 231 (class 1259 OID 16736)
-- Name: notificationsTeams; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE play."notificationsTeams" (
    id uuid NOT NULL,
    "notificationId" uuid NOT NULL,
    "teamId" uuid NOT NULL
);


--
-- TOC entry 232 (class 1259 OID 16739)
-- Name: notificationsTournaments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE play."notificationsTournaments" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "notificationId" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "tournamentId" integer NOT NULL,
    read boolean DEFAULT false NOT NULL,
    "userId" uuid NOT NULL
);


--
-- TOC entry 233 (class 1259 OID 16745)
-- Name: phoneVerifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE play."phoneVerifications" (
    id uuid NOT NULL,
    "userId" uuid NOT NULL,
    phone character varying(255) NOT NULL,
    code character varying(255) NOT NULL,
    verified boolean DEFAULT false,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- TOC entry 234 (class 1259 OID 16751)
-- Name: players; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE play.players (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "gameId" character varying(255) NOT NULL,
    "userId" uuid NOT NULL,
    tag character varying(255) NOT NULL,
    username character varying(255) NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
    active boolean DEFAULT false
);


--
-- TOC entry 235 (class 1259 OID 16760)
-- Name: playersRatings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE play."playersRatings" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "gameId" character varying(255) NOT NULL,
    "playerId" uuid NOT NULL,
    elo integer DEFAULT 1000 NOT NULL
);


--
-- TOC entry 236 (class 1259 OID 16765)
-- Name: playersRatingsHistories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE play."playersRatingsHistories" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "gameId" character varying(255) NOT NULL,
    "playerId" uuid NOT NULL,
    elo integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 237 (class 1259 OID 16772)
-- Name: playersStats; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE play."playersStats" (
    id uuid NOT NULL,
    "gameId" character varying(255) NOT NULL,
    "playerId" uuid NOT NULL,
    wins integer DEFAULT 0,
    loss integer DEFAULT 0,
    draws integer DEFAULT 0,
    tls integer DEFAULT 0,
    total integer DEFAULT 0,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- TOC entry 238 (class 1259 OID 16780)
-- Name: regions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE play.regions (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    alias character varying(255) NOT NULL,
    language character varying(255) NOT NULL,
    timezone character varying(255) NOT NULL,
    published boolean DEFAULT false NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- TOC entry 239 (class 1259 OID 16786)
-- Name: settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE play.settings (
    id character varying NOT NULL,
    value character varying
);


--
-- TOC entry 240 (class 1259 OID 16791)
-- Name: shopCategories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE play."shopCategories" (
    id character varying(255) DEFAULT 'brawl'::character varying NOT NULL,
    image character varying(255),
    name character varying(255) NOT NULL,
    "shortName" character varying(255),
    "longName" character varying(255),
    "daysToDelivery" integer DEFAULT 0,
    published boolean DEFAULT false
);


--
-- TOC entry 241 (class 1259 OID 16799)
-- Name: shopOrders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE play."shopOrders" (
    id uuid NOT NULL,
    "itemId" uuid NOT NULL,
    "userId" uuid NOT NULL,
    status character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- TOC entry 242 (class 1259 OID 16802)
-- Name: shops; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE play.shops (
    id uuid NOT NULL,
    "categoryId" character varying(255) NOT NULL,
    image character varying(255),
    name character varying(255) NOT NULL,
    "shortDesc" text,
    "longDesc" text,
    "isNew" boolean DEFAULT false,
    "orderType" character varying(255) DEFAULT 'virtual'::character varying,
    price integer DEFAULT 0,
    quantity integer DEFAULT 0,
    unlimited boolean DEFAULT false,
    url text,
    published boolean DEFAULT false NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- TOC entry 264 (class 1259 OID 17697)
-- Name: socials; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE play.socials (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(255) NOT NULL,
    field character varying(255) NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
    url text NOT NULL
);


--
-- TOC entry 243 (class 1259 OID 16813)
-- Name: teams; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE play.teams (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "gameId" character varying(255) NOT NULL,
    "ownerId" uuid NOT NULL,
    name character varying(255) NOT NULL,
    "shortName" character varying(255),
    country character varying(255),
    description text,
    image text,
    deleted boolean DEFAULT false,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
    "captainId" uuid
);


--
-- TOC entry 244 (class 1259 OID 16822)
-- Name: teamsInvites; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE play."teamsInvites" (
    "teamId" uuid NOT NULL,
    "playerId" uuid NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    status character varying DEFAULT 'INVITED'::character varying NOT NULL
);


--
-- TOC entry 245 (class 1259 OID 16831)
-- Name: teamsRatings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE play."teamsRatings" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "gameId" character varying(255) NOT NULL,
    "teamId" uuid NOT NULL,
    elo integer DEFAULT 1000 NOT NULL
);


--
-- TOC entry 246 (class 1259 OID 16836)
-- Name: teamsRatingsHistories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE play."teamsRatingsHistories" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "gameId" character varying(255) NOT NULL,
    "teamId" uuid NOT NULL,
    elo integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 247 (class 1259 OID 16843)
-- Name: teamsStats; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE play."teamsStats" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "gameId" character varying(255) NOT NULL,
    "teamId" uuid NOT NULL,
    wins integer DEFAULT 0,
    loss integer DEFAULT 0,
    draws integer DEFAULT 0,
    tls integer DEFAULT 0,
    total integer DEFAULT 0,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 248 (class 1259 OID 16854)
-- Name: tournaments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE play.tournaments (
    id integer NOT NULL,
    "gameId" character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    image text,
    prize character varying(255),
    "prizeCurrency" character varying(255),
    "teamSize" integer,
    slots integer NOT NULL,
    "seedCreated" boolean DEFAULT false,
    premium boolean DEFAULT false,
    "registrationOpen" boolean DEFAULT false,
    "registrationStartAt" timestamp with time zone NOT NULL,
    "confirmationStartAt" timestamp with time zone NOT NULL,
    "confirmationEndAt" timestamp with time zone NOT NULL,
    "liveStartAt" timestamp with time zone NOT NULL,
    "liveEndAt" timestamp with time zone NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    paid boolean DEFAULT false,
    vpaid boolean DEFAULT false,
    cost integer DEFAULT 0,
    "viewSlots" boolean DEFAULT true,
    status play."tournamentStatus",
    format play."tournamentFormat"
);


--
-- TOC entry 249 (class 1259 OID 16866)
-- Name: tournamentsMatches; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE play."tournamentsMatches" (
    id uuid NOT NULL,
    "tournamentId" integer NOT NULL,
    "startAt" timestamp with time zone,
    status character varying(255),
    "lobbyName" character varying(255),
    "lobbyPassword" character varying(255),
    "prevPosition" character varying(255) DEFAULT '0'::character varying,
    "nextPosition" character varying(255) DEFAULT '0:up'::character varying,
    "groupIndex" integer DEFAULT 0,
    bracket character varying(255) DEFAULT 'winners'::character varying,
    "roundIndex" integer DEFAULT 1,
    "position" integer DEFAULT 1,
    "playerScore" integer,
    "opponentScore" integer,
    "playerId" uuid,
    "opponentId" uuid,
    "winnerId" uuid,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- TOC entry 250 (class 1259 OID 16877)
-- Name: tournamentsMatchesMaps; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE play."tournamentsMatchesMaps" (
    id integer NOT NULL,
    "tournamentId" integer NOT NULL,
    "matchId" uuid NOT NULL,
    "playerScore" integer,
    "opponentScore" integer,
    "mapId" uuid NOT NULL,
    "mapName" character varying(255)
);


--
-- TOC entry 251 (class 1259 OID 16880)
-- Name: tournamentsMatchesMaps_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE play."tournamentsMatchesMaps_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4245 (class 0 OID 0)
-- Dependencies: 251
-- Name: tournamentsMatchesMaps_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE play."tournamentsMatchesMaps_id_seq" OWNED BY play."tournamentsMatchesMaps".id;


--
-- TOC entry 252 (class 1259 OID 16881)
-- Name: tournamentsPartners; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE play."tournamentsPartners" (
    "tournamentId" integer NOT NULL,
    name character varying(255),
    image text,
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL
);


--
-- TOC entry 253 (class 1259 OID 16887)
-- Name: tournamentsPlayers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE play."tournamentsPlayers" (
    "tournamentId" integer NOT NULL,
    "playerId" uuid NOT NULL,
    name character varying(255),
    "isReady" boolean DEFAULT false,
    "tookPlace" character varying(255),
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
    "tookKill" character varying(255),
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL
);


--
-- TOC entry 254 (class 1259 OID 16896)
-- Name: tournamentsPrizes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE play."tournamentsPrizes" (
    "tournamentId" integer NOT NULL,
    image text,
    type integer,
    currency character varying(255),
    points integer DEFAULT 0 NOT NULL,
    "addtlText" character varying(255),
    "addtlImage" character varying(255),
    place integer NOT NULL,
    amount integer NOT NULL,
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL
);


--
-- TOC entry 255 (class 1259 OID 16903)
-- Name: tournamentsRounds; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE play."tournamentsRounds" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "tournamentId" integer NOT NULL,
    "lobbyName" character varying(255),
    "lobbyPassword" character varying(255),
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 256 (class 1259 OID 16911)
-- Name: tournamentsRules; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE play."tournamentsRules" (
    "tournamentId" integer NOT NULL,
    name character varying(255) NOT NULL,
    text text NOT NULL,
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL
);


--
-- TOC entry 257 (class 1259 OID 16917)
-- Name: tournamentsTeams; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE play."tournamentsTeams" (
    "tournamentId" integer NOT NULL,
    "teamId" uuid NOT NULL,
    "teamName" character varying(255) NOT NULL,
    "isReady" boolean DEFAULT false,
    "tookPlace" character varying(255),
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
    "tookKill" character varying(255),
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL
);


--
-- TOC entry 258 (class 1259 OID 16926)
-- Name: tournamentsTeamsPlayers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE play."tournamentsTeamsPlayers" (
    "tournamentId" integer NOT NULL,
    "playerName" character varying(255) NOT NULL,
    "playerId" uuid NOT NULL,
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "tournamentTeamId" uuid NOT NULL
);


--
-- TOC entry 259 (class 1259 OID 16930)
-- Name: tournaments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE play.tournaments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4246 (class 0 OID 0)
-- Dependencies: 259
-- Name: tournaments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE play.tournaments_id_seq OWNED BY play.tournaments.id;


--
-- TOC entry 260 (class 1259 OID 16939)
-- Name: usersMemberships; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE play."usersMemberships" (
    id integer NOT NULL,
    "userId" uuid NOT NULL,
    "membershipId" character varying(255) NOT NULL,
    "planId" integer NOT NULL,
    "gameId" character varying(255) NOT NULL,
    "orderedAt" timestamp with time zone NOT NULL,
    "expiresAt" timestamp with time zone NOT NULL,
    times integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- TOC entry 261 (class 1259 OID 16945)
-- Name: usersMemberships_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE play."usersMemberships_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4247 (class 0 OID 0)
-- Dependencies: 261
-- Name: usersMemberships_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE play."usersMemberships_id_seq" OWNED BY play."usersMemberships".id;


--
-- TOC entry 262 (class 1259 OID 16946)
-- Name: usersSocials; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE play."usersSocials" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "userId" uuid NOT NULL,
    vk character varying(255) DEFAULT ''::character varying,
    facebook character varying(255) DEFAULT ''::character varying,
    twitch character varying(255) DEFAULT ''::character varying,
    youtube character varying(255) DEFAULT ''::character varying,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
    instagram character varying(255) DEFAULT ''::character varying,
    discord character varying(255) DEFAULT ''::character varying
);


--
-- TOC entry 267 (class 1259 OID 17732)
-- Name: wallets; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE play.wallets (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now(),
    "updatedAt" timestamp with time zone DEFAULT now(),
    "userId" uuid NOT NULL
);


--
-- TOC entry 266 (class 1259 OID 17722)
-- Name: walletsBanks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE play."walletsBanks" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now(),
    "updatedAt" timestamp with time zone DEFAULT now(),
    "order" integer NOT NULL,
    name text NOT NULL
);


--
-- TOC entry 265 (class 1259 OID 17721)
-- Name: walletsBanks_order_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE play."walletsBanks" ALTER COLUMN "order" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME play."walletsBanks_order_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 268 (class 1259 OID 17748)
-- Name: walletsCards; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE play."walletsCards" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now(),
    "updatedAt" timestamp with time zone DEFAULT now(),
    "walletId" uuid NOT NULL,
    name text NOT NULL,
    "bankId" uuid NOT NULL,
    "where" play."walletsCardsWhere" DEFAULT 'CARD'::play."walletsCardsWhere" NOT NULL,
    number bigint NOT NULL
);


--
-- TOC entry 269 (class 1259 OID 17772)
-- Name: walletsTransactions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE play."walletsTransactions" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
    "walletId" uuid NOT NULL,
    amount integer,
    comment character varying(255),
    status play."walletsTransactionsStatus" DEFAULT 'STARTED'::play."walletsTransactionsStatus"
);


--
-- TOC entry 3641 (class 2604 OID 16981)
-- Name: membershipsCosts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."membershipsCosts" ALTER COLUMN id SET DEFAULT nextval('play."membershipsCosts_id_seq"'::regclass);


--
-- TOC entry 3712 (class 2604 OID 16982)
-- Name: tournaments id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY play.tournaments ALTER COLUMN id SET DEFAULT nextval('play.tournaments_id_seq'::regclass);


--
-- TOC entry 3726 (class 2604 OID 16983)
-- Name: tournamentsMatchesMaps id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."tournamentsMatchesMaps" ALTER COLUMN id SET DEFAULT nextval('play."tournamentsMatchesMaps_id_seq"'::regclass);


--
-- TOC entry 3743 (class 2604 OID 16984)
-- Name: usersMemberships id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."usersMemberships" ALTER COLUMN id SET DEFAULT nextval('play."usersMemberships_id_seq"'::regclass);


--
-- TOC entry 3787 (class 2606 OID 16986)
-- Name: chatMessages chatMessages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."chatMessages"
    ADD CONSTRAINT "chatMessages_pkey" PRIMARY KEY (id);


--
-- TOC entry 3793 (class 2606 OID 16988)
-- Name: chatRoomsUsers chatRoomsUsers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."chatRoomsUsers"
    ADD CONSTRAINT "chatRoomsUsers_pkey" PRIMARY KEY (id);


--
-- TOC entry 3795 (class 2606 OID 16990)
-- Name: chatRoomsUsers chatRoomsUsers_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."chatRoomsUsers"
    ADD CONSTRAINT "chatRoomsUsers_uniq" UNIQUE ("roomId", "userId") DEFERRABLE;


--
-- TOC entry 3789 (class 2606 OID 16993)
-- Name: chatRooms chatRooms_name_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."chatRooms"
    ADD CONSTRAINT "chatRooms_name_uniq" UNIQUE (name) DEFERRABLE;


--
-- TOC entry 3791 (class 2606 OID 16996)
-- Name: chatRooms chatRooms_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."chatRooms"
    ADD CONSTRAINT "chatRooms_pkey" PRIMARY KEY (id);


--
-- TOC entry 3797 (class 2606 OID 16998)
-- Name: chatRosters chatRosters_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."chatRosters"
    ADD CONSTRAINT "chatRosters_pkey" PRIMARY KEY (id);


--
-- TOC entry 3799 (class 2606 OID 17000)
-- Name: chatRosters chatRosters_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."chatRosters"
    ADD CONSTRAINT "chatRosters_uniq" UNIQUE ("toUserId", "fromUserId", "messageId") DEFERRABLE;


--
-- TOC entry 3802 (class 2606 OID 17003)
-- Name: countdowns countdowns_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play.countdowns
    ADD CONSTRAINT countdowns_pkey PRIMARY KEY (id);


--
-- TOC entry 3815 (class 2606 OID 17010)
-- Name: friendsInvites friendsInvites_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."friendsInvites"
    ADD CONSTRAINT "friendsInvites_pkey" PRIMARY KEY (id);


--
-- TOC entry 3817 (class 2606 OID 17012)
-- Name: friendsInvites friendsInvites_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."friendsInvites"
    ADD CONSTRAINT "friendsInvites_uniq" UNIQUE ("userId", "friendId") DEFERRABLE;


--
-- TOC entry 3808 (class 2606 OID 17015)
-- Name: friends friends_friend_user; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play.friends
    ADD CONSTRAINT friends_friend_user UNIQUE ("friendId", "userId");


--
-- TOC entry 3810 (class 2606 OID 17017)
-- Name: friends friends_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play.friends
    ADD CONSTRAINT friends_pkey PRIMARY KEY (id);


--
-- TOC entry 3812 (class 2606 OID 17019)
-- Name: friends friends_user_friend; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play.friends
    ADD CONSTRAINT friends_user_friend UNIQUE ("userId", "friendId");


--
-- TOC entry 3824 (class 2606 OID 17021)
-- Name: gamesMaps gamesMaps_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."gamesMaps"
    ADD CONSTRAINT "gamesMaps_pkey" PRIMARY KEY (id);


--
-- TOC entry 3827 (class 2606 OID 17023)
-- Name: gamesRegions gamesRegions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."gamesRegions"
    ADD CONSTRAINT "gamesRegions_pkey" PRIMARY KEY (id);


--
-- TOC entry 3821 (class 2606 OID 17025)
-- Name: games games_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play.games
    ADD CONSTRAINT games_pkey PRIMARY KEY (id);


--
-- TOC entry 3833 (class 2606 OID 17027)
-- Name: membershipsCosts membershipsCosts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."membershipsCosts"
    ADD CONSTRAINT "membershipsCosts_pkey" PRIMARY KEY (id);


--
-- TOC entry 3831 (class 2606 OID 17029)
-- Name: memberships memberships_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play.memberships
    ADD CONSTRAINT memberships_pkey PRIMARY KEY (id);


--
-- TOC entry 3839 (class 2606 OID 17031)
-- Name: notificationsMatches notificationsMatches_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."notificationsMatches"
    ADD CONSTRAINT "notificationsMatches_pkey" PRIMARY KEY (id);


--
-- TOC entry 3842 (class 2606 OID 17033)
-- Name: notificationsTeams notificationsTeams_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."notificationsTeams"
    ADD CONSTRAINT "notificationsTeams_pkey" PRIMARY KEY (id);


--
-- TOC entry 3845 (class 2606 OID 17035)
-- Name: notificationsTournaments notificationsTournaments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."notificationsTournaments"
    ADD CONSTRAINT "notificationsTournaments_pkey" PRIMARY KEY (id);


--
-- TOC entry 3837 (class 2606 OID 17037)
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- TOC entry 3848 (class 2606 OID 17039)
-- Name: phoneVerifications phoneVerifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."phoneVerifications"
    ADD CONSTRAINT "phoneVerifications_pkey" PRIMARY KEY (id);


--
-- TOC entry 3869 (class 2606 OID 17041)
-- Name: playersRatingsHistories playersRatingsHistories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."playersRatingsHistories"
    ADD CONSTRAINT "playersRatingsHistories_pkey" PRIMARY KEY (id);


--
-- TOC entry 3875 (class 2606 OID 17043)
-- Name: playersStats playersStats_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."playersStats"
    ADD CONSTRAINT "playersStats_pkey" PRIMARY KEY (id);


--
-- TOC entry 3881 (class 2606 OID 17045)
-- Name: regions regions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play.regions
    ADD CONSTRAINT regions_pkey PRIMARY KEY (id);


--
-- TOC entry 3883 (class 2606 OID 17047)
-- Name: settings settings_id_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play.settings
    ADD CONSTRAINT settings_id_pkey PRIMARY KEY (id);


--
-- TOC entry 3885 (class 2606 OID 17049)
-- Name: shopCategories shopCategories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."shopCategories"
    ADD CONSTRAINT "shopCategories_pkey" PRIMARY KEY (id);


--
-- TOC entry 3891 (class 2606 OID 17051)
-- Name: shopOrders shopOrders_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."shopOrders"
    ADD CONSTRAINT "shopOrders_pkey" PRIMARY KEY (id);


--
-- TOC entry 3897 (class 2606 OID 17053)
-- Name: shops shops_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play.shops
    ADD CONSTRAINT shops_pkey PRIMARY KEY (id);


--
-- TOC entry 4004 (class 2606 OID 17706)
-- Name: socials socials_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play.socials
    ADD CONSTRAINT socials_pkey PRIMARY KEY (id);


--
-- TOC entry 3913 (class 2606 OID 17055)
-- Name: teamsInvites teamsInvites_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."teamsInvites"
    ADD CONSTRAINT "teamsInvites_pkey" PRIMARY KEY (id);


--
-- TOC entry 3915 (class 2606 OID 17057)
-- Name: teamsInvites teamsInvites_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."teamsInvites"
    ADD CONSTRAINT "teamsInvites_uniq" UNIQUE ("teamId", "playerId") DEFERRABLE;


--
-- TOC entry 3772 (class 2606 OID 17060)
-- Name: teamsPlayers teamsPlayers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."teamsPlayers"
    ADD CONSTRAINT "teamsPlayers_pkey" PRIMARY KEY (id);


--
-- TOC entry 3774 (class 2606 OID 17062)
-- Name: teamsPlayers teamsPlayers_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."teamsPlayers"
    ADD CONSTRAINT "teamsPlayers_uniq" UNIQUE ("teamId", "playerId") DEFERRABLE;


--
-- TOC entry 3925 (class 2606 OID 17065)
-- Name: teamsRatingsHistories teamsRatingsHistories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."teamsRatingsHistories"
    ADD CONSTRAINT "teamsRatingsHistories_pkey" PRIMARY KEY (id);


--
-- TOC entry 3917 (class 2606 OID 17067)
-- Name: teamsRatings teamsRatings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."teamsRatings"
    ADD CONSTRAINT "teamsRatings_pkey" PRIMARY KEY (id);


--
-- TOC entry 3919 (class 2606 OID 17069)
-- Name: teamsRatings teamsRatings_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."teamsRatings"
    ADD CONSTRAINT "teamsRatings_uniq" UNIQUE ("gameId", "teamId") DEFERRABLE;


--
-- TOC entry 3931 (class 2606 OID 17072)
-- Name: teamsStats teamsStats_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."teamsStats"
    ADD CONSTRAINT "teamsStats_pkey" PRIMARY KEY (id);


--
-- TOC entry 3933 (class 2606 OID 17074)
-- Name: teamsStats teamsStats_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."teamsStats"
    ADD CONSTRAINT "teamsStats_uniq" UNIQUE ("gameId", "teamId") DEFERRABLE;


--
-- TOC entry 3904 (class 2606 OID 17077)
-- Name: teams teams_name_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play.teams
    ADD CONSTRAINT teams_name_uniq UNIQUE (name) DEFERRABLE;


--
-- TOC entry 3907 (class 2606 OID 17080)
-- Name: teams teams_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play.teams
    ADD CONSTRAINT teams_pkey PRIMARY KEY (id);


--
-- TOC entry 3909 (class 2606 OID 17082)
-- Name: teams teams_shortName_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play.teams
    ADD CONSTRAINT "teams_shortName_uniq" UNIQUE ("shortName") DEFERRABLE;


--
-- TOC entry 3911 (class 2606 OID 17085)
-- Name: teams teams_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play.teams
    ADD CONSTRAINT teams_uniq UNIQUE ("gameId", "ownerId") DEFERRABLE;


--
-- TOC entry 3955 (class 2606 OID 17088)
-- Name: tournamentsPlayers tournamentPlayers_tookPlace; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."tournamentsPlayers"
    ADD CONSTRAINT "tournamentPlayers_tookPlace" UNIQUE ("tournamentId", "tookPlace");


--
-- TOC entry 3957 (class 2606 OID 17090)
-- Name: tournamentsPlayers tournamentPlayers_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."tournamentsPlayers"
    ADD CONSTRAINT "tournamentPlayers_uniq" UNIQUE ("tournamentId", "playerId") DEFERRABLE;


--
-- TOC entry 3949 (class 2606 OID 17093)
-- Name: tournamentsMatchesMaps tournamentsMatchesMaps_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."tournamentsMatchesMaps"
    ADD CONSTRAINT "tournamentsMatchesMaps_pkey" PRIMARY KEY (id);


--
-- TOC entry 3942 (class 2606 OID 17095)
-- Name: tournamentsMatches tournamentsMatches_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."tournamentsMatches"
    ADD CONSTRAINT "tournamentsMatches_pkey" PRIMARY KEY (id);


--
-- TOC entry 3952 (class 2606 OID 17097)
-- Name: tournamentsPartners tournamentsPartners_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."tournamentsPartners"
    ADD CONSTRAINT "tournamentsPartners_pkey" PRIMARY KEY (id);


--
-- TOC entry 3959 (class 2606 OID 17099)
-- Name: tournamentsPlayers tournamentsPlayers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."tournamentsPlayers"
    ADD CONSTRAINT "tournamentsPlayers_pkey" PRIMARY KEY (id);


--
-- TOC entry 3961 (class 2606 OID 17101)
-- Name: tournamentsPlayers tournamentsPlayers_tookPlace; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."tournamentsPlayers"
    ADD CONSTRAINT "tournamentsPlayers_tookPlace" UNIQUE ("tournamentId", "tookPlace") DEFERRABLE;


--
-- TOC entry 3965 (class 2606 OID 17104)
-- Name: tournamentsPrizes tournamentsPrizes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."tournamentsPrizes"
    ADD CONSTRAINT "tournamentsPrizes_pkey" PRIMARY KEY (id);


--
-- TOC entry 3968 (class 2606 OID 17106)
-- Name: tournamentsRounds tournamentsRounds_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."tournamentsRounds"
    ADD CONSTRAINT "tournamentsRounds_pkey" PRIMARY KEY (id);


--
-- TOC entry 3970 (class 2606 OID 17108)
-- Name: tournamentsRounds tournamentsRounds_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."tournamentsRounds"
    ADD CONSTRAINT "tournamentsRounds_uniq" UNIQUE ("tournamentId") DEFERRABLE;


--
-- TOC entry 3974 (class 2606 OID 17111)
-- Name: tournamentsRules tournamentsRules_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."tournamentsRules"
    ADD CONSTRAINT "tournamentsRules_pkey" PRIMARY KEY (id);


--
-- TOC entry 3985 (class 2606 OID 17113)
-- Name: tournamentsTeamsPlayers tournamentsTeamsPlayers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."tournamentsTeamsPlayers"
    ADD CONSTRAINT "tournamentsTeamsPlayers_pkey" PRIMARY KEY (id);


--
-- TOC entry 3987 (class 2606 OID 17115)
-- Name: tournamentsTeamsPlayers tournamentsTeamsPlayers_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."tournamentsTeamsPlayers"
    ADD CONSTRAINT "tournamentsTeamsPlayers_uniq" UNIQUE ("tournamentId", "playerId") DEFERRABLE;


--
-- TOC entry 3977 (class 2606 OID 17118)
-- Name: tournamentsTeams tournamentsTeams_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."tournamentsTeams"
    ADD CONSTRAINT "tournamentsTeams_pkey" PRIMARY KEY (id);


--
-- TOC entry 3979 (class 2606 OID 17120)
-- Name: tournamentsTeams tournamentsTeams_tookPlace; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."tournamentsTeams"
    ADD CONSTRAINT "tournamentsTeams_tookPlace" UNIQUE ("tournamentId", "tookPlace") DEFERRABLE;


--
-- TOC entry 3981 (class 2606 OID 17123)
-- Name: tournamentsTeams tournamentsTeams_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."tournamentsTeams"
    ADD CONSTRAINT "tournamentsTeams_uniq" UNIQUE ("tournamentId", "teamId") DEFERRABLE;


--
-- TOC entry 3940 (class 2606 OID 17126)
-- Name: tournaments tournaments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play.tournaments
    ADD CONSTRAINT tournaments_pkey PRIMARY KEY (id);


--
-- TOC entry 3991 (class 2606 OID 17132)
-- Name: usersMemberships usersMemberships_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."usersMemberships"
    ADD CONSTRAINT "usersMemberships_pkey" PRIMARY KEY (id);


--
-- TOC entry 3852 (class 2606 OID 17134)
-- Name: players usersPlatforms_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play.players
    ADD CONSTRAINT "usersPlatforms_pkey" PRIMARY KEY (id);


--
-- TOC entry 3854 (class 2606 OID 17136)
-- Name: players usersPlatforms_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play.players
    ADD CONSTRAINT "usersPlatforms_uniq" UNIQUE ("gameId", "userId") DEFERRABLE;


--
-- TOC entry 3856 (class 2606 OID 17139)
-- Name: players usersPlatforms_username; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play.players
    ADD CONSTRAINT "usersPlatforms_username" UNIQUE (username) DEFERRABLE;


--
-- TOC entry 3861 (class 2606 OID 17142)
-- Name: playersRatings usersRatings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."playersRatings"
    ADD CONSTRAINT "usersRatings_pkey" PRIMARY KEY (id);


--
-- TOC entry 3863 (class 2606 OID 17144)
-- Name: playersRatings usersRatings_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."playersRatings"
    ADD CONSTRAINT "usersRatings_uniq" UNIQUE ("gameId", "playerId");


--
-- TOC entry 3998 (class 2606 OID 17146)
-- Name: usersSocials usersSocials_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."usersSocials"
    ADD CONSTRAINT "usersSocials_pkey" PRIMARY KEY (id);


--
-- TOC entry 4000 (class 2606 OID 17148)
-- Name: usersSocials usersSocials_userId_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."usersSocials"
    ADD CONSTRAINT "usersSocials_userId_uniq" UNIQUE ("userId") DEFERRABLE;


--
-- TOC entry 3778 (class 2606 OID 17158)
-- Name: users users_email; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play.users
    ADD CONSTRAINT users_email UNIQUE (email) DEFERRABLE;


--
-- TOC entry 3782 (class 2606 OID 17161)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 3784 (class 2606 OID 17163)
-- Name: users users_username; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play.users
    ADD CONSTRAINT users_username UNIQUE (username) DEFERRABLE;


--
-- TOC entry 4006 (class 2606 OID 17731)
-- Name: walletsBanks walletsBanks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."walletsBanks"
    ADD CONSTRAINT "walletsBanks_pkey" PRIMARY KEY (id);


--
-- TOC entry 4012 (class 2606 OID 17758)
-- Name: walletsCards walletsCards_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."walletsCards"
    ADD CONSTRAINT "walletsCards_pkey" PRIMARY KEY (id);


--
-- TOC entry 4014 (class 2606 OID 17760)
-- Name: walletsCards walletsCards_walletId_number_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."walletsCards"
    ADD CONSTRAINT "walletsCards_walletId_number_uniq" UNIQUE ("walletId", number) DEFERRABLE;


--
-- TOC entry 4016 (class 2606 OID 17780)
-- Name: walletsTransactions walletsTransactions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."walletsTransactions"
    ADD CONSTRAINT "walletsTransactions_pkey" PRIMARY KEY (id);


--
-- TOC entry 4008 (class 2606 OID 17739)
-- Name: wallets wallets_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play.wallets
    ADD CONSTRAINT wallets_pkey PRIMARY KEY (id);


--
-- TOC entry 4010 (class 2606 OID 17741)
-- Name: wallets wallets_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play.wallets
    ADD CONSTRAINT wallets_uniq UNIQUE ("userId") DEFERRABLE;


--
-- TOC entry 3800 (class 1259 OID 17165)
-- Name: countdowns_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX countdowns_id ON play.countdowns USING btree (id);


--
-- TOC entry 3803 (class 1259 OID 17166)
-- Name: countdowns_team_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX countdowns_team_id ON play.countdowns USING btree ("teamId");


--
-- TOC entry 3804 (class 1259 OID 17167)
-- Name: countdowns_type; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX countdowns_type ON play.countdowns USING btree (type);


--
-- TOC entry 3805 (class 1259 OID 17168)
-- Name: countdowns_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX countdowns_user_id ON play.countdowns USING btree ("userId");


--
-- TOC entry 3806 (class 1259 OID 17171)
-- Name: friends_friend_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX friends_friend_id ON play.friends USING btree ("friendId");


--
-- TOC entry 3813 (class 1259 OID 17172)
-- Name: friends_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX friends_user_id ON play.friends USING btree ("userId");


--
-- TOC entry 3818 (class 1259 OID 17173)
-- Name: games_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX games_id ON play.games USING btree (id);


--
-- TOC entry 3825 (class 1259 OID 17174)
-- Name: games_maps_id_game_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX games_maps_id_game_id ON play."gamesMaps" USING btree (id, "gameId");


--
-- TOC entry 3819 (class 1259 OID 17175)
-- Name: games_name; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX games_name ON play.games USING btree (name);


--
-- TOC entry 3828 (class 1259 OID 17176)
-- Name: games_regions_id_game_id_region_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX games_regions_id_game_id_region_id ON play."gamesRegions" USING btree (id, "gameId", "regionId");


--
-- TOC entry 3822 (class 1259 OID 17177)
-- Name: games_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX games_status ON play.games USING btree (status);


--
-- TOC entry 3834 (class 1259 OID 17178)
-- Name: memberships_costs_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX memberships_costs_id ON play."membershipsCosts" USING btree (id);


--
-- TOC entry 3829 (class 1259 OID 17179)
-- Name: memberships_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX memberships_id ON play.memberships USING btree (id);


--
-- TOC entry 3835 (class 1259 OID 17180)
-- Name: notifications_id_user_id_type_read; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX notifications_id_user_id_type_read ON play.notifications USING btree (id, "userId", type, read);


--
-- TOC entry 3840 (class 1259 OID 17181)
-- Name: notifications_matches_id_notification_id_match_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX notifications_matches_id_notification_id_match_id ON play."notificationsMatches" USING btree (id, "notificationId", "matchId");


--
-- TOC entry 3843 (class 1259 OID 17182)
-- Name: notifications_teams_id_notification_id_team_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX notifications_teams_id_notification_id_team_id ON play."notificationsTeams" USING btree (id, "notificationId", "teamId");


--
-- TOC entry 3846 (class 1259 OID 17183)
-- Name: notifications_tournaments_id_notification_id_tournament_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX notifications_tournaments_id_notification_id_tournament_id ON play."notificationsTournaments" USING btree (id, "notificationId", "tournamentId");


--
-- TOC entry 3849 (class 1259 OID 17184)
-- Name: phone_verifications_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX phone_verifications_id ON play."phoneVerifications" USING btree (id);


--
-- TOC entry 3850 (class 1259 OID 17185)
-- Name: phone_verifications_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX phone_verifications_user_id ON play."phoneVerifications" USING btree ("userId");


--
-- TOC entry 3879 (class 1259 OID 17186)
-- Name: regions_id_alias; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX regions_id_alias ON play.regions USING btree (id, alias);


--
-- TOC entry 3886 (class 1259 OID 17187)
-- Name: shop_categories_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX shop_categories_id ON play."shopCategories" USING btree (id);


--
-- TOC entry 3887 (class 1259 OID 17188)
-- Name: shop_categories_long_name; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX shop_categories_long_name ON play."shopCategories" USING btree ("longName");


--
-- TOC entry 3888 (class 1259 OID 17189)
-- Name: shop_categories_name; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX shop_categories_name ON play."shopCategories" USING btree (name);


--
-- TOC entry 3889 (class 1259 OID 17190)
-- Name: shop_categories_short_name; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX shop_categories_short_name ON play."shopCategories" USING btree ("shortName");


--
-- TOC entry 3892 (class 1259 OID 17191)
-- Name: shop_orders_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX shop_orders_id ON play."shopOrders" USING btree (id);


--
-- TOC entry 3893 (class 1259 OID 17192)
-- Name: shops_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX shops_id ON play.shops USING btree (id);


--
-- TOC entry 3894 (class 1259 OID 17193)
-- Name: shops_is_new; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX shops_is_new ON play.shops USING btree ("isNew");


--
-- TOC entry 3895 (class 1259 OID 17194)
-- Name: shops_name; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX shops_name ON play.shops USING btree (name);


--
-- TOC entry 3898 (class 1259 OID 17195)
-- Name: shops_price; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX shops_price ON play.shops USING btree (price);


--
-- TOC entry 3899 (class 1259 OID 17196)
-- Name: shops_published; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX shops_published ON play.shops USING btree (published);


--
-- TOC entry 3900 (class 1259 OID 17197)
-- Name: teams_game_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX teams_game_id ON play.teams USING btree ("gameId");


--
-- TOC entry 3901 (class 1259 OID 17198)
-- Name: teams_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX teams_id ON play.teams USING btree (id);


--
-- TOC entry 3902 (class 1259 OID 17199)
-- Name: teams_name; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX teams_name ON play.teams USING btree (name);


--
-- TOC entry 3905 (class 1259 OID 17200)
-- Name: teams_owner_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX teams_owner_id ON play.teams USING btree ("ownerId");


--
-- TOC entry 3775 (class 1259 OID 17201)
-- Name: teams_players_team_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX teams_players_team_id ON play."teamsPlayers" USING btree ("teamId");


--
-- TOC entry 3776 (class 1259 OID 17202)
-- Name: teams_players_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX teams_players_user_id ON play."teamsPlayers" USING btree ("playerId");


--
-- TOC entry 3926 (class 1259 OID 17203)
-- Name: teams_rating_histories_elo; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX teams_rating_histories_elo ON play."teamsRatingsHistories" USING btree (elo);


--
-- TOC entry 3927 (class 1259 OID 17204)
-- Name: teams_rating_histories_game_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX teams_rating_histories_game_id ON play."teamsRatingsHistories" USING btree ("gameId");


--
-- TOC entry 3928 (class 1259 OID 17205)
-- Name: teams_rating_histories_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX teams_rating_histories_id ON play."teamsRatingsHistories" USING btree (id);


--
-- TOC entry 3929 (class 1259 OID 17206)
-- Name: teams_rating_histories_team_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX teams_rating_histories_team_id ON play."teamsRatingsHistories" USING btree ("teamId");


--
-- TOC entry 3920 (class 1259 OID 17207)
-- Name: teams_ratings_elo; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX teams_ratings_elo ON play."teamsRatings" USING btree (elo);


--
-- TOC entry 3921 (class 1259 OID 17208)
-- Name: teams_ratings_game_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX teams_ratings_game_id ON play."teamsRatings" USING btree ("gameId");


--
-- TOC entry 3922 (class 1259 OID 17209)
-- Name: teams_ratings_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX teams_ratings_id ON play."teamsRatings" USING btree (id);


--
-- TOC entry 3923 (class 1259 OID 17210)
-- Name: teams_ratings_team_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX teams_ratings_team_id ON play."teamsRatings" USING btree ("teamId");


--
-- TOC entry 3934 (class 1259 OID 17211)
-- Name: teams_stats_game_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX teams_stats_game_id ON play."teamsStats" USING btree ("gameId");


--
-- TOC entry 3935 (class 1259 OID 17212)
-- Name: teams_stats_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX teams_stats_id ON play."teamsStats" USING btree (id);


--
-- TOC entry 3936 (class 1259 OID 17213)
-- Name: teams_stats_team_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX teams_stats_team_id ON play."teamsStats" USING btree ("teamId");


--
-- TOC entry 3937 (class 1259 OID 17214)
-- Name: tournaments_game_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX tournaments_game_id ON play.tournaments USING btree ("gameId");


--
-- TOC entry 3938 (class 1259 OID 17215)
-- Name: tournaments_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX tournaments_id ON play.tournaments USING btree (id);


--
-- TOC entry 3943 (class 1259 OID 17216)
-- Name: tournaments_matches_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX tournaments_matches_id ON play."tournamentsMatches" USING btree (id);


--
-- TOC entry 3950 (class 1259 OID 17217)
-- Name: tournaments_matches_maps_id_tournament_id_match_id_map_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX tournaments_matches_maps_id_tournament_id_match_id_map_id ON play."tournamentsMatchesMaps" USING btree (id, "tournamentId", "matchId", "mapId");


--
-- TOC entry 3944 (class 1259 OID 17218)
-- Name: tournaments_matches_opponent_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX tournaments_matches_opponent_id ON play."tournamentsMatches" USING btree ("opponentId");


--
-- TOC entry 3945 (class 1259 OID 17219)
-- Name: tournaments_matches_player_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX tournaments_matches_player_id ON play."tournamentsMatches" USING btree ("playerId");


--
-- TOC entry 3946 (class 1259 OID 17220)
-- Name: tournaments_matches_tournament_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX tournaments_matches_tournament_id ON play."tournamentsMatches" USING btree ("tournamentId");


--
-- TOC entry 3947 (class 1259 OID 17221)
-- Name: tournaments_matches_winner_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX tournaments_matches_winner_id ON play."tournamentsMatches" USING btree ("winnerId");


--
-- TOC entry 3953 (class 1259 OID 17222)
-- Name: tournaments_partners_tournament_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX tournaments_partners_tournament_id ON play."tournamentsPartners" USING btree ("tournamentId");


--
-- TOC entry 3962 (class 1259 OID 17223)
-- Name: tournaments_players_player_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX tournaments_players_player_id ON play."tournamentsPlayers" USING btree ("playerId");


--
-- TOC entry 3963 (class 1259 OID 17224)
-- Name: tournaments_players_tournament_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX tournaments_players_tournament_id ON play."tournamentsPlayers" USING btree ("tournamentId");


--
-- TOC entry 3966 (class 1259 OID 17225)
-- Name: tournaments_prizes_tournament_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX tournaments_prizes_tournament_id ON play."tournamentsPrizes" USING btree ("tournamentId");


--
-- TOC entry 3971 (class 1259 OID 17226)
-- Name: tournaments_rounds_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX tournaments_rounds_id ON play."tournamentsRounds" USING btree (id);


--
-- TOC entry 3972 (class 1259 OID 17227)
-- Name: tournaments_rounds_tournament_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX tournaments_rounds_tournament_id ON play."tournamentsRounds" USING btree ("tournamentId");


--
-- TOC entry 3975 (class 1259 OID 17228)
-- Name: tournaments_rules_tournament_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX tournaments_rules_tournament_id ON play."tournamentsRules" USING btree ("tournamentId");


--
-- TOC entry 3988 (class 1259 OID 17229)
-- Name: tournaments_teams_squads_player_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX tournaments_teams_squads_player_id ON play."tournamentsTeamsPlayers" USING btree ("playerId");


--
-- TOC entry 3989 (class 1259 OID 17230)
-- Name: tournaments_teams_squads_tournament_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX tournaments_teams_squads_tournament_id ON play."tournamentsTeamsPlayers" USING btree ("tournamentId");


--
-- TOC entry 3982 (class 1259 OID 17231)
-- Name: tournaments_teams_team_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX tournaments_teams_team_id ON play."tournamentsTeams" USING btree ("teamId");


--
-- TOC entry 3983 (class 1259 OID 17232)
-- Name: tournaments_teams_tournament_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX tournaments_teams_tournament_id ON play."tournamentsTeams" USING btree ("tournamentId");


--
-- TOC entry 3779 (class 1259 OID 17234)
-- Name: users_email_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX users_email_idx ON play.users USING btree (email);


--
-- TOC entry 3780 (class 1259 OID 17235)
-- Name: users_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX users_id ON play.users USING btree (id);


--
-- TOC entry 3992 (class 1259 OID 17236)
-- Name: users_memberships_game_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_memberships_game_id ON play."usersMemberships" USING btree ("gameId");


--
-- TOC entry 3993 (class 1259 OID 17237)
-- Name: users_memberships_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX users_memberships_id ON play."usersMemberships" USING btree (id);


--
-- TOC entry 3994 (class 1259 OID 17238)
-- Name: users_memberships_membership_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_memberships_membership_id ON play."usersMemberships" USING btree ("membershipId");


--
-- TOC entry 3995 (class 1259 OID 17239)
-- Name: users_memberships_plan_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_memberships_plan_id ON play."usersMemberships" USING btree ("planId");


--
-- TOC entry 3996 (class 1259 OID 17240)
-- Name: users_memberships_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX users_memberships_user_id ON play."usersMemberships" USING btree ("userId");


--
-- TOC entry 3857 (class 1259 OID 17241)
-- Name: users_platforms_game_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_platforms_game_id ON play.players USING btree ("gameId");


--
-- TOC entry 3858 (class 1259 OID 17242)
-- Name: users_platforms_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX users_platforms_id ON play.players USING btree (id);


--
-- TOC entry 3859 (class 1259 OID 17243)
-- Name: users_platforms_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_platforms_user_id ON play.players USING btree ("userId");


--
-- TOC entry 3870 (class 1259 OID 17244)
-- Name: users_rating_histories_elo; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_rating_histories_elo ON play."playersRatingsHistories" USING btree (elo);


--
-- TOC entry 3871 (class 1259 OID 17245)
-- Name: users_rating_histories_game_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_rating_histories_game_id ON play."playersRatingsHistories" USING btree ("gameId");


--
-- TOC entry 3872 (class 1259 OID 17246)
-- Name: users_rating_histories_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX users_rating_histories_id ON play."playersRatingsHistories" USING btree (id);


--
-- TOC entry 3873 (class 1259 OID 17247)
-- Name: users_rating_histories_user_platform_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_rating_histories_user_platform_id ON play."playersRatingsHistories" USING btree ("playerId");


--
-- TOC entry 3864 (class 1259 OID 17248)
-- Name: users_ratings_elo; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_ratings_elo ON play."playersRatings" USING btree (elo);


--
-- TOC entry 3865 (class 1259 OID 17249)
-- Name: users_ratings_game_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_ratings_game_id ON play."playersRatings" USING btree ("gameId");


--
-- TOC entry 3866 (class 1259 OID 17250)
-- Name: users_ratings_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX users_ratings_id ON play."playersRatings" USING btree (id);


--
-- TOC entry 3867 (class 1259 OID 17251)
-- Name: users_ratings_user_platform_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX users_ratings_user_platform_id ON play."playersRatings" USING btree ("playerId");


--
-- TOC entry 4001 (class 1259 OID 17252)
-- Name: users_socials_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX users_socials_id ON play."usersSocials" USING btree (id);


--
-- TOC entry 4002 (class 1259 OID 17253)
-- Name: users_socials_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_socials_user_id ON play."usersSocials" USING btree ("userId");


--
-- TOC entry 3876 (class 1259 OID 17254)
-- Name: users_stats_game_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_stats_game_id ON play."playersStats" USING btree ("gameId");


--
-- TOC entry 3877 (class 1259 OID 17255)
-- Name: users_stats_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX users_stats_id ON play."playersStats" USING btree (id);


--
-- TOC entry 3878 (class 1259 OID 17256)
-- Name: users_stats_user_platform_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX users_stats_user_platform_id ON play."playersStats" USING btree ("playerId");


--
-- TOC entry 3785 (class 1259 OID 17259)
-- Name: users_username_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX users_username_idx ON play.users USING btree (username);


--
-- TOC entry 4020 (class 2606 OID 17260)
-- Name: chatRoomsUsers chatRoomsUsers_roomId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."chatRoomsUsers"
    ADD CONSTRAINT "chatRoomsUsers_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES play."chatRooms"(id) ON DELETE CASCADE DEFERRABLE NOT VALID;


--
-- TOC entry 4021 (class 2606 OID 17265)
-- Name: chatRoomsUsers chatRoomsUsers_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."chatRoomsUsers"
    ADD CONSTRAINT "chatRoomsUsers_userId_fkey" FOREIGN KEY ("userId") REFERENCES play.users(id) ON DELETE CASCADE DEFERRABLE NOT VALID;


--
-- TOC entry 4022 (class 2606 OID 17270)
-- Name: chatRosters chatRosters_fromUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."chatRosters"
    ADD CONSTRAINT "chatRosters_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES play.users(id) ON DELETE CASCADE DEFERRABLE NOT VALID;


--
-- TOC entry 4023 (class 2606 OID 17275)
-- Name: chatRosters chatRosters_messageId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."chatRosters"
    ADD CONSTRAINT "chatRosters_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES play."chatMessages"(id) ON DELETE CASCADE DEFERRABLE NOT VALID;


--
-- TOC entry 4024 (class 2606 OID 17280)
-- Name: chatRosters chatRosters_roomId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."chatRosters"
    ADD CONSTRAINT "chatRosters_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES play."chatRooms"(id) ON DELETE CASCADE DEFERRABLE NOT VALID;


--
-- TOC entry 4025 (class 2606 OID 17285)
-- Name: chatRosters chatRosters_toUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."chatRosters"
    ADD CONSTRAINT "chatRosters_toUserId_fkey" FOREIGN KEY ("toUserId") REFERENCES play.users(id) ON DELETE CASCADE DEFERRABLE NOT VALID;


--
-- TOC entry 4026 (class 2606 OID 17290)
-- Name: countdowns countdowns_teamId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play.countdowns
    ADD CONSTRAINT "countdowns_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES play.teams(id) ON DELETE CASCADE DEFERRABLE;


--
-- TOC entry 4027 (class 2606 OID 17295)
-- Name: countdowns countdowns_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play.countdowns
    ADD CONSTRAINT "countdowns_userId_fkey" FOREIGN KEY ("userId") REFERENCES play.users(id) ON DELETE CASCADE DEFERRABLE;


--
-- TOC entry 4030 (class 2606 OID 17310)
-- Name: friendsInvites friendsInvites_friendId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."friendsInvites"
    ADD CONSTRAINT "friendsInvites_friendId_fkey" FOREIGN KEY ("friendId") REFERENCES play.users(id) ON DELETE CASCADE DEFERRABLE NOT VALID;


--
-- TOC entry 4031 (class 2606 OID 17315)
-- Name: friendsInvites friendsInvites_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."friendsInvites"
    ADD CONSTRAINT "friendsInvites_userId_fkey" FOREIGN KEY ("userId") REFERENCES play.users(id) ON DELETE CASCADE DEFERRABLE NOT VALID;


--
-- TOC entry 4028 (class 2606 OID 17320)
-- Name: friends friends_friendId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play.friends
    ADD CONSTRAINT "friends_friendId_fkey" FOREIGN KEY ("friendId") REFERENCES play.users(id) ON DELETE CASCADE DEFERRABLE;


--
-- TOC entry 4029 (class 2606 OID 17325)
-- Name: friends friends_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play.friends
    ADD CONSTRAINT "friends_userId_fkey" FOREIGN KEY ("userId") REFERENCES play.users(id) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE;


--
-- TOC entry 4032 (class 2606 OID 17330)
-- Name: gamesMaps gamesMaps_gameId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."gamesMaps"
    ADD CONSTRAINT "gamesMaps_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES play.games(id) DEFERRABLE;


--
-- TOC entry 4033 (class 2606 OID 17335)
-- Name: gamesRegions gamesRegions_gameId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."gamesRegions"
    ADD CONSTRAINT "gamesRegions_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES play.games(id) DEFERRABLE;


--
-- TOC entry 4034 (class 2606 OID 17340)
-- Name: gamesRegions gamesRegions_regionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."gamesRegions"
    ADD CONSTRAINT "gamesRegions_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES play.regions(id) DEFERRABLE;


--
-- TOC entry 4035 (class 2606 OID 17345)
-- Name: membershipsCosts membershipsCosts_membershipId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."membershipsCosts"
    ADD CONSTRAINT "membershipsCosts_membershipId_fkey" FOREIGN KEY ("membershipId") REFERENCES play.memberships(id) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE;


--
-- TOC entry 4037 (class 2606 OID 17350)
-- Name: notificationsMatches notificationsMatches_matchId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."notificationsMatches"
    ADD CONSTRAINT "notificationsMatches_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES play."tournamentsMatches"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4038 (class 2606 OID 17355)
-- Name: notificationsMatches notificationsMatches_notificationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."notificationsMatches"
    ADD CONSTRAINT "notificationsMatches_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES play.notifications(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4039 (class 2606 OID 17360)
-- Name: notificationsTeams notificationsTeams_notificationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."notificationsTeams"
    ADD CONSTRAINT "notificationsTeams_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES play.notifications(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4040 (class 2606 OID 17365)
-- Name: notificationsTeams notificationsTeams_teamId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."notificationsTeams"
    ADD CONSTRAINT "notificationsTeams_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES play.teams(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4041 (class 2606 OID 17370)
-- Name: notificationsTournaments notificationsTournaments_tournamentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."notificationsTournaments"
    ADD CONSTRAINT "notificationsTournaments_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES play.tournaments(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4042 (class 2606 OID 17375)
-- Name: notificationsTournaments notificationsTournaments_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."notificationsTournaments"
    ADD CONSTRAINT "notificationsTournaments_userId_fkey" FOREIGN KEY ("userId") REFERENCES play.users(id) DEFERRABLE NOT VALID;


--
-- TOC entry 4036 (class 2606 OID 17380)
-- Name: notifications notifications_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play.notifications
    ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES play.users(id);


--
-- TOC entry 4043 (class 2606 OID 17385)
-- Name: phoneVerifications phoneVerifications_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."phoneVerifications"
    ADD CONSTRAINT "phoneVerifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES play.users(id) DEFERRABLE;


--
-- TOC entry 4048 (class 2606 OID 17390)
-- Name: playersRatingsHistories playersRatingsHistories_gameId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."playersRatingsHistories"
    ADD CONSTRAINT "playersRatingsHistories_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES play.games(id) DEFERRABLE;


--
-- TOC entry 4049 (class 2606 OID 17395)
-- Name: playersRatingsHistories playersRatingsHistories_playerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."playersRatingsHistories"
    ADD CONSTRAINT "playersRatingsHistories_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES play.players(id) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE;


--
-- TOC entry 4050 (class 2606 OID 17400)
-- Name: playersStats playersStats_gameId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."playersStats"
    ADD CONSTRAINT "playersStats_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES play.games(id) DEFERRABLE;


--
-- TOC entry 4051 (class 2606 OID 17405)
-- Name: playersStats playersStats_playerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."playersStats"
    ADD CONSTRAINT "playersStats_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES play.players(id) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE;


--
-- TOC entry 4052 (class 2606 OID 17410)
-- Name: shopOrders shopOrders_itemId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."shopOrders"
    ADD CONSTRAINT "shopOrders_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES play.shops(id) ON DELETE CASCADE DEFERRABLE;


--
-- TOC entry 4053 (class 2606 OID 17415)
-- Name: shopOrders shopOrders_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."shopOrders"
    ADD CONSTRAINT "shopOrders_userId_fkey" FOREIGN KEY ("userId") REFERENCES play.users(id) ON DELETE CASCADE DEFERRABLE;


--
-- TOC entry 4054 (class 2606 OID 17420)
-- Name: shops shops_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play.shops
    ADD CONSTRAINT "shops_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES play."shopCategories"(id) ON DELETE CASCADE DEFERRABLE;


--
-- TOC entry 4058 (class 2606 OID 17425)
-- Name: teamsInvites teamsInvites_playerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."teamsInvites"
    ADD CONSTRAINT "teamsInvites_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES play.users(id) ON DELETE CASCADE DEFERRABLE NOT VALID;


--
-- TOC entry 4059 (class 2606 OID 17430)
-- Name: teamsInvites teamsInvites_teamId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."teamsInvites"
    ADD CONSTRAINT "teamsInvites_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES play.teams(id) ON DELETE CASCADE DEFERRABLE NOT VALID;


--
-- TOC entry 4017 (class 2606 OID 17435)
-- Name: teamsPlayers teamsPlayers_playerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."teamsPlayers"
    ADD CONSTRAINT "teamsPlayers_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES play.users(id) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE;


--
-- TOC entry 4018 (class 2606 OID 17440)
-- Name: teamsPlayers teamsPlayers_teamId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."teamsPlayers"
    ADD CONSTRAINT "teamsPlayers_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES play.teams(id) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE;


--
-- TOC entry 4062 (class 2606 OID 17445)
-- Name: teamsRatingsHistories teamsRatingsHistories_gameId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."teamsRatingsHistories"
    ADD CONSTRAINT "teamsRatingsHistories_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES play.games(id) DEFERRABLE;


--
-- TOC entry 4063 (class 2606 OID 17450)
-- Name: teamsRatingsHistories teamsRatingsHistories_teamId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."teamsRatingsHistories"
    ADD CONSTRAINT "teamsRatingsHistories_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES play.teams(id) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE;


--
-- TOC entry 4060 (class 2606 OID 17455)
-- Name: teamsRatings teamsRatings_gameId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."teamsRatings"
    ADD CONSTRAINT "teamsRatings_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES play.games(id) DEFERRABLE;


--
-- TOC entry 4061 (class 2606 OID 17460)
-- Name: teamsRatings teamsRatings_teamId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."teamsRatings"
    ADD CONSTRAINT "teamsRatings_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES play.teams(id) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE;


--
-- TOC entry 4064 (class 2606 OID 17465)
-- Name: teamsStats teamsStats_gameId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."teamsStats"
    ADD CONSTRAINT "teamsStats_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES play.games(id) DEFERRABLE;


--
-- TOC entry 4065 (class 2606 OID 17470)
-- Name: teamsStats teamsStats_teamId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."teamsStats"
    ADD CONSTRAINT "teamsStats_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES play.teams(id) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE;


--
-- TOC entry 4055 (class 2606 OID 17475)
-- Name: teams teams_captainId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play.teams
    ADD CONSTRAINT "teams_captainId_fkey" FOREIGN KEY ("captainId") REFERENCES play."teamsPlayers"(id) ON DELETE SET NULL DEFERRABLE NOT VALID;


--
-- TOC entry 4056 (class 2606 OID 17480)
-- Name: teams teams_gameId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play.teams
    ADD CONSTRAINT "teams_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES play.games(id) DEFERRABLE;


--
-- TOC entry 4057 (class 2606 OID 17485)
-- Name: teams teams_ownerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play.teams
    ADD CONSTRAINT "teams_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES play.users(id) ON UPDATE CASCADE DEFERRABLE;


--
-- TOC entry 4071 (class 2606 OID 17490)
-- Name: tournamentsMatchesMaps tournamentsMatchesMaps_mapId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."tournamentsMatchesMaps"
    ADD CONSTRAINT "tournamentsMatchesMaps_mapId_fkey" FOREIGN KEY ("mapId") REFERENCES play."gamesMaps"(id) DEFERRABLE;


--
-- TOC entry 4072 (class 2606 OID 17495)
-- Name: tournamentsMatchesMaps tournamentsMatchesMaps_matchId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."tournamentsMatchesMaps"
    ADD CONSTRAINT "tournamentsMatchesMaps_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES play."tournamentsMatches"(id) DEFERRABLE;


--
-- TOC entry 4073 (class 2606 OID 17500)
-- Name: tournamentsMatchesMaps tournamentsMatchesMaps_tournamentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."tournamentsMatchesMaps"
    ADD CONSTRAINT "tournamentsMatchesMaps_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES play.tournaments(id) DEFERRABLE;


--
-- TOC entry 4067 (class 2606 OID 17505)
-- Name: tournamentsMatches tournamentsMatches_opponentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."tournamentsMatches"
    ADD CONSTRAINT "tournamentsMatches_opponentId_fkey" FOREIGN KEY ("opponentId") REFERENCES play.teams(id) ON UPDATE CASCADE DEFERRABLE;


--
-- TOC entry 4068 (class 2606 OID 17510)
-- Name: tournamentsMatches tournamentsMatches_playerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."tournamentsMatches"
    ADD CONSTRAINT "tournamentsMatches_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES play.teams(id) ON UPDATE CASCADE DEFERRABLE;


--
-- TOC entry 4069 (class 2606 OID 17515)
-- Name: tournamentsMatches tournamentsMatches_tournamentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."tournamentsMatches"
    ADD CONSTRAINT "tournamentsMatches_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES play.tournaments(id) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE;


--
-- TOC entry 4070 (class 2606 OID 17520)
-- Name: tournamentsMatches tournamentsMatches_winnerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."tournamentsMatches"
    ADD CONSTRAINT "tournamentsMatches_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES play.teams(id) ON UPDATE CASCADE DEFERRABLE;


--
-- TOC entry 4074 (class 2606 OID 17525)
-- Name: tournamentsPartners tournamentsPartners_tournamentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."tournamentsPartners"
    ADD CONSTRAINT "tournamentsPartners_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES play.tournaments(id) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE;


--
-- TOC entry 4075 (class 2606 OID 17530)
-- Name: tournamentsPlayers tournamentsPlayers_playerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."tournamentsPlayers"
    ADD CONSTRAINT "tournamentsPlayers_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES play.users(id) ON UPDATE CASCADE DEFERRABLE;


--
-- TOC entry 4076 (class 2606 OID 17535)
-- Name: tournamentsPlayers tournamentsPlayers_tournamentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."tournamentsPlayers"
    ADD CONSTRAINT "tournamentsPlayers_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES play.tournaments(id) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE;


--
-- TOC entry 4077 (class 2606 OID 17540)
-- Name: tournamentsPrizes tournamentsPrizes_tournamentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."tournamentsPrizes"
    ADD CONSTRAINT "tournamentsPrizes_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES play.tournaments(id) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE;


--
-- TOC entry 4078 (class 2606 OID 17545)
-- Name: tournamentsRounds tournamentsRounds_tournamentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."tournamentsRounds"
    ADD CONSTRAINT "tournamentsRounds_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES play.tournaments(id) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE;


--
-- TOC entry 4079 (class 2606 OID 17550)
-- Name: tournamentsRules tournamentsRules_tournamentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."tournamentsRules"
    ADD CONSTRAINT "tournamentsRules_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES play.tournaments(id) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE;


--
-- TOC entry 4082 (class 2606 OID 17555)
-- Name: tournamentsTeamsPlayers tournamentsTeamsPlayers_playerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."tournamentsTeamsPlayers"
    ADD CONSTRAINT "tournamentsTeamsPlayers_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES play.users(id) ON UPDATE CASCADE DEFERRABLE;


--
-- TOC entry 4083 (class 2606 OID 17560)
-- Name: tournamentsTeamsPlayers tournamentsTeamsPlayers_teamId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."tournamentsTeamsPlayers"
    ADD CONSTRAINT "tournamentsTeamsPlayers_teamId_fkey" FOREIGN KEY ("tournamentTeamId") REFERENCES play."tournamentsTeams"(id) ON DELETE CASCADE DEFERRABLE NOT VALID;


--
-- TOC entry 4084 (class 2606 OID 17680)
-- Name: tournamentsTeamsPlayers tournamentsTeamsPlayers_tournamentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."tournamentsTeamsPlayers"
    ADD CONSTRAINT "tournamentsTeamsPlayers_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES play.tournaments(id) ON DELETE CASCADE DEFERRABLE NOT VALID;


--
-- TOC entry 4080 (class 2606 OID 17570)
-- Name: tournamentsTeams tournamentsTeams_teamId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."tournamentsTeams"
    ADD CONSTRAINT "tournamentsTeams_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES play.teams(id) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE;


--
-- TOC entry 4081 (class 2606 OID 17575)
-- Name: tournamentsTeams tournamentsTeams_tournamentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."tournamentsTeams"
    ADD CONSTRAINT "tournamentsTeams_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES play.tournaments(id) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE;


--
-- TOC entry 4066 (class 2606 OID 17580)
-- Name: tournaments tournaments_gameId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play.tournaments
    ADD CONSTRAINT "tournaments_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES play.games(id) DEFERRABLE;


--
-- TOC entry 4085 (class 2606 OID 17595)
-- Name: usersMemberships usersMemberships_gameId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."usersMemberships"
    ADD CONSTRAINT "usersMemberships_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES play.games(id) ON DELETE CASCADE DEFERRABLE;


--
-- TOC entry 4086 (class 2606 OID 17600)
-- Name: usersMemberships usersMemberships_membershipId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."usersMemberships"
    ADD CONSTRAINT "usersMemberships_membershipId_fkey" FOREIGN KEY ("membershipId") REFERENCES play.memberships(id) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE;


--
-- TOC entry 4087 (class 2606 OID 17605)
-- Name: usersMemberships usersMemberships_planId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."usersMemberships"
    ADD CONSTRAINT "usersMemberships_planId_fkey" FOREIGN KEY ("planId") REFERENCES play."membershipsCosts"(id) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE;


--
-- TOC entry 4088 (class 2606 OID 17610)
-- Name: usersMemberships usersMemberships_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."usersMemberships"
    ADD CONSTRAINT "usersMemberships_userId_fkey" FOREIGN KEY ("userId") REFERENCES play.users(id) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE;


--
-- TOC entry 4044 (class 2606 OID 17615)
-- Name: players usersPlatforms_gameId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play.players
    ADD CONSTRAINT "usersPlatforms_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES play.games(id) DEFERRABLE;


--
-- TOC entry 4045 (class 2606 OID 17620)
-- Name: players usersPlatforms_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play.players
    ADD CONSTRAINT "usersPlatforms_userId_fkey" FOREIGN KEY ("userId") REFERENCES play.users(id) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE;


--
-- TOC entry 4046 (class 2606 OID 17625)
-- Name: playersRatings usersRatings_gameId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."playersRatings"
    ADD CONSTRAINT "usersRatings_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES play.games(id) DEFERRABLE;


--
-- TOC entry 4047 (class 2606 OID 17630)
-- Name: playersRatings usersRatings_playerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."playersRatings"
    ADD CONSTRAINT "usersRatings_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES play.players(id) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE;


--
-- TOC entry 4089 (class 2606 OID 17635)
-- Name: usersSocials usersSocials_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."usersSocials"
    ADD CONSTRAINT "usersSocials_userId_fkey" FOREIGN KEY ("userId") REFERENCES play.users(id) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE;


--
-- TOC entry 4019 (class 2606 OID 17650)
-- Name: users users_gameId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play.users
    ADD CONSTRAINT "users_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES play.games(id) ON DELETE CASCADE DEFERRABLE NOT VALID;


--
-- TOC entry 4091 (class 2606 OID 17762)
-- Name: walletsCards walletsCards_bankId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."walletsCards"
    ADD CONSTRAINT "walletsCards_bankId_fkey" FOREIGN KEY ("bankId") REFERENCES play."walletsBanks"(id) ON DELETE CASCADE DEFERRABLE;


--
-- TOC entry 4092 (class 2606 OID 17767)
-- Name: walletsCards walletsCards_walletId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."walletsCards"
    ADD CONSTRAINT "walletsCards_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES play.wallets(id) ON DELETE CASCADE DEFERRABLE;


--
-- TOC entry 4093 (class 2606 OID 17781)
-- Name: walletsTransactions walletsTransactions_walletId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play."walletsTransactions"
    ADD CONSTRAINT "walletsTransactions_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES play.wallets(id) ON DELETE CASCADE DEFERRABLE;


--
-- TOC entry 4090 (class 2606 OID 17743)
-- Name: wallets wallets_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY play.wallets
    ADD CONSTRAINT "wallets_userId_fkey" FOREIGN KEY ("userId") REFERENCES play.users(id) ON DELETE CASCADE DEFERRABLE;


-- Completed on 2022-01-12 11:31:25 MSK

--
-- PostgreSQL database dump complete
--


-----------------------------
-- DATA
-----------------------------

TRUNCATE play.users CASCADE;

-- GAMES
TRUNCATE play.games CASCADE;
INSERT INTO play.games VALUES ('brawl', 'BRAWL', NULL, 'games/Brawl.png', 'games/Brawl.png', 'games/Brawl.png', 2, 'disabled', 'disabled', '2020-07-20 15:32:59.312+03', '2020-07-20 15:32:59.312+03', false, 5);
INSERT INTO play.games VALUES ('pubg_mobile', 'PUBG_MOBILE', NULL, 'games/PUBG.png', 'games/PUBG.png', 'games/PUBG.png', 1, 'published', 'published', '2020-07-20 15:32:59.312+03', '2020-07-20 15:32:59.312+03', true, 6);

-- SOCIALS
DELETE FROM play."usersSocials" WHERE vk = '' and facebook = '' and twitch = '' and youtube = '' and instagram = '' and discord = '';

TRUNCATE play.socials CASCADE;
INSERT INTO play.socials VALUES ('7bfe2b0d-aa9e-49db-9ea5-e0a248080f8a', 'vk', 'vk', '2021-12-08 15:54:20.306829+00', '2021-12-08 15:54:20.306829+00', 'https://vk.com/');
INSERT INTO play.socials VALUES ('bd74bbd0-dfa1-4c0a-8470-df3ca89d24d1', 'twitch', 'twitch', '2021-12-08 15:54:20.306829+00', '2021-12-08 15:54:20.306829+00', 'https://www.twitch.tv/');
INSERT INTO play.socials VALUES ('64e65e8b-9d27-4c33-ad28-2c9833aabaff', 'facebook', 'facebook', '2021-12-08 15:54:20.306829+00', '2021-12-08 15:54:20.306829+00', 'https://facebook.com/');
INSERT INTO play.socials VALUES ('1a949dda-3ac2-47d2-aff8-2091b7b3e35d', 'instagram', 'instagram', '2021-12-08 15:54:20.306829+00', '2021-12-08 15:54:20.306829+00', 'https://www.instagram.com/');
INSERT INTO play.socials VALUES ('923223e7-49d7-4fe4-aa2c-9411e7bd2326', 'discord', 'discord', '2021-12-08 15:54:20.306829+00', '2021-12-08 15:54:20.306829+00', 'https://discord.gg/');

-- WALLETS
TRUNCATE play."walletsBanks" CASCADE;
INSERT INTO play."walletsBanks" (id, "createdAt", "updatedAt", "name", "order") VALUES ('9e995f91-44b0-44b3-a36a-19deb556ac58', '2021-12-26 16:10:30.824148+00', '2021-12-26 16:10:30.824148+00', 'Sber', 1);
INSERT INTO play."walletsBanks" (id, "createdAt", "updatedAt", "name", "order") VALUES ('45211296-946f-49ec-b4f8-4f6911452eff', '2021-12-26 16:10:30.824148+00', '2021-12-26 16:10:30.824148+00', 'Tinkoff', 2);
INSERT INTO play."walletsBanks" (id, "createdAt", "updatedAt", "name", "order") VALUES ('206e69a2-5880-4fb1-bbf9-ca26f97bed2e', '2021-12-26 16:10:30.824148+00', '2021-12-26 16:10:30.824148+00', 'Qiwi', 3);

