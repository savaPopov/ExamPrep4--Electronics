const { Router } = require('express');
const { login } = require('../services/user');
const { createToken } = require('../services/jwt');
const { getAll, getById } = require('../services/data');

const homeRouter = Router()


homeRouter.get('/', async (req, res) => {

  console.log(req.user)
  res.render('home')
})

homeRouter.get('/catalog', async (req, res) => {
  const products = await getAll()

  res.render('catalog', { products })
})

homeRouter.get('/catalog/:id', async (req, res) => {
  const product = await getById(req.params.id)

  if (!product) {
    res.render('404')
    return;
  }

  const isOwner = req.user?._id == product.author.toString()
  const hasBought = Boolean(product.buyingList.find(l => req.user?._id == l.toString()))

  res.render('details', { product, isOwner, hasBought})
})

module.exports = {
  homeRouter
}