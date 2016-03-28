var express = require('express');
var teslams = require('teslams');
var tesla = require('./tesla.js');
var util = require('util');
var fs = require('fs');
var app = express();

var port = 3000;

app.use('/api', tesla);

app.set('port', process.env.PORT || port);
app.use(express.static(__dirname + "/public"));
app.use('/*', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});


app.listen(port, function() {
    console.log('listening on port: '+ port);
});

//////////////////////////////////////////////////////////////////////////////////////////////////