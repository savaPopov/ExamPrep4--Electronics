const { Data } = require('../models/Data')

async function getAll() {

  return Data.find().lean()
}

async function getById(id) {
  return Data.findById(id).lean()

}

function getRecent() {
  return Data.find().sort({ $natural: -1 }).limit(3).lean()
}
async function create(data, authorId) {

  const record = new Data({
    name: data.name,
    type: data.type,
    damages: data.damages,
    image: data.image,
    description: data.description,
    production: data.production,
    exploitation: data.exploitation,
    price: data.price,
    author: authorId
  })

  await record.save()

  return record
}

async function update(id, data, userId) {
  const record = await Data.findById(id)

  if (!record) {
    throw new ReferenceError('Record not found!' + id)
  }

  if (record.author.toString() != userId) {
    throw new Error('Access Denied!')
  }


  record.name = data.name
  record.type = data.type
  record.damages = data.damages
  record.image = data.image
  record.description = data.description
  record.production = data.production
  record.exploitation = data.exploitation
  record.price = data.price

  await record.save()

  return record
}
async function buyProduct(productId, userId) {
  const record = await Data.findById(productId)

  if (!record) {
    throw new ReferenceError('Record not found!' + productId)
  }

  if (record.author.toString() == userId) {

    throw new Error('Access Denied!')
  }

  if (record.buyingList.find(l => l.toString() == userId)) {

    return
  }

  record.buyingList.push(userId)

  await record.save()

}


async function deleteById(id, userId) {
  const record = await Data.findById(id)

  if (!record) {
    throw new ReferenceError('Record not found!' + id)
  }

  if (record.author.toString() != userId) {
    throw new Error('Access Denied!')
  }

  await Data.findByIdAndDelete(id)


}

module.exports = {
  getAll,
  getById,
  update,
  deleteById,
  create,
  getRecent,
  buyProduct
}