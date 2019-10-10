var express = require('express');
var path = require('path');
const cors = require('cors')
let grpc = require('grpc');

var app = express();

let protoLoader = require('@grpc/proto-loader');
let packageDefinition = protoLoader.loadSync('../file.proto', {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});
let aproto = grpc.loadPackageDefinition(packageDefinition);

var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200,
}

app.use(cors(corsOptions));

app.listen(3000, function () {
    console.log('success');
});

app.get('/', (req, res) => {
    res.send('testing');
});

app.post('/upload', (req, res) => {
    let temp = new aproto.upload('localhost:50050', grpc.credentials.createInsecure());
    temp.uploadFile(req, (err, response) => {
        res.send(response)
    });
});