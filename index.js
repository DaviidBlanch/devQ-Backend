const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())

app.use()

let posts = [
    {
        id: 1,
        company: 'Capgemini',
        description: ' Impulsa la excelencia tecnológica a nivel … ',
        image: 'Archivo.jpeg',
        country: 'España',
        city: 'Valencia',
        range: 'Junior',
        questions: '¿Expectativas salariales ?',
        create_date: '13 /08 / 2023'
    }
]

app.get('/devq/posts', (req, res) => {
    res.json(posts)
})

app.get('/devq/post/:id', (req, res) => {
    const id = Number(req.params.id)
    const post = posts.find(post => post.id === id)

    if (post) {
        res.json(post)
    } else {
        res.status(404).end()
    }
})

app.delete('/devq/post/:id', (req, res) => {
    const id = Number(req.params.id)
    posts = posts.filter(post => post.id !== id)
    res.status(204).end()
})

app.post('/devq/post', (req, res) => {
    const post = req.body

    if (!post || !post.company) {
        return res.status(400).json({
            error: 'company is missing'
        })
    }

    const newPost = {
        id: posts.length + 1,
        company: post.company,
        description: post.description,
        image: post.image,
        country: post.country,
        city: post.city,
        range: post.range,
        questions: post.questions,
        create_date: new Date().toISOString
    }

    posts = [...posts, newPost]

    res.status(201).json(post)
})

app.use((req, res) => {
    res.status(404).json({
        error: 'Not found'
    })
})

const port = 3001

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})
