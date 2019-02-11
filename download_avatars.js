const request = require('request');
const secrets = require('./secrets.js');

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': secrets.user_agent,
      'auth': {
        'bearer': "bearer " + secrets.token
      }
    }
  };
  request(options, cb);

}

function handleData(error, response, body) {
  console.log('error:', error);
  console.log('statusCode:', response && response.statusCode);

  let parseBody = JSON.parse(body);
  parseBody.forEach( function(element, index) {
    console.log('body: ', element.avatar_url);
  });
};


getRepoContributors('jquery', 'jquery', handleData);

