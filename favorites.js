
const favoritesCard = document.querySelector(".fav_card"); // Details card on favorites.html
// Function to add a meal to favorites

const addToFavorites = (meal) => {
  // Check if the meal is already in favorites
  console.log(meal);
  const existingFavorites = getFavoritesFromLocalStorage();
  const isAlreadyFavorite = existingFavorites.some((fav) => fav.idMeal === meal.idMeal);
    
  if (!isAlreadyFavorite) {
   
    existingFavorites.push(meal);
    saveFavoritesToLocalStorage(existingFavorites);

    displayFavorites();
  }
  else{
    removeFromFavorites(meal.idMeal);
    displayFavorites();
  }
};

// Function to remove a meal from favorites

const removeFromFavorites = (mealId) => {
  const existingFavorites = getFavoritesFromLocalStorage();
  const updatedFavorites = existingFavorites.filter((fav) => fav.idMeal !== mealId);
  saveFavoritesToLocalStorage(updatedFavorites);
  displayFavorites();
};

// Function to get favorites from local 

const getFavoritesFromLocalStorage = () => {
  const favoritesJSON = localStorage.getItem("favorites");
  console.log(favoritesJSON);
  return JSON.parse(favoritesJSON) || [];

};

// Function to save favorites to local storage

const saveFavoritesToLocalStorage = (favorites) => {
  const favoritesJSON = JSON.stringify(favorites);
  localStorage.setItem("favorites", favoritesJSON);
};

// Function to display favorites on favorites.html
const displayFavorites = () => {


  const favoritesList = document.getElementById("fav_meal_list");

  favoritesList.innerHTML = ''; // Clear previous favorites

  const favorites = getFavoritesFromLocalStorage();

    console.log(favorites);
  favorites.forEach((meal) => {
    const listItem = document.createElement('li');
    console.log(listItem)
    listItem.innerHTML = `
      <div class="fav_meal_items">
        <div class="fav_meal_items_img">
          <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        </div>
        <div class="fav_meal_items_details">
          <p><span class="fav_meal_items_name">${meal.strMeal}</span></p>
          <button class="meal_items_btn">More</button>
          <i id="icon" class="fas fa-heart favorite_meal_item_heart"></i>
        </div>
      </div>
    `;

    listItem.querySelector(".meal_items_btn").addEventListener("click", function () {
      fetchMealDetails(meal);
    });

    listItem.querySelector("#icon").addEventListener("click", function () {
      removeFromFavorites(meal.idMeal);
      displayFavorites();
    });

   
    favoritesList.appendChild(listItem);
  });
};
window.addEventListener('load', myFunction);

