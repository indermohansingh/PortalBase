CREATE DATABASE IF NOT EXISTS inderdb;
CREATE USER 'inderuser'@'%' IDENTIFIED BY 'inderpass';
GRANT ALL ON inderdb.* TO 'inderuser'@'%';

CREATE DATABASE IF NOT EXISTS grafdb;
CREATE USER 'grafuser'@'%' IDENTIFIED BY 'grafpass';
GRANT ALL ON grafdb.* TO 'grafuser'@'%';

CREATE DATABASE IF NOT EXISTS keycdb;
CREATE USER 'keycuser'@'%' IDENTIFIED BY 'keycpass';
GRANT ALL ON keycdb.* TO 'keycuser'@'%';

CREATE DATABASE IF NOT EXISTS keycdbwy;
CREATE USER 'keycuserwy'@'%' IDENTIFIED BY 'keycpasswy';
GRANT ALL ON keycdbwy.* TO 'keycuserwy'@'%';
