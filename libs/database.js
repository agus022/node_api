const MongoClient = require('mongodb').MongoClient
require('dotenv').config()
var db = null
try {
    const client = new MongoClient(process.env.CONN_STRING)
    client.connect()
    db = client.db(process.env.NAME_DB)//es como el use para cada base de datos 
    console.log("Connection successfully...")
    employees = db.collection('Employees').find()
    employees.forEach(element => {
        console.log('Full Name: ' + element.first_name + '' + element.last_name)
    });
} catch (error) {
    console.log(error)
}
module.exports = db