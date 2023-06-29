//inital Marvel API fetch code
var id = ""
var characterIndex = 0
var characterName = ""
var comics_list = document.getElementById("search-results-container")
var submit_btn = document.getElementById("searchBtn")



var Search = function(event) {
  event.preventDefault()
  entry = document.getElementById("userInput").value;
  if (entry!=="") {
      entry = "nameStartsWith=" + entry + "&"
  }

  let idscrapper = "https://gateway.marvel.com/v1/public/characters?" + entry + "&ts=1&apikey=09c6684b7cdacf3a0b97f764a489708f&hash=011be6f4c78340c4c4da9a1a4a713518"
  fetch (idscrapper)
  .then(function (response) {
      response.json().then(function(data) {
          console.log(data.data.results[characterIndex].comics.available)
          while (true) {
              if (data.data.results[characterIndex].comics.available>100) {
                  id = data.data.results[characterIndex].id
                  console.log(data.data.results[characterIndex].name)
                  characterName = data.data.results[characterIndex].name
                  break;
              }
              characterIndex++;
          }
          let comicscrapper = "https://gateway.marvel.com/v1/public/characters/" + id +"/comics?limit=10&ts=1&apikey=09c6684b7cdacf3a0b97f764a489708f&hash=011be6f4c78340c4c4da9a1a4a713518"
          fetch (comicscrapper)
          .then(function (response2) {
              response2.json().then(function(data) {
              for (i=0;i<data.data.results.length;i++) {
                  currentComic = document.createElement("li")
                  currentComic.textContent = data.data.results[i].title
                  comics_list.appendChild(currentComic)
              }
      })
      })
  })})
}

submit_btn.addEventListener("click", Search)

// inital Wiki API code
submit_btn.addEventListener("click", function(event) {
    event.preventDefault(); 
    console.log("Form submitted!");
  
    // Get the search query
    var query = characterName;
  
    // Send the API request to your proxy server
    fetch("http://localhost:3000/wiki-proxy?q=" + encodeURIComponent(query))
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        // Parse the response and extract the first paragraph
        var pages = data.query.pages;
        var pageId = Object.keys(pages)[0];
        var extract = pages[pageId].extract;
        
        // Extract the first paragraph
        var firstParagraph = extract.split('\n')[0];
        
        // Display the first paragraph on your webpage
        document.getElementById("wikipedia-display").textContent = firstParagraph;
      })
      .catch(function(error) {
        console.log("Error:", error);
      });
  });
