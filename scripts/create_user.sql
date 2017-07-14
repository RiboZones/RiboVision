CREATE USER 'gatech'@'localhost' IDENTIFIED BY 'gatech';
DROP USER gatech@localhost;
FLUSH PRIVILEGES;
CREATE USER 'gatech'@'localhost' IDENTIFIED BY 'gatech';
GRANT ALL PRIVILEGES ON *.* TO 'gatech'@'localhost' WITH GRANT OPTION;
CREATE USER 'gatech'@'%' IDENTIFIED BY 'gatech';
GRANT ALL PRIVILEGES ON *.* TO 'gatech'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;

