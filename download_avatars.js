const request = require('request');
const secrets = require('./secrets.js');
const fs = require('fs');

const args = process.argv;
const argRepoOwner = args[2];
const argRepoName = args[3];

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': secrets.user_agent,
      'Authorization': "token " + secrets.token
    }
  };
  request(options, cb);
}

function handleData(error, response, body) {
  console.log('error:', error);
  console.log('statusCode:', response && response.statusCode);

  let parseBody = JSON.parse(body);

  parseBody.forEach( function(element, index) {
    let pathName = 'avatars/' + element.login;
    let downloadUrl = element.avatar_url
    downloadImageByURL(downloadUrl, pathName)
  });
};

function downloadImageByURL(url, filePath) {
  let currentPath = filePath.split('/')[0];
  let user = filePath.split('/')[1];

  if (!fs.existsSync(currentPath)){
        fs.mkdirSync(currentPath);
      }

  request.get(url)
    .on('error', function (err) {
      throw err;
    })
    .on('response', function (response) {
      console.log(`Downloading image of user ${user.toUpperCase()}`)
      console.log('Response Status Code: ', response.statusCode);
      filePath = filePath + '.' + response.headers['content-type'].split('/')[1];
      let downloader = fs.createWriteStream(filePath);
      response.pipe(downloader);
    })
}

getRepoContributors(argRepoOwner, argRepoName, handleData);