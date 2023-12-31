//imported functions from main.js file

import { fetchMealDetails, updateFavPageIconColor } from "./main.js";

// Function to add a meal to favorites

export const addToFavorites = (meal) => {

  // Check if the meal is already in favorites

  const existingFavorites = getFavoritesFromLocalStorage();
  const isAlreadyFavorite = existingFavorites.some(
    (fav) => fav.idMeal === meal.idMeal
  );

  if (!isAlreadyFavorite) {
    existingFavorites.push(meal);
    saveFavoritesToLocalStorage(existingFavorites);

    displayFavorites();
  } else {
    removeFromFavorites(meal.idMeal);
    displayFavorites();
  }
  updateFavPageIconColor();
};

// Function to remove a meal from favorites

export const removeFromFavorites = (mealId) => {
  const existingFavorites = getFavoritesFromLocalStorage();
  const updatedFavorites = existingFavorites.filter(
    (fav) => fav.idMeal !== mealId
  );
  saveFavoritesToLocalStorage(updatedFavorites);
  displayFavorites();
  updateFavPageIconColor();
};

// Function to get favorites from local

export const getFavoritesFromLocalStorage = () => {
  const favoritesJSON = localStorage.getItem("favorites");

  return JSON.parse(favoritesJSON) || [];
};

// Function to save favorites to local storage

export const saveFavoritesToLocalStorage = (favorites) => {
  const favoritesJSON = JSON.stringify(favorites);
  localStorage.setItem("favorites", favoritesJSON);
};

// Function to display favorites on favorites.html

export const displayFavorites = () => {
  const favoritesList = document.querySelector("#fav_meal_list");

  favoritesList.innerHTML = ""; // Clear previous favorites

  const favorites = getFavoritesFromLocalStorage(); //fetch favorites from local storage

  favorites.forEach((meal) => {
    const listItem = document.createElement("li");
    const trimmedMealName = meal.strMeal.slice(0, 22);
    listItem.innerHTML = `
      <div class="fav_meal_items">
        <div class="fav_meal_items_img">
          <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        </div>
        <div class="fav_meal_items_details">
          <p><span class="fav_meal_items_name">${trimmedMealName}</span></p>
          <button class="fav_meal_items_btn">More</button>
          <i id="fav_icon" class="fas fa-heart "></i>
        </div>
      </div>
    `;
    listItem
      .querySelector(".fav_meal_items_btn")
      .addEventListener("click", function () {
        fetchMealDetails(meal);
      });


    const favIcon = listItem.querySelector("#fav_icon");
    if (isInFavorites(meal)) {
    
      favIcon.style.color = "rgba(210, 99, 99, 0.85)";
    } else {
     
      favIcon.style.color = " rgba(244, 230, 213,0.85)";
    }

      //toggle between color of favorite items on clicking on fav icon

    favIcon.addEventListener("click", function () {
      toggleFavorite(meal);
      displayFavorites();
    });

    favoritesList.appendChild(listItem);
  });
};

//Check if a meal is in the favorites list

export const isInFavorites = (meal) => {
  const favorites = getFavoritesFromLocalStorage();
  return favorites.some((fav) => fav.idMeal === meal.idMeal);
};

// Toggle favorite status for a meal

export const toggleFavorite = (meal) => {
  if (isInFavorites(meal)) {
    removeFromFavorites(meal.idMeal);
  } else {
    addToFavorites(meal);
  }
};

document.addEventListener("DOMContentLoaded", displayFavorites);
