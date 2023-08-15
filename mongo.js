const mongoose = require('mongoose')

// const { MONGO_DB_URI, MONGO_DB_URI_TEST, NODE_ENV } = process.env
// const url = NODE_ENV === 'test'
//     ? MONGO_DB_URI_TEST
//     : MONGO_DB_URI

const connectionString = process.env.MONGO_DB_URI

// Conexion a Mongodb
mongoose.connect(connectionString)
    .then(() => {
        console.log('Database connected')
    }).catch(err => {
        console.log(err)
    })

process.on('uncaughtException', error => {
    console.log(error)
    mongoose.disconnect()
})
