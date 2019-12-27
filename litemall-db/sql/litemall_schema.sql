drop database if exists junji_mall;
drop user if exists 'junji_mall'@'localhost';
-- 支持emoji：需要mysql数据库参数： character_set_server=utf8mb4
create database junji_mall default character set utf8mb4 collate utf8mb4_unicode_ci;
use litemall;
create user 'junji_mall'@'localhost' identified by 'Lychlov_929';
grant all privileges on litemall.* to 'junji_mall'@'localhost';
flush privileges;