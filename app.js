var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var PubNub = require('pubnub');

//Provide the absolute path to the dist directory.
app.use(express.static('./dist'));

//On get request send 'index.html' page as a response.
app.get('/', function(req, res) {
   res.sendfile('index.html');
});

io.on('connection', function (socket) {
    pubnub = new PubNub({
        subscribeKey : 'sub-c-78806dd4-42a6-11e4-aed8-02ee2ddab7fe'
    })

    pubnub.addListener({
        message: function(message) {
            var tweet = message.message;
            if(tweet.place && tweet.place.country_code == 'US') {
                var x = new Date(tweet.created_at);
                var formatted =  (x.getHours()) + ':' + (x.getMinutes()) + ':' + (x.getSeconds()) + ':' + (x.getMilliseconds());
                var strData = {
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
