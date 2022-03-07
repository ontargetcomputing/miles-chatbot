# Miles Chatbot

TODO - badges for build and test coverage and maintainability

This repository represents the user interface portion of the Miles Chatbot.  It is a rewrite of [AWS lex-web-ui](https://github.com/aws-samples/aws-lex-web-ui), moving from Vue.js to React.js to allow use of the DMV style guide.

## Getting Started

### Prerequisites
* [GIT](https://git-scm.com/)
* [Node 16.x](https://nodejs.org/en/) 

## Private ca-dmv npm packages

This repository makes use of private npm packages located at [ca-dmv](https://github.com/ca-dmv/dashboard).  Please follow the directions below to authenticate and ensure you have access to the **ca-dmv** packages.

1. Obtain access to [WSI-Design-System](https://github.com/ca-dmv/WSI-Design-System) 
2. Create a [GitHub personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) with the user that has access to that repo. Token needs to be able to read from the package repository.  
3. Run `npm login --registry=https://npm.pkg.github.com` and use the created personal access token as the password when prompted.


## Local Development

### Setup

Please see the prerequisites in above if you have not already done so.

1. **Check out this repository**

	`$ git clone git@github.com:ontargetcomputing/miles-chatbot.git`
	
1. **Change to directoy where you clone the repository**

	`$ cd /path/to/repository`
		 
1. **Load required modules**
	
	`$ npm install`
	
1. **Connect to a chatbot**
	

# QnA Bot

The app requires an installation of [QnA Bot](https://github.com/aws-solutions/aws-qnabot) to connect to.

A development installation of QnA Bot is available for use.

Please create a `.env` in the repositories root folder.  **NOTE**. This file is ignored by git so will need be included with the repository.
Place the following contents into the file.

```
REACT_APP_IDENTITY_POOL_ID=us-west-2:d149addc-a97f-4f86-8846-3813fceb0f05
REACT_APP_AWS_REGION=us-west-2
REACT_APP_MILES_BOT=qnabot_dev_BotbTNbA
REACT_APP_ALIAS=live
```

## Start the app

Please insure you have setup your environment as directed above in **QnA Bot**

`$ npm start`


## Testing


TODO 
Unit/integration tests are via [mocha](https://mochajs.org/). If using the `assert`
module is too low level. Feel free to add in some `chai` and `sinon`.
Acceptance tests are via [cucaroo](https://www.npmjs.com/package/cucaroo)
These tests can be run via an npm script:

    `npm run test`

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.



## Building the Application
**TODO**
### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### Deployment
**TODO**
This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

FORCE PR