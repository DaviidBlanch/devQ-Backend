const postsRouter = require('express').Router()
const Post = require('../models/Post')
const User = require('../models/User')

postsRouter.get('/', async (req, res, next) => {
    const posts = await Post.find({}).populate('user', {
        username: 1,
        name: 1
    })
    res.json(posts)
})

postsRouter.get('/', (req, res, next) => {
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

postsRouter.delete('/', async (req, res, next) => {
    const { id } = req.params

    try {
        Post.findByIdAndDelete(id)
        res.status(204).end()
    } catch (err) {
        next(err)
    }
})

postsRouter.post('/', async (req, res, next) => {
    const { company, description, image, country, city, experience, questions, userId } = req.body

    const user = await User.findById(userId)

    if (!company || !description || !image || !country || !city || !experience || !questions || !user) {
        return res.status(400).json({
            error: 'company, description, image, country, city, experience, questions, userId are missing'
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

postsRouter.put('/', (req, res, next) => {
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

module.exports = postsRouter
