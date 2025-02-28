CREATE TYPE "public"."game_status" AS ENUM('queued', 'in-progress', 'paused', 'complete');--> statement-breakpoint
ALTER TABLE "profile" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "game" DROP CONSTRAINT "public_game_player_1_fkey";
--> statement-breakpoint
ALTER TABLE "game" DROP CONSTRAINT "public_game_player_2_fkey";
--> statement-breakpoint
ALTER TABLE "leaderboard" DROP CONSTRAINT "public_leaderboard_player_id_fkey";
--> statement-breakpoint
ALTER TABLE "moves" DROP CONSTRAINT "public_moves_player_id_fkey";
--> statement-breakpoint
ALTER TABLE "game" ADD COLUMN "game_status" "game_status" NOT NULL;--> statement-breakpoint
ALTER TABLE "game" ADD COLUMN "player_1_symbol" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "game" ADD COLUMN "player_2_symbol" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "game" ADD CONSTRAINT "game_player_1_profile_id_fk" FOREIGN KEY ("player_1") REFERENCES "public"."profile"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game" ADD CONSTRAINT "game_player_2_profile_id_fk" FOREIGN KEY ("player_2") REFERENCES "public"."profile"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leaderboard" ADD CONSTRAINT "leaderboard_player_id_profile_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."profile"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "moves" ADD CONSTRAINT "moves_player_id_profile_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."profile"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint