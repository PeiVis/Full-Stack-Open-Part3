const express = require('express')
const app = express()

let persons = [

  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456'
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523'
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345'
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122'
  }

]

app.use(express.json())

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

const generateId = () => {
  const id = Math.floor(Math.random() * 100000)
  return id
}

const checkDuplicate = (name) => {
  const duplicate = persons.filter((person) => {
    return person.name === name
  })
  console.log(duplicate)
  return duplicate
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.number || !body.name) {
    return response.status(400).json({
      error: `error no ${!body.number ? 'number' : 'name'} was given`
    })
  }

  if (checkDuplicate(body.name).length !== 0) {
    return response.status(400).json({
      error: `error duplicate name: '${body.name}'`
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId()
  }

  persons = persons.concat(person)

  response.json(person)
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => {
    return person.id === id
  })

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.get('/info', (request, response) => {
  const personsLen = persons.length
  const message = `<div><p>Phonebook has info for ${personsLen} people</p><p>${new Date()}</p></div>`

  response.send(message)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
