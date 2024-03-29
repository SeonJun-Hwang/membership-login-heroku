const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const dataSource = require('../model/datasource')
const generator = require('../util/generator')
const CORS = require('cors')

app.use(bodyParser())
app.use(cookieParser())
app.use(CORS())

app.get('/', (req, res, next) => {
    res.send('Cannot Found?')
})

app.get('/join', (req, res, next) => {
    console.log(`${req.host} is comming join to GET`)
    res.send('Cannot GET /join')
})

app.post('/join', (req, res, next) => {

    if (!isDuplicate(req.body)) {
        newUser(req.body)
        const result = { "result": "Success" }
        res.send(`${JSON.stringify(result)}`)
    }
    else {
        const result = { "result": "Fali", "Message": "Alread exist Id" }
        res.send(`${JSON.stringify(result)}`)
    }
})

app.get('/duplicate', (req, res, next) => {
    console.log(`${req.host} is comming duplicate to GET`)

    const result = { "result": isDuplicate(req.query) }
    res.send(`${JSON.stringify(result)}`)
})

app.post('/duplicate', (req, res, next) => {
    console.log(`${req.host} is comming duplicate to POST`)

    const result = { "result": isDuplicate(req.query) }
    res.send(`${JSON.stringify(result)}`)
})

app.get('/signIn', (req, res, next) => {
    console.log(`${req.originalUrl} is comming signIn to GET`)

    const params = req.query
    const loginResult = login(params)

    if (loginResult){
        const uid = generator.uuid()
        const exirTime = generator.timestamp() + 300000
        console.log(`uuid : ${uid}\nexirTime : ${exirTime}`)
        res.cookie('BHC', uid, {'maxAge': 30000, domain: req.host ,expires: exirTime, httpOnly: true})
  0  }
       
    const result = { "result": loginResult }
    res.send(`${JSON.stringify(result)}`)
})

const isDuplicate = str => dataSource.isDuplicate(str.id)
const newUser = obj => dataSource.createUser(obj)
const login = obj => dataSource.isLoginable(obj.id, obj.pwd)

module.exports = app