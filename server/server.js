require('dotenv').config()

const {
  client,
  createTables,
  createProduct,
  createUser,
  createFavorite,
  fetchProducts,
  fetchFavoritesByUserId,
  destroyFavorite
} = require('./db')
const express = require('express')
const app = express()
app.use(express.json())




app.get('/api/products',  
    async(req, res, next)=> {
    try {
        res.send(await fetchProducts());
    }
    catch(ex){
        next(ex);
    }
});


app.post('/api/users', async (req, res, next) => {
    try {
      const newUser = await createUser({
        username: req.body.username,
        password: req.body.password,
      });
      res.status(201).send(newUser);
    } catch (ex) {
      next(ex);
    }
  });
  

  app.get('/api/users/:id/favorites', async (req, res, next) => {
    try {
      res.send(await fetchFavoritesByUserId(req.params.id));
    } catch (ex) {
      next(ex);
    }
  });
  


  app.post('/api/users/:id/favorites', async (req, res, next) => {
    try {
      const newFavorite = await createFavorite({
        user_id: req.params.id,
        product_id: req.body.product_id,
      });
      res.status(201).send(newFavorite);
    } catch (ex) {
      next(ex);
    }
  });
  


  app.delete('/api/users/:userId/favorites/:id', async (req, res, next) => {
    try {
      await destroyFavorite({
        user_id: req.params.userId,
        product_id: req.params.id
      });
      res.sendStatus(204);
    } catch (ex) {
      next(ex);
    }
  });
  



const init = async() => {
  const port = 3000
  await client.connect()
  console.log('connected to database')

  await createTables()
  console.log('created tables yay')

  const [jeans, tshirt, shoes, socks, bob, sam, millie, nigel] = await Promise.all([
    createProduct({ name: 'jeans' }),
    createProduct({ name: 'tshirt' }),
    createProduct({ name: 'shoes' }),
    createProduct({ name: 'socks' }),
    createUser({ username: 'bobuser', password: 'bobpw' }),
    createUser({ username: 'samuser', password: 'sampw' }),
    createUser({ username: 'millieuser', password: 'milliepw' }),
    createUser({ username: 'nigeluser', password: 'nigelpw' })
  ])
console.log('seeded')

console.log('attempt to fetch fav before adding', await fetchFavoritesByUserId(nigel.id))
const favorite = await createFavorite({product_id: shoes.id, user_id: nigel.id})
console.log('attempt to fetch after adding', favorite)
console.log('attempt to fetch after adding' + favorite)
}
  

init()