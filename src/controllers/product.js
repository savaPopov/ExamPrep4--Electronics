const { Router } = require('express');
const { create, getById, update, deleteById, buyProduct } = require('../services/data');
const { body, validationResult } = require('express-validator');
const { isUser } = require('../middlewares/guards');
const { parseError } = require('../util');

const productRouter = Router()

productRouter.get('/create', isUser(), async (req, res) => {

  res.render('create')
})

productRouter.post('/create', isUser(),
  body('name').trim().isLength({ min: 10 }).withMessage('Name should be at least 10 charachters long'),
  body('type').trim().isLength({ min: 2 }).withMessage('Type must be at least 2 charachters long'),
  body('damages').trim().isLength({ min: 10 }).withMessage('Damages should be at least 2 charachters long'),
  body('image').trim().isURL({ require_tld: false, require_protocol: true }).withMessage('Image must be a valid URL'),
  body('production').trim().isInt({ min: 1900, max: 2024 }).withMessage('The Year of Last Production  should be between 1900 and 2024'),
  body('exploitation').trim().isInt({ min: 0 }).withMessage('The exploitation should be a positive number'),
  body('description').trim().isLength({ min: 10, max: 200 }).withMessage('Description should be between 10 and 200 charachters long'),

  async (req, res) => {

    try {
      const validation = validationResult(req)
      if (validation.errors.length) {
        throw validation.errors
      }
      const result = await create(req.body, req.user._id)
      res.redirect('/catalog')
    } catch (err) {

      res.render('create', { data: req.body, errors: parseError(err).errors })
    }
  }
)


productRouter.get('/edit/:id', isUser(), async (req, res) => {
  const product = await getById(req.params.id)


  if (!product) {
    res.render('404')
  }

  const isOwner = req.user?._id == product.author.toString()

  if (!isOwner) {
    res.redirect('/login')
    return;
  }

  res.render('edit', { data: product })
})

productRouter.post('/edit/:id', isUser(),
body('name').trim().isLength({ min: 10 }).withMessage('Name should be at least 10 charachters long'),
body('type').trim().isLength({ min: 2 }).withMessage('Type must be at least 2 charachters long'),
body('damages').trim().isLength({ min: 10 }).withMessage('Damages should be at least 2 charachters long'),
body('image').trim().isURL({ require_tld: false, require_protocol: true }).withMessage('Image must be a valid URL'),
body('production').trim().isInt({ min: 1900, max: 2024 }).withMessage('The Year of Last Production  should be between 1900 and 2024'),
body('exploitation').trim().isInt({ min: 0 }).withMessage('The exploitation should be a positive number'),
body('description').trim().isLength({ min: 10, max: 200 }).withMessage('Description should be between 10 and 200 charachters long'),

  async (req, res) => {
    const productId = req.params.id
    const userId = req.user._id
    try {
      const validation = validationResult(req)

      if (validation.errors.length) {
        throw validation.errors
      }

      const result = await update(productId, req.body, userId)
      res.redirect('/catalog/' + productId)
    } catch (err) {
      res.render('create', { data: req.body, errors: parseError(err).errors })
    }
  }
)

productRouter.get('/delete/:id', isUser(), async (req, res) => {
  const productId = req.params.id
  const userId = req.user._id

  try {

    const result = await deleteById(productId, userId)
    res.redirect('/catalog')
  } catch (err) {
    res.redirect('/catalog/' + productId)
  }
}
)

productRouter.get('/buy/:id', isUser(), async (req, res) => {
  const productId = req.params.id
  const userId = req.user._id

  try {

    const result = await buyProduct(productId, userId)
    res.redirect('/catalog/' + productId)
  } catch (err) {
    console.log(err)
    res.redirect('/')
  }
}
)

module.exports = {
  productRouter
}
