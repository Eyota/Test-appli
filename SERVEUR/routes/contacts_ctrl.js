
var express = require('express');
var router = express.Router();
var service = require('../services/contacts');
var maps = require('../../CLIENT/www/js/maps');

router.post('/user/contact/', service.setContactList);
//router.get('/user/contact/:num', service.getContactNum);
//router.put('/user/position/:num', service.updatePos);
//router.get('/user/contact/position/:num', service.getContactPos);

//router.get('/user/maps', maps.watchMapPosition);

//router.get('/msg/:num', service.getMsgs);
//router.post('/msg/', service.createMsg);


module.exports = router;
