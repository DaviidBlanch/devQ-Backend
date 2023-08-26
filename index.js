require('dotenv').config()
require('./mongo')

const express = require('express')
const cors = require('cors')
const app = express()
const notFound = require('./middleware/notFound')
const handleError = require('./middleware/handleError')
const usersRouter = require('./controllers/users')
const postsRouter = require('./controllers/posts')
const loginRouter = require('./controllers/login')

app.use(cors())
app.use(express.json())

// Muestra todos los posts
app.use('/devq/posts', postsRouter)

// Mustra todos los posts por id
app.use('/devq/posts/:id', postsRouter)

// Borrar un post por id
app.use('/devq/posts/:id', postsRouter)

// Crear un post
app.use('/devq/post', postsRouter)

// Modificar un post
app.use('/devq/post/:id', postsRouter)

// Muestra todos los usuarios
app.use('/devq/users', usersRouter)

// Crear usuarios
app.use('/devq/users', usersRouter)

// Login
app.use('/devq/login', loginRouter)

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
