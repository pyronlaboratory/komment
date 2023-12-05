import { Octokit } from "octokit";
import { createRequire } from "module";
import express from 'express';

// load env
const require = createRequire(import.meta.url);

require('dotenv').config();

// express setup
const app = express();

app.set("view engine", "ejs");

app.use(express.static('public'));

app.listen(3000, () => {
    console.log('listening on port 3000');
}); 

// octokit client
const octokit = new Octokit({
    auth: process.env.TOKEN
});

// Get user details
const {
    data: { login },
} = await octokit.rest.users.getAuthenticated();

console.log("Authenticated user: %s", login);

// endpoints
app.get("/", (req, res) => {
    res.render("index", {
        title: "Simple JavaScript app to demonstrate interactions with GitHub API"
    });
})

app.get("/dashboard", async (req, res) => {

    /**
    * @description This function retrieves paginated data from an API endpoint using 
    * GitHub's pagination syntax.
    *
    * Based on: https://docs.github.com/en/rest/guides/using-pagination-in-the-rest-api?apiVersion=2022-11-28#scripting-with-pagination
    * 
    * @param { string } url - The `url` input parameter is the base URL for which to 
    * retrieve paginated data.
    * 
    * @returns { object } - The output returned by this function is an array of data.
    */
    async function getPaginatedData(url) {
        const nextPattern = /(?<=<)([\S]*)(?=>; rel="Next")/i;
        let pagesRemaining = true;
        let data = [];

        while (pagesRemaining) {
          const response = await octokit.request(`GET ${url}`, {
            per_page: 5,
            headers: {
              "X-GitHub-Api-Version":
                "2022-11-28",
            },
          });

          const parsedData = parseData(response.data)
          data = [...data, ...parsedData];

          const linkHeader = response.headers.link;

          pagesRemaining = linkHeader && linkHeader.includes(`rel=\"next\"`);

          if (pagesRemaining) {
            url = linkHeader.match(nextPattern)[0];
          }
        }

        return data;
    }

    /**
    * @description This function takes a potentially nested JSON object as input and 
    * returns the nested array of items inside the object. It does this by first checking 
    * if the input is already an array and returning it if so.
    * 
    * @param { object } data - The `data` input parameter is passed the array of items 
    * that we want to extract and parse from a larger object.
    * 
    * @returns { array } - The output returned by this function is an array of items.
    */
    function parseData(data) {
      // If the data is an array, return that
        if (Array.isArray(data)) {
          return data
        }
    
      // Some endpoints respond with 204 No Content instead of empty array
      //   when there is no data. In that case, return an empty array.
      if (!data) {
        return []
      }
    
      // Otherwise, the array of items that we want is in an object
      // Delete keys that don't include the array of items
      delete data.incomplete_results;
      delete data.repository_selection;
      delete data.total_count;
      
      // Pull out the array of items
      const namespaceKey = Object.keys(data)[0];
      data = data[namespaceKey];
    
      return data;
    }

    console.log("Feteching repositories details..");

    const data = await getPaginatedData("/user/repos");

    console.log("Total repositories: ", data.length);
    
    // Render dashboard
    res.render("dashboard", {
        title: "Dashboard",
        username: login,
        repositories: data, 
        total_repositories: data.length
    });

})

app.get("/details", async (req, res) => {

    const {owner, repo} = req.query;

    // Extract files from repository
    const details = await octokit.request('GET /repos/{owner}/{repo}/contents', {
        owner,
        repo,
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        }
    });

    // Render details
    res.render("details", {
        title: "Dashboard / Repository details",
        username: login,
        repo_owner: owner,
        repo_name: repo,
        repo_files: details.data
    });

});

app.get("/edit", async (req, res) => {

    const {owner, repo, path} = req.query;

    // Extract details
    const details = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
        owner,
        repo,
        path,
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        }
    });

    console.log(details);

    // Decode content
    let buff = new Buffer(details.data.content, 'base64');
    let text = buff.toString('ascii');

    // Render edit page
    res.render("edit", {
        title: "Dashboard / Repository details / Edit file",
        username: login,
        repo_name: repo,
        repo_owner: owner,
        file_name: path,
        file_content: text,
        file_details: details.data,
        sha: details.data.sha,
        show_alert: false,
        message: ""
    });

});

app.get("/commit", async (req, res) => {

    const {owner, repo, path, sha} = req.query;

    // Get details of file
    const details = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
        owner,
        repo,
        path,
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        }
    });

    // Create buffer
    let append = "// Komment Demo Task\n";
    let readBuffer = new Buffer(details.data.content, 'base64');
    let text = append + readBuffer.toString('utf8');

    let writeBuffer = new Buffer(text);
    let base64data = writeBuffer.toString('base64');

    let message = "Successfully commited the file";
    let update = "";

    // Push update on git
    try {
        update = await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
            owner,
            repo,
            path,
            sha,
            message: "Kommenting..",
            content: base64data,
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            }
        });
    }
    catch (error) {
        if (error.status) {
            message = error.message;
        }
    }

    // Redirect to edit page
    res.render("edit", {
        title: "Dashboard / Repository details / Edit file",
        username: login,
        repo_name: repo,
        repo_owner: owner,
        file_name: path,
        file_content: text,
        file_details: update.data,
        sha: sha,
        show_alert: true,
        message
    });

});

// TO DO: write adapter to intercept requests



