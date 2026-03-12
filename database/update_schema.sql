-- Create Albums Table
CREATE TABLE IF NOT EXISTS albums (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Alter Galleries Table to support albums and ownership
-- Use an idempotent approach for altering table, MySQL doesn't have ADD COLUMN IF NOT EXISTS 
-- so we'll handle this in a way that doesn't break if run multiple times via a stored procedure.
DELIMITER //

CREATE PROCEDURE AlterGalleriesTable()
BEGIN
    -- Check for album_id
    IF NOT EXISTS (
        SELECT * FROM information_schema.COLUMNS 
        WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'galleries' AND COLUMN_NAME = 'album_id'
    ) THEN
        ALTER TABLE galleries ADD COLUMN album_id INT DEFAULT NULL;
        ALTER TABLE galleries ADD CONSTRAINT fk_gallery_album FOREIGN KEY (album_id) REFERENCES albums(id) ON DELETE SET NULL;
    END IF;

    -- Check for uploaded_by
    IF NOT EXISTS (
        SELECT * FROM information_schema.COLUMNS 
        WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'galleries' AND COLUMN_NAME = 'uploaded_by'
    ) THEN
        ALTER TABLE galleries ADD COLUMN uploaded_by INT DEFAULT NULL;
        ALTER TABLE galleries ADD CONSTRAINT fk_gallery_uploader FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL;
    END IF;
END//

DELIMITER ;

CALL AlterGalleriesTable();
DROP PROCEDURE IF EXISTS AlterGalleriesTable;

-- Album Permissions Table
CREATE TABLE IF NOT EXISTS album_permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    album_id INT NOT NULL,
    user_id INT NOT NULL,
    granted_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (album_id) REFERENCES albums(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (granted_by) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_permission (album_id, user_id)
);
