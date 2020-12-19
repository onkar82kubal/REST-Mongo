const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectID;
const moment = require('moment');

const Product = require('../models/product');

exports.products_get_all = (req,res,next) => {
	Product.find()
	.select('name price _id productImage')
	.exec()
	.then(docs => {
		console.log(docs);
		const response = {
			count: docs.length,
			products: docs.map(doc => {
				return {
					name: doc.name,
					price: doc.price,
					productImage: doc.productImage,
					_id: doc._id,
					request : {
						type : 'GET',
						url : 'http:localhost:3000/products/' + doc._id
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
}  

exports.product_add = (req,res,next) => {	
	console.log(req.file);
	const product = new Product({
		_id: new mongoose.Types.ObjectId(),
		name : req.body.name,
		price : req.body.price,
		productImage: req.file.path 
	});
	product
	.save()
	.then(result => {
		console.log(result);
		res.status(200).json({
		message: 'Created product successfully',
		createdProduct: {
			name: result.name,
			price: result.price,
			_id: result._id,
			request : {
				type : 'GET',
				url : 'http:localhost:3000/products/' + result._id
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
}  

exports.product_update = (req,res,next) => {
	const id = req.params.productId;
	const updateops = {};
	for(const ops of req.body){
		updateops[ops.propName] = ops.value;
	}
	Product.update({_id: ObjectId(id)}, {$set : updateops})
	.exec()
	.then(doc => {
		console.log(doc);
		res.status(200).json({
			message : 'Product updated',
			request: {
				type : 'GET',
				url : 'http:localhost:3000/products/' + id
			}
		});			
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({
			error: err
		});
	});
} 

exports.product_details = (req,res,next) => {
	const id = req.params.productId;
	Product.findById(ObjectId(id))
	.select('name price _id productImage')
	.exec()
	.then(doc => {
		console.log(doc);
		if(doc){
			res.status(200).json({
				product : doc,
				request: {
					type : 'GET',
					url : 'http:localhost:3000/products'
				}
			});
		} else {
			res.status(200).json({
				message: 'No valid entry found for provided ID'
			});
		}		
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({
			error: err
		});
	});
} 

exports.product_delete = (req,res,next) => {
	const id = req.params.productId;
	Product.deleteOne({_id: ObjectId(id)})
	.exec()
	.then(doc => {
		console.log(doc);
		res.status(200).json({
			message: 'Product deleted',
			request: {
				type : 'POST',
				url : 'http:localhost:3000/products',
				body : {name: 'String', price: 'Number'} 
			}
		});			
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({
			error: err
		});
	});
}