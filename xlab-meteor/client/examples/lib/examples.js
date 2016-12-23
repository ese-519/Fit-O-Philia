Template.examples.helpers({
    data: function() {
        return Session.get('jsonData');
    }
});

Template.examples.events({
    'click #findVideos': function(e) {
        var videos = OrchVideos.findOne({});
        Session.set('jsonData', JSON.stringify(videos));
    },
    'click #insertVideo': function(e) {
        var vid = OrchVideos.findOne({});

        var id = "3";
        var jsonToInsert = {
            "id": id,
            "videoSource": "/videos/macys.mp4",
            "metaSource": "/metadata/macys.json",
            "name": "Macy Orch",
            "rating": "5",
            "thumbnail": "/images/macys.jpg"
        };
        vid.videos[id] = jsonToInsert;
        console.log(vid);
        OrchVideos.update({
            _id: vid._id
        }, {
            $set: {
                videos: vid.videos
            }
        });
    },
    'click #findMetadata': function(e) {
        var metaData = Metadata.findOne({});
        Session.set('jsonData', JSON.stringify(metaData));
        //console.log(JSON.stringify(meta));
    },
    'click #insertMetadata': function(e) {
        var metaData = Metadata.findOne({});

        var id = "TestMetaData";
        var jsonToInsert = {
            "0": [{
                "id": "none",
                "name": "none",
                "type": "abstract_event"
            }]
        };

        metaData.meta[id] = jsonToInsert;
        console.log(metaData);
        Metadata.update({
            _id: metaData._id
        }, {
            $set: {
                meta: metaData.meta
            }
        });
    },
    'click #findDict': function(e) {
        var dictData = Dictionary.findOne({});
        Session.set('jsonData', JSON.stringify(dictData));
        //console.log(JSON.stringify(meta));
    },
    'click #insertDict': function(e) {
        var dictData = Dictionary.findOne({});

        //var id = "TestDictionary";
        var jsonToInsert = {
            "TestDictionary": {
                "light": {
                    "addr": {
                        "duration": "4000",
                        "pattern": "wave",
                        "color": "0,65535,0",
                        "direction": "right",
                        "shape": "none"
                    },
                    "nonAddr": {
                        "duration": "3000",
                        "pattern": "on",
                        "color": "0,65535,0"
                    }
                },
                "vest": {},
                "couch": {}
            }
        };

        //dictData.dict[id] = jsonToInsert;
        console.log(dictData);
        Dictionary.update({
            _id: dictData._id
        }, {
            $set: {
                dict: jsonToInsert
            }
        });
    }
});
