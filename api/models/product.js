const mongoose = require('mongoose');

const productScehma = mongoose.Schema({
	_id: mongoose.Types.ObjectId,
	name: String,
	price: Number
});

module.exports = mongoose.model('Product',productScehma);

