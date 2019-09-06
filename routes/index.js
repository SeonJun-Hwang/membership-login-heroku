const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const dataSource = require('../model/datasource')
const generator = require('../util/generator')

app.use(bodyParser())
app.use(cookieParser())

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

    res.set('User-Agent', 'Mozilla/5.0')
    res.set('Content-Type', 'application/json')

    const result = { "result": isDuplicate(req.query) }
    res.send(`${JSON.stringify(result)}`)
})

app.post('/duplicate', (req, res, next) => {
    console.log(`${req.host} is comming duplicate to POST`)

    res.set('User-Agent', 'Mozilla/5.0')
    res.set('Content-Type', 'application/json')

    const result = { "result": isDuplicate(req.query) }
    res.send(`${JSON.stringify(result)}`)
})

app.get('/signIn', (req, res, next) => {
    console.log(`${req.host} is comming signIn to GET`)

    res.set('User-Agent', 'Mozilla/5.0')
    res.set('Content-Type', 'application/json')

    const params = req.query
    const loginResult = login(params)

    if (loginResult)
        res.cookie('BHC', generator.uuid(), {'maxAge': 30000, expires: generator.timestamp() + 300000, httpOnly: false})

    const result = { "result": loginResult }
    res.send(`${JSON.stringify(result)}`)
})

const isDuplicate = str => dataSource.isDuplicate(str.id)
const newUser = obj => dataSource.createUser(obj)
const login = obj => dataSource.isLoginable(obj.id, obj.pwd)

module.exports = app