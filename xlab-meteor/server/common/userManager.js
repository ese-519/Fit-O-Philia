Meteor.methods({

  //This function is responsible for user information management
  //It checks if the user exists in the 'users' collection
  //if the user does not exist the user is added to the collection
  //else executes the addUserCallback with the userId passed
  'manageUser': function(userId, moduleId) {
    var users = Users.find({
      userId: userId
    }).fetch().length;

    if (users == 1) {
      //user exists
      Meteor.log.info('User ID: ' + userId + ' already exists');
    } else if (users == 0) {
      //user does not exist
      Meteor.log.info('Adding User ID: ' + userId);
      Users.insert({
        userId: userId
        //add more information about the user here
      });
    } else {
      //multiple instances of the user exists in the Users collection
      Meteor.log.error('Multiple instances of the user ID: ' + userId + ' exist');
    }
    Meteor.call('updateScreenInfo', moduleId, true);
  },

  //updates screen related information for the user  
  'updateScreenInfo': function(moduleId, bool) {
    var key = {};
    key[moduleId+'.primaryScreenEnabled'] = bool;
    key.time = Date.now();
    console.log('updateScreenInfo json: '+JSON.stringify(key));
    Users.update({
      userId: Meteor.userId()
    }, {
      $set: key
    });    
  },

  'checkScreenOneDisplay': function(moduleId) {
  var info = Users.findOne({
    userId: Meteor.userId()
  });
  console.log(JSON.stringify(info));
  var screenState = false;
  if (typeof info != 'undefined' && info[moduleId] != undefined) {
    //Meteor.log.info('primaryScreenEnabled :' + info.primaryScreenEnabled);
    screenState = info[moduleId].primaryScreenEnabled;
    console.log('screenState: '+screenState);
  }  
  //callback(screenState);  
  return screenState;
}


});