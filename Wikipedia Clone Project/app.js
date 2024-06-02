const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');

// console.log(searchForm);
// console.log(searchInput);
// console.log(searchResults);

// Theme toggler elements
const themeToggler = document.getElementById('theme-toggler');
const body = document.body;

async function searchWikipedia(query){ // Function to call Wikipedia API
    const encodedQuery = encodeURIComponent(query); //Takes a string as input and returns a new string with special characters
    const endpoint = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=10&srsearch=${encodedQuery}`;

    const responses = await fetch(endpoint);

    if(!responses.ok) {
        throw new Error('Failed to fetch search results from Wikipedia API');
    }

    const json = await responses.json();
    return json;
}

function displayResults(search_results){
    // remove the loading spinner
    searchResults.innerHTML= '';

    search_results.forEach((individual_result) => {
        const url = `https://en.wikipedia.org/?curid=${individual_result.pageid}`;
        const titleLink = `<a href="${url}" target="_blank" rel="noopener">${individual_result.title} </a>`;
        const urlLink = `<a href="${url}" class="result-link" target="_blank" rel="noopener">${url} </a>`;

        const resultItem = document.createElement("div");
        resultItem.className = "result-item";
        resultItem.innerHTML = `
            <h3 class="result-title">${titleLink}</h3>
            ${urlLink}
            <p class="result-snippet">${individual_result.snippet}</p>
            `;

        searchResults.appendChild(resultItem);
    });
}

searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const query = searchInput.value.trim();

    if (!query) {
        searchResults.innerHTML = "<p>Please enter a valid search term. </p>";
        return;
    }

    searchResults.innerHTML = "<div class='spinner'>Loading ...</div>";

    try {
        const search_results = await searchWikipedia(query);

        if (search_results.query.searchinfo.totalhits == 0) {
            searchResults.innerHTML = "<p>No results found. </p>";
        } else {
            displayResults(search_results.query.search);
        }
    } catch (error) {
        console.error(error);
        searchResults.innerHTML = `<p>An error occured while searching. Please try again later. </p>`;
    }
});

//Event listener for theme toggler
themeToggler.addEventListener("click", () => {
    body.classList.toggle("dark-theme");
    if(body.classList.contains('dark-theme')) {
        themeToggler.textContent = "Dark";
        themeToggler.style.background = "#fff";
        themeToggler.style.color = "#333";
    } else {
        themeToggler.textContent = 'Light';
        themeToggler.style.border = '2px solid #ccc';
        themeToggler.style.color = "#333";
    }
});
