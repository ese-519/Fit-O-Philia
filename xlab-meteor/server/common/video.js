Meteor.methods({
    //this method sends the new timestamp to the meteor server using the video id
    'updateTimestamp': function( moduleId, timestamp, videoId ) {

        var setObj = {};
        var myevents = Updatedata.findOne({});
        Meteor.log.debug('got moduleId: '+ moduleId + ' timestamp:' + timestamp + ' videoId: ' + videoId);
        if(myevents.meta[videoId][timestamp] != null) {
            setObj[moduleId + '.timestamp'] = timestamp;   
            setObj[moduleId + '.event'] = myevents.meta[videoId][timestamp];     
            setObj[moduleId + '.currentTime'] = Date.now();


            Users.upsert({
                userId: Meteor.userId()
            }, {
                $set: setObj
            }, {
                upsert: true
            })
        }
    },
    'updateTimeAndEvent': function(moduleId, timestamp, event) {

        var setObj = {};
        Meteor.log.debug('Module : ' + moduleId + ' timestamp: ' + timestamp+ " event: "+JSON.stringify(event));
        moduleIdTemp = 'xlab_module_3'; //since lights currently read from only xlab_module_3
        setObj[moduleIdTemp + '.timestamp'] = timestamp;        
        setObj[moduleIdTemp + '.event'] = event;        
        setObj[moduleIdTemp + '.currentTime'] = Date.now();        

        //setObj[moduleId + '.timestamp'] = timestamp;        
        //setObj[moduleId + '.event'] = event;        
        //setObj[moduleId + '.currentTime'] = Date.now();        
        
        Users.upsert({
            userId: Meteor.userId()
        }, {
            $set: setObj
        }, {
            upsert: true
        })
    },
    //sent at the end of the video
    'videoEnd': function(moduleId) {

        var setObj = {};
        //setObj[moduleId + '.timestamp'] = 0;

        Meteor.log.debug('moduleId: ' + moduleId + ' config.video[moduleId]: ' + JSON.stringify(config.video[moduleId]));
        //check for fields which need to be updated
        if (config.video[moduleId] != undefined) {
            var fieldChanges = config.video[moduleId].videoEnd;
            Meteor.log.debug('fieldChanges: ' + JSON.stringify(fieldChanges));

            for (var key in fieldChanges) {
                if (fieldChanges.hasOwnProperty(key)) {
                    setObj[moduleId + '.' + key] = fieldChanges[key];
                }
            }
            Meteor.log.info('videoEnd called, following changes being applied:\n' + JSON.stringify(setObj));

        }

        //setObj.time = Date.now();

        Users.update({
            userId: Meteor.userId()
        }, {
            $set: setObj
        });
    }

    
})

/**
 * this method can be replaced later based on the needs of how
 * pose data needs to be fetched/processed/stored in order to 
 * generate pose content. Currently its read from a pre-defined
 * collection called pose
 * 
 * @param  {[type]} videoId [description]
 * @param  {[type]} time    [description]
 * @return {[type]}         [description]
 */
function extractPose(videoId, time) {
    return pose[videoId][time];
}
