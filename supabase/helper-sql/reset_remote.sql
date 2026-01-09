-- WARNING: This script will delete all data in the public schema and reset the migration log.
-- RUN THIS IN THE SUPABASE SQL EDITOR (https://supabase.com/dashboard/project/dvdlbgfspauwfnbeyjvj/sql/new)

-- 1. Drop the public schema and recreate it
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

-- 2. Grant permissions back to default Supabase roles
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO anon;
GRANT ALL ON SCHEMA public TO authenticated;
GRANT ALL ON SCHEMA public TO service_role;

-- 3. Reset the migration history log
TRUNCATE supabase_migrations.schema_migrations;

-- 4. Re-establish default search path
ALTER ROLE postgres SET search_path TO public, supabase_migrations;
ALTER ROLE authenticated SET search_path TO public, supabase_migrations;
ALTER ROLE anon SET search_path TO public, supabase_migrations;
ALTER ROLE service_role SET search_path TO public, supabase_migrations;
