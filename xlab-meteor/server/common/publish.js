Meteor.publish("userData", function() {
    Meteor.log.info('Publishing userData');
    return Users.find({
        userId: this.userId
    });
});

/*var net = Npm.require('net');
var result;
var HOST = '127.0.0.1';
var PORT = 6969;*/

var PORT = 9997;
//var HOST = '192.168.1.82';
var HOST='10.0.0.126';
var dgram = Npm.require('dgram');
var server = dgram.createSocket('udp4');
var result;
//on startup add the default metadata into the collection
Meteor.startup(function() {

    Metadata.upsert({}, {
        $set: {meta : orch_time_data}
    }, {
        upsert: true
    }) 

    Updatedata.upsert({}, {
        $set: {meta : orch_time_data}
    }, {
        upsert: true
    })       

    OrchVideos.upsert({}, {
        $set: {videos : orchDefaultVideos}
    }, {
        upsert: true
    })
    
    Dictionary.upsert({}, {
        $set: {dict : orch_dict_data}
    }, {
        upsert: true
    })


server.on('listening', function () {
    var address = server.address();
    console.log('UDP Server listening on ' + address.address + ":" + address.port);
});

server.on('message', function (message, remote) {
    console.log(remote.address + ':' + remote.port +' - ' + message);
    result=message;
});

server.bind(PORT, HOST);
console.log('Server listening on ' + HOST +':'+ PORT);

Meteor.log.info('Initializing orchestration videos, metadata and dictionary');

});



 Meteor.methods({
        foo: function () {
         var send=result;
         result='NULL';  
         return send.toString();
        },
    });


 Meteor.methods({
         send: function (name) {
         server.send(name, 0, name.length, 8888, '10.0.0.126', function(err, bytes) {
         //server.send(name, 0, name.length, 8888, '127.0.0.1', function(err, bytes) {
         if (err) throw err;
         console.log('UDP message sent to ' + HOST +':'+ PORT);
        });
        },
    });

Meteor.publish("metadataInfo", function() {
    Meteor.log.info('Publishing metadataInfo');
    return Metadata.find({});
});

Meteor.publish("updateDataInfo", function() {
    Meteor.log.info('Publishing updateDatainfo');
    return Updatedata.find({});
});

Meteor.publish("orchVideos", function() {
    Meteor.log.info('Publishing orchVideos');
    return OrchVideos.find({});
});

Meteor.publish("dict", function() {
    Meteor.log.info('Publishing dictionary');
    return Dictionary.find({});
});

