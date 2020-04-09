const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const app = express();
const ba = require('bitcoinaverage');

var publicKey = 'YTkwMzYzMmZlOTk3NDllOGI1NTU1ZjczMjk3MjgxMzQ';
var secretKey = 'NjllODQ5ZGVlNTRmNGRjODlkMzNlZGFmMmJmNTdlZWE2ZDUxNTI1OWE2NzQ0ZWYwYjQ3NDFmNTE1ZTM5ZTEzMA';

var restClient = ba.restfulClient(publicKey, secretKey);
var wsClient = ba.websocketClient(publicKey, secretKey);

app.use(bodyParser.urlencoded({
    extended: true
}));
 
// home page
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
    //console.log(req.body.crypto);
    var crypto = req.body.crypto; //accesing the value in dropdown menu using body parser that the user chose at runtime
    var fiat = req.body.fiat;

    restClient.getTickerDataPerSymbol('global', crypto + fiat, function (response) {
        //console.log(response);
        var data = JSON.parse(response); //storing the server response in a data var after converting json string i.e server resp into js object
        var price = data.last; //accessing the last data using .(dot) in js object
        var CurrentDate = data.display_timestamp; //var to store the current date & time
        res.write("<p>The Current date is " + CurrentDate + "</p>");
        res.write("<h1>The Current Price of " + crypto + " is " + price + fiat + "</h1>");
        res.send();
    }, function (error) {
        console.log(error);

    });
});

// price conversion page
app.get("/priceconversion", function (req, res) {
    res.sendFile(__dirname + "/priceconversion.html");
});

app.post("/priceconversion.html", function (req, res) {

    var crypto = req.body.crypto; //accesing the value in dropdown menu using body parser that the user chose at runtime
    var fiat = req.body.fiat;
    var amount = req.body.amount;
    var options = {
        url: "https://apiv2.bitcoinaverage.com/convert/global",
        method: "GET",
        qs: {
            from: crypto,
            to: fiat,
            amount: amount
        }
    };
    request(options, function (response) {

    
        console.log("done");     
      var data = JSON.parse(response); //storing the server response in a data var after converting json string i.e server resp into js object
      console.log(data);
    // //     var pricee = data.price; //accessing the last data using .(dot) in js object
    // //     var CurrentDate = data.time; //var to store the current date & time
    // //     console.log("hello");
    // //     res.write("<p>The Current date is " + CurrentDate + "</p>");
    // //     res.write("<h1" + amount + crypto + "is currently worth" + pricee + fiat + "</h1>");
    // //     res.send();
    // // });
}
, function (error) {
    console.log(error);

});
});
app.listen(5000, function () {
    console.log("Server is running on port 5000.");
});