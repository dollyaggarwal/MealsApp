import { addToFavorites } from './favorites.js';
// import { getFavoritesFromLocalStorage } from './favorites.js';
const searchMealInput = document.getElementById("search_meal_input");
const submitMealButton = document.getElementById("submit_meal_input");
const mealList = document.getElementById("meal_list");
const detailsCard = document.querySelector(".card"); 
const body = document.body;



//const favoritesCard = document.querySelector(".fav_card"); // Details card on favorites.html


// Define a function to fetch and display meal data
const fetchMeals = async (searchText) => {

  const apiUrl = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchText}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.meals) {
      mealList.innerHTML = ''; 

      data.meals.forEach(meal => {
        const listItem = document.createElement('li');
        const trimmedMealName = meal.strMeal.slice(0, 25);

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

        listItem.querySelector(".meal_items_btn").addEventListener("click", function () {
          fetchMealDetails(meal);
        });

      const favIcon=  listItem.querySelector("#fav_icon");
       favIcon.addEventListener("click", function () {
          addToFavorites(meal);
  
        });

        mealList.appendChild(listItem);
        
      });
    } else {
      mealList.innerHTML = 'No meals found.';
    }
  } catch (error) {
    console.error('Fetch error:', error);
  }
};


export const fetchMealDetails = (meal) => {
  body.style.pointerEvents = 'none';
  detailsCard.style.pointerEvents = 'auto';

  const cardItem = document.createElement('div');
  cardItem.classList.add('meal_items_details_card');
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

  cardItem.querySelector("#video_btn").addEventListener("click", () =>{
    console.log(meal.strYoutube);
    fetchMealVideo(meal);
  })

 detailsCard.appendChild(cardItem);

cardItem.querySelector("#close_btn").addEventListener("click", () => {
  body.style.pointerEvents = 'auto';
  cardItem.style. pointerEvents = 'auto';
  cardItem.style.display = 'none'
});
};


const fetchMealVideo = async (meal) => {
  try {
    const videoUrl =`${meal.strYoutube}`; 
    if (videoUrl) {
      
      window.open(videoUrl, '_blank');
    } 
    else {
      console.error('Video URL not found in API response');
    }
  }
   catch (error) {
    console.error('Error fetching video URL: ' + error);
  }
};

const loadFavPage=document.getElementById("fav_page");
loadFavPage.addEventListener("click", function () {
  var newPageUrl = "favorites.html";
  window.location.href = newPageUrl;
 
});

// Add an event listener to the search form
submitMealButton.addEventListener('click', function (event) {
  event.preventDefault();
  const searchText = searchMealInput.value.trim();
  fetchMeals(searchText);
});
