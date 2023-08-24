const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/User')

usersRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('posts')
    response.json(users)
})

usersRouter.post('/', async (request, response) => {
    const { body } = request
    const { name, username, password, image } = body

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        name,
        username,
        passwordHash,
        image,
        created_at: new Date()
    })

    const savedUser = await user.save()

    response.status(201).json(savedUser)
})

module.exports = usersRouter
