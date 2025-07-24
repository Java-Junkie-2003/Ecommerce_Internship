const app = require("./src/app");

const {app: {port}} = require('./src/configs/config.mongo')

const PORT =  port || 3055

const server = app.listen(3055, ()=>{
    console.log(`WSV e-commerce start with ${PORT}`)
})

process.on('SIGINT', ()=>{
    server.close(() => console.log("Exit server"))
})