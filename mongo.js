const mongoose = require('mongoose')

if (process.argv.length<3 || process.argv.length>5) {
  console.log('incorrect # arguments')
  process.exit(1)
}

const password = process.argv[2]

const url =
    `mongodb+srv://seniorj:${password}@cluster0.rjwlj.mongodb.net/phoneBook?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length > 3) {
  const enteredName = process.argv[3]
  const enteredNumber = process.argv[4]

  const person = new Person({
    name: enteredName,
    number: enteredNumber,
  })

  person.save().then(() => {
    console.log(`added ${enteredName} number ${enteredNumber} to phonebook`)
    mongoose.connection.close()
  })
} else {
  Person
    .find({})
    .then(persons => {
      console.log('phonebook:')
      persons.forEach(person => {
        console.log(`${person.name} ${person.number}`)
      })
      mongoose.connection.close()
    })

}
