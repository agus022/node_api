const express = require('express')
const {ObjectId} = require('mongodb')
const db = require('../libs/database')
const router = express.Router()

router.get('/api/v1/employees', async (req, res)=>{
    const employees = await db.collection('Employees').find().toArray()
    res.status(200).json({"data":employees});
})

//ruta para usar el select2
router.get('/api/v1/employees_gender', async (req, res)=>{
    try {
        let query = {};
        if (req.query.gender) {
            query.gender = { $regex: new RegExp("^" + req.query.gender + "$", "i") }; //ignorar mayus para la busqueda 
        }

        const employees = await db.collection('Employees').find(query).toArray();
        res.status(200).json({ "data": employees });
    } catch (error) {
        console.log("Error en la API:", error);
        res.status(500).json({ "error": "Error fetching employees" });
    }
})


router.get('/api/v1/employees/:id', async (req, res) => {
    const employees = await db.collection('Employees').find({"id": parseInt(req.params.id)}).toArray()
    res.send(employees)
})

router.get('/api/v1/employees/oid/:oid', async (req, res) => {
    const employees = await db.collection('Employees')
                    .find({"_id": new ObjectId(req.params.oid)})
                    .toArray()
    res.send(employees)
})

router.get('/api/v1/employees/gender/:gender/department/:depto', async (req, res) => {
    const employees = await db.collection('Employees')
                    .find({
                        "gender": req.params.gender,
                        "department": req.params.depto
                    })
                    .toArray()
    res.send(employees)
})

router.post('/api/v1/employees', async function (req, res) {
    try {
        const emp = await db.collection('Employees')
        const lastEmp = await emp.find().sort({"id":-1}).limit(1).toArray()
        const id = lastEmp[0].id + 1
        const newEmployee = {
            "id" : id,
            ...req.body
        }
   
        const result = await db.collection("Employees").insertOne(newEmployee)
        res.status(200).json(result);  
    } catch (error) {
        console.log(error)
        res.status(500).json({"error": error});
    }

})

router.put('/api/v1/employees', async function(req, res) {

    try {
        const empUpdate = db.collection('Employees')
        const result = await empUpdate.findOneAndUpdate(
            { "_id": new ObjectId(req.body.id) },
            { $set: req.body },
            { returnDocument: 'after', upsert: true }
        )
        res.send(result)
    } catch (error) {
        console.log(error)
        res.status(500).json({"error": error});
    }
});

router.delete('/api/v1/employees/:id', async (req, res)=>{
    try {
        const result = await db.collection('Employees').findOneAndDelete(
            {"_id": new ObjectId(req.params.id)}
        )
        res.send((result)?"Employee deleted...":"Employee not found")
    } catch (error) {
        console.log(error)
        res.status(500).json({"error": error});
    }
})
module.exports = router