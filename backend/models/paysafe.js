var mongoose = require("mongoose");

var paySafeSchema = mongoose.Schema({
    email: String,
    payid: String
});

module.exports = mongoose.model("Paysafe", paySafeSchema);