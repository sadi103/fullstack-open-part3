const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

morgan.token('data', function (req, res) {
  const body = req.body

  return JSON.stringify(body)
})

app.use(express.static('dist'))

app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  if(!person) {
    return response.status(404).end()
  }

  return response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  return response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if(!body.name || !body.number || persons.some(person => person.name === body.name)) {
    let error
    if(!body.name || !body.number) {
      error = {error: 'name or number missing'}
    }
    else {
      error = {error: 'name must be unique'}
    }
    return response.status(400).json(error)
  }

  const person = {
    name: body.name,
    number: body.number,
    id: Math.ceil(Math.random() * 233423234)
  }

  persons = persons.concat(person)

  response.json(person)
})

app.get('/info', (request, response) => {
  const currentDate = new Date();

  response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${currentDate}</p>`)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})