const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const compression = require('compression')
const app = express()

// init middlewares
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// init db

// init router

// handle errors
app.use((error, req, res, next)=>{
    const error = new Error('Not Found')
    error.status = 404
    next(error)
})

app.use((error, req, res, next)=>{
    const errorCode = error.status || 500
    res.status(errorCode).json(
        {
            status: "error",
            code: errorCode,
            message: error.message || "Internal server error",
            stack: error.stack
        }
    )
})
module.exports = app