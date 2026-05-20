ALTER TABLE `pages` ADD COLUMN `owner_github_id` integer;
--> statement-breakpoint
ALTER TABLE `pages` ADD COLUMN `owner_github_login` text;
--> statement-breakpoint
UPDATE `pages`
SET
  `owner_github_id` = `created_by_github_id`,
  `owner_github_login` = `created_by_github_login`
WHERE `owner_github_id` IS NULL
  AND `created_by_github_id` IS NOT NULL;
