const pg = require('pg')
const client = new pg.Client('postgres://localhost/acme_store_db')

const createTable = async() => {
    const SQL = `
        DROP TABLES IF EXISTS: favorites;
        DROP TABLES IF EXISTS: users;
        DROP TABLES IF EXISTS: products;

        CREATE TABLE user (
            id UUID PRIMARY KEY,
            username VARCHAR(20) UNIQUE NOT NULL,
            PASSWORD VARCHAR(20) NOT NULL
        )
        ` 
}