// Initialization
var express = require('express');

// Required if we need to use HTTP query or post parameters
var bodyParser = require('body-parser');
var validator = require('validator'); // See documentation at https://github.com/chriso/validator.js
var app = express();
// See https://stackoverflow.com/questions/5710358/how-to-get-post-query-in-express-node-js
app.use(bodyParser.json());
// See https://stackoverflow.com/questions/25471856/express-throws-error-as-body-parser-deprecated-undefined-extended
app.use(bodyParser.urlencoded({ extended: true }));

// Mongo initialization and connect to database
// process.env.MONGOLAB_URI is the environment variable on Heroku for the MongoLab add-on
// process.env.MONGOHQ_URL is the environment variable on Heroku for the MongoHQ add-on
// If environment variables not found, fall back to mongodb://localhost/nodemongoexample
// nodemongoexample is the name of the database
var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/server3';
var MongoClient = require('mongodb').MongoClient, format = require('util').format;
var db = MongoClient.connect(mongoUri, function(error, databaseConnection) {
        db = databaseConnection;
});

// Serve static content
app.use(express.static(__dirname + '/public'));

app.post('/sendLocation', function(request, response) {
        response.header("Access-Control-Allow-Origin", "*");
        response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        var login = request.body.login;
        var lat = Number(request.body.lat);
        var lng = Number(request.body.lng);
        var created_at = Date();

        if(!login || !lat || !lng) {
            response.send({"error":"Whoops, something is wrong with your data!"});
            return;
        }

        var returnData = new Object;

        var checkIn = {
                "login"     : login,
                "lat"       : lat,
                "lng"       : lng,
                "created_at": created_at
        }
        console.log(checkIn);
        db.collection('checkins', function(error, coll) {
                var id = coll.insert(checkIn, function(error, saved) {
                        if (error) {
                                console.log("error adding checkin");
                        }
                        else {
                                console.log("Successfully added checkin");
                        }
            });
        });

        db.collection('landmarks').createIndex({'geometry':"2dsphere"}, function(err, res){
            if(!err) {
                db.collection('landmarks',function(error, coll) {
                    coll.find({geometry:{$near:{$geometry:{type:"Point",coordinates:[lng,lat]},$maxDistance: 1609}}}).toArray(function(landmarkErr, nearestLandmarks) {
                        if(!landmarkErr) {
                            returnData.landmarks = nearestLandmarks;
                            response.send(returnData);
                        }
                        else {
                            console.log("error getting near landmarks");
                            response.send(200);
                        }
                    });
            });
            }
            else {
                console.log("error");
            }
        });
        // db.collection('landmarks', function(error, coll) {
        //     coll.find({geometry:{$near:{$geometry:{type:"Point",coordinates:[lng,lat]},$minDistance: 0,$maxDistance: 1609}}}).toArray(function(err, cursor) {
        //         console.log(cursor);
        //         response.send(200);
        //     });
        // });
        // db.collection('landmarks').find().toArray(function(err, cursor) {
        //     if(!err) {
        //         console.log(cursor);
        //     }
        //     else {
        //         console.log('db error');
        //     }
        // });

        
});

app.get('/checkins.json', function(request, response) {
        response.header("Access-Control-Allow-Origin", "*");
        response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        
        var login = request.query.login;

        if(!login) {
            response.send([]);
            return;
        }

        var toFind = {"login": login};

        db.collection('checkins', function(error, coll) {
                coll.find(toFind).toArray(function(err, cursor) {
                        if (!err) {
                                response.send(cursor);
                        } else {
                                console.log("error");
                        }
                });
        });
});

app.get('/', function(request, response) {
        response.set('Content-Type', 'text/html');
        var indexPage = '<!DOCTYPE HTML><html><head><title>Checkins</title></head><body><h1> Checkins, as hosted by David Bernstein </h1> <h3> Comp 20 - Assignment 3 </h3> <h4> CHECKINS </h4><ul>';
        db.collection('checkins', function(er, collection) {
                collection.find().sort({"created_at":1}).toArray(function(err, checkins) {
                        if (!err) {
                                for(var i = 0; i < checkins.length; i++) {
                                    indexPage += '<li>' + checkins[i].login + " checked in at " + checkins[i].created_at + '</li>';
                                    indexPage += '<ul> <li> Latitude: ' + checkins[i].lat + '</li>';
                                    indexPage += '<li> Longitude: ' + checkins[i].lng + '</li></ul>';
                                }
                                indexPage += '</ul></body></html>';
                                response.status(200);
                                response.send(indexPage);
                        } else {
                                response.send('<!DOCTYPE HTML><html><head><title>What Did You Feed Me?</title></head><body><h1>Whoops, something went terribly wrong!</h1></body></html>');
                        }
                });
        });
});

// Oh joy! http://stackoverflow.com/questions/15693192/heroku-node-js-error-web-process-failed-to-bind-to-port-within-60-seconds-of
app.listen(process.env.PORT || 3000);
