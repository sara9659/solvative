const apiKey = "afd52ca93dmshe32d2d7257781e8p10c839jsnaf89b9b2b3c6";
const baseUrl = "https://wft-geo-db.p.rapidapi.com/v1/geo/cities";

const searchBox = document.getElementById("search-box");
const tableBody = document.getElementById("table-body");
const spinner = document.getElementById("spinner");
const pagination = document.getElementById("pagination");
const limitBox = document.getElementById("limit");

let currentPage = 1;
let totalResults = 0;
let query = "";

// Fetch Cities based on limit, query
async function fetchCities(searchQuery, limit, offset) {
  spinner.classList.remove("hidden");

  try {
    const response = await fetch(
      `${baseUrl}?namePrefix=${searchQuery}&limit=${limit}&offset=${offset}`,
      {
        headers: {
          "x-rapidapi-key": apiKey,
          "x-rapidapi-host": "wft-geo-db.p.rapidapi.com",
        },
      }
    );

    const data = await response.json();
    console.log("Data received");
    spinner.classList.add("hidden");
    return data;
  } catch (error) {
    console.error("API Error:", error);
    spinner.classList.add("hidden");
  }
}

// To render table in dynamic way
function renderTable(data) {
  if (data.length === 0) {
    tableBody.innerHTML = "<tr><td colspan='3'>No result found</td></tr>";
    pagination.innerHTML = "";
    return;
  }

  tableBody.innerHTML = data
    .map(
      (item, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${item.name}</td>
      <td><img src="https://flagsapi.com/${
        item.countryCode
      }/flat/16.png" alt="${item.country}" /> ${item.country}</td>
    </tr>
  `
    )
    .join("");
}

// Render pagination based on totalcount and limit
function renderPagination(totalCount, limit) {
  const totalPages = Math.ceil(totalCount / limit);
  pagination.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement("button");
    button.textContent = i;
    button.className = i === currentPage ? "active" : "";
    button.addEventListener("click", () => changePage(i));
    pagination.appendChild(button);
  }
}

// this is to search the cities based on value given in search box
async function searchCities() {
  const limit = parseInt(limitBox.value, 10);
  const offset = (currentPage - 1) * limit;

  const response = await fetchCities(query, limit, offset);
  totalResults = response.metadata.totalCount;

  renderTable(response.data);
  renderPagination(totalResults, limit);
}

//change page
function changePage(page) {
  currentPage = page;
  searchCities();
}
//enter key press  event lisener
searchBox.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    query = searchBox.value.trim();

    if (!query) {
      tableBody.innerHTML = "<tr><td colspan='3'>Start searching</td></tr>";
      return;
    }

    currentPage = 1;
    searchCities();
  }
});

// limit box change event lisener
limitBox.addEventListener("change", () => {
  const limit = parseInt(limitBox.value, 10);
  if (limit > 10) {
    alert("Maximum limit is 10!");
    limitBox.value = 10;
  }

  currentPage = 1;
  searchCities();
});

// ctrl + / key press event lisener
document.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === "/") {
    e.preventDefault();
    searchBox.focus();

    if (searchBox.value.trim() !== "") {
      query = searchBox.value.trim();
      currentPage = 1;
      searchCities();
    }
  }
});

//search box focus  event lisener
searchBox.addEventListener("focus", () => {
  if (searchBox.value.trim() !== "") {
    query = searchBox.value.trim();
    currentPage = 1;
    searchCities();
  }
});
