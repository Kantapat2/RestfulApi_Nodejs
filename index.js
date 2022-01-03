const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();
const dbCon = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"root",
    database:"cancer_backend"
});

dbCon.connect((err)=>{
    if(err){
        throw err;
    }
    console.log('connected success!!');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extends: true}));

app.get('/patient_information',(req,res)=>{
    let sql = 'SELECT cp.update_time, cp.id_doctor, cp.hospital, doc.id, doc.name FROM calendar_appointment as cp INNER JOIN doctor as doc ON cp.id_doctor = doc.id';
    let query = dbCon.query(sql, (err, results) =>{
        if(err) throw err;
        console.log(results);
        res.send('success get!!')
    })
})

app.get('/patient/history_drug', (req,res)=>{
    let sql = 'SELECT cp.id_patient, cp.update_time, cp.drug_formula, p.id, p.weight, p.height FROM calendar_appointment as cp INNER JOIN patient as p ON cp.id_patient = p.id';
    let query = dbCon.query(sql, (err,results)=>{
        if(err) throw err;
        console.log(results);
        res.send('success history_drug!!')
    })
})

app.get('/patient/patient_allergic', (req,res)=>{
    dbCon.query('SELECT update_at, allergic FROM allergic',(err, results,fields)=>{
        if(err) throw err;  
        let message = ""
        if (results === undefined || results.length == 0){
            message = "Allergic table is empty";
        }else{
            message = "success patient_allergic";
        }
        return res.send({error: false , data: results, message: message});
    })
})

app.post('/patient/add_alllergic', (req,res)=>{
    let allergic = req.body.name;

    if(!allergic){
        return res.status(400).send({error: true, message:"Please provide allergic "})
    }else{
        dbCon.query('INSERT INTO allergic (allergic) VALUES(?)', [allergic] ,(err, results, fields)=>{
            if(err) throw err;
            return res.send({ error: false, data: results , message: "Allergic success added"})
        } )
    }
})

app.put('/update_allergic', (req,res)=>{
    let allergic = req.body.allergic;

    if (!allergic) {
        return res.status(400).send({err: true, message: "Please provide allergic update"});
    }else{
        dbCon.query('UPDATE allergic SET allergic = ?', [allergic] ,(err, results, fields)=>{
            if(err) throw err;
            let message = ""
            if (results.changeRows === 0){
                message = " Allergic not found data update";
            }else{
                message = " Allergic successfull update";
            }
            return res.send({err: false, data: results, message: message})
        })
    }
})

app.delete('/delete_allergic',(req,res)=>{
    let allergic = req.body.allergic;

    if(!allergic){
        return res.status(400).send({err: true, message: "Please provide allergic to delete"})
    } else {
        dbCon.query('DELETE FROM allergic WHERE allergic = ?', [allergic] ,(err, resutls, fields) =>{
            if(err) throw err;
            message = ""
            if (resutls.affectedRows === 0){
                message = "allergic not found data" ;
            } else {
                message = "allergic successfull to delete";
            }
            return res.send({err: false, data: resutls, message: message})
        })
    }
})

app.get('/doctor/patient_list', (req,res)=>{
    let sql = 'SELECT cd.id_patient, cd.booking_date, cd.drug_formula, p.id, p.name FROM calendar_appointment as cd INNER JOIN patient as p ON cd.id_patient = p.id'
    let query = dbCon.query(sql,(err, resutls)=>{
        if(err) throw err;
        console.log(resutls);
        res.send('success patient_list')
    })
})

app.get('/doctor/patient_history', (req,res)=>{
    let sql = 'SELECT cd.id_patient, cd.booking_date, cd.drug_formula, p.id, p.name, p.height, p.weight, p.disease, p.age, p.gender, p.treatment, p.Hn, p.national, p.ethnicity FROM calendar_appointment as cd INNER JOIN patient as p ON cd.id_patient = p.id'
    let query = dbCon.query(sql,(err,results)=>{
        if(err) throw err;
        console.log(results);
        res.send('success patient_history')
    })
})
app.post('/add_drug', (req,res)=>{
    let drug_formula = req.body.drug_formula;

    if (!drug_formula){
        return res.status(400).send({err: true, message: "Please provide drug formula data"})
    } else {
        dbCon.query('INSERT INTO calendar_appointment (drug_formula) VALUES(?)',[drug_formula], (err,results,fields)=>{
            if(err) throw err;
            return res.send({ err: false, data: results, message: "drung formula success added"})
        })
    }
})
app.put('/update_drug',(req,res)=>{
    let drug_formula = req.body.drug_formula;

    if (!drug_formula){
        return res.status(400).send({err: true, message: "Please provide drug formula update"})
    } else {
        dbCon.query('UPDATE calendar_appointment SET drug_formula = ?', [drug_formula] ,(err, results, fields) =>{
            if(err) throw err;
            let message = ""
            if (results.changeRows === 0){
                message = " drug_formula not found data update";
            }else{
                message = " drug_formula successfull update";
            }
            return res.send({err: false, data: results, message: message})
        })
    }
})

app.delete('/delete_drug',(req,res)=>{
    let drug_formula = req.body.allergic;

    if(!drug_formula){
        return res.status(400).send({err: true, message: "Please provide drug_formula to delete"})
    } else {
        dbCon.query('DELETE FROM calendar_appointment WHERE drug_formula = ?', [drug_formula] ,(err, resutls, fields) =>{
            if(err) throw err;
            message = ""
            if (resutls.affectedRows === 0){
                message = "drug_formula not found data" ;
            } else {
                message = "drug_formula successfull to delete";
            }
            return res.send({err: false, data: resutls, message: message})
        })
    }
})

