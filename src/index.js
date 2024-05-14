const express = require("express");
const dotenv = require('dotenv');
const mongoose = require("mongoose");
const routes = require('./routes')
const cors = require('cors');
const cookieParser = require('cookie-parser')
const path = require('path');

dotenv.config()

const app = express()
const port = process.env.PORT || 3001

app.use(cors())
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(cookieParser())

routes(app);

mongoose.set('strictQuery', false);

mongoose.connect(`${process.env.MONGO_DB}`)
    .then(() => {
        console.log('Connect Db success!')
    })
    .catch((err) => {
        console.log(err)
    })


app.get('/', (req, res) => {
    res.send('hello world')
})
    


app.listen(port, () => {
    console.log('Server is running in port: ', + port)
})