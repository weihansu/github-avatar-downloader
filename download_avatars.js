const request = require('request');
const secrets = require('./secrets.js');
const fs = require('fs');

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': secrets.user_agent,
      'Authorization': "token " + secrets.token
    }
  };
  console.log(options);
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
    // console.log(`User ${element.login} image download complete in path ${pathName}`)
  });
};

getRepoContributors('jquery', 'jquery', handleData);

function downloadImageByURL(url, filePath) {
  // fs.createWriteStream(filePath);
  let currentPath = filePath.split('/')[0];
  let user = filePath.split('/')[1];

  if (!fs.existsSync(currentPath)){
        fs.mkdirSync(currentPath);
      }

  let downloder = fs.createWriteStream(filePath);

  request.get(url)
    .on('error', function (err) {
      throw err;
    })
    .on('response', function (response) {
      console.log(`Downloading image of user ${user}`)
      console.log('Response Status Code: ', response.statusCode);
    })
    .pipe(downloder);
}

