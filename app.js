var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var PubNub = require('pubnub');
var AWS = require('aws-sdk');
var KinesisReadable = require('kinesis-streams').KinesisReadable;
var streamName = 'development-prod-echo-global-stream';
var keyword = 'fifa';

//Provide the absolute path to the dist directory.

app.use(express.static('./dist'));

//On get request send 'index.html' page as a response.
app.get('/', function(req, res) {
    if (req.query.filter) {
        keyword = req.query.filter.toLowerCase();
    }
    console.log('FILTER', keyword);
    res.sendfile('index.html');
});

// io.on('connection', function (socket) {
//     console.log('Connection received');
//     var kinesisOptions = {
//         region: 'eu-west-1'
//     }
//     var client = new AWS.Kinesis(kinesisOptions);

//     var options = {
//         interval: 1000,
//         parser: (data) => {
//             console.log('PARSER DATA', data);
//             return Buffer.from(data, 'base64').toString();
//         },
//         ShardId: 'shardId-000000000001',
//         ShardIteratorType: 'TRIM_HORIZON'
//     }

//     var reader = new KinesisReadable(client, streamName, options);

//     reader.on('data', function (data) {
//         console.log('--- GOT DATA', data);
//         var parsed;
//         try {
//             parsed = JSON.parse(data);
//         } catch (e) {
//             console.log('EXCEPTION', e);
//         }
//     });

//     var dummyData = {
//         "date": '2018',
//         "text": 'This is some test text',
//         "user": {
//             "name": 'Russell Hill',
//             "profile": 'Profile'
//         }
//     }

//     reader.on('checkpoint', function (checkpoint) {
//         console.log('--- GOT CHECKPOINT', checkpoint);
//         socket.emit('data', dummyData);
//     })
// });


io.on('connection', function (socket) {
    pubnub = new PubNub({
        subscribeKey : 'sub-c-78806dd4-42a6-11e4-aed8-02ee2ddab7fe'
    })

    pubnub.addListener({
        message: function(message) {
            var tweet = message.message;
            if(tweet.text && tweet.text.toLowerCase().indexOf(keyword) > -1) {
                var x = new Date(tweet.created_at);
                var formatted =  (x.getHours()) + ':' + (x.getMinutes()) + ':' + (x.getSeconds()) + ':' + (x.getMilliseconds());
                var strData = {
                    "filter": keyword,
                    "date": formatted,
                    "text": tweet.text,
                    "user": {
                        "name": tweet.user.screen_name,
                        "profile": tweet.user.profile_image_url
                    }
                }
                socket.emit('tweet', strData);
            };  
        }
    });

    console.log("Subscribing..");

    pubnub.subscribe({
        channels: ['pubnub-twitter'] 
    });
});

//server listening on port 3003
http.listen(3003, function() {
   console.log('listening on *:3003');
});
