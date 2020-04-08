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

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
    //console.log(req.body.crypto);
    var crypto = req.body.crypto;
    var fiat =  req.body.fiat;
    var baseURL = "https://apiv2.bitcoinaverage.com/indices/global/ticker/";
    var finalURL = baseURL + crypto +fiat;
    request(finalURL , function (error, response,body) {
    restClient.getTickerDataPerSymbol('global', crypto+fiat, function(response) {
        console.log(response);
        // var data = JSON.parse(response);
        // var price = data.last;
        // console.log("your price is" + price);
    }, function(error){
        console.log(error);
    }) ;
    });
});
app.listen(5000, function () {
    console.log("Server is running on port 5000.");
});