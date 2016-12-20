

Users = new Meteor.Collection('userDetails');


Metadata = new Meteor.Collection('metadata');
Updatedata = new Meteor.Collection('updateData');

Metadata.allow({  
  insert: function (userId, doc) {
    return userId;
  },
  update: function (userId, doc, fields, modifier) {    
    return userId;
  },
  remove: function (userId, doc) {    
    return userId;
  }
});


Updatedata.allow({  
  insert: function (userId, doc) {
    return userId;
  },
  update: function (userId, doc, fields, modifier) {    
    return userId;
  },
  remove: function (userId, doc) {    
    return userId;
  }
});

Dictionary = new Meteor.Collection('dictionary');

Dictionary.allow({  
  insert: function (userId, doc) {
    return userId;
  },
  update: function (userId, doc, fields, modifier) {    
    return userId;
  },
  remove: function (userId, doc) {    
    return userId;
  }
});

// meteor collection for storing the orchestration videos
OrchVideos = new Meteor.Collection('orchVideos');

OrchVideos.allow({  
  insert: function (userId, doc) {
    return userId;
  },
  update: function (userId, doc, fields, modifier) {    
    return userId;
  },
  remove: function (userId, doc) {    
    return userId;
  }
});