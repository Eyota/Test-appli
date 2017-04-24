var express = require('express');
var router = express.Router();
var service = require('../services/contacts');
var maps = require('../services/maps');


//router.get('/user/contact/:num', service.getContactNum);
router.post('/user/contacts/', service.setContactList);
//router.put('/user/position/:num', service.updatePos);
//router.get('/user/contact/position/:num', service.getContactPos);

//router.get('/user/maps', maps.)

//router.get('/msg/:num', service.getMsgs);
//router.post('/msg/', service.createMsg);


module.exports = router;
