create database libros_db;
use libros_db;

create table libros (
id int auto_increment primary key,
nombre varchar (50) not null,
autor varchar (50) not null,
paginas int not null
);
