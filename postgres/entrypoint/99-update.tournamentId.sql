ALTER TABLE IF EXISTS play."tournaments" DROP COLUMN IF EXISTS id CASCADE;

ALTER TABLE IF EXISTS play.tournaments
    ADD COLUMN id uuid NOT NULL DEFAULT public.uuid_generate_v4();
ALTER TABLE IF EXISTS play.tournaments
    ADD PRIMARY KEY (id);

ALTER TABLE IF EXISTS play."tournamentsPlayers" DROP COLUMN IF EXISTS "tournamentId" CASCADE;
ALTER TABLE IF EXISTS play."tournamentsPlayers"
    ADD COLUMN "tournamentId" uuid NOT NULL DEFAULT public.uuid_generate_v4();
ALTER TABLE IF EXISTS play."tournamentsPlayers"
    ADD CONSTRAINT "tournamentsPlayers_tournamentd_fkey" FOREIGN KEY ("tournamentId")
    REFERENCES play.tournaments (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE
    DEFERRABLE
    NOT VALID;
ALTER TABLE IF EXISTS play."tournamentsPlayers"
    ADD CONSTRAINT "tournamentsPlayers_uniq" UNIQUE ("tournamentId", "playerId")
    DEFERRABLE;


ALTER TABLE IF EXISTS play."tournamentsPrizes" DROP COLUMN IF EXISTS "tournamentId" CASCADE;
ALTER TABLE IF EXISTS play."tournamentsPrizes"
    ADD COLUMN "tournamentId" uuid NOT NULL DEFAULT public.uuid_generate_v4();
ALTER TABLE IF EXISTS play."tournamentsPrizes"
    ADD CONSTRAINT "tournamentsPrizes_tournamentd_fkey" FOREIGN KEY ("tournamentId")
    REFERENCES play.tournaments (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE
    DEFERRABLE
    NOT VALID;

ALTER TABLE IF EXISTS play."tournamentsRounds" DROP COLUMN IF EXISTS "tournamentId" CASCADE;
ALTER TABLE IF EXISTS play."tournamentsRounds"
    ADD COLUMN "tournamentId" uuid NOT NULL DEFAULT public.uuid_generate_v4();
ALTER TABLE IF EXISTS play."tournamentsRounds"
    ADD CONSTRAINT "tournamentsRounds_tournamentd_fkey" FOREIGN KEY ("tournamentId")
    REFERENCES play.tournaments (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE
    DEFERRABLE
    NOT VALID;
ALTER TABLE IF EXISTS play."tournamentsRounds"
    ADD CONSTRAINT "tournamentsRounds_uniq" UNIQUE ("tournamentId")
    DEFERRABLE;

ALTER TABLE IF EXISTS play."tournamentsRules" DROP COLUMN IF EXISTS "tournamentId" CASCADE;
ALTER TABLE IF EXISTS play."tournamentsRules"
    ADD COLUMN "tournamentId" uuid NOT NULL DEFAULT public.uuid_generate_v4();
ALTER TABLE IF EXISTS play."tournamentsRules"
    ADD CONSTRAINT "tournamentsRules_tournamentd_fkey" FOREIGN KEY ("tournamentId")
    REFERENCES play.tournaments (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE
    DEFERRABLE
    NOT VALID;

ALTER TABLE IF EXISTS play."tournamentsTeams" DROP COLUMN IF EXISTS "tournamentId" CASCADE;
ALTER TABLE IF EXISTS play."tournamentsTeams"
    ADD COLUMN "tournamentId" uuid NOT NULL DEFAULT public.uuid_generate_v4();
ALTER TABLE IF EXISTS play."tournamentsTeams"
    ADD CONSTRAINT "tournamentsTeams_tournamentd_fkey" FOREIGN KEY ("tournamentId")
    REFERENCES play.tournaments (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE
    DEFERRABLE
    NOT VALID;
ALTER TABLE IF EXISTS play."tournamentsTeams"
    ADD CONSTRAINT "tournamentTeams_uniq" UNIQUE ("tournamentId", "teamId")
    DEFERRABLE;
ALTER TABLE IF EXISTS play."tournamentsTeams"
    ADD CONSTRAINT "tournamentsTeams_tookPlace_uniq" UNIQUE ("tournamentId", "tookPlace")
    DEFERRABLE;
    
ALTER TABLE IF EXISTS play."tournamentsTeamsPlayers" DROP COLUMN IF EXISTS "tournamentId" CASCADE;
ALTER TABLE IF EXISTS play."tournamentsTeamsPlayers"
    ADD COLUMN "tournamentId" uuid NOT NULL DEFAULT public.uuid_generate_v4();
ALTER TABLE IF EXISTS play."tournamentsTeamsPlayers"
    ADD CONSTRAINT "tournamentsTeamsPlayers_tournamentd_fkey" FOREIGN KEY ("tournamentId")
    REFERENCES play.tournaments (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE
    DEFERRABLE
    NOT VALID;
ALTER TABLE IF EXISTS play."tournamentsTeamsPlayers"
    ADD CONSTRAINT "tournamentTeamsPlayers_uniq" UNIQUE ("tournamentTeamId", "playerId")
    DEFERRABLE;
ALTER TABLE IF EXISTS play."tournamentsPlayers"
    ADD CONSTRAINT "tournamentsPlayers_tookPlace_uniq" UNIQUE ("tournamentId", "tookPlace")
    DEFERRABLE;

ALTER TABLE IF EXISTS play."tournamentsMatches" DROP COLUMN IF EXISTS "tournamentId" CASCADE;
ALTER TABLE IF EXISTS play."tournamentsMatches"
    ADD COLUMN "tournamentId" uuid NOT NULL DEFAULT public.uuid_generate_v4();
ALTER TABLE IF EXISTS play."tournamentsMatches"
    ADD CONSTRAINT "tournamentsMatches_tournamentd_fkey" FOREIGN KEY ("tournamentId")
    REFERENCES play.tournaments (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE
    DEFERRABLE
    NOT VALID;

ALTER TABLE IF EXISTS play."tournamentsMatchesMaps" DROP COLUMN IF EXISTS "tournamentId" CASCADE;
ALTER TABLE IF EXISTS play."tournamentsMatchesMaps"
    ADD COLUMN "tournamentId" uuid NOT NULL DEFAULT public.uuid_generate_v4();
ALTER TABLE IF EXISTS play."tournamentsMatchesMaps"
    ADD CONSTRAINT "tournamentsMatchesMaps_tournamentd_fkey" FOREIGN KEY ("tournamentId")
    REFERENCES play.tournaments (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE
    DEFERRABLE
    NOT VALID;

ALTER TABLE IF EXISTS play."tournamentsPartners" DROP COLUMN IF EXISTS "tournamentId" CASCADE;
ALTER TABLE IF EXISTS play."tournamentsPartners"
    ADD COLUMN "tournamentId" uuid NOT NULL DEFAULT public.uuid_generate_v4();
ALTER TABLE IF EXISTS play."tournamentsPartners"
    ADD CONSTRAINT "tournamentsPartners_tournamentd_fkey" FOREIGN KEY ("tournamentId")
    REFERENCES play.tournaments (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE
    DEFERRABLE
    NOT VALID;


ALTER TABLE IF EXISTS play."notificationsTournaments" DROP COLUMN IF EXISTS "tournamentId" CASCADE;
ALTER TABLE IF EXISTS play."notificationsTournaments"
    ADD COLUMN "tournamentId" uuid NOT NULL DEFAULT public.uuid_generate_v4();
ALTER TABLE IF EXISTS play."notificationsTournaments"
    ADD CONSTRAINT "notificationsTournaments_tournamentd_fkey" FOREIGN KEY ("tournamentId")
    REFERENCES play.tournaments (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE
    DEFERRABLE
    NOT VALID;