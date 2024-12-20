const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(cors())

// Define a custom token to log the request body
morgan.token('body', (req) => JSON.stringify(req.body));
app.use(
    morgan(':method :url :status :res[content-length] - :response-time ms :body')
);


let persons = [
    { 
        "id": "1",
        "name": "Arto Hellas", 
        "number": "040-123456"
      },
      { 
        "id": "2",
        "name": "Ada Lovelace", 
        "number": "39-44-5323523"
      },
      { 
        "id": "3",
        "name": "Dan Abramov", 
        "number": "12-43-234345"
      },
      { 
        "id": "4",
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122"
      }
]

app.get('/', (request, response) => {
    response.send('<h1>Phonebook server<h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    response.send(
        `<p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date()}</p>`
    )
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(p => p.id !== id)
    response.status(204).end()
})

const generateId = () => {
    let id
    do {
        id = Math.floor(Math.random() * 1000000)
    } while (persons.some((entry) => entry.id === id)) // Ensure it's unique
    return id
}

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number missing'
        })
    }

    if (persons.some(person => person.name === body.name)) {
        return response.status(400).json({
            error: 'person already exists in phonebook'
        })
    }

    const person = {
        id: String(generateId()),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)
    response.json(person)
})



const PORT = process.env.PORT || 3003

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

