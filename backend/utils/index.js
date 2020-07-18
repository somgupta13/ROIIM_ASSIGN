const request = require('request');
var constants = require("./constants");

 getId=async (req, callbackfunc)=>{
	//url
	const url = 'https://api.test.paysafe.com/paymenthub/v1/customers';
  	//body
	var values = {
					merchantCustomerId: req.email+req.firstName+req.phone+"479877865",
					firstName: req.firstName,
					email: req.email,
					phone: req.phone,
				}
	//options for post request,headersand url
	const options = {
				  url: url,
				  headers: constants.headers,
				  body: JSON.stringify(values),
   				  method: 'POST'
				};
	//callback for requests	
	 function callback(error, response, body) {
		// console.log(error)
		// console.log(response)
		console.log(JSON.parse(body).id)
		return callbackfunc(JSON.parse(body).id);
	}			
	
	  request(options, callback);			

				
	
	
};

module.exports.getId = getId;