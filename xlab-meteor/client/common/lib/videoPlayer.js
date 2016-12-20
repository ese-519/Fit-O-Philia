Template.videoPlayer.helpers({
    videoName: function() {
        return Session.get('videoName');
    }
});

Template.videoPlayer.events({
	'click #playlist': function() {
		Session.set('renderTemplate', 'videoDetails');
		Meteor.call('videoEnd', Session.get('moduleId'));
	},
    'click #home': function() {
        Session.set('renderTemplate', 'moduleSelection');
        Session.set('moduleName', '');
        Session.set('moduleId', '');
        Session.set('videoName', '');
    }
});


// Template.eventDisplay.rendered = function() {
//   // set Session variable in method callback
//   Meteor.call('getAds', function(error, ads) {
//     Session.set('adList', ads);
//   });
// }

Users.find().observeChanges({
	added: function() {
		Meteor.log.info('added');

		var info = Users.findOne();

		if (typeof info != 'undefined') {
			Meteor.log.info('videoState added as: ' + info.videoState);
			handleVideo(info.videoState);
		}
		//callback(screenState);  
		//return videoState;

	},
	changed: function() {
		Meteor.log.info('changed');
		var info = Users.findOne();

		if (typeof info != 'undefined') {
			Meteor.log.info('videoState changed to: ' + info.videoState);
			handleVideo(info.videoState);
		}
	},
	removed: function() {
		Meteor.log.info('removed');
	}
});

function handleVideo(videoState) {
	if (videoState === 'play') {
		$('#videoTag')[0].play();
	} else if (videoState === 'pause') {
		$('#videoTag')[0].pause();
	} else if (videoState === 'stop') {
		$('#videoTag')[0].stop();
	} 
}