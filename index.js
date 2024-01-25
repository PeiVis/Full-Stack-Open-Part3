const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
require('dotenv').config()
app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
morgan.token('data', function (req, res) { return JSON.stringify(req.body) })

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))
const Contact = require('./models/contact')

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.number || !body.name) {
    return response.status(400).json({
      error: `error no ${!body.number ? 'number' : 'name'} was given`
    })
  }

  const contact = new Contact({
    name: body.name,
    number: body.number
  })

  contact.save().then(contact => {
    response.json(contact)
    console.log(`added ${contact.name} number ${contact.number} to the phonebook`)
  })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  const contact = {
    name: body.name,
    number: body.number
  }
  Contact.findByIdAndUpdate(request.params.id, contact, { new: true, runValidators: true, context: 'query' })
    .then(updatedContact => {
      response.json(updatedContact)
    })
    .catch(error => next(error))
})

app.get('/api/persons', (req, res) => {
  Contact.find({}).then(contacts => {
    res.json(contacts)
  })
})

app.delete('/api/persons/:id', (request, response, next) => {
  Contact.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Contact.findById(request.params.id)
    .then(contact => {
      if (contact) {
        response.json(contact)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.get('/info', (request, response, next) => {
  Contact.find({}).then(contacts => {
    const personsLen = contacts.length
    const message = `<div><p>Phonebook has info for ${personsLen} people</p><p>${new Date()}</p></div>`
    response.send(message)
  })
    .catch(error => next(error))
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

app.use(unknownEndpoint)

app.use(errorHandler)
