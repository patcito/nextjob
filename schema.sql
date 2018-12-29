--
-- PostgreSQL database dump
--

-- Dumped from database version 10.5 (Debian 10.5-1.pgdg90+1)
-- Dumped by pg_dump version 10.5 (Debian 10.5-1.pgdg90+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: DATABASE postgres; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON DATABASE postgres IS 'default administrative connection database';


--
-- Name: hdb_catalog; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA hdb_catalog;


ALTER SCHEMA hdb_catalog OWNER TO postgres;

--
-- Name: hdb_views; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA hdb_views;


ALTER SCHEMA hdb_views OWNER TO postgres;

--
-- Name: topology; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA topology;


ALTER SCHEMA topology OWNER TO postgres;

--
-- Name: SCHEMA topology; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA topology IS 'PostGIS Topology schema';


--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: postgis; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;


--
-- Name: EXTENSION postgis; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION postgis IS 'PostGIS geometry, geography, and raster spatial types and functions';


--
-- Name: postgis_topology; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS postgis_topology WITH SCHEMA topology;


--
-- Name: EXTENSION postgis_topology; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION postgis_topology IS 'PostGIS topology spatial types and functions';


--
-- Name: first_agg(anyelement, anyelement); Type: FUNCTION; Schema: hdb_catalog; Owner: postgres
--

CREATE FUNCTION hdb_catalog.first_agg(anyelement, anyelement) RETURNS anyelement
    LANGUAGE sql IMMUTABLE STRICT
    AS $_$
       SELECT $1;
$_$;


ALTER FUNCTION hdb_catalog.first_agg(anyelement, anyelement) OWNER TO postgres;

--
-- Name: hdb_table_oid_check(); Type: FUNCTION; Schema: hdb_catalog; Owner: postgres
--

CREATE FUNCTION hdb_catalog.hdb_table_oid_check() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
  BEGIN
    IF (EXISTS (SELECT 1 FROM information_schema.tables st WHERE st.table_schema = NEW.table_schema AND st.table_name = NEW.table_name)) THEN
      return NEW;
    ELSE
      RAISE foreign_key_violation using message = 'table_schema, table_name not in information_schema.tables';
      return NULL;
    END IF;
  END;
$$;


ALTER FUNCTION hdb_catalog.hdb_table_oid_check() OWNER TO postgres;

--
-- Name: inject_table_defaults(text, text, text, text); Type: FUNCTION; Schema: hdb_catalog; Owner: postgres
--

CREATE FUNCTION hdb_catalog.inject_table_defaults(view_schema text, view_name text, tab_schema text, tab_name text) RETURNS void
    LANGUAGE plpgsql
    AS $$
    DECLARE
        r RECORD;
    BEGIN
      FOR r IN SELECT column_name, column_default FROM information_schema.columns WHERE table_schema = tab_schema AND table_name = tab_name AND column_default IS NOT NULL LOOP
          EXECUTE format('ALTER VIEW %I.%I ALTER COLUMN %I SET DEFAULT %s;', view_schema, view_name, r.column_name, r.column_default);
      END LOOP;
    END;
$$;


ALTER FUNCTION hdb_catalog.inject_table_defaults(view_schema text, view_name text, tab_schema text, tab_name text) OWNER TO postgres;

--
-- Name: last_agg(anyelement, anyelement); Type: FUNCTION; Schema: hdb_catalog; Owner: postgres
--

CREATE FUNCTION hdb_catalog.last_agg(anyelement, anyelement) RETURNS anyelement
    LANGUAGE sql IMMUTABLE STRICT
    AS $_$
        SELECT $2;
$_$;


ALTER FUNCTION hdb_catalog.last_agg(anyelement, anyelement) OWNER TO postgres;

--
-- Name: notify_hasura_on_job_application_create_INSERT(); Type: FUNCTION; Schema: hdb_views; Owner: postgres
--

CREATE FUNCTION hdb_views."notify_hasura_on_job_application_create_INSERT"() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
   DECLARE
   id text;
   _old record;
   _new record;
   _data json;
   payload json;
   BEGIN
     id := gen_random_uuid();
     IF TG_OP = 'UPDATE' THEN
       _old := row((SELECT  "e"  FROM  (SELECT  OLD."status" , OLD."iid" , OLD."jobId" , OLD."createdAt" , OLD."coverLetter" , OLD."hasResumePdf" , OLD."applicantId" , OLD."id" , OLD."updatedAt"        ) AS "e"      ) );
       _new := row((SELECT  "e"  FROM  (SELECT  NEW."status" , NEW."iid" , NEW."jobId" , NEW."createdAt" , NEW."coverLetter" , NEW."hasResumePdf" , NEW."applicantId" , NEW."id" , NEW."updatedAt"        ) AS "e"      ) );
     ELSE
     /* initialize _old and _new with dummy values */
       _old := row((select 1));
       _new := row((select 1));
     END IF;
     _data := json_build_object(
       'old', NULL,
       'new', row_to_json(NEW )
     );
     payload := json_build_object(
                        'op', TG_OP,
                        'data', _data
                        )::text;
     IF (TG_OP <> 'UPDATE') OR (_old <> _new) THEN
       INSERT INTO
       hdb_catalog.event_log (id, schema_name, table_name, trigger_name, trigger_id, payload)
       VALUES
       (id, TG_TABLE_SCHEMA, TG_TABLE_NAME, 'on_job_application_create', 'fc60f3ac-837e-4391-bf19-9b2b978f7a04', payload);
     END IF;
     RETURN NULL;
   END;
   $$;


ALTER FUNCTION hdb_views."notify_hasura_on_job_application_create_INSERT"() OWNER TO postgres;

--
-- Name: notify_hasura_on_job_update_INSERT(); Type: FUNCTION; Schema: hdb_views; Owner: postgres
--

CREATE FUNCTION hdb_views."notify_hasura_on_job_update_INSERT"() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
   DECLARE
   id text;
   _old record;
   _new record;
   _data json;
   payload json;
   BEGIN
     id := gen_random_uuid();
     IF TG_OP = 'UPDATE' THEN
       _old := row((SELECT  "e"  FROM  (SELECT  OLD."minimumExperienceYears" , OLD."remote" , OLD."postal_code" , OLD."companyId" , OLD."Industry" , OLD."createdAt" , (ST_AsGeoJSON(OLD."location", 15, 4 ))::json , OLD."description_fr" , OLD."country" , OLD."administrative_area_level_1" , OLD."SeniorityLevel" , OLD."maximumMonthlySalary" , OLD."route" , OLD."lat" , OLD."applicationUrl" , OLD."locality" , OLD."applyDirectly" , OLD."ownerId" , OLD."SalaryBracket" , OLD."minimumMonthlySalary" , OLD."JobTitle" , OLD."maximumExperienceYears" , OLD."isPublished" , OLD."lng" , OLD."EmployementType" , OLD."street_number" , OLD."id" , OLD."updatedAt" , OLD."title" , OLD."minimumYearlySalary" , OLD."hasMonthlySalary" , OLD."applicationEmail" , OLD."maximumYearlySalary" , OLD."description"        ) AS "e"      ) );
       _new := row((SELECT  "e"  FROM  (SELECT  NEW."minimumExperienceYears" , NEW."remote" , NEW."postal_code" , NEW."companyId" , NEW."Industry" , NEW."createdAt" , (ST_AsGeoJSON(NEW."location", 15, 4 ))::json , NEW."description_fr" , NEW."country" , NEW."administrative_area_level_1" , NEW."SeniorityLevel" , NEW."maximumMonthlySalary" , NEW."route" , NEW."lat" , NEW."applicationUrl" , NEW."locality" , NEW."applyDirectly" , NEW."ownerId" , NEW."SalaryBracket" , NEW."minimumMonthlySalary" , NEW."JobTitle" , NEW."maximumExperienceYears" , NEW."isPublished" , NEW."lng" , NEW."EmployementType" , NEW."street_number" , NEW."id" , NEW."updatedAt" , NEW."title" , NEW."minimumYearlySalary" , NEW."hasMonthlySalary" , NEW."applicationEmail" , NEW."maximumYearlySalary" , NEW."description"        ) AS "e"      ) );
     ELSE
     /* initialize _old and _new with dummy values */
       _old := row((select 1));
       _new := row((select 1));
     END IF;
     _data := json_build_object(
       'old', NULL,
       'new', row_to_json(NEW )
     );
     payload := json_build_object(
                        'op', TG_OP,
                        'data', _data
                        )::text;
     IF (TG_OP <> 'UPDATE') OR (_old <> _new) THEN
       INSERT INTO
       hdb_catalog.event_log (id, schema_name, table_name, trigger_name, trigger_id, payload)
       VALUES
       (id, TG_TABLE_SCHEMA, TG_TABLE_NAME, 'on_job_update', 'ded6f056-ceb7-4613-b2b0-657f4494bb57', payload);
     END IF;
     RETURN NULL;
   END;
   $$;


ALTER FUNCTION hdb_views."notify_hasura_on_job_update_INSERT"() OWNER TO postgres;

--
-- Name: notify_hasura_on_message_create_INSERT(); Type: FUNCTION; Schema: hdb_views; Owner: postgres
--

CREATE FUNCTION hdb_views."notify_hasura_on_message_create_INSERT"() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
   DECLARE
   id text;
   _old record;
   _new record;
   _data json;
   payload json;
   BEGIN
     id := gen_random_uuid();
     IF TG_OP = 'UPDATE' THEN
       _old := row((SELECT  "e"  FROM  (SELECT  OLD."createdAt" , OLD."body" , OLD."userId" , OLD."applicationId" , OLD."id" , OLD."updatedAt"        ) AS "e"      ) );
       _new := row((SELECT  "e"  FROM  (SELECT  NEW."createdAt" , NEW."body" , NEW."userId" , NEW."applicationId" , NEW."id" , NEW."updatedAt"        ) AS "e"      ) );
     ELSE
     /* initialize _old and _new with dummy values */
       _old := row((select 1));
       _new := row((select 1));
     END IF;
     _data := json_build_object(
       'old', NULL,
       'new', row_to_json(NEW )
     );
     payload := json_build_object(
                        'op', TG_OP,
                        'data', _data
                        )::text;
     IF (TG_OP <> 'UPDATE') OR (_old <> _new) THEN
       INSERT INTO
       hdb_catalog.event_log (id, schema_name, table_name, trigger_name, trigger_id, payload)
       VALUES
       (id, TG_TABLE_SCHEMA, TG_TABLE_NAME, 'on_message_create', '9308935c-fd7d-454b-8eb3-07e7684a5c53', payload);
     END IF;
     RETURN NULL;
   END;
   $$;


ALTER FUNCTION hdb_views."notify_hasura_on_message_create_INSERT"() OWNER TO postgres;

--
-- Name: notify_hasura_on_message_insert_UPDATE(); Type: FUNCTION; Schema: hdb_views; Owner: postgres
--

CREATE FUNCTION hdb_views."notify_hasura_on_message_insert_UPDATE"() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
   DECLARE
   id text;
   _old record;
   _new record;
   _data json;
   payload json;
   BEGIN
     id := gen_random_uuid();
     IF TG_OP = 'UPDATE' THEN
       _old := row((SELECT  "e"  FROM  (SELECT  OLD."createdAt" , OLD."body" , OLD."userId" , OLD."applicationId" , OLD."id" , OLD."updatedAt"        ) AS "e"      ) );
       _new := row((SELECT  "e"  FROM  (SELECT  NEW."createdAt" , NEW."body" , NEW."userId" , NEW."applicationId" , NEW."id" , NEW."updatedAt"        ) AS "e"      ) );
     ELSE
     /* initialize _old and _new with dummy values */
       _old := row((select 1));
       _new := row((select 1));
     END IF;
     _data := json_build_object(
       'old', row_to_json(OLD ),
       'new', row_to_json(NEW )
     );
     payload := json_build_object(
                        'op', TG_OP,
                        'data', _data
                        )::text;
     IF (TG_OP <> 'UPDATE') OR (_old <> _new) THEN
       INSERT INTO
       hdb_catalog.event_log (id, schema_name, table_name, trigger_name, trigger_id, payload)
       VALUES
       (id, TG_TABLE_SCHEMA, TG_TABLE_NAME, 'on_message_insert', 'b4762fba-ddcc-4f33-b9c5-8be549810e5e', payload);
     END IF;
     RETURN NULL;
   END;
   $$;


ALTER FUNCTION hdb_views."notify_hasura_on_message_insert_UPDATE"() OWNER TO postgres;

--
-- Name: notify_hasura_on_update_message_UPDATE(); Type: FUNCTION; Schema: hdb_views; Owner: postgres
--

CREATE FUNCTION hdb_views."notify_hasura_on_update_message_UPDATE"() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
   DECLARE
   id text;
   _old record;
   _new record;
   _data json;
   payload json;
   BEGIN
     id := gen_random_uuid();
     IF TG_OP = 'UPDATE' THEN
       _old := row((SELECT  "e"  FROM  (SELECT  OLD."createdAt" , OLD."body" , OLD."userId" , OLD."applicationId" , OLD."id" , OLD."updatedAt"        ) AS "e"      ) );
       _new := row((SELECT  "e"  FROM  (SELECT  NEW."createdAt" , NEW."body" , NEW."userId" , NEW."applicationId" , NEW."id" , NEW."updatedAt"        ) AS "e"      ) );
     ELSE
     /* initialize _old and _new with dummy values */
       _old := row((select 1));
       _new := row((select 1));
     END IF;
     _data := json_build_object(
       'old', row_to_json(OLD ),
       'new', row_to_json(NEW )
     );
     payload := json_build_object(
                        'op', TG_OP,
                        'data', _data
                        )::text;
     IF (TG_OP <> 'UPDATE') OR (_old <> _new) THEN
       INSERT INTO
       hdb_catalog.event_log (id, schema_name, table_name, trigger_name, trigger_id, payload)
       VALUES
       (id, TG_TABLE_SCHEMA, TG_TABLE_NAME, 'on_update_message', '8d3e9d4c-1368-45ef-91ce-3a94e1775eb8', payload);
     END IF;
     RETURN NULL;
   END;
   $$;


ALTER FUNCTION hdb_views."notify_hasura_on_update_message_UPDATE"() OWNER TO postgres;

--
-- Name: user-candidate__insert__public__JobApplication(); Type: FUNCTION; Schema: hdb_views; Owner: postgres
--

CREATE FUNCTION hdb_views."user-candidate__insert__public__JobApplication"() RETURNS trigger
    LANGUAGE plpgsql
    AS $_$
  DECLARE r "public"."JobApplication"%ROWTYPE;
  DECLARE conflict_clause jsonb;
  DECLARE action text;
  DECLARE constraint_name text;
  DECLARE set_expression text;
  BEGIN
    conflict_clause = current_setting('hasura.conflict_clause')::jsonb;
    IF (((((((NEW."applicantId") = (((current_setting('hasura.user')::json->>'x-hasura-user-id'))::integer)) OR (((NEW."applicantId") IS NULL) AND ((((current_setting('hasura.user')::json->>'x-hasura-user-id'))::integer) IS NULL))) AND ('true')) AND ('true')) AND (((EXISTS  (SELECT  1  FROM "public"."User" AS "_be_0_public_User" WHERE (((("_be_0_public_User"."id") = (NEW."applicantId")) AND ('true')) AND (((("_be_0_public_User"."linkedinEmail") IS NULL) AND ('true')) AND ('true')))     )) AND ('true')) AND ('true'))) AND ('true')) THEN
      CASE
        WHEN conflict_clause = 'null'::jsonb THEN INSERT INTO "public"."JobApplication" VALUES (NEW.*) RETURNING * INTO r;
        ELSE
          action = conflict_clause ->> 'action';
          constraint_name = quote_ident(conflict_clause ->> 'constraint');
          set_expression = conflict_clause ->> 'set_expression';
          IF action is NOT NULL THEN
            CASE
              WHEN action = 'ignore'::text AND constraint_name IS NULL THEN
                INSERT INTO "public"."JobApplication" VALUES (NEW.*) ON CONFLICT DO NOTHING RETURNING * INTO r;
              WHEN action = 'ignore'::text AND constraint_name is NOT NULL THEN
                EXECUTE 'INSERT INTO "public"."JobApplication" VALUES ($1.*) ON CONFLICT ON CONSTRAINT ' || constraint_name ||
                           ' DO NOTHING RETURNING *' INTO r USING NEW;
              ELSE
                EXECUTE 'INSERT INTO "public"."JobApplication" VALUES ($1.*) ON CONFLICT ON CONSTRAINT ' || constraint_name ||
                           ' DO UPDATE ' || set_expression || ' RETURNING *' INTO r USING NEW;
            END CASE;
            ELSE
              RAISE internal_error using message = 'action is not found'; RETURN NULL;
          END IF;
      END CASE;
      IF r IS NULL THEN RETURN null; ELSE RETURN r; END IF;
     ELSE RAISE check_violation using message = 'insert check constraint failed'; RETURN NULL;
     END IF;
  END $_$;


ALTER FUNCTION hdb_views."user-candidate__insert__public__JobApplication"() OWNER TO postgres;

--
-- Name: user-hr__insert__public__Moderator(); Type: FUNCTION; Schema: hdb_views; Owner: postgres
--

CREATE FUNCTION hdb_views."user-hr__insert__public__Moderator"() RETURNS trigger
    LANGUAGE plpgsql
    AS $_$
  DECLARE r "public"."Moderator"%ROWTYPE;
  DECLARE conflict_clause jsonb;
  DECLARE action text;
  DECLARE constraint_name text;
  DECLARE set_expression text;
  BEGIN
    conflict_clause = current_setting('hasura.conflict_clause')::jsonb;
    IF ((((EXISTS  (SELECT  1  FROM "public"."Company" AS "_be_0_public_Company" WHERE (((("_be_0_public_Company"."id") = (NEW."companyId")) AND ('true')) AND ((((("_be_0_public_Company"."ownerId") = (((current_setting('hasura.user')::json->>'x-hasura-user-id'))::integer)) OR ((("_be_0_public_Company"."ownerId") IS NULL) AND ((((current_setting('hasura.user')::json->>'x-hasura-user-id'))::integer) IS NULL))) AND ('true')) AND ('true')))     )) AND ('true')) OR (((EXISTS  (SELECT  1  FROM "public"."Company" AS "_be_1_public_Company" WHERE (((("_be_1_public_Company"."id") = (NEW."companyId")) AND ('true')) AND ((EXISTS  (SELECT  1  FROM "public"."Moderator" AS "_be_2_public_Moderator" WHERE (((("_be_2_public_Moderator"."companyId") = ("_be_1_public_Company"."id")) AND ('true')) AND ((((EXISTS  (SELECT  1  FROM "public"."User" AS "_be_3_public_User" WHERE (((("_be_3_public_User"."linkedinEmail") = ("_be_2_public_Moderator"."userEmail")) AND ('true')) AND ((((("_be_3_public_User"."id") = (((current_setting('hasura.user')::json->>'x-hasura-user-id'))::integer)) OR ((("_be_3_public_User"."id") IS NULL) AND ((((current_setting('hasura.user')::json->>'x-hasura-user-id'))::integer) IS NULL))) AND ('true')) AND ('true')))     )) AND ('true')) AND (((((("_be_2_public_Moderator"."canAddModerator") = ('true')) OR ((("_be_2_public_Moderator"."canAddModerator") IS NULL) AND (('true') IS NULL))) AND ('true')) AND ('true')) AND ('true'))) AND ('true')))     )) AND ('true')))     )) AND ('true')) OR ('false'))) AND ('true')) THEN
      CASE
        WHEN conflict_clause = 'null'::jsonb THEN INSERT INTO "public"."Moderator" VALUES (NEW.*) RETURNING * INTO r;
        ELSE
          action = conflict_clause ->> 'action';
          constraint_name = quote_ident(conflict_clause ->> 'constraint');
          set_expression = conflict_clause ->> 'set_expression';
          IF action is NOT NULL THEN
            CASE
              WHEN action = 'ignore'::text AND constraint_name IS NULL THEN
                INSERT INTO "public"."Moderator" VALUES (NEW.*) ON CONFLICT DO NOTHING RETURNING * INTO r;
              WHEN action = 'ignore'::text AND constraint_name is NOT NULL THEN
                EXECUTE 'INSERT INTO "public"."Moderator" VALUES ($1.*) ON CONFLICT ON CONSTRAINT ' || constraint_name ||
                           ' DO NOTHING RETURNING *' INTO r USING NEW;
              ELSE
                EXECUTE 'INSERT INTO "public"."Moderator" VALUES ($1.*) ON CONFLICT ON CONSTRAINT ' || constraint_name ||
                           ' DO UPDATE ' || set_expression || ' RETURNING *' INTO r USING NEW;
            END CASE;
            ELSE
              RAISE internal_error using message = 'action is not found'; RETURN NULL;
          END IF;
      END CASE;
      IF r IS NULL THEN RETURN null; ELSE RETURN r; END IF;
     ELSE RAISE check_violation using message = 'insert check constraint failed'; RETURN NULL;
     END IF;
  END $_$;


ALTER FUNCTION hdb_views."user-hr__insert__public__Moderator"() OWNER TO postgres;

--
-- Name: user__insert__public__Company(); Type: FUNCTION; Schema: hdb_views; Owner: postgres
--

CREATE FUNCTION hdb_views."user__insert__public__Company"() RETURNS trigger
    LANGUAGE plpgsql
    AS $_$
  DECLARE r "public"."Company"%ROWTYPE;
  DECLARE conflict_clause jsonb;
  DECLARE action text;
  DECLARE constraint_name text;
  DECLARE set_expression text;
  BEGIN
    conflict_clause = current_setting('hasura.conflict_clause')::jsonb;
    IF (((((((NEW."ownerId") = (((current_setting('hasura.user')::json->>'x-hasura-user-id'))::integer)) OR (((NEW."ownerId") IS NULL) AND ((((current_setting('hasura.user')::json->>'x-hasura-user-id'))::integer) IS NULL))) AND ('true')) AND ('true')) AND (((EXISTS  (SELECT  1  FROM "public"."User" AS "_be_0_public_User" WHERE (((("_be_0_public_User"."id") = (NEW."ownerId")) AND ('true')) AND ((((("_be_0_public_User"."linkedinId") <> ('')) OR ((("_be_0_public_User"."linkedinId") IS NOT NULL) AND (('') IS NULL))) AND ('true')) AND ('true')))     )) AND ('true')) AND ('true'))) AND ('true')) THEN
      CASE
        WHEN conflict_clause = 'null'::jsonb THEN INSERT INTO "public"."Company" VALUES (NEW.*) RETURNING * INTO r;
        ELSE
          action = conflict_clause ->> 'action';
          constraint_name = quote_ident(conflict_clause ->> 'constraint');
          set_expression = conflict_clause ->> 'set_expression';
          IF action is NOT NULL THEN
            CASE
              WHEN action = 'ignore'::text AND constraint_name IS NULL THEN
                INSERT INTO "public"."Company" VALUES (NEW.*) ON CONFLICT DO NOTHING RETURNING * INTO r;
              WHEN action = 'ignore'::text AND constraint_name is NOT NULL THEN
                EXECUTE 'INSERT INTO "public"."Company" VALUES ($1.*) ON CONFLICT ON CONSTRAINT ' || constraint_name ||
                           ' DO NOTHING RETURNING *' INTO r USING NEW;
              ELSE
                EXECUTE 'INSERT INTO "public"."Company" VALUES ($1.*) ON CONFLICT ON CONSTRAINT ' || constraint_name ||
                           ' DO UPDATE ' || set_expression || ' RETURNING *' INTO r USING NEW;
            END CASE;
            ELSE
              RAISE internal_error using message = 'action is not found'; RETURN NULL;
          END IF;
      END CASE;
      IF r IS NULL THEN RETURN null; ELSE RETURN r; END IF;
     ELSE RAISE check_violation using message = 'insert check constraint failed'; RETURN NULL;
     END IF;
  END $_$;


ALTER FUNCTION hdb_views."user__insert__public__Company"() OWNER TO postgres;

--
-- Name: user__insert__public__Job(); Type: FUNCTION; Schema: hdb_views; Owner: postgres
--

CREATE FUNCTION hdb_views."user__insert__public__Job"() RETURNS trigger
    LANGUAGE plpgsql
    AS $_$
  DECLARE r "public"."Job"%ROWTYPE;
  DECLARE conflict_clause jsonb;
  DECLARE action text;
  DECLARE constraint_name text;
  DECLARE set_expression text;
  BEGIN
    conflict_clause = current_setting('hasura.conflict_clause')::jsonb;
    IF ((((EXISTS  (SELECT  1  FROM "public"."Company" AS "_be_0_public_Company" WHERE (((("_be_0_public_Company"."id") = (NEW."companyId")) AND ('true')) AND ((((("_be_0_public_Company"."ownerId") = (((current_setting('hasura.user')::json->>'x-hasura-user-id'))::integer)) OR ((("_be_0_public_Company"."ownerId") IS NULL) AND ((((current_setting('hasura.user')::json->>'x-hasura-user-id'))::integer) IS NULL))) AND ('true')) AND ('true')))     )) AND ('true')) OR ('false')) AND ('true')) THEN
      CASE
        WHEN conflict_clause = 'null'::jsonb THEN INSERT INTO "public"."Job" VALUES (NEW.*) RETURNING * INTO r;
        ELSE
          action = conflict_clause ->> 'action';
          constraint_name = quote_ident(conflict_clause ->> 'constraint');
          set_expression = conflict_clause ->> 'set_expression';
          IF action is NOT NULL THEN
            CASE
              WHEN action = 'ignore'::text AND constraint_name IS NULL THEN
                INSERT INTO "public"."Job" VALUES (NEW.*) ON CONFLICT DO NOTHING RETURNING * INTO r;
              WHEN action = 'ignore'::text AND constraint_name is NOT NULL THEN
                EXECUTE 'INSERT INTO "public"."Job" VALUES ($1.*) ON CONFLICT ON CONSTRAINT ' || constraint_name ||
                           ' DO NOTHING RETURNING *' INTO r USING NEW;
              ELSE
                EXECUTE 'INSERT INTO "public"."Job" VALUES ($1.*) ON CONFLICT ON CONSTRAINT ' || constraint_name ||
                           ' DO UPDATE ' || set_expression || ' RETURNING *' INTO r USING NEW;
            END CASE;
            ELSE
              RAISE internal_error using message = 'action is not found'; RETURN NULL;
          END IF;
      END CASE;
      IF r IS NULL THEN RETURN null; ELSE RETURN r; END IF;
     ELSE RAISE check_violation using message = 'insert check constraint failed'; RETURN NULL;
     END IF;
  END $_$;


ALTER FUNCTION hdb_views."user__insert__public__Job"() OWNER TO postgres;

--
-- Name: user__insert__public__JobFunctionJob(); Type: FUNCTION; Schema: hdb_views; Owner: postgres
--

CREATE FUNCTION hdb_views."user__insert__public__JobFunctionJob"() RETURNS trigger
    LANGUAGE plpgsql
    AS $_$
  DECLARE r "public"."JobFunctionJob"%ROWTYPE;
  DECLARE conflict_clause jsonb;
  DECLARE action text;
  DECLARE constraint_name text;
  DECLARE set_expression text;
  BEGIN
    conflict_clause = current_setting('hasura.conflict_clause')::jsonb;
    IF ((EXISTS  (SELECT  1  FROM "public"."Job" AS "_be_0_public_Job" WHERE (((("_be_0_public_Job"."id") = (NEW."JobId")) AND ('true')) AND ((((("_be_0_public_Job"."ownerId") = (((current_setting('hasura.user')::json->>'x-hasura-user-id'))::integer)) OR ((("_be_0_public_Job"."ownerId") IS NULL) AND ((((current_setting('hasura.user')::json->>'x-hasura-user-id'))::integer) IS NULL))) AND ('true')) AND ('true')))     )) AND ('true')) THEN
      CASE
        WHEN conflict_clause = 'null'::jsonb THEN INSERT INTO "public"."JobFunctionJob" VALUES (NEW.*) RETURNING * INTO r;
        ELSE
          action = conflict_clause ->> 'action';
          constraint_name = quote_ident(conflict_clause ->> 'constraint');
          set_expression = conflict_clause ->> 'set_expression';
          IF action is NOT NULL THEN
            CASE
              WHEN action = 'ignore'::text AND constraint_name IS NULL THEN
                INSERT INTO "public"."JobFunctionJob" VALUES (NEW.*) ON CONFLICT DO NOTHING RETURNING * INTO r;
              WHEN action = 'ignore'::text AND constraint_name is NOT NULL THEN
                EXECUTE 'INSERT INTO "public"."JobFunctionJob" VALUES ($1.*) ON CONFLICT ON CONSTRAINT ' || constraint_name ||
                           ' DO NOTHING RETURNING *' INTO r USING NEW;
              ELSE
                EXECUTE 'INSERT INTO "public"."JobFunctionJob" VALUES ($1.*) ON CONFLICT ON CONSTRAINT ' || constraint_name ||
                           ' DO UPDATE ' || set_expression || ' RETURNING *' INTO r USING NEW;
            END CASE;
            ELSE
              RAISE internal_error using message = 'action is not found'; RETURN NULL;
          END IF;
      END CASE;
      IF r IS NULL THEN RETURN null; ELSE RETURN r; END IF;
     ELSE RAISE check_violation using message = 'insert check constraint failed'; RETURN NULL;
     END IF;
  END $_$;


ALTER FUNCTION hdb_views."user__insert__public__JobFunctionJob"() OWNER TO postgres;

--
-- Name: user__insert__public__JobIndustry(); Type: FUNCTION; Schema: hdb_views; Owner: postgres
--

CREATE FUNCTION hdb_views."user__insert__public__JobIndustry"() RETURNS trigger
    LANGUAGE plpgsql
    AS $_$
  DECLARE r "public"."JobIndustry"%ROWTYPE;
  DECLARE conflict_clause jsonb;
  DECLARE action text;
  DECLARE constraint_name text;
  DECLARE set_expression text;
  BEGIN
    conflict_clause = current_setting('hasura.conflict_clause')::jsonb;
    IF ((EXISTS  (SELECT  1  FROM "public"."Job" AS "_be_0_public_Job" WHERE (((("_be_0_public_Job"."id") = (NEW."JobId")) AND ('true')) AND ((((("_be_0_public_Job"."ownerId") = (((current_setting('hasura.user')::json->>'x-hasura-user-id'))::integer)) OR ((("_be_0_public_Job"."ownerId") IS NULL) AND ((((current_setting('hasura.user')::json->>'x-hasura-user-id'))::integer) IS NULL))) AND ('true')) AND ('true')))     )) AND ('true')) THEN
      CASE
        WHEN conflict_clause = 'null'::jsonb THEN INSERT INTO "public"."JobIndustry" VALUES (NEW.*) RETURNING * INTO r;
        ELSE
          action = conflict_clause ->> 'action';
          constraint_name = quote_ident(conflict_clause ->> 'constraint');
          set_expression = conflict_clause ->> 'set_expression';
          IF action is NOT NULL THEN
            CASE
              WHEN action = 'ignore'::text AND constraint_name IS NULL THEN
                INSERT INTO "public"."JobIndustry" VALUES (NEW.*) ON CONFLICT DO NOTHING RETURNING * INTO r;
              WHEN action = 'ignore'::text AND constraint_name is NOT NULL THEN
                EXECUTE 'INSERT INTO "public"."JobIndustry" VALUES ($1.*) ON CONFLICT ON CONSTRAINT ' || constraint_name ||
                           ' DO NOTHING RETURNING *' INTO r USING NEW;
              ELSE
                EXECUTE 'INSERT INTO "public"."JobIndustry" VALUES ($1.*) ON CONFLICT ON CONSTRAINT ' || constraint_name ||
                           ' DO UPDATE ' || set_expression || ' RETURNING *' INTO r USING NEW;
            END CASE;
            ELSE
              RAISE internal_error using message = 'action is not found'; RETURN NULL;
          END IF;
      END CASE;
      IF r IS NULL THEN RETURN null; ELSE RETURN r; END IF;
     ELSE RAISE check_violation using message = 'insert check constraint failed'; RETURN NULL;
     END IF;
  END $_$;


ALTER FUNCTION hdb_views."user__insert__public__JobIndustry"() OWNER TO postgres;

--
-- Name: user__insert__public__Message(); Type: FUNCTION; Schema: hdb_views; Owner: postgres
--

CREATE FUNCTION hdb_views."user__insert__public__Message"() RETURNS trigger
    LANGUAGE plpgsql
    AS $_$
  DECLARE r "public"."Message"%ROWTYPE;
  DECLARE conflict_clause jsonb;
  DECLARE action text;
  DECLARE constraint_name text;
  DECLARE set_expression text;
  BEGIN
    conflict_clause = current_setting('hasura.conflict_clause')::jsonb;
    IF ((((EXISTS  (SELECT  1  FROM "public"."JobApplication" AS "_be_0_public_JobApplication" WHERE (((("_be_0_public_JobApplication"."id") = (NEW."applicationId")) AND ('true')) AND ((((("_be_0_public_JobApplication"."applicantId") = (((current_setting('hasura.user')::json->>'x-hasura-user-id'))::integer)) OR ((("_be_0_public_JobApplication"."applicantId") IS NULL) AND ((((current_setting('hasura.user')::json->>'x-hasura-user-id'))::integer) IS NULL))) AND ('true')) AND ('true')))     )) AND ('true')) OR (((EXISTS  (SELECT  1  FROM "public"."JobApplication" AS "_be_1_public_JobApplication" WHERE (((("_be_1_public_JobApplication"."id") = (NEW."applicationId")) AND ('true')) AND ((EXISTS  (SELECT  1  FROM "public"."Job" AS "_be_2_public_Job" WHERE (((("_be_2_public_Job"."id") = ("_be_1_public_JobApplication"."jobId")) AND ('true')) AND ((((("_be_2_public_Job"."ownerId") = (((current_setting('hasura.user')::json->>'x-hasura-user-id'))::integer)) OR ((("_be_2_public_Job"."ownerId") IS NULL) AND ((((current_setting('hasura.user')::json->>'x-hasura-user-id'))::integer) IS NULL))) AND ('true')) AND ('true')))     )) AND ('true')))     )) AND ('true')) OR (((EXISTS  (SELECT  1  FROM "public"."JobApplication" AS "_be_3_public_JobApplication" WHERE (((("_be_3_public_JobApplication"."id") = (NEW."applicationId")) AND ('true')) AND ((EXISTS  (SELECT  1  FROM "public"."Job" AS "_be_4_public_Job" WHERE (((("_be_4_public_Job"."id") = ("_be_3_public_JobApplication"."jobId")) AND ('true')) AND ((EXISTS  (SELECT  1  FROM "public"."Company" AS "_be_5_public_Company" WHERE (((("_be_5_public_Company"."id") = ("_be_4_public_Job"."companyId")) AND ('true')) AND ((EXISTS  (SELECT  1  FROM "public"."Moderator" AS "_be_6_public_Moderator" WHERE (((("_be_6_public_Moderator"."companyId") = ("_be_5_public_Company"."id")) AND ('true')) AND ((EXISTS  (SELECT  1  FROM "public"."User" AS "_be_7_public_User" WHERE (((("_be_7_public_User"."linkedinEmail") = ("_be_6_public_Moderator"."userEmail")) AND ('true')) AND ((((("_be_7_public_User"."id") = (((current_setting('hasura.user')::json->>'x-hasura-user-id'))::integer)) OR ((("_be_7_public_User"."id") IS NULL) AND ((((current_setting('hasura.user')::json->>'x-hasura-user-id'))::integer) IS NULL))) AND ('true')) AND ('true')))     )) AND ('true')))     )) AND ('true')))     )) AND ('true')))     )) AND ('true')))     )) AND ('true')) OR (((EXISTS  (SELECT  1  FROM "public"."JobApplication" AS "_be_8_public_JobApplication" WHERE (((("_be_8_public_JobApplication"."id") = (NEW."applicationId")) AND ('true')) AND ((EXISTS  (SELECT  1  FROM "public"."Job" AS "_be_9_public_Job" WHERE (((("_be_9_public_Job"."id") = ("_be_8_public_JobApplication"."jobId")) AND ('true')) AND ((EXISTS  (SELECT  1  FROM "public"."Company" AS "_be_10_public_Company" WHERE (((("_be_10_public_Company"."id") = ("_be_9_public_Job"."companyId")) AND ('true')) AND ((((("_be_10_public_Company"."ownerId") = (((current_setting('hasura.user')::json->>'x-hasura-user-id'))::integer)) OR ((("_be_10_public_Company"."ownerId") IS NULL) AND ((((current_setting('hasura.user')::json->>'x-hasura-user-id'))::integer) IS NULL))) AND ('true')) AND ('true')))     )) AND ('true')))     )) AND ('true')))     )) AND ('true')) OR ('false'))))) AND ('true')) THEN
      CASE
        WHEN conflict_clause = 'null'::jsonb THEN INSERT INTO "public"."Message" VALUES (NEW.*) RETURNING * INTO r;
        ELSE
          action = conflict_clause ->> 'action';
          constraint_name = quote_ident(conflict_clause ->> 'constraint');
          set_expression = conflict_clause ->> 'set_expression';
          IF action is NOT NULL THEN
            CASE
              WHEN action = 'ignore'::text AND constraint_name IS NULL THEN
                INSERT INTO "public"."Message" VALUES (NEW.*) ON CONFLICT DO NOTHING RETURNING * INTO r;
              WHEN action = 'ignore'::text AND constraint_name is NOT NULL THEN
                EXECUTE 'INSERT INTO "public"."Message" VALUES ($1.*) ON CONFLICT ON CONSTRAINT ' || constraint_name ||
                           ' DO NOTHING RETURNING *' INTO r USING NEW;
              ELSE
                EXECUTE 'INSERT INTO "public"."Message" VALUES ($1.*) ON CONFLICT ON CONSTRAINT ' || constraint_name ||
                           ' DO UPDATE ' || set_expression || ' RETURNING *' INTO r USING NEW;
            END CASE;
            ELSE
              RAISE internal_error using message = 'action is not found'; RETURN NULL;
          END IF;
      END CASE;
      IF r IS NULL THEN RETURN null; ELSE RETURN r; END IF;
     ELSE RAISE check_violation using message = 'insert check constraint failed'; RETURN NULL;
     END IF;
  END $_$;


ALTER FUNCTION hdb_views."user__insert__public__Message"() OWNER TO postgres;

--
-- Name: user__insert__public__Moderator(); Type: FUNCTION; Schema: hdb_views; Owner: postgres
--

CREATE FUNCTION hdb_views."user__insert__public__Moderator"() RETURNS trigger
    LANGUAGE plpgsql
    AS $_$
  DECLARE r "public"."Moderator"%ROWTYPE;
  DECLARE conflict_clause jsonb;
  DECLARE action text;
  DECLARE constraint_name text;
  DECLARE set_expression text;
  BEGIN
    conflict_clause = current_setting('hasura.conflict_clause')::jsonb;
    IF ((((EXISTS  (SELECT  1  FROM "public"."Company" AS "_be_0_public_Company" WHERE (((("_be_0_public_Company"."id") = (NEW."companyId")) AND ('true')) AND ((((("_be_0_public_Company"."ownerId") = (((current_setting('hasura.user')::json->>'x-hasura-user-id'))::integer)) OR ((("_be_0_public_Company"."ownerId") IS NULL) AND ((((current_setting('hasura.user')::json->>'x-hasura-user-id'))::integer) IS NULL))) AND ('true')) AND ('true')))     )) AND ('true')) OR (((EXISTS  (SELECT  1  FROM "public"."Company" AS "_be_1_public_Company" WHERE (((("_be_1_public_Company"."id") = (NEW."companyId")) AND ('true')) AND ((EXISTS  (SELECT  1  FROM "public"."Moderator" AS "_be_2_public_Moderator" WHERE (((("_be_2_public_Moderator"."companyId") = ("_be_1_public_Company"."id")) AND ('true')) AND ((EXISTS  (SELECT  1  FROM "public"."User" AS "_be_3_public_User" WHERE (((("_be_3_public_User"."linkedinEmail") = ("_be_2_public_Moderator"."userEmail")) AND ('true')) AND ((((("_be_3_public_User"."id") = (((current_setting('hasura.user')::json->>'x-hasura-user-id'))::integer)) OR ((("_be_3_public_User"."id") IS NULL) AND ((((current_setting('hasura.user')::json->>'x-hasura-user-id'))::integer) IS NULL))) AND ('true')) AND ('true')))     )) AND ('true')))     )) AND ('true')))     )) AND ('true')) OR ('false'))) AND ('true')) THEN
      CASE
        WHEN conflict_clause = 'null'::jsonb THEN INSERT INTO "public"."Moderator" VALUES (NEW.*) RETURNING * INTO r;
        ELSE
          action = conflict_clause ->> 'action';
          constraint_name = quote_ident(conflict_clause ->> 'constraint');
          set_expression = conflict_clause ->> 'set_expression';
          IF action is NOT NULL THEN
            CASE
              WHEN action = 'ignore'::text AND constraint_name IS NULL THEN
                INSERT INTO "public"."Moderator" VALUES (NEW.*) ON CONFLICT DO NOTHING RETURNING * INTO r;
              WHEN action = 'ignore'::text AND constraint_name is NOT NULL THEN
                EXECUTE 'INSERT INTO "public"."Moderator" VALUES ($1.*) ON CONFLICT ON CONSTRAINT ' || constraint_name ||
                           ' DO NOTHING RETURNING *' INTO r USING NEW;
              ELSE
                EXECUTE 'INSERT INTO "public"."Moderator" VALUES ($1.*) ON CONFLICT ON CONSTRAINT ' || constraint_name ||
                           ' DO UPDATE ' || set_expression || ' RETURNING *' INTO r USING NEW;
            END CASE;
            ELSE
              RAISE internal_error using message = 'action is not found'; RETURN NULL;
          END IF;
      END CASE;
      IF r IS NULL THEN RETURN null; ELSE RETURN r; END IF;
     ELSE RAISE check_violation using message = 'insert check constraint failed'; RETURN NULL;
     END IF;
  END $_$;


ALTER FUNCTION hdb_views."user__insert__public__Moderator"() OWNER TO postgres;

--
-- Name: user__insert__public__PerkCompany(); Type: FUNCTION; Schema: hdb_views; Owner: postgres
--

CREATE FUNCTION hdb_views."user__insert__public__PerkCompany"() RETURNS trigger
    LANGUAGE plpgsql
    AS $_$
  DECLARE r "public"."PerkCompany"%ROWTYPE;
  DECLARE conflict_clause jsonb;
  DECLARE action text;
  DECLARE constraint_name text;
  DECLARE set_expression text;
  BEGIN
    conflict_clause = current_setting('hasura.conflict_clause')::jsonb;
    IF ((((EXISTS  (SELECT  1  FROM "public"."Company" AS "_be_0_public_Company" WHERE (((("_be_0_public_Company"."id") = (NEW."CompanyId")) AND ('true')) AND ((((("_be_0_public_Company"."ownerId") = (((current_setting('hasura.user')::json->>'x-hasura-user-id'))::integer)) OR ((("_be_0_public_Company"."ownerId") IS NULL) AND ((((current_setting('hasura.user')::json->>'x-hasura-user-id'))::integer) IS NULL))) AND ('true')) AND ('true')))     )) AND ('true')) OR (((EXISTS  (SELECT  1  FROM "public"."Company" AS "_be_1_public_Company" WHERE (((("_be_1_public_Company"."id") = (NEW."CompanyId")) AND ('true')) AND ((EXISTS  (SELECT  1  FROM "public"."Moderator" AS "_be_2_public_Moderator" WHERE (((("_be_2_public_Moderator"."companyId") = ("_be_1_public_Company"."id")) AND ('true')) AND ((EXISTS  (SELECT  1  FROM "public"."User" AS "_be_3_public_User" WHERE (((("_be_3_public_User"."linkedinEmail") = ("_be_2_public_Moderator"."userEmail")) AND ('true')) AND ((((("_be_3_public_User"."id") = (((current_setting('hasura.user')::json->>'x-hasura-user-id'))::integer)) OR ((("_be_3_public_User"."id") IS NULL) AND ((((current_setting('hasura.user')::json->>'x-hasura-user-id'))::integer) IS NULL))) AND ('true')) AND ('true')))     )) AND ('true')))     )) AND ('true')))     )) AND ('true')) OR ('false'))) AND ('true')) THEN
      CASE
        WHEN conflict_clause = 'null'::jsonb THEN INSERT INTO "public"."PerkCompany" VALUES (NEW.*) RETURNING * INTO r;
        ELSE
          action = conflict_clause ->> 'action';
          constraint_name = quote_ident(conflict_clause ->> 'constraint');
          set_expression = conflict_clause ->> 'set_expression';
          IF action is NOT NULL THEN
            CASE
              WHEN action = 'ignore'::text AND constraint_name IS NULL THEN
                INSERT INTO "public"."PerkCompany" VALUES (NEW.*) ON CONFLICT DO NOTHING RETURNING * INTO r;
              WHEN action = 'ignore'::text AND constraint_name is NOT NULL THEN
                EXECUTE 'INSERT INTO "public"."PerkCompany" VALUES ($1.*) ON CONFLICT ON CONSTRAINT ' || constraint_name ||
                           ' DO NOTHING RETURNING *' INTO r USING NEW;
              ELSE
                EXECUTE 'INSERT INTO "public"."PerkCompany" VALUES ($1.*) ON CONFLICT ON CONSTRAINT ' || constraint_name ||
                           ' DO UPDATE ' || set_expression || ' RETURNING *' INTO r USING NEW;
            END CASE;
            ELSE
              RAISE internal_error using message = 'action is not found'; RETURN NULL;
          END IF;
      END CASE;
      IF r IS NULL THEN RETURN null; ELSE RETURN r; END IF;
     ELSE RAISE check_violation using message = 'insert check constraint failed'; RETURN NULL;
     END IF;
  END $_$;


ALTER FUNCTION hdb_views."user__insert__public__PerkCompany"() OWNER TO postgres;

--
-- Name: user__insert__public__SkillCompany(); Type: FUNCTION; Schema: hdb_views; Owner: postgres
--

CREATE FUNCTION hdb_views."user__insert__public__SkillCompany"() RETURNS trigger
    LANGUAGE plpgsql
    AS $_$
  DECLARE r "public"."SkillCompany"%ROWTYPE;
  DECLARE conflict_clause jsonb;
  DECLARE action text;
  DECLARE constraint_name text;
  DECLARE set_expression text;
  BEGIN
    conflict_clause = current_setting('hasura.conflict_clause')::jsonb;
    IF ((((EXISTS  (SELECT  1  FROM "public"."Company" AS "_be_0_public_Company" WHERE (((("_be_0_public_Company"."id") = (NEW."CompanyId")) AND ('true')) AND ((((("_be_0_public_Company"."ownerId") = (((current_setting('hasura.user')::json->>'x-hasura-user-id'))::integer)) OR ((("_be_0_public_Company"."ownerId") IS NULL) AND ((((current_setting('hasura.user')::json->>'x-hasura-user-id'))::integer) IS NULL))) AND ('true')) AND ('true')))     )) AND ('true')) OR (((EXISTS  (SELECT  1  FROM "public"."Company" AS "_be_1_public_Company" WHERE (((("_be_1_public_Company"."id") = (NEW."CompanyId")) AND ('true')) AND ((EXISTS  (SELECT  1  FROM "public"."Moderator" AS "_be_2_public_Moderator" WHERE (((("_be_2_public_Moderator"."companyId") = ("_be_1_public_Company"."id")) AND ('true')) AND ((EXISTS  (SELECT  1  FROM "public"."User" AS "_be_3_public_User" WHERE (((("_be_3_public_User"."linkedinEmail") = ("_be_2_public_Moderator"."userEmail")) AND ('true')) AND ((((("_be_3_public_User"."id") = (((current_setting('hasura.user')::json->>'x-hasura-user-id'))::integer)) OR ((("_be_3_public_User"."id") IS NULL) AND ((((current_setting('hasura.user')::json->>'x-hasura-user-id'))::integer) IS NULL))) AND ('true')) AND ('true')))     )) AND ('true')))     )) AND ('true')))     )) AND ('true')) OR ('false'))) AND ('true')) THEN
      CASE
        WHEN conflict_clause = 'null'::jsonb THEN INSERT INTO "public"."SkillCompany" VALUES (NEW.*) RETURNING * INTO r;
        ELSE
          action = conflict_clause ->> 'action';
          constraint_name = quote_ident(conflict_clause ->> 'constraint');
          set_expression = conflict_clause ->> 'set_expression';
          IF action is NOT NULL THEN
            CASE
              WHEN action = 'ignore'::text AND constraint_name IS NULL THEN
                INSERT INTO "public"."SkillCompany" VALUES (NEW.*) ON CONFLICT DO NOTHING RETURNING * INTO r;
              WHEN action = 'ignore'::text AND constraint_name is NOT NULL THEN
                EXECUTE 'INSERT INTO "public"."SkillCompany" VALUES ($1.*) ON CONFLICT ON CONSTRAINT ' || constraint_name ||
                           ' DO NOTHING RETURNING *' INTO r USING NEW;
              ELSE
                EXECUTE 'INSERT INTO "public"."SkillCompany" VALUES ($1.*) ON CONFLICT ON CONSTRAINT ' || constraint_name ||
                           ' DO UPDATE ' || set_expression || ' RETURNING *' INTO r USING NEW;
            END CASE;
            ELSE
              RAISE internal_error using message = 'action is not found'; RETURN NULL;
          END IF;
      END CASE;
      IF r IS NULL THEN RETURN null; ELSE RETURN r; END IF;
     ELSE RAISE check_violation using message = 'insert check constraint failed'; RETURN NULL;
     END IF;
  END $_$;


ALTER FUNCTION hdb_views."user__insert__public__SkillCompany"() OWNER TO postgres;

--
-- Name: user__insert__public__SkillJob(); Type: FUNCTION; Schema: hdb_views; Owner: postgres
--

CREATE FUNCTION hdb_views."user__insert__public__SkillJob"() RETURNS trigger
    LANGUAGE plpgsql
    AS $_$
  DECLARE r "public"."SkillJob"%ROWTYPE;
  DECLARE conflict_clause jsonb;
  DECLARE action text;
  DECLARE constraint_name text;
  DECLARE set_expression text;
  BEGIN
    conflict_clause = current_setting('hasura.conflict_clause')::jsonb;
    IF ((EXISTS  (SELECT  1  FROM "public"."Job" AS "_be_0_public_Job" WHERE (((("_be_0_public_Job"."id") = (NEW."JobId")) AND ('true')) AND ((((("_be_0_public_Job"."ownerId") = (((current_setting('hasura.user')::json->>'x-hasura-user-id'))::integer)) OR ((("_be_0_public_Job"."ownerId") IS NULL) AND ((((current_setting('hasura.user')::json->>'x-hasura-user-id'))::integer) IS NULL))) AND ('true')) AND ('true')))     )) AND ('true')) THEN
      CASE
        WHEN conflict_clause = 'null'::jsonb THEN INSERT INTO "public"."SkillJob" VALUES (NEW.*) RETURNING * INTO r;
        ELSE
          action = conflict_clause ->> 'action';
          constraint_name = quote_ident(conflict_clause ->> 'constraint');
          set_expression = conflict_clause ->> 'set_expression';
          IF action is NOT NULL THEN
            CASE
              WHEN action = 'ignore'::text AND constraint_name IS NULL THEN
                INSERT INTO "public"."SkillJob" VALUES (NEW.*) ON CONFLICT DO NOTHING RETURNING * INTO r;
              WHEN action = 'ignore'::text AND constraint_name is NOT NULL THEN
                EXECUTE 'INSERT INTO "public"."SkillJob" VALUES ($1.*) ON CONFLICT ON CONSTRAINT ' || constraint_name ||
                           ' DO NOTHING RETURNING *' INTO r USING NEW;
              ELSE
                EXECUTE 'INSERT INTO "public"."SkillJob" VALUES ($1.*) ON CONFLICT ON CONSTRAINT ' || constraint_name ||
                           ' DO UPDATE ' || set_expression || ' RETURNING *' INTO r USING NEW;
            END CASE;
            ELSE
              RAISE internal_error using message = 'action is not found'; RETURN NULL;
          END IF;
      END CASE;
      IF r IS NULL THEN RETURN null; ELSE RETURN r; END IF;
     ELSE RAISE check_violation using message = 'insert check constraint failed'; RETURN NULL;
     END IF;
  END $_$;


ALTER FUNCTION hdb_views."user__insert__public__SkillJob"() OWNER TO postgres;

--
-- Name: user__insert__public__SkillUser(); Type: FUNCTION; Schema: hdb_views; Owner: postgres
--

CREATE FUNCTION hdb_views."user__insert__public__SkillUser"() RETURNS trigger
    LANGUAGE plpgsql
    AS $_$
  DECLARE r "public"."SkillUser"%ROWTYPE;
  DECLARE conflict_clause jsonb;
  DECLARE action text;
  DECLARE constraint_name text;
  DECLARE set_expression text;
  BEGIN
    conflict_clause = current_setting('hasura.conflict_clause')::jsonb;
    IF (((((NEW."UserId") = (((current_setting('hasura.user')::json->>'x-hasura-user-id'))::integer)) OR (((NEW."UserId") IS NULL) AND ((((current_setting('hasura.user')::json->>'x-hasura-user-id'))::integer) IS NULL))) AND ('true')) AND ('true')) THEN
      CASE
        WHEN conflict_clause = 'null'::jsonb THEN INSERT INTO "public"."SkillUser" VALUES (NEW.*) RETURNING * INTO r;
        ELSE
          action = conflict_clause ->> 'action';
          constraint_name = quote_ident(conflict_clause ->> 'constraint');
          set_expression = conflict_clause ->> 'set_expression';
          IF action is NOT NULL THEN
            CASE
              WHEN action = 'ignore'::text AND constraint_name IS NULL THEN
                INSERT INTO "public"."SkillUser" VALUES (NEW.*) ON CONFLICT DO NOTHING RETURNING * INTO r;
              WHEN action = 'ignore'::text AND constraint_name is NOT NULL THEN
                EXECUTE 'INSERT INTO "public"."SkillUser" VALUES ($1.*) ON CONFLICT ON CONSTRAINT ' || constraint_name ||
                           ' DO NOTHING RETURNING *' INTO r USING NEW;
              ELSE
                EXECUTE 'INSERT INTO "public"."SkillUser" VALUES ($1.*) ON CONFLICT ON CONSTRAINT ' || constraint_name ||
                           ' DO UPDATE ' || set_expression || ' RETURNING *' INTO r USING NEW;
            END CASE;
            ELSE
              RAISE internal_error using message = 'action is not found'; RETURN NULL;
          END IF;
      END CASE;
      IF r IS NULL THEN RETURN null; ELSE RETURN r; END IF;
     ELSE RAISE check_violation using message = 'insert check constraint failed'; RETURN NULL;
     END IF;
  END $_$;


ALTER FUNCTION hdb_views."user__insert__public__SkillUser"() OWNER TO postgres;

--
-- Name: keepjobappid(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.keepjobappid() RETURNS trigger
    LANGUAGE plpgsql
    AS $$BEGIN
   IF NEW.id IS DISTINCT FROM OLD.id
   THEN
      RAISE EXCEPTION 'id cannot be modified';
   END IF;
   RETURN NEW;
END;$$;


ALTER FUNCTION public.keepjobappid() OWNER TO postgres;

--
-- Name: search_job_distance(double precision, double precision); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.search_job_distance(lat double precision, long double precision) RETURNS TABLE(distance double precision)
    LANGUAGE sql
    AS $_$
                              select ST_Distance_Sphere(location::Geometry, ST_MakePoint($1,$2)) as distance from  "Job"
                                         $_$;


ALTER FUNCTION public.search_job_distance(lat double precision, long double precision) OWNER TO postgres;

--
-- Name: first(anyelement); Type: AGGREGATE; Schema: hdb_catalog; Owner: postgres
--

CREATE AGGREGATE hdb_catalog.first(anyelement) (
    SFUNC = hdb_catalog.first_agg,
    STYPE = anyelement
);


ALTER AGGREGATE hdb_catalog.first(anyelement) OWNER TO postgres;

--
-- Name: last(anyelement); Type: AGGREGATE; Schema: hdb_catalog; Owner: postgres
--

CREATE AGGREGATE hdb_catalog.last(anyelement) (
    SFUNC = hdb_catalog.last_agg,
    STYPE = anyelement
);


ALTER AGGREGATE hdb_catalog.last(anyelement) OWNER TO postgres;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: event_invocation_logs; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.event_invocation_logs (
    id text DEFAULT public.gen_random_uuid() NOT NULL,
    event_id text,
    status integer,
    request json,
    response json,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE hdb_catalog.event_invocation_logs OWNER TO postgres;

--
-- Name: event_log; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.event_log (
    id text DEFAULT public.gen_random_uuid() NOT NULL,
    schema_name text NOT NULL,
    table_name text NOT NULL,
    trigger_id text NOT NULL,
    trigger_name text NOT NULL,
    payload jsonb NOT NULL,
    delivered boolean DEFAULT false NOT NULL,
    error boolean DEFAULT false NOT NULL,
    tries integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    locked boolean DEFAULT false NOT NULL,
    next_retry_at timestamp without time zone
);


ALTER TABLE hdb_catalog.event_log OWNER TO postgres;

--
-- Name: event_triggers; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.event_triggers (
    id text DEFAULT public.gen_random_uuid() NOT NULL,
    name text,
    type text NOT NULL,
    schema_name text NOT NULL,
    table_name text NOT NULL,
    comment text,
    configuration json
);


ALTER TABLE hdb_catalog.event_triggers OWNER TO postgres;

--
-- Name: hdb_check_constraint; Type: VIEW; Schema: hdb_catalog; Owner: postgres
--

CREATE VIEW hdb_catalog.hdb_check_constraint AS
 SELECT (n.nspname)::text AS table_schema,
    (ct.relname)::text AS table_name,
    (r.conname)::text AS constraint_name,
    pg_get_constraintdef(r.oid, true) AS "check"
   FROM ((pg_constraint r
     JOIN pg_class ct ON ((r.conrelid = ct.oid)))
     JOIN pg_namespace n ON ((ct.relnamespace = n.oid)))
  WHERE (r.contype = 'c'::"char");


ALTER TABLE hdb_catalog.hdb_check_constraint OWNER TO postgres;

--
-- Name: hdb_foreign_key_constraint; Type: VIEW; Schema: hdb_catalog; Owner: postgres
--

CREATE VIEW hdb_catalog.hdb_foreign_key_constraint AS
 SELECT (q.table_schema)::text AS table_schema,
    (q.table_name)::text AS table_name,
    (q.constraint_name)::text AS constraint_name,
    (min(q.constraint_oid))::integer AS constraint_oid,
    min((q.ref_table_table_schema)::text) AS ref_table_table_schema,
    min((q.ref_table)::text) AS ref_table,
    json_object_agg(ac.attname, afc.attname) AS column_mapping,
    min((q.confupdtype)::text) AS on_update,
    min((q.confdeltype)::text) AS on_delete
   FROM ((( SELECT ctn.nspname AS table_schema,
            ct.relname AS table_name,
            r.conrelid AS table_id,
            r.conname AS constraint_name,
            r.oid AS constraint_oid,
            cftn.nspname AS ref_table_table_schema,
            cft.relname AS ref_table,
            r.confrelid AS ref_table_id,
            r.confupdtype,
            r.confdeltype,
            unnest(r.conkey) AS column_id,
            unnest(r.confkey) AS ref_column_id
           FROM ((((pg_constraint r
             JOIN pg_class ct ON ((r.conrelid = ct.oid)))
             JOIN pg_namespace ctn ON ((ct.relnamespace = ctn.oid)))
             JOIN pg_class cft ON ((r.confrelid = cft.oid)))
             JOIN pg_namespace cftn ON ((cft.relnamespace = cftn.oid)))
          WHERE (r.contype = 'f'::"char")) q
     JOIN pg_attribute ac ON (((q.column_id = ac.attnum) AND (q.table_id = ac.attrelid))))
     JOIN pg_attribute afc ON (((q.ref_column_id = afc.attnum) AND (q.ref_table_id = afc.attrelid))))
  GROUP BY q.table_schema, q.table_name, q.constraint_name;


ALTER TABLE hdb_catalog.hdb_foreign_key_constraint OWNER TO postgres;

--
-- Name: hdb_permission; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_permission (
    table_schema text NOT NULL,
    table_name text NOT NULL,
    role_name text NOT NULL,
    perm_type text NOT NULL,
    perm_def jsonb NOT NULL,
    comment text,
    is_system_defined boolean DEFAULT false,
    CONSTRAINT hdb_permission_perm_type_check CHECK ((perm_type = ANY (ARRAY['insert'::text, 'select'::text, 'update'::text, 'delete'::text])))
);


ALTER TABLE hdb_catalog.hdb_permission OWNER TO postgres;

--
-- Name: hdb_permission_agg; Type: VIEW; Schema: hdb_catalog; Owner: postgres
--

CREATE VIEW hdb_catalog.hdb_permission_agg AS
 SELECT hdb_permission.table_schema,
    hdb_permission.table_name,
    hdb_permission.role_name,
    json_object_agg(hdb_permission.perm_type, hdb_permission.perm_def) AS permissions
   FROM hdb_catalog.hdb_permission
  GROUP BY hdb_permission.table_schema, hdb_permission.table_name, hdb_permission.role_name;


ALTER TABLE hdb_catalog.hdb_permission_agg OWNER TO postgres;

--
-- Name: hdb_primary_key; Type: VIEW; Schema: hdb_catalog; Owner: postgres
--

CREATE VIEW hdb_catalog.hdb_primary_key AS
 SELECT tc.table_schema,
    tc.table_name,
    tc.constraint_name,
    json_agg(ccu.column_name) AS columns
   FROM (information_schema.table_constraints tc
     JOIN information_schema.constraint_column_usage ccu ON (((tc.constraint_name)::text = (ccu.constraint_name)::text)))
  WHERE ((tc.constraint_type)::text = 'PRIMARY KEY'::text)
  GROUP BY tc.table_schema, tc.table_name, tc.constraint_name;


ALTER TABLE hdb_catalog.hdb_primary_key OWNER TO postgres;

--
-- Name: hdb_query_template; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_query_template (
    template_name text NOT NULL,
    template_defn jsonb NOT NULL,
    comment text,
    is_system_defined boolean DEFAULT false
);


ALTER TABLE hdb_catalog.hdb_query_template OWNER TO postgres;

--
-- Name: hdb_relationship; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_relationship (
    table_schema text NOT NULL,
    table_name text NOT NULL,
    rel_name text NOT NULL,
    rel_type text,
    rel_def jsonb NOT NULL,
    comment text,
    is_system_defined boolean DEFAULT false,
    CONSTRAINT hdb_relationship_rel_type_check CHECK ((rel_type = ANY (ARRAY['object'::text, 'array'::text])))
);


ALTER TABLE hdb_catalog.hdb_relationship OWNER TO postgres;

--
-- Name: hdb_table; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_table (
    table_schema text NOT NULL,
    table_name text NOT NULL,
    is_system_defined boolean DEFAULT false
);


ALTER TABLE hdb_catalog.hdb_table OWNER TO postgres;

--
-- Name: hdb_unique_constraint; Type: VIEW; Schema: hdb_catalog; Owner: postgres
--

CREATE VIEW hdb_catalog.hdb_unique_constraint AS
 SELECT tc.table_name,
    tc.constraint_schema AS table_schema,
    tc.constraint_name,
    json_agg(kcu.column_name) AS columns
   FROM (information_schema.table_constraints tc
     JOIN information_schema.key_column_usage kcu USING (constraint_schema, constraint_name))
  WHERE ((tc.constraint_type)::text = 'UNIQUE'::text)
  GROUP BY tc.table_name, tc.constraint_schema, tc.constraint_name;


ALTER TABLE hdb_catalog.hdb_unique_constraint OWNER TO postgres;

--
-- Name: hdb_version; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_version (
    version text NOT NULL,
    upgraded_on timestamp with time zone NOT NULL
);


ALTER TABLE hdb_catalog.hdb_version OWNER TO postgres;

--
-- Name: remote_schemas; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.remote_schemas (
    id bigint NOT NULL,
    name text,
    definition json,
    comment text
);


ALTER TABLE hdb_catalog.remote_schemas OWNER TO postgres;

--
-- Name: remote_schemas_id_seq; Type: SEQUENCE; Schema: hdb_catalog; Owner: postgres
--

CREATE SEQUENCE hdb_catalog.remote_schemas_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE hdb_catalog.remote_schemas_id_seq OWNER TO postgres;

--
-- Name: remote_schemas_id_seq; Type: SEQUENCE OWNED BY; Schema: hdb_catalog; Owner: postgres
--

ALTER SEQUENCE hdb_catalog.remote_schemas_id_seq OWNED BY hdb_catalog.remote_schemas.id;


--
-- Name: JobApplication; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."JobApplication" (
    "applicantId" integer NOT NULL,
    "jobId" integer NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
    "coverLetter" text NOT NULL,
    "hasResumePdf" boolean NOT NULL,
    id integer NOT NULL,
    iid integer NOT NULL,
    status boolean
);


ALTER TABLE public."JobApplication" OWNER TO postgres;

--
-- Name: user-candidate__insert__public__JobApplication; Type: VIEW; Schema: hdb_views; Owner: postgres
--

CREATE VIEW hdb_views."user-candidate__insert__public__JobApplication" AS
 SELECT "JobApplication"."applicantId",
    "JobApplication"."jobId",
    "JobApplication"."createdAt",
    "JobApplication"."updatedAt",
    "JobApplication"."coverLetter",
    "JobApplication"."hasResumePdf",
    "JobApplication".id,
    "JobApplication".iid,
    "JobApplication".status
   FROM public."JobApplication";


ALTER TABLE hdb_views."user-candidate__insert__public__JobApplication" OWNER TO postgres;

--
-- Name: Moderator; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Moderator" (
    "userEmail" text NOT NULL,
    "companyId" integer NOT NULL,
    "canAddJobs" boolean DEFAULT true,
    "canModifyJobs" boolean DEFAULT true,
    "canEditCompany" boolean DEFAULT true,
    "canAddModerator" boolean DEFAULT true
);


ALTER TABLE public."Moderator" OWNER TO postgres;

--
-- Name: user-hr__insert__public__Moderator; Type: VIEW; Schema: hdb_views; Owner: postgres
--

CREATE VIEW hdb_views."user-hr__insert__public__Moderator" AS
 SELECT "Moderator"."userEmail",
    "Moderator"."companyId",
    "Moderator"."canAddJobs",
    "Moderator"."canModifyJobs",
    "Moderator"."canEditCompany",
    "Moderator"."canAddModerator"
   FROM public."Moderator";


ALTER TABLE hdb_views."user-hr__insert__public__Moderator" OWNER TO postgres;

--
-- Name: Company; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Company" (
    id integer NOT NULL,
    name text NOT NULL,
    "ownerId" integer NOT NULL,
    url text NOT NULL,
    "updatedAt" timestamp with time zone,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "Industry" text NOT NULL,
    "yearFounded" integer,
    "employeeCount" integer DEFAULT 5,
    "devCount" integer DEFAULT 5,
    quote1 json,
    quote2 json,
    employee1 json,
    employee2 json,
    media1 json,
    media2 json,
    media3 json,
    twitter text,
    location public.geography(Point,4326),
    route text,
    street_number text,
    locality text,
    administrative_area_level_1 text,
    postal_code text,
    country text,
    description text,
    description_fr text
);


ALTER TABLE public."Company" OWNER TO postgres;

--
-- Name: user__insert__public__Company; Type: VIEW; Schema: hdb_views; Owner: postgres
--

CREATE VIEW hdb_views."user__insert__public__Company" AS
 SELECT "Company".id,
    "Company".name,
    "Company"."ownerId",
    "Company".url,
    "Company"."updatedAt",
    "Company"."createdAt",
    "Company"."Industry",
    "Company"."yearFounded",
    "Company"."employeeCount",
    "Company"."devCount",
    "Company".quote1,
    "Company".quote2,
    "Company".employee1,
    "Company".employee2,
    "Company".media1,
    "Company".media2,
    "Company".media3,
    "Company".twitter,
    "Company".location,
    "Company".route,
    "Company".street_number,
    "Company".locality,
    "Company".administrative_area_level_1,
    "Company".postal_code,
    "Company".country,
    "Company".description,
    "Company".description_fr
   FROM public."Company";


ALTER TABLE hdb_views."user__insert__public__Company" OWNER TO postgres;

--
-- Name: Job; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Job" (
    id integer NOT NULL,
    title text,
    description text NOT NULL,
    "companyId" integer NOT NULL,
    "ownerId" integer NOT NULL,
    country text NOT NULL,
    remote boolean NOT NULL,
    "SeniorityLevel" text,
    "EmployementType" text,
    "Industry" text,
    "minimumExperienceYears" integer DEFAULT 0,
    "maximumExperienceYears" integer DEFAULT 5,
    "SalaryBracket" text,
    "createdAt" timestamp with time zone,
    "updatedAt" timestamp with time zone,
    "isPublished" boolean DEFAULT false,
    "JobTitle" text,
    route text,
    street_number text,
    locality text,
    administrative_area_level_1 text,
    postal_code text,
    "applicationUrl" text,
    "applicationEmail" text,
    "applyDirectly" boolean,
    lat numeric,
    lng numeric,
    location public.geography(Point,4326),
    "minimumYearlySalary" integer,
    "maximumYearlySalary" integer,
    "minimumMonthlySalary" integer,
    "maximumMonthlySalary" integer,
    "hasMonthlySalary" boolean DEFAULT false,
    description_fr text
);


