-- Adds a safe password length field for UI masking.
-- This stores ONLY the character count, never the password itself.

ALTER TABLE `users`
  ADD COLUMN `password_len` INT NOT NULL DEFAULT 8
  AFTER `password`;

