#xlab-meteor
This project provides the meteor infrastructure for handling multiple projects in xlab, namely: yoga, entertainment/ads and orchestration.

##Setup
The project requires meteor installed. Its available to download from:
https://www.meteor.com/install

##Usage
For running the project, use the command:
```
meteor
```

For running on aws or any other cloud service, follow the same process:

1. Install meteor
2. Clone the repository
3. run the command: `meteor`

##Code/Folder Structure

* client - Comprises of templates, javascripts and stylesheets required for rendering information. 

  * common - Common client-side files across projects

  * examples - Using collections with meteor

  * orchestration - Files for the orchestration tool

  * yoga

* lib

  * collections.js - Meteor/mongoDB collections for the all projects

  * config.js - Project configurations

  * router.js - Routing/page navigation definitions

* public - Storing photo/video/metadata files.

* server - For project specific business/server-side logic. Meteor.methods used for calling server-side logic from client-side javascript files.