ALTER TABLE public."Job" OWNER TO postgres;

--
-- Name: user__insert__public__Job; Type: VIEW; Schema: hdb_views; Owner: postgres
--

CREATE VIEW hdb_views."user__insert__public__Job" AS
 SELECT "Job".id,
    "Job".title,
    "Job".description,
    "Job"."companyId",
    "Job"."ownerId",
    "Job".country,
    "Job".remote,
    "Job"."SeniorityLevel",
    "Job"."EmployementType",
    "Job"."Industry",
    "Job"."minimumExperienceYears",
    "Job"."maximumExperienceYears",
    "Job"."SalaryBracket",
    "Job"."createdAt",
    "Job"."updatedAt",
    "Job"."isPublished",
    "Job"."JobTitle",
    "Job".route,
    "Job".street_number,
    "Job".locality,
    "Job".administrative_area_level_1,
    "Job".postal_code,
    "Job"."applicationUrl",
    "Job"."applicationEmail",
    "Job"."applyDirectly",
    "Job".lat,
    "Job".lng,
    "Job".location,
    "Job"."minimumYearlySalary",
    "Job"."maximumYearlySalary",
    "Job"."minimumMonthlySalary",
    "Job"."maximumMonthlySalary",
    "Job"."hasMonthlySalary",
    "Job".description_fr
   FROM public."Job";


