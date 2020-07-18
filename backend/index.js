const express = require('express')
mongoose    = require("mongoose");
const bodyParser = require('body-parser');
const cors = require('cors');
Paysafe = require("./models/paysafe");
const request = require('request');
const request1 = require('request');
const app = express();
var util = require("./utils/index");
var token = require("./utils/token");
var payment = require("./utils/payment");
var path = require('path');



const port = 3000;

app.use(cors());
// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect("mongodb://localhost/rooim");

app.get('/', function(req, res) {
     res.sendFile(path.join(__dirname + '/index.html'));
});
//routes for token
app.post("/token", function(req, res) {
	
	findpaysafe={
		"email":req.body.email
	}
	console.log(findpaysafe)
		Paysafe.find(findpaysafe, async function(err,paysafe){
			if(err){
				console.log(err);
			}else{
				console.log("-----------");
				console.log("paysafe",paysafe.length);
				if(paysafe.length==0){
					 await util.getId(req.body,
						 function(result){
							 // console.log(result);
							var newpaysafe={
								payid:result,
								email:req.body.email
							}
							console.log(newpaysafe)
							Paysafe.create(newpaysafe,async function(err, newlyCreated){
								if(err){
									// console.log(err);
								} else {
									console.log("///////////////////////////////////");
									paysafe=newlyCreated;
									console.log("paysafe**********",paysafe)
									await token.getToken(paysafe.payid,function(result){
									res.send({token:result});
								})
									// console.log("added",newlyCreated)
								}
							});
					 });	
				}else{
					console.log("paysafe",paysafe)
						await token.getToken(paysafe[0].payid,function(result){
						res.send({token:result});
					})
				}
			}
		});
	
	});
//routes for payment
app.post("/payment", async(req, res) => {
  	console.log(req.body);
	await payment.onPay(req.body,function(result){
		console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^",result)
		res.send({data:result.status});
	});
});


app.listen(port, () => console.log(`Hello world app listening on port ${port}!`));


// Where we will keep books

