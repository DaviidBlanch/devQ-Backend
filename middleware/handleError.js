const ERROR_HANDLERS = {
    CastError: res => res.status(400).send({ error: 'id used is malformed' }),

    ValidationError: (res, { message }) => res.status(409).send({ error: message }),

    JsonWebTokenError: res => res.status(401).json({ error: 'invalid token' }),

    TokenExpiredError: res => res.status(401).json({ error: 'token expired' }),

    ParamError: res => res.status(400).send({ error: 'missing parameters' }),

    defaultError: res => res.status(500).end()
}

module.exports = (res, err) => {
    const handler =
        ERROR_HANDLERS[err.name] || ERROR_HANDLERS.defaultError
    handler(res, err)
}
