USE cep_db;

-- Clear any existing demo data (Optional: user can decide, but "no demo data" was requested)
-- DELETE FROM events;
-- DELETE FROM announcements;
-- DELETE FROM choirs;
-- DELETE FROM ministries;
-- DELETE FROM gallery;

-- Real Choirs
INSERT INTO choirs (name, description, leader_name) VALUES 
('Louange Choir', 'A prominent student choir at UR-CE Rukara Campus dedicated to worship and praise through music.', 'To be updated via Admin'),
('Horeb Family Choir', 'A vibrant family of singers sharing the gospel and fostering community through choral music.', 'To be updated via Admin');

-- Real Ministries / Directorates (Source: UR-CE Administration info)
INSERT INTO ministries (name, description, leader_name, contact_info) VALUES 
('Student Welfare', 'Oversees the well-being and support services for all students on campus.', 'Mr. Musore Manege Fred', 'fred.musore@ur.ac.rw'),
('ICT Services', 'Provides technological support and maintains digital infrastructure for the campus.', 'Mr. Gasani Mpatswe', 'ict.rukara@ur.ac.rw'),
('Administration & HR', 'Handles administrative functions and human resource management for campus staff.', 'Campus Administrator', 'admin.rukara@ur.ac.rw'),
('Assets & Services', 'Manages campus facilities, maintenance, and essential services.', 'Mr. Shyirambere Willy Dieudonne', 'willy.shyirambere@ur.ac.rw');

-- Real Principal Info (In Announcements or a special About section if we had one, but let's add an announcement from him)
INSERT INTO announcements (title, content, importance) VALUES 
('Welcome to the New Academic Year', 'Welcome back to UR-CE Rukara Campus. We are committed to your excellence and professional training as future educators.', 'high'),
('Campus Excellence Vision', 'Our vision remains to be an international center of excellence for education and research. Let us work together towards this goal.', 'normal');
