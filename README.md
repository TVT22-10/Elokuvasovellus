# Elokuvasovellus

### Arvosanatavoite: 4

## Ropsu01: Roope Nahkala

## tompih: Tomi Pihlajamaa

## valtterivimpari: Valtteri Vimpari

## nooruuw: Noora Ylitalo

## JuliusPohjanen: Julius Pohjanen

## ER-Kaavio
![ER-Kaavio](https://github.com/TVT22-10/Elokuvasovellus/blob/main/diagrams/er-kaavio.png)

## UI suunnitelma
![UI-suunnitelma](https://github.com/TVT22-10/Elokuvasovellus/blob/main/diagrams/UI-suunnitelma.png)

### Muistilista 
- npm install express
- npm install pg
- npm install dotenv 
- npm install bcrypt
- npm install jsonwebtoken
- npm install cors
- npm install react-router-dom

CREATE TABLE customer (
    username VARCHAR(50) PRIMARY KEY,
    fname VARCHAR(100),
    lname VARCHAR(100),
    pw VARCHAR(100),
    creation_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