ALTER TABLE hdb_views."user__insert__public__Job" OWNER TO postgres;

--
-- Name: JobFunctionJob; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."JobFunctionJob" (
    "JobFunction" text NOT NULL,
    "JobId" integer NOT NULL
);


ALTER TABLE public."JobFunctionJob" OWNER TO postgres;

--
-- Name: user__insert__public__JobFunctionJob; Type: VIEW; Schema: hdb_views; Owner: postgres
--

CREATE VIEW hdb_views."user__insert__public__JobFunctionJob" AS
 SELECT "JobFunctionJob"."JobFunction",
    "JobFunctionJob"."JobId"
   FROM public."JobFunctionJob";


ALTER TABLE hdb_views."user__insert__public__JobFunctionJob" OWNER TO postgres;

--
-- Name: JobIndustry; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."JobIndustry" (
    "IndustryName" text NOT NULL,
    "JobId" integer NOT NULL
);


ALTER TABLE public."JobIndustry" OWNER TO postgres;

--
-- Name: user__insert__public__JobIndustry; Type: VIEW; Schema: hdb_views; Owner: postgres
--

CREATE VIEW hdb_views."user__insert__public__JobIndustry" AS
 SELECT "JobIndustry"."IndustryName",
    "JobIndustry"."JobId"
   FROM public."JobIndustry";


