var express = require('express');
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');

var app = express();

let grpc = require('grpc');
let protoLoader = require('@grpc/proto-loader');
let packageDefinition = protoLoader.loadSync('../file.proto', {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});
let bproto = grpc.loadPackageDefinition(packageDefinition);

function uploadFile(call, callback) {
    console.log(call);
    console.log(call.request.images);
    var form = new formidable.IncomingForm();
    form.parse(call.request.images);
    form.on('fileBegin', function (name, file) {
        file.path = __dirname + './uploads/' + file.name;
    });

    form.on('file', function (name, file) {
        console.log('Uploaded ' + file.name);
    });
    fs.writeFile('image.png', call.request.images);
    callback(null, {message: call.request});
}

(function() {
    let server = new grpc.Server();
    server.addService(bproto.upload.service, {uploadFile: uploadFile});
    server.bind('0.0.0.0:50050', grpc.ServerCredentials.createInsecure());
    server.start();
})();
