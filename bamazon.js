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
        return !isNaN(value)
        if(isNaN(value) == false && parseInt(value) <= res.length && parseInt(value) > 0){
          return true;
        } else{
          return false;
        }
      }
    }
    ]).then(function(value){
      console.log(inventory.product_id)
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
      console.log(ans, value)
    })

}

      var whatToBuy = (ans.id)-1;
      var howMuchToBuy = parseInt(ans.qty);
      var grandTotal = parseFloat(((res[whatToBuy].Price)*howMuchToBuy).toFixed(2));

      if(res[whatToBuy].StockQuantity >= howMuchToBuy){

        connection.query("UPDATE Products SET ? WHERE ?", [
        {StockQuantity: (res[whatToBuy].StockQuantity - howMuchToBuy)},
        {ItemID: ans.id}
        ], function(err, result){
            if(err) throw err;
            console.log("Success! Your total is $" + grandTotal.toFixed(2) + ". Your item(s) will be shipped to you in 3-5 business days.");
        });

        connection.query("SELECT * FROM Departments", function(err, deptRes){
          if(err) throw err;
          var index;
          for(var i = 0; i < deptRes.length; i++){
            if(deptRes[i].DepartmentName === res[whatToBuy].DepartmentName){
              index = i;
            }
          }
          
          connection.query("UPDATE Departments SET ? WHERE ?", [
          {TotalSales: deptRes[index].TotalSales + grandTotal},
          {DepartmentName: res[whatToBuy].DepartmentName}
          ], function(err, deptRes){
              if(err) throw err;
          
          });
        });

      } else{
        console.log("Sorry, there's not enough in stock!");
      }

      reprompt();
    }
}
}

function reprompt(){
  inquirer.prompt([{
    type: "confirm",
    name: "reply",
    message: "Would you like to purchase another item?"
  }]).then(function(ans){
    if(ans.reply){
      start();
    } else{
      console.log("See you soon!");
    }
  });
}

start();