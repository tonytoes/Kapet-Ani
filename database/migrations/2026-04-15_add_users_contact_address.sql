-- Add address + postal code + phone number to users.
-- (Safe to run once; if you already added them, skip.)

ALTER TABLE `users`
  ADD COLUMN `phone` VARCHAR(30) NOT NULL DEFAULT '' AFTER `email`,
  ADD COLUMN `address` TEXT NOT NULL AFTER `phone`,
  ADD COLUMN `postalcode` VARCHAR(20) NOT NULL DEFAULT '' AFTER `address`;

