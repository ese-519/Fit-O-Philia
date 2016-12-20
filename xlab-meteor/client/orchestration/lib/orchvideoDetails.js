  Template.orchvideoDetails.helpers({

      moduleName: function() {
          //return Session.get('moduleName');
            return 'Orchestration Videos';
      },

      videoList: function() {
          //Session.set('module', 'xlab_module_1');
        //  var module = Session.get('moduleId');
          //console.log('module: ' + module);
          var module = 'xlab_module_4';
          if (module != undefined) {
              //dynamic fetch from videos collection
              if (module == 'xlab_module_4') {
                 var vids = OrchVideos.findOne({});   

                 //generate array for displaying the videos
                 videoArray = [];
                 if(vids != undefined){
                 for(key in vids.videos){
                    videoArray.push(vids.videos[key]);  
                 }    
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

  var id;
  var name;
  var videoSource;


  Template.orchvideoDetails.events({
      'click .edit': function(e) {
          e.preventDefault(); //this will prevent the link trying to navigate to another page
          var href = $(this).attr("href"); //get the href so we can navigate later
          id = $(this).attr("id");
          name = $(this).attr("name");
          videoSource = $(this).attr("videoSource");
          //metaSource = $(this).attr("metaSource");

          console.log('id: ' + id + ' name: ' + name + ' videoSource: ' + videoSource );
           Session.set('videoName', name);
          Session.set('videoSource', videoSource);
          Session.set('id' , id);
         Session.set('renderTemplate', 'orchestration');
        
         
      }
  });


  

