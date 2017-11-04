var mysql = require('mysql');
var inquirer = require('inquirer');
require('console.table');


var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "bamazon_DB"
})

connection.connect(function(err){
  if(err) throw err;
  start();
})

function start(){
connection.query('SELECT * FROM Products', function(err, res){
  if(err) throw err;
  for(var i = 0; i<res.length;i++){
    console.log("ID: " + res[i].item_id + " | " + "Product: " + res[i].product_name + " | " + "Department: " + res[i].department_name + " | " + "Price: " + res[i].price + " | " + "QTY: " + res[i].stock_quantity);
    console.log('--------------------------------------------------------------------------------------------------')
  }
  console.table(res);
  pickId(res);
  })
}


function pickId(inventory) {
  inquirer.prompt([
    {
      type: "input",
      name: "id",
      message: "What is the ID of the product you would like to purchase?",
      validate: function(value){
        if(isNaN(value) == false && parseInt(value) <= inventory.length && parseInt(value) > 0){
          return true;
        } else{
          return false;
        }
      }
    }
    ]).then(function(value){
      pickQuantity(value)
    })
}

function pickQuantity(ans) {
  inquirer.prompt([
    {
      type: "input",
      name: "qty",
      message: "How much would you like to purchase?",
      validate: function(value){
        return !isNaN(value)
        if(isNaN(value)){
          return false;
        } else{
          return true;
        }
        return(value)
      }
    }

    ]).then(function(value){
      purchaseItem(ans.id, value.qty, start);
    })

}

     
function purchaseItem(itemId, numPurchased, callback) {
  connection.query(
    "SELECT * FROM products WHERE ?",
    [{ item_id: itemId }],
    function(err, res) {
      if (err) throw err;
      // Log all results of the SELECT statement
      //console.log("hello");

      if (numPurchased > res[0].stock_quantity) {
        console.log("Insufficient quantity!");
        callback();
      } else {
        newStockAmt = res[0].stock_quantity - numPurchased;
        updateInventory(itemId, newStockAmt);
        callback(itemId, numPurchased);
      }
    }
  );
}

function updateInventory(selectedItem, newValue) {
  var query = connection.query(
    "UPDATE products SET ? WHERE ?",
    [
      {
        stock_quantity: newValue
      },
      {
        item_id: selectedItem
      }
    ],
    function(err, res) {
      if (err) {
        throw err;
      }
    }
  );
}

function setProfit(itemId, numPurchased) {
  var query = connection.query(
    "UPDATE products SET product_sales = " + numPurchased + "* price WHERE ?",
    [
      {
        item_id: itemId
      }
    ],
    function(err, res) {
      if (err) {
        throw err;
      }
    }
  );
}

