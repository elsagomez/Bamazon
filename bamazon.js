var inquirer = require('inquirer');
var mysql = require('mysql');
var Table = require('cli-table');

var connection = mysql.createConnection({
	host: "127.0.0.1",
	port: 3306,
	user: "root",
	password: "Stpvwhxi8247!",
	database: "bamazondb"
});



connection.connect(function(err){
    if (err) {
       throw err;
    // }    else{
    //     console.log("connected as id " + connection.threadId);
    // }
}
});


var showTable = function() {
connection.query("SELECT * FROM products", function(error, results){

	var table = new Table({
    head: ['item_id', 'product_name', 'department_name','price','stock_qty'],
   colWidths: [10, 30, 30, 10, 10]
});
 
// table is an Array, so you can `push`, `unshift`, `splice` and friends 

	for(i=0; i<results.length; i++){

		table.push(
    [(JSON.parse(JSON.stringify(results))[i]["item_id"]),(JSON.parse(JSON.stringify(results))[i]["product_name"]),
    (JSON.parse(JSON.stringify(results))[i]["department_name"]), (JSON.parse(JSON.stringify(results))[i]["price"]),
    (JSON.parse(JSON.stringify(results))[i]["stock_qty"])]);
		};

		console.log("\n" + table.toString());
  
		// console.log(results[i].item_id + " | " + results[i].product_name + " | " + results[i].department_name + " | " + results[i].price + " | " + results	[i].stock_qty);
		// }
		// console.log("-------------------------------------");
		

})
}

var buyProduct = function(){
	console.log("\n");
  inquirer.prompt([
    {
      type: "input",
      message: "What item do you want to buy? (please enter item ID)",
      name: "item"
    },
      {
      type: "input",
      message: "Please enter the quantity",
      name: "qty",
      validate: function(value){
      	if(isNaN(value) === false){
      		return true;
      	}
      		return false;
      }
    }

      ]).then(function(answer){

    
      connection.query("SELECT * FROM products WHERE item_id=?", [answer.item], function(error, results) {

      if (error) throw error;
    		console.log("\nPurchasing: " + answer.qty + "units of " + results[0].product_name );

   	if (results[0].stock_qty >= answer.qty){

   		var totalItem =  results[0].price * answer.qty;
  	console.log("\nYour total for this product is: $" + totalItem.toFixed(2) + "\n");

   		var finalQty= results[0].stock_qty - answer.qty;

   		connection.query("UPDATE products SET ? WHERE ?",[
   		{stock_qty: finalQty},
   		{item_id: answer.item}
   		], function(error, results){

   		})

   		
   		
  	continueShopping();
}
  		
  	
  	else{
  		console.log("\nInsufficient quantity. Please enter a lower number.\n");

  		continueShopping();

  	}
  	

  	})

    });

  	
   }


var continueShopping = function(){
  inquirer.prompt([
    {
      type: "confirm",
      message: "Do you want to order another item?",
      name: "anotherItem",
      default: true
    }
   ]).then(function(data){
   		if(data.anotherItem === true){
   			showTable();
   			setTimeout(buyProduct,1000);

   			}
   		else{
   			console.log("Thank you for using Bamazon");
   			process.exit(0);
   		}
   })
};

 

showTable();

setTimeout(buyProduct,1000);
