const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;

const Order = require('../models/order');
const Product = require('../models/product');


router.get('/',(req,res,next) => {
	Order.find()
	.select('product quantity _id')
	.populate('product','name')
	.exec()
	.then(docs => {
		console.log(docs);
		const response = {
			count: docs.length,
			orders: docs.map(doc => {
				return {
					product: doc.product,
					quantity: doc.quantity,
					_id: doc._id,
					request : {
						type : 'GET',
						url : 'http:localhost:3000/orders/' + doc._id
					}
				}	
			})
		}
		res.status(200).json(response);	
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({
			error: err
		});
	});
});

router.post('/',(req,res,next) => {	
	Product.findById(req.body.productId)
	.then(product => {
		if(!product){
			res.status(404).json({
			message: "Product not found"
		});
		}
	const order = new Order({
		_id: new mongoose.Types.ObjectId(),
		quantity: req.body.quantity,
		product: req.body.productId,
	});
	order
	.save()
	.then(result => {
		console.log(result);
		res.status(200).json({
		message: 'Order stored',
		createdOrder: {
			product: result.product,
			quantity: result.quantity,
			_id: result._id,
			request : {
				type : 'GET',
				url : 'http:localhost:3000/orders/' + result._id
				}
			}
		});
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({
			error: err
		});
		});	
	});
});

router.get('/:orderId',(req,res,next) => {
	Order.findById(req.params.orderId)
	.populate('product','name')
	.exec()
	.then(order => {
		res.status(200).json({
			order: order,
			request : {
				type : 'GET',
				url : 'http:localhost:3000/orders'
				}
			});		
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({
			error: err
		});
	});
});

router.delete('/:orderId',(req,res,next) => {
	const id = req.params.orderId;
	Order.deleteOne({_id: ObjectId(id)})
	.exec()
	.then(doc => {
		console.log(doc);
		res.status(200).json({
			message: 'Order deleted',
			request: {
				type : 'POST',
				url : 'http:localhost:3000/orders',
				body : {productId: 'String', quantity: 'Number'} 
			}
		});			
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({
			error: err
		});
	});
});

module.exports = router;