var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazon_db"
});

function runProgram() {
  displayTable();
  setTimeout(bezos, 3000);
}

function bezos() {
  inquirer
    .prompt([
      {
        name: "itemPicked",
        type: "input",
        message: "What would you like to buy today? Select using ID"
      },
      {
        name: "amount",
        type: "input",
        message: "How many would you like to buy?"
      }
    ])
    .then(function(response) {
      purchaseItem(response.itemPicked, response.amount, setProfit);
      setTimeout(displayTable, 2000);
    });
}

function displayTable() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    // Log all results of the SELECT statement
    for (var i = 0; i < res.length; i++) {
      console.log(
        "Item ID-",
        res[i].item_id,
        " Product-",
        res[i].product_name,
        " Price-",
        res[i].price,
        " Quantity-",
        res[i].stock_quantity,
        "Product Sales-",
        res[i].product_sales
      );
    }
  });

  //connection.end();
}

function purchaseItem(itemNum, numPurchased, callback) {
  connection.query(
    "SELECT * FROM products WHERE ?",
    [{ item_id: itemNum }],
    function(err, res) {
      if (err) throw err;
      // Log all results of the SELECT statement
      //console.log("hello");

      if (numPurchased > res[0].stock_quantity) {
        console.log("Insufficient quantity!");
      } else {
        newStockAmt = res[0].stock_quantity - numPurchased;
        updateInventory(itemNum, newStockAmt);
        callback(itemNum, numPurchased);
      }
    }
  );
}

function updateInventory(thatItem, newValue) {
  var query = connection.query(
    "UPDATE products SET ? WHERE ?",
    [
      {
        stock_quantity: newValue
      },
      {
        item_id: thatItem
      }
    ],
    function(err, res) {
      if (err) {
        throw err;
      }
    }
  );
}

function setProfit(itemNum, numPurchased) {
  var query = connection.query(
    "UPDATE products SET product_sales = " + numPurchased + "* price WHERE ?",
    [
      {
        item_id: itemNum
      }
    ],
    function(err, res) {
      if (err) {
        throw err;
      }
    }
  );
}
//displayTable();
// bezos();
runProgram();