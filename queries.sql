create database cbfinder;

use cbfinder;

create table accounts(
username varchar(255) PRIMARY KEY NOT NULL,
password varchar(255) NOT NULL,
name varchar(255) NOT NULL,
profile_name text,
age varchar(3),
gender varchar(10),
skill text,
dob varchar(15),
email text,
phone_number varchar(20),
about text,
city text,
state text,
country text,
education text,
ideas text
);

create table feedback(
id int(11) PRIMARY KEY AUTO_INCREMENT NOT NULL,
username varchar(255) NOT NULL,
feedback text NOT NULL
);

create table message(
id int(11) PRIMARY KEY AUTO_INCREMENT NOT NULL,
sender varchar(255) NOT NULL,
receiver varchar(255) NOT NULL,
chat text NOT NULL,
timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

create table otp_table(
id int(11) PRIMARY KEY AUTO_INCREMENT NOT NULL,
username varchar(255) NOT NULL,
otp text NOT NULL
);


create table posts(
post_name text,
username varchar(255) NOT NULL,
timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

create table skills(
id int(11) PRIMARY KEY AUTO_INCREMENT NOT NULL,
username varchar(255),
skill varchar(255) 
);

create table teamrequest(
id int(11) PRIMARY KEY AUTO_INCREMENT NOT NULL,
uploader varchar(255)  NOT NULL,
skills text  NOT NULL,
description text
);
