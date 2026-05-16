ALTER TABLE `pages` ADD COLUMN `created_by_github_id` integer;
--> statement-breakpoint
ALTER TABLE `pages` ADD COLUMN `created_by_github_login` text;
--> statement-breakpoint
ALTER TABLE `pages` ADD COLUMN `updated_by_github_id` integer;
--> statement-breakpoint
ALTER TABLE `pages` ADD COLUMN `updated_by_github_login` text;
