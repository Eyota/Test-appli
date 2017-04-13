var express = require('express');
var router = express.Router();
var service = require('../services/contacts');


router.get('/user/contact/:num', service.getContactNum);
router.put('/user/position/:num', service.updatePos);
router.get('/user/contact/position/:num', service.getContactPos);


router.get('/msg/:num', service.getMsgs);
router.post('/msg/', service.createMsg);


module.exports = router;