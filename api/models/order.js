const mongoose = require('mongoose');

const orderScehma = mongoose.Schema({
	_id: mongoose.Types.ObjectId,
	product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
	quantity: { type: Number, default: 1 }
});

module.exports = mongoose.model('Order',orderScehma);

