CREATE TABLE "core_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp NOT NULL,
	"device_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "core_sessions_known_devices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ip_address" varchar(40) NOT NULL,
	"user_agent" text NOT NULL,
	"uagent_browser" varchar(200) NOT NULL,
	"uagent_version" varchar(100) NOT NULL,
	"uagent_os" varchar(100) NOT NULL,
	"last_seen" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "core_sessions" ADD CONSTRAINT "core_sessions_user_id_core_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."core_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "core_sessions" ADD CONSTRAINT "core_sessions_device_id_core_sessions_known_devices_id_fk" FOREIGN KEY ("device_id") REFERENCES "public"."core_sessions_known_devices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "core_sessions_user_id_idx" ON "core_sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "core_sessions_known_devices_ip_address_idx" ON "core_sessions_known_devices" USING btree ("ip_address");