ALTER TABLE hdb_views."user__insert__public__JobIndustry" OWNER TO postgres;

--
-- Name: Message; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Message" (
    id integer NOT NULL,
    body text NOT NULL,
    "applicationId" integer NOT NULL,
    "userId" integer NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public."Message" OWNER TO postgres;

--
-- Name: user__insert__public__Message; Type: VIEW; Schema: hdb_views; Owner: postgres
--

CREATE VIEW hdb_views."user__insert__public__Message" AS
 SELECT "Message".id,
    "Message".body,
    "Message"."applicationId",
    "Message"."userId",
    "Message"."createdAt",
    "Message"."updatedAt"
   FROM public."Message";


ALTER TABLE hdb_views."user__insert__public__Message" OWNER TO postgres;

--
-- Name: user__insert__public__Moderator; Type: VIEW; Schema: hdb_views; Owner: postgres
--

CREATE VIEW hdb_views."user__insert__public__Moderator" AS
 SELECT "Moderator"."userEmail",
    "Moderator"."companyId",
    "Moderator"."canAddJobs",
    "Moderator"."canModifyJobs",
    "Moderator"."canEditCompany",
    "Moderator"."canAddModerator"
   FROM public."Moderator";


ALTER TABLE hdb_views."user__insert__public__Moderator" OWNER TO postgres;

--
-- Name: PerkCompany; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PerkCompany" (
    "Perk" text NOT NULL,
    "CompanyId" integer NOT NULL
);


ALTER TABLE public."PerkCompany" OWNER TO postgres;

--
-- Name: user__insert__public__PerkCompany; Type: VIEW; Schema: hdb_views; Owner: postgres
--

CREATE VIEW hdb_views."user__insert__public__PerkCompany" AS
 SELECT "PerkCompany"."Perk",
    "PerkCompany"."CompanyId"
   FROM public."PerkCompany";


ALTER TABLE hdb_views."user__insert__public__PerkCompany" OWNER TO postgres;

--
-- Name: SkillCompany; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SkillCompany" (
    "Skill" text NOT NULL,
    "CompanyId" integer NOT NULL
);


ALTER TABLE public."SkillCompany" OWNER TO postgres;

--
-- Name: user__insert__public__SkillCompany; Type: VIEW; Schema: hdb_views; Owner: postgres
--

CREATE VIEW hdb_views."user__insert__public__SkillCompany" AS
 SELECT "SkillCompany"."Skill",
    "SkillCompany"."CompanyId"
   FROM public."SkillCompany";


ALTER TABLE hdb_views."user__insert__public__SkillCompany" OWNER TO postgres;

--
-- Name: SkillJob; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SkillJob" (
    "Skill" text NOT NULL,
    "JobId" integer NOT NULL
);


