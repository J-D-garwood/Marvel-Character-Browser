
document.getElementById("form").addEventListener("submit", function(event) {
    event.preventDefault(); 
  
    // Get the search query from the input field
    const query = document.getElementById("query").value;
  
    // Redirect to the search results page with the query as a URL parameter
    window.location.href = 'searchResultsPage.html?query=' + encodeURIComponent(query);
  });

const form = document.getElementById('form');
const queryInput = document.getElementById('query');
const modal = document.getElementById('myModal');
const closeBtn = document.getElementsByClassName('close')[0];

// Handle form submission
form.addEventListener('submit', function(event) {
  event.preventDefault();

  if (queryInput.value.trim() === '') {
    modal.style.display = 'block';
  } else {
    // Redirect to the search results page with the query as a URL parameter
    window.location.href = 'searchResultsPage.html?query=' + encodeURIComponent(queryInput.value);
  }
});

// Close modal
closeBtn.addEventListener('click', function() {
  modal.style.display = 'none';
});

// Clear input field when the back button is pressed
window.addEventListener('pageshow', function(event) {
  queryInput.value = '';
});
