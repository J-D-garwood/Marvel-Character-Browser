var id = "";
var characterIndex = 0;
var characterName = "";
var comics_list = document.getElementById("search-results-container");
var urlParams = new URLSearchParams(window.location.search);
var queryFromURL = urlParams.get('query');
var form = document.getElementById('form'); 
var userInput = document.getElementById('userInput');
var Search_btn = document.getElementById('searchBtn');
var entry = "";
var recent_searches_container = document.getElementById('recent-container');
var recent_searches = localStorage.getItem('recent-searches');
var is_recent_searches = false;
var modal = document.getElementById('myModal');
var modalMessage = document.getElementById('modal-message')
const closeBtn = document.getElementsByClassName('close')[0];
var clearRecentBtn = document.getElementById('clearRecentBtn');

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
  event.preventDefault();
  if (recent_searches !== null && recent_searches.trim() !== "") {
    var recent_searches_ls = recent_searches.split("|");
    is_recent_searches = true;
  }
  if (is_recent_searches == true) {
    var recent_search_div = document.createElement("button");
    recent_search_div.setAttribute('class', 'last-search');
    recent_search_div.textContent = recent_searches_ls[recent_searches_ls.length - 1];
    recent_searches_container.appendChild(recent_search_div);
    recent_search_div.addEventListener("click", function(event) {
      event.preventDefault();
      userInput.value = recent_searches_ls[recent_searches_ls.length - 1];
      Search_btn.click();
    });
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
  if (entry === "") {
    console.log("No results returned");
    displayErrorModal("Please enter a search query.");
    clearPage();

    return;
  }
  if (entry !== "") {
    entry = "nameStartsWith=" + entry + "&";
  }

  let idscrapper = "https://gateway.marvel.com/v1/public/characters?" + entry + "limit=50&ts=1&apikey=09c6684b7cdacf3a0b97f764a489708f&hash=011be6f4c78340c4c4da9a1a4a713518";
  fetch(idscrapper)
    .then(function(response) {
      response.json().then(function(data) {
        if (data.data.results.length > 0) {
          var results_given = data.data.results
          results_given = sort_chars(results_given)
          results_given = results_given.reverse()
          while (true) {
            console.log(results_given[characterIndex].comics.available);
            if (results_given[characterIndex].comics.available > 0) {
              id = results_given[characterIndex].id;
              characterName = results_given[characterIndex].name;
              console.log(characterName);
              append_recent_search();
              fetchWikipediaContent(characterName);
              break;
            }
            characterIndex++;
            if (characterIndex === 50) {
              console.log("No results returned");
              displayErrorModal("No results found!");
              clearPage(); 
              break;
            }
          }
  let comicscrapper = "https://gateway.marvel.com/v1/public/characters/" + id + "/comics?limit=10&ts=1&apikey=09c6684b7cdacf3a0b97f764a489708f&hash=011be6f4c78340c4c4da9a1a4a713518";
  fetch(comicscrapper)
    .then(function(response2) {
      response2.json().then(function(data) {
        console.log(data.data.results)
        for (i = 0; i < data.data.results.length; i++) {
          var comic = data.data.results[i]
    
          currentComic = document.createElement("li");
          currentComic.setAttribute("style", "list-style-type: none; padding: 0; border-top: 1px solid; border-bottom: 1px solid")

          currentComicCapsule = document.createElement("div")
          currentComicCapsule.setAttribute("class", "flex-container")

          currentComicImg = document.createElement('img')
          currentComicImg.setAttribute("class", "flex-child-img")
          currentComicImg.setAttribute("style", "height: 200px")
          if (comic.images.length > 0) {
            var thumbnailUrl = comic.images[0].path + "." + comic.images[0].extension
            console.log(thumbnailUrl)
            currentComicImg.src = thumbnailUrl
            currentComicImg.alt = comic.title;
          } else {
            currentComicImg.src = "assets/images/dummy_550x834_ffffff_808080_comic-not-found.jpg"
            currentComicImg.alt = comic.title;
            console.log(currentComicImg.src)
          }

          currentComicTitle = document.createElement('div')
          currentComicTitle.textContent = comic.title;

          currentComicTitle.setAttribute("class", "flex-child-title")
          currentComicTitle.setAttribute("style", "padding-left:5px")
          currentComicCapsule.appendChild(currentComicImg)
          currentComicCapsule.appendChild(currentComicTitle)
          currentComic.appendChild(currentComicCapsule)
          comics_list.appendChild(currentComic);
          }
      });
     });
        } if (data.data.results.length === 0) {
          console.log("No results found");
          displayErrorModal("No results found!");

          clearPage(); 
        }
      });
    });
}

function clearPage() {
  userInput.value = "";
  while (comics_list.firstChild) {
    comics_list.removeChild(comics_list.firstChild);
  }
  document.getElementById('wikipedia-display').innerHTML = "";
  characterIndex = 0; 

}

function displayErrorModal(message) {
  if (message !== "") {
    modal.style.display = 'block';
    modalMessage.textContent = message;
    clearPage();
  }
}

Search_btn.addEventListener("click", Search_Comics);
Search_btn.addEventListener("click", append_recent_search_li_element);


function fetchWikipediaContent(characterName) { 
  const apiUrl = `https://en.wikipedia.org/w/api.php?origin=*&action=query&format=json&prop=extracts&exintro&explaintext&redirects=1&titles=${encodeURIComponent(characterName)}`;

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
      modal.style.display = 'block'; 
    });
}

function displayWikipediaContent(content) {
  const wikipediaDisplay = document.getElementById('wikipedia-display');
  const paragraphs = content.split('\n');
  const firstParagraph = paragraphs[0];
  const wikiExtract = document.getElementById('wiki-extract');
  const fullWikiLink = document.getElementById('full-wiki-link');

  wikiExtract.innerHTML = `<p>${firstParagraph}</p>`;
 
  if (content.trim() !== '') {
    const wikipediaURL = `https://en.wikipedia.org/wiki/${encodeURIComponent(characterName)}`;
    fullWikiLink.href = wikipediaURL;
    fullWikiLink.style.display = 'inline';
    fullWikiLink.style.background = "red";
  } else {
    fullWikiLink.style.display = 'none';
  }
};


userInput.value = decodeURIComponent(queryFromURL);
window.addEventListener('DOMContentLoaded', function() {
  if (queryFromURL){
    Search_btn.click();
  }
});

closeBtn.addEventListener('click', function() {
  modal.style.display = 'none';
});

window.addEventListener('pageshow', function(event) {
  userInput.value = '';
});

clearRecentBtn.addEventListener('click', function () {
  localStorage.removeItem('recent-searches');
  var lastSearches = document.querySelectorAll('.last-search');
  lastSearches.forEach(function (lastSearch) {
    lastSearch.remove();
  });

