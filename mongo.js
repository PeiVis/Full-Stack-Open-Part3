const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://peikvisuri:${password}@cluster0.s9gkag4.mongodb.net/noteApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: Number
})

const Contact = mongoose.model('Contact', phonebookSchema)

const contact = new Contact({
  name: process.argv[3],
  number: process.argv[4]
})

if (process.argv[3]) {
  contact.save().then(result => {
    console.log(`added ${result.name} number ${result.number} to the phonebook`)
    mongoose.connection.close()
  })
} else {
  Contact.find({}).then(result => {
    result.forEach(contact => {
      console.log(`${contact.name}  ${contact.number}`)
    })
    mongoose.connection.close()
  })
}
