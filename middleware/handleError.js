module.exports = (req, res, err, next) => {
    console.log(err)
    if (err.name === 'CastError') {
        return res.status(400).send({ err: 'malformatted id' })
    } else {
        res.status(500).end()
    }
}
