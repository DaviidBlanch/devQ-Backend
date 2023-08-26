const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    const authorization = req.get('authorization')
    let token = ''

    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        token = authorization.substring(7)
    }

    let decodedToken = {}

    try {
        decodedToken = jwt.verify(token, process.env.TOKEN)
    } catch (err) {
        console.log(err)
    }

    if (!token || !decodedToken.id) {
        return res.status(401).json({ error: 'token missing or invalid' })
    }

    const { id: userId } = decodedToken

    req.userId = userId

    next()
}
