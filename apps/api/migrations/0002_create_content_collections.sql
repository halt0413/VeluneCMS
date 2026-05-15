CREATE TABLE `content_collections` (
	`created_at` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `content_collections_slug_unique` ON `content_collections` (`slug`);--> statement-breakpoint
INSERT INTO `content_collections` (`id`, `slug`, `name`, `created_at`, `updated_at`)
VALUES ('collection-portfolio', 'portfolio', 'portfolio', '2026-03-26T00:00:00.000Z', '2026-03-26T00:00:00.000Z');
