const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person')

const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

// Define a custom token to log the request body
morgan.token('body', (req) => JSON.stringify(req.body))
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)


// let persons = [
//   {
//     'id': '1',
//     'name': 'Arto Hellas',
//     'number': '040-123456'
//   },
//   {
//     'id': '2',
//     'name': 'Ada Lovelace',
//     'number': '39-44-5323523'
//   },
//   {
//     'id': '3',
//     'name': 'Dan Abramov',
//     'number': '12-43-234345'
//   },
//   {
//     'id': '4',
//     'name': 'Mary Poppendieck',
//     'number': '39-23-6423122'
//   }
// ]

app.get('/', (request, response) => {
  response.send('<h1>Phonebook server<h1>')
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/info', (request, response, next) => {
  Person.countDocuments({})
    .then(count => {
      response.send(
        `<p>Phonebook has info for ${count} people</p>
                <p>${new Date()}</p>`
      )
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  // if (!body.name || !body.number) {
  //     return response.status(400).json({
  //         error: 'name or number missing'
  //     })
  // }

  // if (persons.some(person => person.name === body.name)) {
  //     return response.status(400).json({
  //         error: 'person already exists in phonebook'
  //     })
  // }

  const person = new Person({
    // id: String(generateId()),
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findByIdAndUpdate(request.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

// Utility functions
// const generateId = () => {
//   let id
//   do {
//     id = Math.floor(Math.random() * 1000000)
//   } while (persons.some((entry) => entry.id === id)) // Ensure it's unique
//   return id
// }

// Error handler
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}
// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)


const PORT = process.env.PORT || 3003

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

