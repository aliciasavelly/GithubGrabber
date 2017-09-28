const fs = require('fs');
const qs = require('querystring');
const https = require('https');
const http = require('http');

const githubServer = http.createServer((req, res) => {
  if (req.method === 'POST') {
    let requestBody = '';

    req.on('data', data => {
      requestBody += data;
    });

    req.on('end', () => {
      const username = qs.parse(requestBody).username;
      const ws = fs.createWriteStream(`./${username}_starred_repos.txt`);
      const options = buildOptionsObj(username);

      https.get(options, dataStream => {
        let repoData = '';

        dataStream.on('data', data => { repoData += data });

        dataStream.on('end', () => {
          const repos = JSON.parse(repoData).map(repo => {
            return `Repo: ${repo.name}. Stars: ${repo.stargazers_count}.`;
          }).join('\n');

          ws.write(repos);
          res.end(repos);
        });
      });
    });

    res.end("I'm a post request!");
  } else {
    res.end("Danger, not a post request!");
  }
});

githubServer.listen(8080, () => console.log('Listening on 8080!'));
