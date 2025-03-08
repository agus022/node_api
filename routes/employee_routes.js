const express = require('express')
const {ObjectId} = require('mongodb')
const db = require('../libs/database')
const router = express.Router()

router.get('/employees', async (req, res) => {
    const employees = await db.collection('Employees').find().toArray();
    res.status(200).json(employees)
})   
router.get('/api/v1/employees', async (req, res)=>{
    const employees = await db.collection('Employees').find().toArray()
    res.status(200).json(employees);
})

router.get('/api/v1/employees/:emp_no', async (req, res) => {
    const employees = await db.collection('Employees').find({"emp_number": parseInt(req.params.emp_no)}).toArray()
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
        const lastEmp = await emp.find().sort({"emp_number":-1}).limit(1).toArray()
        const emp_no = lastEmp[0].emp_number + 1
        const newEmployee = {
            "emp_number" : emp_no,
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