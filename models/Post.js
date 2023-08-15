const { Schema, model } = require('mongoose')

const postSchema = new Schema({
    company: String,
    description: String,
    image: String,
    country: String,
    city: String,
    experience: String,
    questions: Array, // Es un array de strings
    create_date: Date
})

postSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Post = model('Post', postSchema)

module.exports = Post
