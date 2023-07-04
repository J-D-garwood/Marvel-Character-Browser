// Initial Wiki API code
var id = "";
var characterIndex = 0;
var characterName = "";
var comics_list = document.getElementById("search-results-container");
var urlParams = new URLSearchParams(window.location.search);
var queryFromURL = urlParams.get('query');
var form = document.getElementById('form'); // Get the form element
var userInput = document.getElementById('userInput');
var Search_btn = document.getElementById('searchBtn');
var entry = "";
var recent_searches_container = document.getElementById('recent-container');
var recent_searches = localStorage.getItem('recent-searches');
var is_recent_searches = false;
var modal = document.getElementById('myModal');



function sort_chars(array) { 
  for (var i=0;i<(array.length-1);i++){
      var swp = false
      for (var j=0;j<(array.length-i-1);j++){
          if (array[j].comics.available >array[j+1].comics.available) {
              var temp = array [j]
              array[j]=array[j+1]
              array[j+1] = temp
              swp = true
          }
      }
  if (!swp) {
      break;
  }
  }
  return(array)
}

function append_recent_search_li_element(event) {

  event.preventDefault()
  if (recent_searches!==null && recent_searches.trim()!=="") {
    var recent_searches_ls = recent_searches.split("|")
    is_recent_searches = true
  }  
  if (is_recent_searches==true) {
  var recent_search_div = document.createElement("button")
  recent_search_div.setAttribute('class', 'last-search')
  recent_search_div.textContent = recent_searches_ls[recent_searches_ls.length-1]
  recent_searches_container.appendChild(recent_search_div)
  recent_search_div.addEventListener("click", function (event) {
    event.preventDefault()
    userInput.value = recent_searches_ls[recent_searches_ls.length-1]
    Search_btn.click()
  })

  }
}

function append_recent_search() {
  if (recent_searches !== null) {
    recent_searches = recent_searches + "|" + characterName.trim();
  } else {
    recent_searches = characterName;
  }
  localStorage.setItem('recent-searches', recent_searches);
}


function Search_Comics(event) {
  event.preventDefault();
  while (comics_list.childElementCount > 0) {
    comics_list.children[0].remove();
  }
  entry = userInput.value.trim();
  if (entry !== "") {
    entry = "nameStartsWith=" + entry + "&";
  }
  let idscrapper = "https://gateway.marvel.com/v1/public/characters?" + entry + "limit=50&ts=1&apikey=09c6684b7cdacf3a0b97f764a489708f&hash=011be6f4c78340c4c4da9a1a4a713518";
  fetch(idscrapper)
    .then(function (response) {
      response.json().then(function (data) {
        if (data.data.results.length > 0) {
          while (true) {
            console.log(data.data.results[characterIndex].comics.available);
            if (data.data.results[characterIndex].comics.available > 0) {
              id = data.data.results[characterIndex].id;
              characterName = data.data.results[characterIndex].name;
              console.log(characterName);
              append_recent_search();
              fetchWikipediaContent(characterName);
              break;
            }
            characterIndex++;
            if (characterIndex === 50) {
              console.log("No results returned");
              // Display an alert that no results were returned

              break;
            }
          characterIndex++;
          if (characterIndex===50) {
            characterIndex = 0
            console.log("No results returned")
            ///This is where you display the alert that no results were returned
            break;
          }
          let comicscrapper = "https://gateway.marvel.com/v1/public/characters/" + id + "/comics?limit=10&ts=1&apikey=09c6684b7cdacf3a0b97f764a489708f&hash=011be6f4c78340c4c4da9a1a4a713518";
          fetch(comicscrapper)
            .then(function (response2) {
              response2.json().then(function (data) {
                for (i = 0; i < data.data.results.length; i++) {
                  currentComic = document.createElement("li");
                  currentComic.textContent = data.data.results[i].title;
                  comics_list.appendChild(currentComic);
                }
              });
            });
        } else {
          console.log("No results returned");
          modal.style.display = 'block';
          return;        
        }
      });
    });
}

Search_btn.addEventListener("click", Search_Comics);
Search_btn.addEventListener("click", append_recent_search_li_element);

function fetchWikipediaContent(characterName) {
  const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro&explaintext&redirects=1&titles=${encodeURIComponent(characterName)}`;

  fetch(apiUrl)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      const pages = data.query.pages;
      const firstPageId = Object.keys(pages)[0];
      const extract = pages[firstPageId].extract;
      displayWikipediaContent(extract);
    })
    .catch(function(error) {
      console.log("Error fetching Wikipedia content:", error);
      displayWikipediaContent('');
      modal.style.display = 'block'; // Show the error modal
    });
}

function displayWikipediaContent(content) {
  const wikipediaDisplay = document.getElementById('wikipedia-display');
  const paragraphs = content.split('\n');
  const firstParagraph = paragraphs[0];

  wikipediaDisplay.innerHTML = `<p>${firstParagraph}</p>`;
}

// Links the landing page to search results page - prepopulates the input field and triggers the submit
userInput.value = decodeURIComponent(queryFromURL);
window.addEventListener('DOMContentLoaded', function() {
  Search_btn.click();
});

// var publicKey;
// var timestamp;
// var apiUrl;



// function fetchComicThumbnails(entry) {
//   // Construct the API URL to fetch comics for the character
//   var comicsUrl =
//     "https://gateway.marvel.com/v1/public/characters?" +
//     entry +
//     "&limit=10&ts=1&apikey=09c6684b7cdacf3a0b97f764a489708f&hash=011be6f4c78340c4c4da9a1a4a713518";
// console.log(entry);
//   fetch(comicsUrl)
//     .then(function (response) {
//       if (!response.ok) {
//         throw new Error("Failed to fetch comics for the character. Status: " + response.status);
//       }
//       return response.json();
//     })
//     .then(function (data) {
//       console.log(data);
//       if (!data.data || !data.data.results || data.data.results.length === 0) {
//         throw new Error("No comics found for the character" + entry);
//       }


//       // Extract the comic data from the response
//       var comicsData = data.data.results;

//       // Clear the existing list items
//       while (comics_list.firstChild) {
//         comics_list.removeChild(comics_list.firstChild);
//       }

//       // Loop through the comic data and create list items with thumbnail images
//       comicsData.forEach(function (comic) {
//         var comicListItem = document.createElement("li");
//         var comicTitle = document.createElement("span");
//         var comicThumbnail = document.createElement("img");

//         comicTitle.textContent = comic.title;

//         if (comic.thumbnail && comic.thumbnail.path && comic.thumbnail.extension) {
//           var thumbnailUrl = comic.thumbnail.path + "." + comic.thumbnail.extension;
//           comicThumbnail.src = thumbnailUrl;
//           comicThumbnail.alt = comic.title;
//         } else {
//           console.log("Missing thumbnail data for comic:", comic.title);
//         }

//         comicListItem.appendChild(comicThumbnail);
//         comicListItem.appendChild(comicTitle);
//         comics_list.appendChild(comicListItem);
//       });
//     })
//     .catch(function (error) {
//       console.log("Error fetching comic thumbnails:", error);
//     });
// }

// // Assuming you have the entry value
// var entry = "nameStartsWith=Spider-Man";

// // Call fetchComicThumbnails with the entry
// fetchComicThumbnails(entry);