ALTER TABLE public."SkillJob" OWNER TO postgres;

--
-- Name: user__insert__public__SkillJob; Type: VIEW; Schema: hdb_views; Owner: postgres
--

CREATE VIEW hdb_views."user__insert__public__SkillJob" AS
 SELECT "SkillJob"."Skill",
    "SkillJob"."JobId"
   FROM public."SkillJob";


ALTER TABLE hdb_views."user__insert__public__SkillJob" OWNER TO postgres;

--
-- Name: SkillUser; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SkillUser" (
    "Skill" text NOT NULL,
    "UserId" integer NOT NULL
);


ALTER TABLE public."SkillUser" OWNER TO postgres;

--
-- Name: user__insert__public__SkillUser; Type: VIEW; Schema: hdb_views; Owner: postgres
--

CREATE VIEW hdb_views."user__insert__public__SkillUser" AS
 SELECT "SkillUser"."Skill",
    "SkillUser"."UserId"
   FROM public."SkillUser";


ALTER TABLE hdb_views."user__insert__public__SkillUser" OWNER TO postgres;

--
-- Name: Company_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Company_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Company_id_seq" OWNER TO postgres;

--
-- Name: Company_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Company_id_seq" OWNED BY public."Company".id;


--
-- Name: EmployementType; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."EmployementType" (
    type text NOT NULL
);


ALTER TABLE public."EmployementType" OWNER TO postgres;

--
-- Name: Industry; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Industry" (
    industry text NOT NULL
);


ALTER TABLE public."Industry" OWNER TO postgres;

--
-- Name: JobApplication_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."JobApplication_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."JobApplication_id_seq" OWNER TO postgres;

--
-- Name: JobApplication_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."JobApplication_id_seq" OWNED BY public."JobApplication".id;


--
-- Name: JobApplication_iid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."JobApplication_iid_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."JobApplication_iid_seq" OWNER TO postgres;

--
-- Name: JobApplication_iid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."JobApplication_iid_seq" OWNED BY public."JobApplication".iid;


--
-- Name: JobFunction; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."JobFunction" (
    title text NOT NULL
);


ALTER TABLE public."JobFunction" OWNER TO postgres;

--
-- Name: JobTitle; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."JobTitle" (
    title text NOT NULL
);


ALTER TABLE public."JobTitle" OWNER TO postgres;

--
-- Name: Job_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Job_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Job_id_seq" OWNER TO postgres;

--
-- Name: Job_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Job_id_seq" OWNED BY public."Job".id;


--
-- Name: Message_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Message_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Message_id_seq" OWNER TO postgres;

--
-- Name: Message_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Message_id_seq" OWNED BY public."Message".id;


--
-- Name: Perk; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Perk" (
    title text NOT NULL
);


ALTER TABLE public."Perk" OWNER TO postgres;

--
-- Name: SalaryBracket; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SalaryBracket" (
    bracket text NOT NULL
);


ALTER TABLE public."SalaryBracket" OWNER TO postgres;

--
-- Name: SeniorityLevel; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SeniorityLevel" (
    level text NOT NULL
);


ALTER TABLE public."SeniorityLevel" OWNER TO postgres;

--
-- Name: Skill; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Skill" (
    name text NOT NULL
);


ALTER TABLE public."Skill" OWNER TO postgres;

--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id integer NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now(),
    "updatedAt" timestamp with time zone,
    name text,
    "githubId" text,
    "linkedinId" text,
    email text,
    bio text,
    ip text,
    "githubAvatarUrl" text,
    "linkedinAvatarUrl" text,
    "githubUsername" text,
    "githubAccessToken" text,
    "linkedinAccessToken" text,
    "githubBlogUrl" text,
    "githubFollowers" integer,
    "firstName" text,
    "lastName" text,
    "headlineLinkedin" text,
    "industryLinkedin" text,
    "companyLinkedin" text,
    "linkedinUrl" text,
    "githubEmail" text,
    "linkedinEmail" text,
    "linkedinProfile" jsonb,
    "githubRepositories" jsonb,
    "pullRequests" jsonb,
    "manualBio" text,
    CONSTRAINT manualbiochk CHECK ((char_length("manualBio") <= 1024))
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: User_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."User_id_seq" OWNER TO postgres;

--
-- Name: User_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".id;


--
-- Name: group_by_location; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.group_by_location AS
 SELECT "Job".locality,
    "Job".country
   FROM public."Job"
  GROUP BY "Job".locality, "Job".country;


ALTER TABLE public.group_by_location OWNER TO postgres;

--
-- Name: remote_schemas id; Type: DEFAULT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.remote_schemas ALTER COLUMN id SET DEFAULT nextval('hdb_catalog.remote_schemas_id_seq'::regclass);


