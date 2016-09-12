var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var safe = { w: 2, wtimeout: 10000 };
var quick = { w: 1, wtimeout: 10000 };

var postSchema = new mongoose.Schema({
	created_by: String,		//should be changed to ObjectId, ref "User"
	created_at: {type: Date, default: Date.now},
	text: String
},{safe: quick});

var postSchemaWC = new mongoose.Schema({
	created_by: String,		//should be changed to ObjectId, ref "User"
	created_at: {type: Date, default: Date.now},
	text: String
},{safe: safe});

var userSchema = new mongoose.Schema({
	username: String,
	password: String, //hash created from password
	created_at: {type: Date, default: Date.now}
});


mongoose.model('Post', postSchema);
mongoose.model('PostWC', postSchemaWC);
mongoose.model('User', userSchema);
 	