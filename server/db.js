const pg = require('pg');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/acme_store_db');

const createTables = async () => {
  const SQL = `
    DROP TABLE IF EXISTS favorites;
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS products;

    CREATE TABLE users (
      id UUID PRIMARY KEY,
      username VARCHAR(20) UNIQUE NOT NULL,
      password VARCHAR(200) NOT NULL
    );

    CREATE TABLE products (
      id UUID PRIMARY KEY,
      name VARCHAR(200)
    );

    CREATE TABLE favorites (
      id UUID PRIMARY KEY,
      user_id UUID REFERENCES users(id) NOT NULL,
      product_id UUID REFERENCES products(id) NOT NULL,
      CONSTRAINT unique_user_id_and_product_id UNIQUE(user_id, product_id)
    );
  `;
  await client.query(SQL);
};

const createProduct = async ({ name }) => {
  const SQL = `
    INSERT INTO products(id, name) 
    VALUES($1, $2) 
    RETURNING *;
  `;
  const response = await client.query(SQL, [uuidv4(), name]);
  return response.rows[0];
};

const createUser = async ({ username, password }) => {
  const SQL = `
    INSERT INTO users(id, username, password) 
    VALUES($1, $2, $3) 
    RETURNING *;
  `;
  const response = await client.query(SQL, [uuidv4(), username, await bcrypt.hash(password, 5)]);
  return response.rows[0];
};


const createFavorite = async ({ user_id, product_id }) => {
    const SQL = `
      INSERT INTO favorites(id, user_id, product_id)
      VALUES($1, $2, $3)
      RETURNING *;
    `;
    const response = await client.query(SQL, [uuidv4(), user_id, product_id]);
    return response.rows[0];
  };


  const fetchProducts = async () => {
    const SQL = `
    SELECT * FROM products;
    `;
    const response = await client.query(SQL);
    return response.rows;
  };
  

  const fetchUsers = async () => {
    const SQL = `
    SELECT * FROM users;
    `;
    const response = await client.query(SQL);
    return response.rows;
  };
  
  
  const fetchFavoritesByUserId = async (user_id) => {
    const SQL = `
      SELECT f.*, p.name AS product_name
      FROM favorites f
      JOIN products p ON f.product_id = p.id
      WHERE f.user_id = $1
    `;
    const response = await client.query(SQL, [user_id]); 
    return response.rows;
  };
  
  
  const destroyFavorite = async ({ user_id, product_id }) => {
    const SQL = `
      DELETE FROM favorites
      WHERE user_id = $1 AND product_id = $2
    `;
    await client.query(SQL, [user_id, product_id]);
  };
  
  


  module.exports = {
    client,
    createTables,
    createUser,
    createProduct,
    createFavorite,
    fetchProducts,
    fetchUsers,
    fetchFavoritesByUserId,
    destroyFavorite 
  };
  