--
-- Name: user-candidate__insert__public__JobApplication createdAt; Type: DEFAULT; Schema: hdb_views; Owner: postgres
--

ALTER TABLE ONLY hdb_views."user-candidate__insert__public__JobApplication" ALTER COLUMN "createdAt" SET DEFAULT now();


--
-- Name: user-candidate__insert__public__JobApplication updatedAt; Type: DEFAULT; Schema: hdb_views; Owner: postgres
--

ALTER TABLE ONLY hdb_views."user-candidate__insert__public__JobApplication" ALTER COLUMN "updatedAt" SET DEFAULT now();


--
-- Name: user-candidate__insert__public__JobApplication id; Type: DEFAULT; Schema: hdb_views; Owner: postgres
--

ALTER TABLE ONLY hdb_views."user-candidate__insert__public__JobApplication" ALTER COLUMN id SET DEFAULT nextval('public."JobApplication_id_seq"'::regclass);


--
-- Name: user-candidate__insert__public__JobApplication iid; Type: DEFAULT; Schema: hdb_views; Owner: postgres
--

ALTER TABLE ONLY hdb_views."user-candidate__insert__public__JobApplication" ALTER COLUMN iid SET DEFAULT nextval('public."JobApplication_iid_seq"'::regclass);


--
-- Name: user-hr__insert__public__Moderator canAddJobs; Type: DEFAULT; Schema: hdb_views; Owner: postgres
--

ALTER TABLE ONLY hdb_views."user-hr__insert__public__Moderator" ALTER COLUMN "canAddJobs" SET DEFAULT true;


--
-- Name: user-hr__insert__public__Moderator canModifyJobs; Type: DEFAULT; Schema: hdb_views; Owner: postgres
--

ALTER TABLE ONLY hdb_views."user-hr__insert__public__Moderator" ALTER COLUMN "canModifyJobs" SET DEFAULT true;


--
-- Name: user-hr__insert__public__Moderator canEditCompany; Type: DEFAULT; Schema: hdb_views; Owner: postgres
--

ALTER TABLE ONLY hdb_views."user-hr__insert__public__Moderator" ALTER COLUMN "canEditCompany" SET DEFAULT true;


--
-- Name: user-hr__insert__public__Moderator canAddModerator; Type: DEFAULT; Schema: hdb_views; Owner: postgres
--

ALTER TABLE ONLY hdb_views."user-hr__insert__public__Moderator" ALTER COLUMN "canAddModerator" SET DEFAULT true;


--
-- Name: user__insert__public__Company id; Type: DEFAULT; Schema: hdb_views; Owner: postgres
--

ALTER TABLE ONLY hdb_views."user__insert__public__Company" ALTER COLUMN id SET DEFAULT nextval('public."Company_id_seq"'::regclass);


--
-- Name: user__insert__public__Company createdAt; Type: DEFAULT; Schema: hdb_views; Owner: postgres
--

ALTER TABLE ONLY hdb_views."user__insert__public__Company" ALTER COLUMN "createdAt" SET DEFAULT now();


--
-- Name: user__insert__public__Company employeeCount; Type: DEFAULT; Schema: hdb_views; Owner: postgres
--

ALTER TABLE ONLY hdb_views."user__insert__public__Company" ALTER COLUMN "employeeCount" SET DEFAULT 5;


--
-- Name: user__insert__public__Company devCount; Type: DEFAULT; Schema: hdb_views; Owner: postgres
--

ALTER TABLE ONLY hdb_views."user__insert__public__Company" ALTER COLUMN "devCount" SET DEFAULT 5;


--
-- Name: user__insert__public__Job id; Type: DEFAULT; Schema: hdb_views; Owner: postgres
--

ALTER TABLE ONLY hdb_views."user__insert__public__Job" ALTER COLUMN id SET DEFAULT nextval('public."Job_id_seq"'::regclass);


--
-- Name: user__insert__public__Job minimumExperienceYears; Type: DEFAULT; Schema: hdb_views; Owner: postgres
--

ALTER TABLE ONLY hdb_views."user__insert__public__Job" ALTER COLUMN "minimumExperienceYears" SET DEFAULT 0;


--
-- Name: user__insert__public__Job maximumExperienceYears; Type: DEFAULT; Schema: hdb_views; Owner: postgres
--

ALTER TABLE ONLY hdb_views."user__insert__public__Job" ALTER COLUMN "maximumExperienceYears" SET DEFAULT 5;


--
-- Name: user__insert__public__Job isPublished; Type: DEFAULT; Schema: hdb_views; Owner: postgres
--

ALTER TABLE ONLY hdb_views."user__insert__public__Job" ALTER COLUMN "isPublished" SET DEFAULT false;


--
-- Name: user__insert__public__Job hasMonthlySalary; Type: DEFAULT; Schema: hdb_views; Owner: postgres
--

ALTER TABLE ONLY hdb_views."user__insert__public__Job" ALTER COLUMN "hasMonthlySalary" SET DEFAULT false;


--
-- Name: user__insert__public__Message id; Type: DEFAULT; Schema: hdb_views; Owner: postgres
--

ALTER TABLE ONLY hdb_views."user__insert__public__Message" ALTER COLUMN id SET DEFAULT nextval('public."Message_id_seq"'::regclass);


--
-- Name: user__insert__public__Message createdAt; Type: DEFAULT; Schema: hdb_views; Owner: postgres
--

ALTER TABLE ONLY hdb_views."user__insert__public__Message" ALTER COLUMN "createdAt" SET DEFAULT now();


--
-- Name: user__insert__public__Message updatedAt; Type: DEFAULT; Schema: hdb_views; Owner: postgres
--

ALTER TABLE ONLY hdb_views."user__insert__public__Message" ALTER COLUMN "updatedAt" SET DEFAULT now();


--
-- Name: user__insert__public__Moderator canAddJobs; Type: DEFAULT; Schema: hdb_views; Owner: postgres
--

ALTER TABLE ONLY hdb_views."user__insert__public__Moderator" ALTER COLUMN "canAddJobs" SET DEFAULT true;


--
-- Name: user__insert__public__Moderator canModifyJobs; Type: DEFAULT; Schema: hdb_views; Owner: postgres
--

ALTER TABLE ONLY hdb_views."user__insert__public__Moderator" ALTER COLUMN "canModifyJobs" SET DEFAULT true;


--
-- Name: user__insert__public__Moderator canEditCompany; Type: DEFAULT; Schema: hdb_views; Owner: postgres
--

ALTER TABLE ONLY hdb_views."user__insert__public__Moderator" ALTER COLUMN "canEditCompany" SET DEFAULT true;


--
-- Name: user__insert__public__Moderator canAddModerator; Type: DEFAULT; Schema: hdb_views; Owner: postgres
--

ALTER TABLE ONLY hdb_views."user__insert__public__Moderator" ALTER COLUMN "canAddModerator" SET DEFAULT true;


--
-- Name: Company id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Company" ALTER COLUMN id SET DEFAULT nextval('public."Company_id_seq"'::regclass);


--
-- Name: Job id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Job" ALTER COLUMN id SET DEFAULT nextval('public."Job_id_seq"'::regclass);


--
-- Name: JobApplication id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."JobApplication" ALTER COLUMN id SET DEFAULT nextval('public."JobApplication_id_seq"'::regclass);


--
-- Name: JobApplication iid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."JobApplication" ALTER COLUMN iid SET DEFAULT nextval('public."JobApplication_iid_seq"'::regclass);


--
-- Name: Message id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Message" ALTER COLUMN id SET DEFAULT nextval('public."Message_id_seq"'::regclass);


--
-- Name: User id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);


--
-- Name: event_invocation_logs event_invocation_logs_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.event_invocation_logs
    ADD CONSTRAINT event_invocation_logs_pkey PRIMARY KEY (id);


--
-- Name: event_log event_log_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.event_log
    ADD CONSTRAINT event_log_pkey PRIMARY KEY (id);


--
-- Name: event_triggers event_triggers_name_key; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.event_triggers
    ADD CONSTRAINT event_triggers_name_key UNIQUE (name);


--
-- Name: event_triggers event_triggers_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.event_triggers
    ADD CONSTRAINT event_triggers_pkey PRIMARY KEY (id);


--
-- Name: hdb_permission hdb_permission_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_permission
    ADD CONSTRAINT hdb_permission_pkey PRIMARY KEY (table_schema, table_name, role_name, perm_type);


--
-- Name: hdb_query_template hdb_query_template_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_query_template
    ADD CONSTRAINT hdb_query_template_pkey PRIMARY KEY (template_name);


--
-- Name: hdb_relationship hdb_relationship_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_relationship
    ADD CONSTRAINT hdb_relationship_pkey PRIMARY KEY (table_schema, table_name, rel_name);


--
-- Name: hdb_table hdb_table_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_table
    ADD CONSTRAINT hdb_table_pkey PRIMARY KEY (table_schema, table_name);


--
-- Name: remote_schemas remote_schemas_name_key; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.remote_schemas
    ADD CONSTRAINT remote_schemas_name_key UNIQUE (name);


--
-- Name: remote_schemas remote_schemas_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.remote_schemas
    ADD CONSTRAINT remote_schemas_pkey PRIMARY KEY (id);


--
-- Name: Company Company_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Company"
    ADD CONSTRAINT "Company_pkey" PRIMARY KEY (id);


--
-- Name: EmployementType EmployementType_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EmployementType"
    ADD CONSTRAINT "EmployementType_pkey" PRIMARY KEY (type);


--
-- Name: Industry Industry_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Industry"
    ADD CONSTRAINT "Industry_pkey" PRIMARY KEY (industry);


--
-- Name: JobApplication JobApplication_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."JobApplication"
    ADD CONSTRAINT "JobApplication_id_key" UNIQUE (id);


--
-- Name: JobApplication JobApplication_iid_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."JobApplication"
    ADD CONSTRAINT "JobApplication_iid_key" UNIQUE (iid);


--
-- Name: JobApplication JobApplication_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."JobApplication"
    ADD CONSTRAINT "JobApplication_pkey" PRIMARY KEY ("applicantId", "jobId");


--
-- Name: JobFunctionJob JobFunctionJob_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."JobFunctionJob"
    ADD CONSTRAINT "JobFunctionJob_pkey" PRIMARY KEY ("JobFunction", "JobId");


--
-- Name: JobFunction JobFunction_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."JobFunction"
    ADD CONSTRAINT "JobFunction_pkey" PRIMARY KEY (title);


--
-- Name: JobIndustry JobIndustry_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."JobIndustry"
    ADD CONSTRAINT "JobIndustry_pkey" PRIMARY KEY ("IndustryName", "JobId");


--
-- Name: JobTitle JobTitle_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."JobTitle"
    ADD CONSTRAINT "JobTitle_pkey" PRIMARY KEY (title);


--
-- Name: Job Job_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Job"
    ADD CONSTRAINT "Job_pkey" PRIMARY KEY (id);


--
-- Name: Message Message_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_pkey" PRIMARY KEY (id);


--
-- Name: Moderator Moderator_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Moderator"
    ADD CONSTRAINT "Moderator_pkey" PRIMARY KEY ("userEmail", "companyId");


--
-- Name: PerkCompany PerkCompany_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PerkCompany"
    ADD CONSTRAINT "PerkCompany_pkey" PRIMARY KEY ("Perk", "CompanyId");


--
-- Name: Perk Perk_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Perk"
    ADD CONSTRAINT "Perk_pkey" PRIMARY KEY (title);


--
-- Name: SalaryBracket SalaryBracket_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SalaryBracket"
    ADD CONSTRAINT "SalaryBracket_pkey" PRIMARY KEY (bracket);


--
-- Name: SeniorityLevel SeniorityLevel_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SeniorityLevel"
    ADD CONSTRAINT "SeniorityLevel_pkey" PRIMARY KEY (level);


--
-- Name: SkillCompany SkillCompany_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SkillCompany"
    ADD CONSTRAINT "SkillCompany_pkey" PRIMARY KEY ("Skill", "CompanyId");


--
-- Name: SkillJob SkillJob_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SkillJob"
    ADD CONSTRAINT "SkillJob_pkey" PRIMARY KEY ("Skill", "JobId");


--
-- Name: SkillUser SkillUser_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SkillUser"
    ADD CONSTRAINT "SkillUser_pkey" PRIMARY KEY ("Skill", "UserId");


--
-- Name: Skill Skill_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Skill"
    ADD CONSTRAINT "Skill_pkey" PRIMARY KEY (name);


--
-- Name: User User_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key" UNIQUE (email);


--
-- Name: User User_githubAccessToken_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_githubAccessToken_key" UNIQUE ("githubAccessToken");


--
-- Name: User User_githubAvatarUrl_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_githubAvatarUrl_key" UNIQUE ("githubAvatarUrl");


--
-- Name: User User_githubEmail_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_githubEmail_key" UNIQUE ("githubEmail");


--
-- Name: User User_githubId_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_githubId_key" UNIQUE ("githubId");


--
-- Name: User User_githubUsername_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_githubUsername_key" UNIQUE ("githubUsername");


--
-- Name: User User_linkedinAccessToken_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_linkedinAccessToken_key" UNIQUE ("linkedinAccessToken");


--
-- Name: User User_linkedinAvatarUrl_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_linkedinAvatarUrl_key" UNIQUE ("linkedinAvatarUrl");


--
-- Name: User User_linkedinEmail_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_linkedinEmail_key" UNIQUE ("linkedinEmail");


