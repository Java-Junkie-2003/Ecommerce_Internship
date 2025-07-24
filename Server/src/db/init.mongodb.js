const mongoose = require('mongoose')
const {db: {user, password, name}} = require('../configs/config.mongo')
const connectString = `mongodb+srv://${user}:${password}@interncluster.lccrovl.mongodb.net/${name}?retryWrites=true&w=majority&appName=InternCluster`;


class Database {
    constructor(){
        this.connect();
    }
    connect(type = 'mongodb'){
        if(true){
            mongoose.set('debug', true);
            mongoose.set('debug', {color: true})
        }
        mongoose.connect(connectString, {
            maxPoolSize: 50
        })
        .then(()=>{
            console.log("Mongodb Connected")
        })
        .catch((err)=>{
            console.log("Mongodb connection error", err)
        })
    }
    static getInstance(){
        if(!Database.instance){
            Database.instance = new Database()
        }
        return Database.instance
    }
}

const instanceMongodb = Database.getInstance()

module.exports = instanceMongodb