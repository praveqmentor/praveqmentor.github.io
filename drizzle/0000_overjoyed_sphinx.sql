CREATE TABLE `journal_posts` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`excerpt` text NOT NULL,
	`category` text NOT NULL,
	`visual` text NOT NULL,
	`date` text NOT NULL,
	`body` text NOT NULL,
	`author` text NOT NULL,
	`kicker` text NOT NULL,
	`status` text NOT NULL,
	`revision` integer DEFAULT 1 NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`first_published_at` text,
	`editor_id` text NOT NULL,
	`mutation_token` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `journal_posts_slug_unique` ON `journal_posts` (`slug`);--> statement-breakpoint
CREATE TABLE `journal_revisions` (
	`id` text PRIMARY KEY NOT NULL,
	`post_id` text NOT NULL,
	`revision` integer NOT NULL,
	`snapshot` text NOT NULL,
	`created_at` text NOT NULL,
	`editor_id` text NOT NULL,
	FOREIGN KEY (`post_id`) REFERENCES `journal_posts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `journal_revision_unique` ON `journal_revisions` (`post_id`,`revision`);--> statement-breakpoint
CREATE TABLE `journal_settings` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL
);
