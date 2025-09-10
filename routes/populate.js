var express = require('express');
var router = express.Router();
var db = require('../models');
var AdminService = require('../services/AdminService');
var adminService = new AdminService(db)
const adminData = require("../data/admins.json")
var crypto = require('crypto');

//Populate DB
router.post('/', async function (req, res, next) {
    try{
        const {login, password, role} = adminData[0];
        
        const exists = await adminService.findOne(login);
        if(exists){
            return res.status(409).json({ statusCode: 409, result: 'Already populated.'});
        }

        const salt = crypto.randomBytes(16);
        const hashedPassword = crypto.pbkdf2Sync(password, salt, 310000, 32, 'sha256');
        
        await adminService.populateDatabase(login, hashedPassword, salt, role)
        return res.status(200).json({statusCode: 200, result: 'Population success.'})

    }catch(err){
        return res.status(400).json({ statusCode: 400, result: 'Population failed.' });
    }
})

module.exports = router;
