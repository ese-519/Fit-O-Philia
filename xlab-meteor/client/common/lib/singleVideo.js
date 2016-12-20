//default template to be rendered
Session.set('renderTemplate', 'mainMenu');
Session.set('moduleId', 'xlab_module_4');
Session.set('moduleName', 'Video List');
Template.singleVideo.helpers({
  screenTemplates: function() {
    return Session.get('renderTemplate');
  }
});
