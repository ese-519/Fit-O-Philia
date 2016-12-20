    Template.videoDetails.helpers({

        moduleName: function() {
            return Session.get('moduleName');
        },

        videoList: function() {

          
            //Session.set('module', 'xlab_module_1');
            var module = Session.get('moduleId');
            //console.log('module: ' + module);
            if (module != undefined) {
                //dynamic fetch from videos collection
                if (module == 'xlab_module_4') {
                   var vids = OrchVideos.findOne({});   

                   //generate array for displaying the videos
                    videoArray = [];
                    for(key in vids.videos){

                    //console.log("key is "+key);
                   // videoArray.push(vids.videos["169660825"]);
                    videoArray.push(vids.videos[key]); 
                      
                   }              

                   Meteor.log.debug('videoArray:\n'+JSON.stringify(videoArray));
                   return videoArray;
                } else {
                    // static fetch from config files
                    Meteor.log.info('module: ' + module);
                    if (config.video[module] != undefined) {
                        return config.video[module].videos;
                    } else {
                        Meteor.log.error('Configuration for module ' + module + ' not available');
                    }
                }
            } else {
                Meteor.log.error('Module not set');
            }
        }
    });

    var falseVideo="NULL";
    var id;
    var id1;
    var idTrack;
    var interID;
    var name;
    var videoSource;
    var videoSource1;
    var metaSource;
    var check='NULL';
    var pauseId;
    var urlTracker;
    var urlID;
    var count=0;
    var textOverlay="";
    var vid=["",""];
    var vidTracker="NULL"

    Template.videoDetails.events({
        'click #play': function(e) {
            e.preventDefault(); //this will prevent the link trying to navigate to another page
            var href = $(this).attr("href"); //get the href so we can navigate later
            id = $(this).attr("id");
            id1 = $(this).attr("id");
            name = $(this).attr("name");
            videoSource = $(this).attr("videoSource");
            videoSource1 = $(this).attr("videoSource");
            console.log('id: ' + id + ' name: ' + name + ' videoSource: ' + videoSource + ' metaSource: ' + metaSource);
            Session.set('renderTemplate', 'videoPlayer');
            Session.set('videoName', name);
            //addVideoTag(videoSource);
        },
        'click #edit': function(e) {
            e.preventDefault(); //this will prevent the link trying to navigate to another page
            var href = $(this).attr("href"); //get the href so we can navigate later
            id = $(this).attr("id");
            name = $(this).attr("name");
            videoSource = $(this).attr("videoSource");
            console.log('is this working')
            //metaSource = $(this).attr("metaSource");

            console.log('LOOK AT THIS id: ' + id + ' name: ' + name + ' videoSource: ' + videoSource );
            Session.set('videoName', name);
            Session.set('videoSource', videoSource);
            Session.set('id' , id);
            Session.set('renderTemplate', 'orchestration');                
        },
        'click #addvideo': function() {
          Session.set('renderTemplate', 'addvideo');
        },
        'click #mainMenu': function() {
          Session.set('renderTemplate', 'mainMenu');
        }
    });


    Template.videoPlayer.rendered = function() {
        Meteor.clearInterval(interID);

        var module = Session.get('moduleId');
        if (module != undefined) {
            Meteor.log.info('module: ' + module);
            if (config.video[module] != undefined) {
                console.log('module: ' + module + ' \nconfig: ' + JSON.stringify(config.video[module]));
                console.log('source :' + videoSource + 'id: ' + id);
                addVideoTag(videoSource, config.video[module]);
                //getMetadata(metaSource, config.video[module].onUpdateTimestamp);
                if(count%2==0)
                    vid[0]=videoSource
                else
                    vid[1]=videoSource;

                count=count+1;
                urlID=id;
                getMetadata(id, config.video[module].onUpdateTimestamp);
            } else {
                Meteor.log.error('Configuration for module ' + module + ' not available');
            }
        } else {
            Meteor.log.error('Module not set');
        }
       
    }

    //add video player
    function addVideoTag(videoURL, videoConfig) {
        if (videoURL != null) {

            var controls = '';
            var autoplay = '';
            if (videoConfig.controls == 'on') {
                controls = 'controls';
            }
            
            if (videoConfig.autoplay == 'on') {
                autoplay = 'autoplay';
            }
            
                
              urlTracker=videoURL;  
              var array=videoURL.split("/");
              var res=array[2].split(".");
              Meteor.call('send', 'filename|'+res[0], function(err) {
              //Session.set('serverDataResponse', videoURL);
              console.log("sending name "+videoURL);
              });

                /*Meteor.call('send', function (error) { 
                Meteor.Session.set("videoName",videoURL);
                console.log("vid name set");
               } );*/

            console.log("before html");

            $("#videoHolder").html(
                '<div class="flex-video">' +
                '<video id="videoTag" width="400" ' + autoplay + ' ' + controls + '>' +
                '<source src="' + videoURL + '" type="video/mp4"></source>' +
                //'<track id="nav" kind="chapters" label="English subtitles" src="' + videoDetails + '" srclang="en" default></track>' +
                '</video>' +
                '</div>'
            );
            
            $("#videoTag").bind("ended", function() {
                Meteor.call('videoEnd');
            });

        }
    }

    function getMetadata(videoId, serverMethod) {
        var meta = Updatedata.findOne({});
        console.log(meta);
        //console.log(meta);
        if (meta.meta[videoId] != undefined) {
            Meteor.log.info('Metadata for videoId ' + videoId + ' found');
            bindMetaDataToVideo(meta.meta[videoId], serverMethod);
        } else {
            Meteor.log.error('Metadata for videoId ' + videoId + ' not found');
        }
    }

    // function getMetadata(metaDataURL, serverMethod) {
    //     $.ajax({
    //         dataType: "json",
    //         type: 'GET',
    //         url: metaDataURL,
    //         success: function(response) {
    //             bindMetaDataToVideo(response, serverMethod);
    //             console.log('metadata: ' + response);
    //         }
    //     });
    // }

  

    function bindMetaDataToVideo(jsonData, serverMethod) {
        //for keeping track of time event already displayed, since timeupdate call can be 
        //triggered multiple times within a single second depending on the system.
        // Create a server instance, and chain the listen function to it

       
        var alreadyDisplayed = [];
        var dictionary = Dictionary.findOne({});
        var interval;
        var check;
        //console.log(dictionary.dict);
      
        $("#videoTag").bind("timeupdate", function() {
         // check="NULL"
           /*var fade_out = function() {
           $("#text-overlay").fadeOut().empty();
            }
            setTimeout(fade_out, 15000);*/
            
            Meteor.clearInterval(pauseId);
            var time = parseInt(this.currentTime, 10);
           
            if (jsonData.hasOwnProperty(time) && alreadyDisplayed.indexOf(time) == -1) {
                alreadyDisplayed.push(time);

                //push information to second screen by adding details to collection
                //which is being viewed through second screen template
                //console.log('id: ' + id


                Meteor.call('foo', function (error, result) { 
                check=result.toString();
                console.log("in bind "+check);
               } );


               Meteor.call('send', 'num|'+String(time), function(err) {
               console.log("sending time "+String(time));
               });

                console.log("before checks: "+check);
                
                if(check=="pause"){
                  var chk;
                   $('#videoTag')[0].pause();  
                    
                    var id=Meteor.setInterval(function(){
                    console.log("the id is "+id);
                    interID=id;
                    Meteor.call('foo', function (error, result) { 
                    chk=result.toString();
                    console.log("in interval "+chk);
                   });

                    if(chk=="startOver"){
                      //$('#videoTag')[0].play();
                    textOverlay="startOver"
                    console.log("In play "+urlTracker);
                    var module = Session.get('moduleId');
                    videoSource = urlTracker;
                    Session.set('videoSource', videoSource);
                    addVideoTag(videoSource, config.video[module]);
                    getMetadata(urlID, config.video[module].onUpdateTimestamp);
                    check='NULL';  
                    Meteor.clearInterval(id);
                    }

                    if(chk=="play")
                    {
                        $('#videoTag')[0].play();
                        Meteor.clearInterval(id);
                    }

                   },500);

                  }

                 else if(check=="switchLow")
                  {
                    //console.log("beginner");
                    falseVideo=urlTracker;
                    var module = Session.get('moduleId');
                    videoSource = "/videos/countDown.mp4";
                    id = 169660829;
                    Session.set('videoSource', videoSource);
                    addVideoTag(videoSource, config.video[module]);
                    getMetadata(id, config.video[module].onUpdateTimestamp);
                    check="NULL"; 
                  }

                 if(urlTracker=="/videos/cardio.mp4")
                 {
                    if(String(time)=="32")
                      {
                        vidTracker="/videos/dumbbellCurl.mp4";
                        idTrack=169660826
                        var module = Session.get('moduleId');
                        videoSource = "/videos/3Timer.mp4";
                        id = 169660830;
                        Session.set('videoSource', videoSource);
                        addVideoTag(videoSource, config.video[module]);
                        getMetadata(id, config.video[module].onUpdateTimestamp);
                        check='NULL';
                      }  
                 }

                 if(urlTracker=="/videos/3Timer.mp4")
                 {
                    if(String(time)=="4")
                      {
                        var module = Session.get('moduleId');
                        videoSource = vidTracker;
                        id = idTrack;
                        Session.set('videoSource', videoSource);
                        addVideoTag(videoSource, config.video[module]);
                        getMetadata(id, config.video[module].onUpdateTimestamp);
                        check='NULL';
                        vidTracker="NULL"
                        idTrack=0;
                      }  
                 }


                 console.log("URL is "+urlTracker);
                 if(urlTracker=="/videos/countDown.mp4")
                 {
                    if(String(time)=="16")
                      {
                        var module = Session.get('moduleId');
                        videoSource = falseVideo;
                        if(falseVideo=="/videos/dumbbellCurl.mp4")
                            id = 169660826;
                        else if(falseVideo=="/videos/cardio.mp4")
                            id = 169660825;
                        else if(falseVideo=="/videos/coolDown.mp4")
                            id = 169660828;
                        else if(falseVideo=="/videos/legLunge.mp4")
                            id = 169660827;
                        Session.set('videoSource', videoSource);
                        addVideoTag(videoSource, config.video[module]);
                        getMetadata(id, config.video[module].onUpdateTimestamp);
                        check='NULL'; 
                      }  
                 }

                 if(urlTracker=="/videos/dumbbellCurl.mp4")
                 {
                    if(String(time)=="31")
                      {
                        vidTracker="/videos/legLunge.mp4";
                        idTrack=169660827
                        var module = Session.get('moduleId');
                        videoSource = "/videos/3Timer.mp4";
                        id = 169660830;
                        Session.set('videoSource', videoSource);
                        addVideoTag(videoSource, config.video[module]);
                        getMetadata(id, config.video[module].onUpdateTimestamp);
                        check='NULL'; 
                      }  
                 }

                 if(urlTracker=="/videos/legLunge.mp4")
                 {
                    if(String(time)=="32")
                      {
                         vidTracker="/videos/coolDown.mp4";
                        idTrack=169660828
                        var module = Session.get('moduleId');
                        videoSource = "/videos/3Timer.mp4";
                        id = 169660830;
                        Session.set('videoSource', videoSource);
                        addVideoTag(videoSource, config.video[module]);
                        getMetadata(id, config.video[module].onUpdateTimestamp);
                        check='NULL'; 
                      }  
                 }
                
                console.log('Module Id : ' + Session.get('moduleId'));
                console.log('id : ' + id);
                if(event['light'] != undefined){
                  var eventName = event['light'].name;
                  console.log(' Light duration:' + event['light'].duration);
                  console.log('Pattern : ' +eventName);
                }
                 if(event['vest'] != undefined){
                  var eventName = event['vest'].name;
                  console.log(' vest duration:' + event['vest'].duration);
                  console.log('Pattern : ' +eventName);
                }
                 if(event['couch'] != undefined){
                  var eventName = event['couch'].name;
                  console.log(' couch duration:' + event['couch'].duration);
                  console.log('Pattern : ' + eventName);
                }
              
                var moduleId = Session.get('moduleId');
                // if (moduleId == 'xlab_module_3') {
                //     var event = jsonData[time];
                //     var lightEffect = {};
                //     Meteor.log.info('event: ' + JSON.stringify(event));

                //     var eventName = event.name;
                    
                //     //transform abstract event to commands for lights
                //     if (eventName != undefined && dictionary.dict[eventName]) {
                //         lightEffect = dictionary.dict[eventName].light;
                //         Meteor.log.info('Found light effect ' + JSON.stringify(lightEffect));
                //     } else {
                //         Meteor.log.error('Could not find effect ' + eventName + ' in the dictionary');
                //     }
                //     Meteor.call(serverMethod, moduleId, time, lightEffect); //used currently for orch+lights
                // } else {

                    Meteor.call(serverMethod, moduleId, time,event); //used currently for ads
               // }
            }
        });
    }