const { Schema, model } = require('mongoose')

const userSchema = new Schema({
    name: String,
    username: String,
    passwordHash: String,
    image: String,
    posts: [{
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }]
})

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v

        delete returnedObject.passwordHash
    }
})

const User = model('User', userSchema)

module.exports = User
