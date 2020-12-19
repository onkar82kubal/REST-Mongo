const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectID;
const moment = require('moment');

const multer = require('multer');

const checkAuth = require('../middleware/check-auth');

const ProductsController = require('../controllers/products');


const storage = multer.diskStorage({
	destination: function(req,file,cb){
		cb(null,'./uploads/');
	},
	filename: function(req,file,cb){
		cb(null, moment().unix() + '_' + file.originalname);
	}
});

const fileFilter = (req,file,cb) => {
	// reject file 
	if(file.mimetype ==='image/jpeg' || file.mimetype ==='image/png' ){
		cb(null,true);	
	}
	else {
		cb(null,false);	
	}	
};

const upload = multer({
	storage: storage, 
	limits: {
		fileSize : 1024 * 1024 * 5
	},
	fileFilter:fileFilter
});

const Product = require('../models/product');

router.get('/',ProductsController.products_get_all);

router.post('/',checkAuth,upload.single('productImage'),ProductsController.product_add);

router.get('/:productId',ProductsController.product_details);


router.patch('/:productId',checkAuth,ProductsController.product_update);


router.delete('/:productId',checkAuth,ProductsController.product_delete);

module.exports = router;