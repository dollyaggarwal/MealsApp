import {
  addToFavorites,
  removeFromFavorites,
  getFavoritesFromLocalStorage,
} from "./favorites.js";

import { displayFavorites, isInFavorites } from "./favorites.js";

const searchMealInput = document.getElementById("search_meal_input");
const submitMealButton = document.getElementById("submit_meal_input");
const mealList = document.getElementById("meal_list");
const detailsCard = document.querySelector(".card");
const body = document.body;

// Define a function to fetch random meals when the page loads
const fetchRandomMeals = async () => {
  const apiUrl = "https://www.themealdb.com/api/json/v1/1/random.php";

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.meals) {
      mealList.innerHTML = "";

      data.meals.forEach((meal) => {
        displayMealItem(meal);
      });
    } else {
      mealList.innerHTML = "No meals found.";
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
};

// Function to display a single meal item
const displayMealItem = (meal) => {
  const listItem = document.createElement("li");
  const trimmedMealName = meal.strMeal.slice(0, 22);

  listItem.innerHTML = `
    <div class="meal_items">
      <div class="meal_items_img">
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
      </div>
      <div class="meal_items_details">
        <p><span class="meal_items_name">${trimmedMealName}</span></p>
        <button class="meal_items_btn">More</button>
        <i id="fav_icon" class="fas fa-heart"></i>
      </div>
    </div>
  `;

  listItem
    .querySelector(".meal_items_btn")
    .addEventListener("click", function () {
      fetchMealDetails(meal);
    });

  const favIcon = listItem.querySelector("#fav_icon");
  if (isInFavorites(meal)) {
    //favIcon.classList.add("favorite");
    favIcon.style.color = "rgba(210, 99, 99, 0.85)";
  } else {
    // favIcon.classList.remove("favorite");
    favIcon.style.color = " rgba(244, 230, 213,0.85)";
  }

  favIcon.addEventListener("click", function () {
    toggleFavorite(meal, favIcon);
    displayFavorites();
  });

  mealList.appendChild(listItem);
};

// Define a function to fetch meals by search query
const fetchMealsBySearch = async (searchText) => {
  const apiUrl = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchText}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.meals) {
      mealList.innerHTML = "";

      data.meals.forEach((meal) => {
        displayMealItem(meal);
      });
    } else {
      mealList.innerHTML = "No meals found.";
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
};

export const fetchMealDetails = (meal) => {
  body.style.pointerEvents = "none";
  detailsCard.style.pointerEvents = "auto";

  const cardItem = document.createElement("div");
  cardItem.classList.add("meal_items_details_card");
  cardItem.innerHTML = `
    <div class="meal_items_details_img">
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
    </div>
    <div class="meal_items_content">
      <div class="meal_items_instructions">
        <p class="meal_items_details_name">${meal.strMeal}</p>
        <p class="meal_items_details_instructions">${meal.strInstructions}</p>
      </div>
      <div class="meal_items_content_btn">
        <button id="video_btn">Recipe Video</button>
      </div>
    </div> 
    <i class="fas fa-close" id="close_btn"></i>
  `;

  cardItem.querySelector("#video_btn").addEventListener("click", () => {
    console.log(meal.strYoutube);
    fetchMealVideo(meal);
  });

  detailsCard.appendChild(cardItem);

  cardItem.querySelector("#close_btn").addEventListener("click", () => {
    body.style.pointerEvents = "auto";
    cardItem.style.pointerEvents = "auto";
    cardItem.style.display = "none";
  });
};

const fetchMealVideo = async (meal) => {
  try {
    const videoUrl = `${meal.strYoutube}`;
    if (videoUrl) {
      window.open(videoUrl, "_blank");
    } else {
      console.error("Video URL not found in API response");
    }
  } catch (error) {
    console.error("Error fetching video URL: " + error);
  }
};
window.addEventListener("load", fetchRandomMeals);

// Toggle favorite status for a meal
const toggleFavorite = (meal, favIcon) => {
  if (isInFavorites(meal)) {
    favIcon.style.color = " rgba(244, 230, 213,0.85)";
    showCustomAlert("Removed From WishList...", 1000);
    removeFromFavorites(meal.idMeal);
  } else {
    favIcon.style.color = "rgba(210, 99, 99, 0.85)";
    showCustomAlert("Added To WishList...", 1000);
    addToFavorites(meal);
  }
};
function showCustomAlert(message, duration) {
  const customAlert = document.getElementById("customAlert");
  const alertMessage = document.getElementById("alertMessage");

  alertMessage.innerText = message;
  customAlert.style.display = "flex";
  customAlert.style.zIndex = 999;
  setTimeout(function () {
    customAlert.style.display = "none";
    customAlert.style.zIndex = 0;
  }, duration);
}
// Function to update the icon color based on the favorite list status
export const updateFavPageIconColor = () => {
  const favPageIcon = document.querySelector("#fav_page");

  // Check if the favorite list is empty
  if (getFavoritesFromLocalStorage().length > 0) {
    
    favPageIcon.style.color = "rgba(210, 99, 99, 0.85)";
  } else {
    favPageIcon.style.color = "rgba(244, 230, 213,0.85)";
  }
};

// Call the function to initially set the icon color
(updateFavPageIconColor);

const loadFavPage = document.querySelector("#fav_page");

loadFavPage.addEventListener("click", function () {
  console.log("Clicked on fav_page icon");
  var newPageUrl = "favorites.html";
  window.location.href = newPageUrl;
});

// Add an event listener to the search form
submitMealButton.addEventListener("click", function (event) {
  event.preventDefault();
  const searchText = searchMealInput.value.trim();
  fetchMealsBySearch(searchText);
});

window.location.reload(true);

