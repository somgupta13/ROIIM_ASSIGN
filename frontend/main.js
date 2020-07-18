
			$(document).ready(function(){
			  $("button").click(function(event){
			  	event.preventDefault();
			    onPay()
			  });
			});
async function onPay(){
					// console.log("hello");
					 // $.ajax({url: "demo_ajax_script.js", dataType: "script"});
					let email=document.getElementById("inputEmail4").value;
					let firstName=document.getElementById("inputFirst4").value;
					let lastName=document.getElementById("inputLast4").value;
					let phone=document.getElementById("inputPhone").value;
					//billing address
					let city=document.getElementById("inputCity").value;
					let zip=document.getElementById("inputZip").value;
					let street=document.getElementById("inputAddress").value;
					var token
					//amount
					let amount=document.getElementById("inputAmount").value;
					$.ajax({
						url: "ec2-18-211-62-45.compute-1.amazonaws.com:3000/token",
						type: "POST",
                        contentType: "application/json",
                        data: JSON.stringify({'email': email,'phone':phone,'firstName':firstName})    
						, success: function(result){
							token=result.token;
					    // console.log(result);
					    billingAddress={
							city:city,
							street:street,
							zip:zip,
							country:'US',
							state:'CA'
						}
						customer={
							firstName:firstName,
							lastName:lastName,
							email:email,
							phone:phone,
							dateOfBirth:{
								day:1,
								month:6,
								year:1989
							}
						}
						
						 function uuidv4() {
						  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
						    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
						    return v.toString(16);
						  });
						}
						// console.log(uuidv4());
						 checkout(token,billingAddress,customer,amount,uuidv4())
					  }});
					
			}
			function checkout(token,billingAddress,customer,amount,uuid) {
   //          console.log(customer)
			// console.log(billingAddress)
			// console.log(amount)
			// console.log(uuid)
			// console.log(token)
            paysafe.checkout.setup("cHVibGljLTc3NTE6Qi1xYTItMC01ZjAzMWNiZS0wLTMwMmQwMjE1MDA4OTBlZjI2MjI5NjU2M2FjY2QxY2I0YWFiNzkwMzIzZDJmZDU3MGQzMDIxNDUxMGJjZGFjZGFhNGYwM2Y1OTQ3N2VlZjEzZjJhZjVhZDEzZTMwNDQ=", {
                "currency": "USD",
                "amount": parseInt(amount)*100,
                "singleUseCustomerToken": token,
                
                "customer": customer,
                "billingAddress": billingAddress,
                "paymentMethodDetails": {
                    "paysafecard": {
                        "consumerId": "1232323"
                    },
                },
                "environment": "TEST",
                "merchantRefNum": uuid,
                "canEditAmount": false,
                "payout": false,
                "payoutConfig": {
                    "maximumAmount": 10000
                }
            }, function(instance, error, result) {
                if (result && result.paymentHandleToken) {
                    // console.log(result);
                    
                    $.ajax({
                              type: "POST",
                              url: "ec2-18-211-62-45.compute-1.amazonaws.com:3000/payment",
                              contentType: "application/json",
                              data: JSON.stringify({'token': result.paymentHandleToken,'amount':result.amount},),
                              success: (data) =>{   
                                      
                                // console.log(data);              
                                
                                if(data.data == "COMPLETED"){
                                	// console.log("ok")
                                	 instance.showSuccessScreen("Payment Successful!");
                                 
                                  
                                }
                                else{
                                	// console.log("ok1")
                                  instance.showFailureScreen("Payment was declined. Try again with the same or another payment method."); 
                                  // window.location.replace("file:///C:/Users/SOM/Desktop/ROIIM/assignment/index.html?");
                                }
                                 setTimeout(function(){window.location.replace(window.location.href);}, 5000);
                                
                                // 
                              }
                            });





                } else {
                  console.log("error");
                  alert("Please keep in mind -----"+error.detailedMessage)
                  console.error(error);
                  // window.location.replace(window.location.origin);
                    
                    // Handle the error
                }
            }, function(stage, expired) {
                switch(stage) {
                    case "PAYMENT_HANDLE_NOT_CREATED": // Handle the scenario
                    case "PAYMENT_HANDLE_CREATED": // Handle the scenario
                    case "PAYMENT_HANDLE_REDIRECT": // Handle the scenario
                    case "PAYMENT_HANDLE_PAYABLE": // Handle the scenario
                    default: // Handle the scenario
                }
            });
    }
		