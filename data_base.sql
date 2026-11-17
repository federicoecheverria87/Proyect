CREATE DATABASE Tech_Store;

USE Tech_Store;

CREATE TABLE Users (
	Id int auto_increment PRIMARY KEY,
    `Name` varchar(100) NOT NULL,
    Email varchar(100) NOT NULL UNIQUE,
    Password varchar(255) NOT NULL,
    Photo varchar(255),
    Role varchar(20) NOT NULL,
    `Status` varchar(20) NOT NULL DEFAULT 'Active'
);

CREATE TABLE Categories (
	Id int auto_increment PRIMARY KEY,
    `Name` varchar(100) NOT NULL,
    `Status` varchar(20) NOT NULL DEFAULT 'Active'
);

CREATE TABLE Products (
	Id int auto_increment PRIMARY KEY,
    `Name` varchar(100) NOT NULL,
    Description varchar(255),
    Price decimal(10,2) NOT NULL,
    Image varchar(255),
    Stock int NOT NULL,
    Id_Category int NOT NULL,
    `Status` varchar(20) NOT NULL DEFAULT 'Active',
    CONSTRAINT fk_Category FOREIGN KEY (Id_Category) REFERENCES Categories(Id)
);


/*Users predefined */
INSERT INTO Tech_Store.Users ( `Name`, Email, Password, Photo, Role, Status) 
VALUES 
    ('Tony Stark', 'tony.stark@example.com', '$2b$10$gT9kvLqc6dE9eZUMRTVIfeOJTZagIVA50PBAkEjw5kxc57L5d9ROK', 'tony_stark.jpg', 'Admin', 'Active'),
    ('Bruno', 'bruno.diaz@example.com', '$2b$10$gT9kvLqc6dE9eZUMRTVIfeOJTZagIVA50PBAkEjw5kxc57L5d9ROK', 'batman.jpg', 'Admin', 'Active'),
    ('Moon Knight', 'cristiano.random@example.com', '$2b$10$gT9kvLqc6dE9eZUMRTVIfeOJTZagIVA50PBAkEjw5kxc57L5d9ROK', 'moonknight.jpg', 'User', 'Active'),
    ('Celia Cruz', 'celia.cruz@example.com', '$2b$10$gT9kvLqc6dE9eZUMRTVIfeOJTZagIVA50PBAkEjw5kxc57L5d9ROK', 'celia_cruz.jpg', 'User', 'Active'),
    ('Don Diego de la Vega', 'el.zorro.@example.com', '$2b$10$gT9kvLqc6dE9eZUMRTVIfeOJTZagIVA50PBAkEjw5kxc57L5d9ROK', 'el_zorro.jpg', 'User', 'Active');

/*Categories predefined*/
INSERT INTO Tech_Store.Categories (`Name`, Status) 
VALUES 
    ('Celulares', 'Active'),
    ('Computadoras', 'Active'),
    ('Audio y Video', 'Active'),
    ('Accesorios', 'Active'),
    ('Gaming', 'Active'),
    ('Fotografía', 'Active');

/*Products predefined*/
INSERT INTO Tech_Store.Products (`Name`, Description, Price, Image, Stock, Id_Category, Status)
VALUES 
    ('Smartphone XYZ', 'Latest model with advanced features', 699.99, 'smartphone_xyz.jpg', 100, 1, 'Active'),
    ('Laptop ABC', 'High-performance laptop for gaming and work', 1299.99, 'laptop_abc.jpg', 30, 2, 'Active'),
    ('Wireless Headphones', 'Noise-cancelling over-ear headphones', 199.99, 'wireless_headphones.jpg', 100, 3, 'Active'),
    ('Gaming Mouse', 'Ergonomic mouse with customizable buttons', 49.99, 'gaming_mouse.jpg', 200, 4, 'Active'),
    ('4K Action Camera', 'Waterproof camera for extreme sports', 299.99, '4k_action_camera.jpg', 25, 6, 'Active'),
    ('Bluetooth Speaker', 'Portable speaker with deep bass', 89.99, 'bluetooth_speaker.jpg', 75, 3, 'Active'),
    ('Mechanical Keyboard', 'Backlit keyboard with tactile switches', 129.99, 'mechanical_keyboard.jpg', 60, 4, 'Active'),
    ('Gaming Console', 'Next-gen console with immersive graphics', 499.99, 'gaming_console.jpg', 40, 5, 'Active'),
    ('DSLR Camera', 'Professional camera for photography enthusiasts', 899.99, 'dslr_camera.jpg', 15, 6, 'Active');