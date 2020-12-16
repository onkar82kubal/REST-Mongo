const mongoose = require('mongoose');

const productScehma = mongoose.Schema({
	_id: mongoose.Types.ObjectId,
	name: { type: String, required: true },
	price: { type: Number, required: true }
});

module.exports = mongoose.model('Product',productScehma);