app.post('/add_Connection', (req,res)=>{
    let contact = req.body.contact;

    if (!contact){
        return res.status(400).send({err: true, message: "Please provide drug contact data"})
    } else {
        dbCon.query('INSERT INTO patient (contact) VALUES(?)',[contact], (err,results,fields)=>{
            if(err) throw err;
            return res.send({ err: false, data: results, message: "contact success added"})
        })
    }
})
app.put('/update_drug',(req,res)=>{
    let contact = req.body.contact;

    if (!contact){
        return res.status(400).send({err: true, message: "Please provide contact update"})
    } else {
        dbCon.query('UPDATE calendar_appointment SET drung_formula = ?', [drug_formula] ,(err, results, fields) =>{
            if(err) throw err;
            let message = ""
            if (results.changeRows === 0){
                message = " drug_formula not found data update";
            }else{
                message = " drug_formula successfull update";
            }
            return res.send({err: false, data: results, message: message})
        })
    }
})

app.delete('/delete_drug',(req,res)=>{
    let contact = req.body.contact;

    if(!contact){
        return res.status(400).send({err: true, message: "Please provide contact to delete"})
    } else {
        dbCon.query('DELETE FROM patient WHERE contact = ?', [contact] ,(err, resutls, fields) =>{
            if(err) throw err;
            message = ""
            if (resutls.affectedRows === 0){
                message = "contact not found data" ;
            } else {
                message = "contact successfull to delete";
            }
            return res.send({err: false, data: resutls, message: message})
        })
    }
})

app.post('/drug_appointment', (req,res)=>{
    let name_patient = req.body.name_patient;
    let time_at = req.body.time_at;
    let drug_formula = req.body.drug_formula;

    if(!name_patient || !time_at || !drug_formula){
        return res.status(400).send({err: true , message: "Please provide already data added"})
    } else {
        dbCon.query('INSERT INTO calendar_appointment (name, time_at, drug_formala) VALUES(?)',[name, time_at, drug_formula],(req,res)=>{
            if(err) throw err;
            return res.send({ err: false, data: results, message: "appointment success added"})
        })
    }
})

app.put('/update_drug',(req,res)=>{
    let name_patient = req.body.name_patient;
    let time_at = req.body.time_at;
    let drug_formula = req.body.drug_formula;

    if (!name_patient || !time_at || !drug_formula){
        return res.status(400).send({err: true, message: "Please provide contact update"})
    } else {
        dbCon.query('UPDATE calendar_appointment SET  time_at = ? drug_formula =? where name_patient = ? ', [name_patient, drug_formula, time_at] ,(err, results, fields) =>{
            if(err) throw err;
            let message = ""
            if (results.changeRows === 0){
                message = " data not found data update";
            }else{
                message = " data successfull update";
            }
            return res.send({err: false, data: results, message: message})
        })
    }
})

app.delete('/delete_drug',(req,res)=>{
    let name_patient = req.body.name_patient;
    let time_at = req.body.time_at;
    let drug_formula = req.body.drug_formula;

    if(!name_patient || !time_at || !drug_formula){
        return res.status(400).send({err: true, message: "Please provide data to delete"})
    } else {
        dbCon.query('DELETE FROM calendar_appointment WHERE name_patient = ?', [name_patient] ,(err, resutls, fields) =>{
            if(err) throw err;
            message = ""
            if (resutls.affectedRows === 0){
                message = "data not found data" ;
            } else {
                message = "data successfull to delete";
            }
            return res.send({err: false, data: resutls, message: message})
        })
    }
})

app.get('/admin/information', (req,res)=>{
    let sql = 'SELECT update_at, name, level_access, time_at, section FROM admin'
    let query = dbCon.query(sql,(err,results)=>{
        if(err) throw err;
        console.log(results);
        res.send('success admin information')
    })
})

app.post('/admin_used', (req,res)=>{
    let name = req.body.name_patient;
    let time_at = req.body.time_at;
    let level_access = req.body.level_access;
    let section = req.body.section;

    if(!name_patient || !time_at || !level_access || !section){
        return res.status(400).send({err: true , message: "Please provide already data added"})
    } else {
        dbCon.query('INSERT INTO admin (name, time_at, level_access, section) VALUES(?)',[name, time_at, level_access, section],(req,res)=>{
            if(err) throw err;
            return res.send({ err: false, data: results, message: "appointment success added"})
        })
    }
})




app.put('/update_',(req,res)=>{
    let name = req.body.name;
    let time_at = req.body.time_at;
    let level_access = req.body.level_access;

    if (!name || !time_at || !level_access){
        return res.status(400).send({err: true, message: "Please provide admin update"})
    } else {
        dbCon.query('UPDATE admin SET  time_at = ? level_access =? where name = ? ', [name, level_access, time_at] ,(err, results, fields) =>{
            if(err) throw err;
            let message = ""
            if (results.changeRows === 0){
                message = " data not found data update";
            }else{
                message = " data successfull update";
            }
            return res.send({err: false, data: results, message: message})
        })
    }
})

app.delete('/delete_drug',(req,res)=>{
    let name = req.body.name;
    let time_at = req.body.time_at;
    let update_at = req.body.update_at;

    if(!name || !time_at || !update_at){
        return res.status(400).send({err: true, message: "Please provide admin delete"})
    } else {
        dbCon.query('DELETE FROM admin WHERE name = ?', [name] ,(err, resutls, fields) =>{
            if(err) throw err;
            message = ""
            if (resutls.affectedRows === 0){
                message = "data not found data" ;
            } else {
                message = "data successfull to delete";
            }
            return res.send({err: false, data: resutls, message: message})
        })
    }
})






app.listen('3000',()=>{
    console.log('Server is running...')
})


