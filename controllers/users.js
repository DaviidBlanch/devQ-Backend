const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
    const { body } = request
    const { name, username, password, image } = body

    const user = new User({
        name,
        username,
        passwordHash: password,
        image
    })

    const savedUser = await user.save()

    response.json(savedUser)
})

module.exports = usersRouter
