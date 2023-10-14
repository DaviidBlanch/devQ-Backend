const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const loginRouter = require('express').Router()
const User = require('../models/User')

loginRouter.post('/', async (request, response) => {
    const { body } = request
    const { username, password } = body

    const user = await User.findOne({ username }).populate('posts')
    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(password, user.passwordHash)

    if (!(user && passwordCorrect)) {
        return response.status(401).json({
            error: 'invalid username or password'
        })
    }

    const userForToken = {
        id: user._id,
        username: user.username
    }

    const token = jwt.sign(
        userForToken,
        process.env.TOKEN,
        {
            expiresIn: 60 * 60 * 24 * 7 // 7 dias
        }
    )

    const transformedPosts = user.posts.map(post => ({
        id: post._id,
        company: post.company,
        image: post.image
    }))

    response.send({
        name: user.name,
        username: user.username,
        image: user.image,
        posts: transformedPosts,
        token
    })
})

module.exports = loginRouter
