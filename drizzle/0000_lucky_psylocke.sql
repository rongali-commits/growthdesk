CREATE TABLE `automations` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`trigger` text NOT NULL,
	`description` text NOT NULL,
	`runs` integer DEFAULT 0 NOT NULL,
	`conversion` integer DEFAULT 0 NOT NULL,
	`active` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE `conversations` (
	`id` text PRIMARY KEY NOT NULL,
	`lead_id` text NOT NULL,
	`name` text NOT NULL,
	`subject` text NOT NULL,
	`preview` text NOT NULL,
	`channel` text NOT NULL,
	`intent` text NOT NULL,
	`unread` integer DEFAULT false NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `leads` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text DEFAULT '' NOT NULL,
	`service` text NOT NULL,
	`source` text DEFAULT 'Website assistant' NOT NULL,
	`status` text DEFAULT 'new' NOT NULL,
	`value` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` text PRIMARY KEY NOT NULL,
	`token` text NOT NULL,
	`client` text NOT NULL,
	`project` text NOT NULL,
	`progress` integer NOT NULL,
	`status` text NOT NULL,
	`next_action` text NOT NULL,
	`invoice_status` text NOT NULL,
	`value` integer NOT NULL,
	`deliverables` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `projects_token_unique` ON `projects` (`token`);--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` text PRIMARY KEY NOT NULL,
	`customer` text NOT NULL,
	`service` text NOT NULL,
	`rating` integer NOT NULL,
	`quote` text NOT NULL,
	`status` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL
);
