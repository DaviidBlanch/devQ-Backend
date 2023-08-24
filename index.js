require('dotenv').config()
require('./mongo')

const express = require('express')
const cors = require('cors')
const app = express()
const Post = require('./models/Post')
const notFound = require('./middleware/notFound')
const handleError = require('./middleware/handleError')
const usersRouter = require('./controllers/users')
const { User } = require('@auth0/auth0-react')

app.use(cors())
app.use(express.json())

// Todos los posts
app.get('/devq/posts', async (req, res, next) => {
    const posts = await Post.find({}).populate('user', {
        username: 1,
        name: 1
    })
    res.json(posts)
})

// Todos los posts por id
app.get('/devq/post/:id', (req, res, next) => {
    const { id } = req.params

    Post.findById(id).then(post => {
        if (post) {
            return res.json(post)
        } else {
            res.status(404).end()
        }
    }).catch(err => {
        next(err)
    })
})

// Borrar un post por id
app.delete('/devq/post/:id', async (req, res, next) => {
    const { id } = req.params

    try {
        Post.findByIdAndDelete(id)
        res.status(204).end()
    } catch (err) {
        next(err)
    }
})

// Crear un post
app.post('/devq/post', async (req, res, next) => {
    const { company, description, image, country, city, experience, questions, userId } = req.body

    const user = await User.findById(userId)

    if (!company || !description || !image || !country || !city || !experience || !questions) {
        return res.status(400).json({
            error: 'fields are missing'
        })
    }

    const newPost = new Post({
        company,
        description,
        image,
        country,
        city,
        experience,
        questions,
        create_date: new Date(),
        user: user._id
    })

    try {
        const savedPost = await newPost.save()

        user.posts = user.posts.concat(savedPost._id)
        await user.save()

        res.json(savedPost)
    } catch (err) {
        next(err)
    }
})

// Modificar un post
app.put('/devq/post/:id', (req, res, next) => {
    const { id } = req.params
    const post = req.body

    const newPostInfo = {
        description: post.description,
        questions: post.questions
    }

    Post.findByIdAndUpdate(id, newPostInfo, { new: true })
        .then(result => {
            res.json(result)
        })
        .catch(err => next(err))
})

// Muestra todos los usuarios
app.use('devq/users', usersRouter)

// Crear usuarios
app.use('/devq/users', usersRouter)

// Middleware para páginas no encontradas
app.use(notFound)
// Middlware para errores
app.use(handleError)

// Port and server
const PORT = process.env.PORT || 3001
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

module.exports = { app, server }