--
-- Name: User User_linkedinId_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_linkedinId_key" UNIQUE ("linkedinId");


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: event_invocation_logs_event_id_idx; Type: INDEX; Schema: hdb_catalog; Owner: postgres
--

CREATE INDEX event_invocation_logs_event_id_idx ON hdb_catalog.event_invocation_logs USING btree (event_id);


--
-- Name: event_log_trigger_id_idx; Type: INDEX; Schema: hdb_catalog; Owner: postgres
--

CREATE INDEX event_log_trigger_id_idx ON hdb_catalog.event_log USING btree (trigger_id);


--
-- Name: hdb_version_one_row; Type: INDEX; Schema: hdb_catalog; Owner: postgres
--

CREATE UNIQUE INDEX hdb_version_one_row ON hdb_catalog.hdb_version USING btree (((version IS NOT NULL)));


--
-- Name: hdb_table hdb_table_oid_check; Type: TRIGGER; Schema: hdb_catalog; Owner: postgres
--

CREATE TRIGGER hdb_table_oid_check BEFORE INSERT OR UPDATE ON hdb_catalog.hdb_table FOR EACH ROW EXECUTE PROCEDURE hdb_catalog.hdb_table_oid_check();


--
-- Name: user-candidate__insert__public__JobApplication user-candidate__insert__public__JobApplication; Type: TRIGGER; Schema: hdb_views; Owner: postgres
--

CREATE TRIGGER "user-candidate__insert__public__JobApplication" INSTEAD OF INSERT ON hdb_views."user-candidate__insert__public__JobApplication" FOR EACH ROW EXECUTE PROCEDURE hdb_views."user-candidate__insert__public__JobApplication"();


--
-- Name: user-hr__insert__public__Moderator user-hr__insert__public__Moderator; Type: TRIGGER; Schema: hdb_views; Owner: postgres
--

CREATE TRIGGER "user-hr__insert__public__Moderator" INSTEAD OF INSERT ON hdb_views."user-hr__insert__public__Moderator" FOR EACH ROW EXECUTE PROCEDURE hdb_views."user-hr__insert__public__Moderator"();


--
-- Name: user__insert__public__Company user__insert__public__Company; Type: TRIGGER; Schema: hdb_views; Owner: postgres
--

CREATE TRIGGER "user__insert__public__Company" INSTEAD OF INSERT ON hdb_views."user__insert__public__Company" FOR EACH ROW EXECUTE PROCEDURE hdb_views."user__insert__public__Company"();


--
-- Name: user__insert__public__Job user__insert__public__Job; Type: TRIGGER; Schema: hdb_views; Owner: postgres
--

CREATE TRIGGER "user__insert__public__Job" INSTEAD OF INSERT ON hdb_views."user__insert__public__Job" FOR EACH ROW EXECUTE PROCEDURE hdb_views."user__insert__public__Job"();


--
-- Name: user__insert__public__JobFunctionJob user__insert__public__JobFunctionJob; Type: TRIGGER; Schema: hdb_views; Owner: postgres
--

CREATE TRIGGER "user__insert__public__JobFunctionJob" INSTEAD OF INSERT ON hdb_views."user__insert__public__JobFunctionJob" FOR EACH ROW EXECUTE PROCEDURE hdb_views."user__insert__public__JobFunctionJob"();


--
-- Name: user__insert__public__JobIndustry user__insert__public__JobIndustry; Type: TRIGGER; Schema: hdb_views; Owner: postgres
--

CREATE TRIGGER "user__insert__public__JobIndustry" INSTEAD OF INSERT ON hdb_views."user__insert__public__JobIndustry" FOR EACH ROW EXECUTE PROCEDURE hdb_views."user__insert__public__JobIndustry"();


--
-- Name: user__insert__public__Message user__insert__public__Message; Type: TRIGGER; Schema: hdb_views; Owner: postgres
--

CREATE TRIGGER "user__insert__public__Message" INSTEAD OF INSERT ON hdb_views."user__insert__public__Message" FOR EACH ROW EXECUTE PROCEDURE hdb_views."user__insert__public__Message"();


--
-- Name: user__insert__public__Moderator user__insert__public__Moderator; Type: TRIGGER; Schema: hdb_views; Owner: postgres
--

CREATE TRIGGER "user__insert__public__Moderator" INSTEAD OF INSERT ON hdb_views."user__insert__public__Moderator" FOR EACH ROW EXECUTE PROCEDURE hdb_views."user__insert__public__Moderator"();


--
-- Name: user__insert__public__PerkCompany user__insert__public__PerkCompany; Type: TRIGGER; Schema: hdb_views; Owner: postgres
--

CREATE TRIGGER "user__insert__public__PerkCompany" INSTEAD OF INSERT ON hdb_views."user__insert__public__PerkCompany" FOR EACH ROW EXECUTE PROCEDURE hdb_views."user__insert__public__PerkCompany"();


--
-- Name: user__insert__public__SkillCompany user__insert__public__SkillCompany; Type: TRIGGER; Schema: hdb_views; Owner: postgres
--

CREATE TRIGGER "user__insert__public__SkillCompany" INSTEAD OF INSERT ON hdb_views."user__insert__public__SkillCompany" FOR EACH ROW EXECUTE PROCEDURE hdb_views."user__insert__public__SkillCompany"();


--
-- Name: user__insert__public__SkillJob user__insert__public__SkillJob; Type: TRIGGER; Schema: hdb_views; Owner: postgres
--

CREATE TRIGGER "user__insert__public__SkillJob" INSTEAD OF INSERT ON hdb_views."user__insert__public__SkillJob" FOR EACH ROW EXECUTE PROCEDURE hdb_views."user__insert__public__SkillJob"();


--
-- Name: user__insert__public__SkillUser user__insert__public__SkillUser; Type: TRIGGER; Schema: hdb_views; Owner: postgres
--

CREATE TRIGGER "user__insert__public__SkillUser" INSTEAD OF INSERT ON hdb_views."user__insert__public__SkillUser" FOR EACH ROW EXECUTE PROCEDURE hdb_views."user__insert__public__SkillUser"();


--
-- Name: JobApplication keepjobappid; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER keepjobappid BEFORE UPDATE ON public."JobApplication" FOR EACH ROW EXECUTE PROCEDURE public.keepjobappid();


--
-- Name: JobApplication notify_hasura_on_job_application_create_INSERT; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER "notify_hasura_on_job_application_create_INSERT" AFTER INSERT ON public."JobApplication" FOR EACH ROW EXECUTE PROCEDURE hdb_views."notify_hasura_on_job_application_create_INSERT"();


--
-- Name: Job notify_hasura_on_job_update_INSERT; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER "notify_hasura_on_job_update_INSERT" AFTER INSERT ON public."Job" FOR EACH ROW EXECUTE PROCEDURE hdb_views."notify_hasura_on_job_update_INSERT"();


--
-- Name: Message notify_hasura_on_message_create_INSERT; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER "notify_hasura_on_message_create_INSERT" AFTER INSERT ON public."Message" FOR EACH ROW EXECUTE PROCEDURE hdb_views."notify_hasura_on_message_create_INSERT"();


--
-- Name: Message notify_hasura_on_message_insert_UPDATE; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER "notify_hasura_on_message_insert_UPDATE" AFTER UPDATE ON public."Message" FOR EACH ROW EXECUTE PROCEDURE hdb_views."notify_hasura_on_message_insert_UPDATE"();


--
-- Name: Message notify_hasura_on_update_message_UPDATE; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER "notify_hasura_on_update_message_UPDATE" AFTER UPDATE ON public."Message" FOR EACH ROW EXECUTE PROCEDURE hdb_views."notify_hasura_on_update_message_UPDATE"();


--
-- Name: event_invocation_logs event_invocation_logs_event_id_fkey; Type: FK CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.event_invocation_logs
    ADD CONSTRAINT event_invocation_logs_event_id_fkey FOREIGN KEY (event_id) REFERENCES hdb_catalog.event_log(id);


--
-- Name: hdb_permission hdb_permission_table_schema_fkey; Type: FK CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_permission
    ADD CONSTRAINT hdb_permission_table_schema_fkey FOREIGN KEY (table_schema, table_name) REFERENCES hdb_catalog.hdb_table(table_schema, table_name);


--
-- Name: hdb_relationship hdb_relationship_table_schema_fkey; Type: FK CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_relationship
    ADD CONSTRAINT hdb_relationship_table_schema_fkey FOREIGN KEY (table_schema, table_name) REFERENCES hdb_catalog.hdb_table(table_schema, table_name);


--
-- Name: Company Company_Industry_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Company"
    ADD CONSTRAINT "Company_Industry_fkey" FOREIGN KEY ("Industry") REFERENCES public."Industry"(industry);


--
-- Name: Company Company_ownerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Company"
    ADD CONSTRAINT "Company_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES public."User"(id);


--
-- Name: JobApplication JobApplication_applicantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."JobApplication"
    ADD CONSTRAINT "JobApplication_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES public."User"(id);


--
-- Name: JobApplication JobApplication_jobId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."JobApplication"
    ADD CONSTRAINT "JobApplication_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES public."Job"(id);


--
-- Name: JobFunctionJob JobFunctionJob_JobFunction_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."JobFunctionJob"
    ADD CONSTRAINT "JobFunctionJob_JobFunction_fkey" FOREIGN KEY ("JobFunction") REFERENCES public."JobFunction"(title);


--
-- Name: JobFunctionJob JobFunctionJob_JobId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."JobFunctionJob"
    ADD CONSTRAINT "JobFunctionJob_JobId_fkey" FOREIGN KEY ("JobId") REFERENCES public."Job"(id);


--
-- Name: JobIndustry JobIndustry_IndustryName_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."JobIndustry"
    ADD CONSTRAINT "JobIndustry_IndustryName_fkey" FOREIGN KEY ("IndustryName") REFERENCES public."Industry"(industry);


--
-- Name: JobIndustry JobIndustry_JobId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."JobIndustry"
    ADD CONSTRAINT "JobIndustry_JobId_fkey" FOREIGN KEY ("JobId") REFERENCES public."Job"(id);


--
-- Name: Job Job_EmployementType_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Job"
    ADD CONSTRAINT "Job_EmployementType_fkey" FOREIGN KEY ("EmployementType") REFERENCES public."EmployementType"(type);


--
-- Name: Job Job_Industry_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Job"
    ADD CONSTRAINT "Job_Industry_fkey" FOREIGN KEY ("Industry") REFERENCES public."Industry"(industry);


--
-- Name: Job Job_JobTitle_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Job"
    ADD CONSTRAINT "Job_JobTitle_fkey" FOREIGN KEY ("JobTitle") REFERENCES public."JobTitle"(title);


--
-- Name: Job Job_SalaryBracket_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Job"
    ADD CONSTRAINT "Job_SalaryBracket_fkey" FOREIGN KEY ("SalaryBracket") REFERENCES public."SalaryBracket"(bracket);


--
-- Name: Job Job_SeniorityLevel_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Job"
    ADD CONSTRAINT "Job_SeniorityLevel_fkey" FOREIGN KEY ("SeniorityLevel") REFERENCES public."SeniorityLevel"(level);


--
-- Name: Job Job_companyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Job"
    ADD CONSTRAINT "Job_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public."Company"(id);


--
-- Name: Job Job_ownerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Job"
    ADD CONSTRAINT "Job_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES public."User"(id);


--
-- Name: Message Message_applicationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES public."JobApplication"(id);


--
-- Name: Message Message_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id);


--
-- Name: Moderator Moderator_companyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Moderator"
    ADD CONSTRAINT "Moderator_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public."Company"(id);


--
-- Name: Moderator Moderator_userEmail_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Moderator"
    ADD CONSTRAINT "Moderator_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES public."User"("linkedinEmail");


--
-- Name: PerkCompany PerkCompany_CompanyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PerkCompany"
    ADD CONSTRAINT "PerkCompany_CompanyId_fkey" FOREIGN KEY ("CompanyId") REFERENCES public."Company"(id);


--
-- Name: PerkCompany PerkCompany_Perk_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PerkCompany"
    ADD CONSTRAINT "PerkCompany_Perk_fkey" FOREIGN KEY ("Perk") REFERENCES public."Perk"(title);


--
-- Name: SkillCompany SkillCompany_CompanyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SkillCompany"
    ADD CONSTRAINT "SkillCompany_CompanyId_fkey" FOREIGN KEY ("CompanyId") REFERENCES public."Company"(id);


--
-- Name: SkillCompany SkillCompany_Skill_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SkillCompany"
    ADD CONSTRAINT "SkillCompany_Skill_fkey" FOREIGN KEY ("Skill") REFERENCES public."Skill"(name);


--
-- Name: SkillJob SkillJob_JobId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SkillJob"
    ADD CONSTRAINT "SkillJob_JobId_fkey" FOREIGN KEY ("JobId") REFERENCES public."Job"(id);


--
-- Name: SkillJob SkillJob_Skill_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SkillJob"
    ADD CONSTRAINT "SkillJob_Skill_fkey" FOREIGN KEY ("Skill") REFERENCES public."Skill"(name);


--
-- Name: SkillUser SkillUser_Skill_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SkillUser"
    ADD CONSTRAINT "SkillUser_Skill_fkey" FOREIGN KEY ("Skill") REFERENCES public."Skill"(name);


--
-- Name: SkillUser SkillUser_UserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SkillUser"
    ADD CONSTRAINT "SkillUser_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES public."User"(id);


--
-- PostgreSQL database dump complete
--

