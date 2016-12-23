  Template.mainMenu.helpers({


  });

  var id;
  var name;
  var videoSource;
  var metaSource;

  Template.mainMenu.events({
      'click #videoList': function(e) {
          e.preventDefault(); //this will prevent the link trying to navigate to another page
          var href = $(this).attr("href"); //get the href so we can navigate later
          id = $(this).attr("id");
          name = $(this).attr("name");
          Session.set('renderTemplate', 'videoDetails');
      }
  });

