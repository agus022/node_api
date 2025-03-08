const express = require('express')
const {ObjectId} = require('mongodb')
const employee_routes = require('./routes/employee_routes')
const app = express()
app.use(express.json())
const port = 3000

app.use('/', employee_routes)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)       
})