
var nano = require('nano')
    , twitter = require('ntwitter')
    , http = require('http')
    , config = require('./config')
    , utils = require('./utils')
 	    
var app = module.exports 
  
// set up couchdb stuff.. 
  
nano = nano(config.couchdb.server);
var all_db = nano.use(config.couchdb.all_db);
var geo_db = nano.use(config.couchdb.geo_db);

// FIXME add support for auto inserting or updating by tweet_id
//       as it's a *much* more stable way of ensuring you dont get dupes

function insert_doc_in_db(db, doc, tried) {
    db.insert(doc,
      function (error,http_body,http_headers) {
        if(error) {
            return console.log(error);
        }
        console.log('inserted OK');
    });
 }

// set up ntwitter object..
var t = new twitter({
	consumer_key: config.twitterapi.consumer_key,
	consumer_secret: config.twitterapi.consumer_secret,
	access_token_key: config.twitterapi.access_token_key,
	access_token_secret: config.twitterapi.access_token_secret,
});


// actual program 'loop'..

// purpose of this dummy listener is just to stop nodejitsu from killing the service with a
// 'Script took too long to listen on a socket' error.. maybe do something with this later anyway
http.createServer().listen(8080);

// bounding box set up in config.js
// this one gets too much data so need to add per-bar filters b4 we use it
//t.stream('statuses/filter',  {'locations': config.geo.nyc_bounds}, function(stream) {

t.stream('statuses/filter',  {'locations': config.geo.sandy_bounds}, function(stream) {
  stream.on('data', function (data) {
    data.doc_type = 'tweet';
    data.doc_type_version = '0.7';
    if ((data.coordinates) && (data.coordinates.coordinates)) {
    	data.lat = data.geo.coordinates[0];
    	data.lon = data.geo.coordinates[1];
        data.has_geo = "point";
    } else if ((data.geo) && (data.geo.coordinates)) {
    	data.lat = data.geo.coordinates[1];
    	data.lon = data.geo.coordinates[0];
        data.has_geo = "point";
    } else if ((data.place) && (data.place.bounding_box)) {
        data.has_geo = "box";
        data.box = data.place.bounding_box;
    }
    else {
    }

    if (data.retweeted_status) {
         console.log(" skipping retweet: " + data.text);
    }

    //nb sometimes it comes pre-loaded with geo as lat/lon
    //else if ((data.lat) && (data.lon)) {
    //should copy this option over to barsaidwhat
    
    if (data.has_geo)
    {
        if (data.text.match(/sandy/)) {
            // only geo tagged data mentioning sandyhere
            insert_doc_in_db(geo_db, data,0);
            console.log(" tweet (geo " + data.has_geo + "): " + data.text);
           }
        else {
      //      console.log(" skipping non sandy: " + data.text);
        }
    }
    //just everything in here
    //insert_doc_in_db(all_db, data, 0)
  });
  stream.on('error', function (protocol, errCode) {
	   //FIXME after code is deployed to nodejitsu you can still access logs... unfortunately
	   //      usual twitter errors doesnt tell you much as to what went wrong
	   console.log('ERROR FROM TWITTER API:' + protocol + ":" + errCode);
  });
  console.log('tweet monitor service started (i hope) ..');
});

//
//var bounding_box = config.geo.wlg_bounding_box;
//t.stream('statuses/filter',  {'locations': bounding_box}, function(stream) {
//  stream.on('data', function (data) {
//    data.doc_type = 'tweet'
//    data.doc_type_version = '0.6'
//    data.rough_geo = "wlg"
//	console.log("wlg tweet: " + data.text);
//    insert_doc(data,0);
//  });
//  stream.on('error', function (protocol, errCode) {
//	   //FIXME after code is deployed to nodejitsu you can still access logs... unfortunately
//	   //      usual twitter errors doesnt tell you much as to what went wrong
//	   console.log('ERROR FROM TWITTER API:' + protocol + ":" + errCode);
//  });
//  console.log('wlg monitor service started (i hope) ..');
//});

