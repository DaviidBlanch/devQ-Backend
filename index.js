require('dotenv').config()
require('./mongo')

const express = require('express')
const cors = require('cors')
const app = express()
const Post = require('./models/Post')
const notFound = require('./middleware/notFound')
const handleError = require('./middleware/handleError')

app.use(cors())
app.use(express.json())

// Todos los posts
app.get('/devq/posts', (req, res, next) => {
    Post.find({})
        .then(posts => {
            res.json(posts)
        })
        .catch(err => next(err))
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
app.delete('/devq/post/:id', (req, res, next) => {
    const { id } = req.params

    Post.findByIdAndDelete(id)
        .then(() => {
            res.status(204).end()
        }).catch(err =>
            next(err)
        )
})

// Crear un post
app.post('/devq/post', (req, res, next) => {
    const post = req.body

    if (!post || !post.company) {
        return res.status(400).json({
            error: 'company is missing'
        })
    }

    const newPost = new Post({
        company: post.company,
        description: post.description,
        image: post.image,
        country: post.country,
        city: post.city,
        experience: post.experience,
        questions: post.questions,
        create_date: new Date()
    })

    newPost.save()
        .then(saveedPost => {
            res.json(saveedPost)
        })
        .catch(err => next(err))
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

// Middleware para páginas no encontradas
app.use(notFound)
// Middlware para errores
app.use(handleError)

// Port and server
const PORT = process.env.PORT
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

module.exports = { app, server }
