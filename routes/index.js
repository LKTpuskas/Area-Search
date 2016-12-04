'use strict';

/**
 * Lorenz Puskas
 */

/**
 * index.js
 * Is the backend for handling the api requests.
 * Requests are sent to the frontend.
 * Backend is used to overcome cors restrictions.
 *
 * APIs used:
 *  PlaceILIve
 *  Youtube
 *  GoogleStreetView
 *  GoogleMaps
 *
 */

var express = require('express');
var router = express.Router();
var Promise = require("bluebird");
var request = require('request-promise');
var Youtube = require('youtube-node');

var counter = 0;

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index.html');

});


router.get('/search', function (req, res) {

    var objToSend = [];
    var apiRequests = [{
        url: 'https://api.placeilive.com/v1/houses/search?q=' + req.query.q
    }];

    Promise.map(apiRequests, function (obj) {
        return request(obj).then(function (body) {
            return JSON.parse(body);
        });
    }).then(function (results) {

        for (var k = 0; k < results.length; k++) { // Loops through the first array

            if (results[k].error == '404') {
                objToSend.push(results[k].error);
                res.send(objToSend);
                console.log(results[k].error);
            } else {
                var obj = results[k];

                for (var j = 0; j < obj.length; j++) {
                    var mergedobj = obj[j];
                    var mergedCat = obj[j].lqi_category;
                    objToSend.push({

                        id: counter++,
                        address: mergedobj.address,
                        lat: mergedobj.lat,
                        lng: mergedobj.lng,
                        lqi_health: mergedCat[0],
                        lqi_safety: mergedCat[1],
                        lqi_transportation: mergedCat[2],
                        lqi_dailylife: mergedCat[3],
                        lqi_sports: mergedCat[4],
                        lqi_entertainment: mergedCat[5],
                        lqi_demographics: mergedCat[6]
                    });
                }

            }
        }

        return results;
    }).then(function () {
        var youTube = new Youtube();

        youTube.setKey(''); // youtube apikey here

        youTube.search(req.query.q, 4, function (error, result) {
            youTube.addParam('order', 'relevance');
            youTube.addParam('regionCode', 'US');
            youTube.addParam('regionCode', 'GB');
            youTube.addParam('regionCode', 'DE');
            if (error) {
                console.log(error);
            }
            else {

                var data = result.items;
                for (var i = 0; i < data.length; i++) {


                    var nestObj = data[i].snippet;
                    console.log(nestObj);
                    var vidId = data[i].id.videoId;
                    if (vidId == null) {
                        console.log(data.error)
                    } else if (vidId !== undefined) {

                        objToSend.push({
                            id: counter++,
                            vidId: vidId
                        });
                    }
                }
            }
            res.send(objToSend);

        });

    }, function (err) {
        console.log(err.message);
        res.send(err.message);
    });
});

module.exports = router;

