let searchInput = document.getElementById("search-input");
let azElement = document.getElementById("sort-az");
let zaElement = document.getElementById("sort-za");
// let shortestElement = document.getElementById("sort-time-shortest");
// let longestElement = document.getElementById("sort-time-longest");
let tempIngredients = [];
let filterIngredients = [];
let tempInstructions = [];
let filterOpen = false;
let currSort = "az";
let difficultyFilter = null;
function openRecipeForm() {
  document.getElementById("add-form").style.display = "flex";
}

function closeRecipeForm() {
  document.getElementById("add-form").style.display = "none";
}

function openRecipeView(name) {
  let item = localStorage.getItem(name);
  if (item) {
    item = JSON.parse(item);
    document.getElementById("difficulty-view").innerHTML = item[0];
    document.getElementById("duration-view").innerHTML = item[1];

    let ingredients = document.getElementById("view-ingredients");
    ingredients.innerHTML = "";

    for (const [ind, text] of item[2].entries()) {
      ingredients.innerHTML += `
      <div class="ingredient" id="ingredient${ind}">
        <div class="ingredient-dash">- </div>
        <div class="ingredient-text">
            ${text}
      </div>
      `;
    }

    let instructions = document.getElementById("view-instructions");
    instructions.innerHTML = "";
    for (const [ind, text] of item[3].entries()) {
      instructions.innerHTML += `
      <div class="instruction" >
        <div class="instruction-number">${ind + 1}.</div>
        <div class="instruction-text">
          ${text}
        </div>
      </div>
      `;
    }
    document.getElementById("title").innerHTML = `<h1>${name}</h1>`;
    document.getElementById("view-recipe").style.display = "flex";

    document.getElementById("view-buttons").innerHTML = `
        <div class="button" id="delete-recipe" onclick="deleteRecipe('${name}')">Delete Recipe</div>
        <div class="button" id="close-recipe" onclick="closeRecipeView()">Close</div>
    
    `;
  }
}

function closeRecipeView() {
  document.getElementById("view-recipe").style.display = "none";
}

function addRecipe() {
  let alerts = "";
  let recipeName = document.getElementById("recipe-name");
  let difficulty = document.getElementById("difficulty");
  let duration = document.getElementById("duration");
  console.log(recipeName.value, difficulty.value, duration.value);
  if (!recipeName.value || !difficulty.value || !duration.value) {
    if (recipeName.value == "") {
      alerts += "recipe name ";
    }
    if (difficulty.value == "") {
      alerts += "difficulty ";
    }
    if (duration.value == "") {
      alerts += "duration ";
    }
    alert("Please provide " + alerts);
    return;
  } else {
    console.log(localStorage.getItem(recipeName.value));
    if (localStorage.getItem(recipeName.value)) {
      alert("Recipe with this name already exists. Please choose another");
      return;
    }
    let recipe = [
      difficulty.value,
      duration.value,
      tempIngredients,
      tempInstructions,
    ];
    let recipeScroll = document.getElementById("recipe-scroll");

    //recipe unit
    recipeScroll.innerHTML += `
    
      <div class="recipe" id="${recipeName.value}" onclick="openRecipeView('${recipeName.value}')">
        <div class="recipe-details">
          <div class="recipe-title">${recipeName.value}</div>

          <div class="recipe-time-difficulty">
            <div class="recipe-difficulty">${difficulty.value}</div>
            <div class="recipe-time">${duration.value}</div>
          </div>
        </div>

      </div>
    
    `;

    localStorage.setItem(recipeName.value, JSON.stringify(recipe)); //add recipe to localstorage

    tempIngredients = [];
    tempInstructions = [];

    document.getElementById("instructions-list").innerHTML = ""; //actual element for storing it
    document.getElementById("ingredients-list").innerHTML = ""; //actual element for storing it

    document.getElementById("add-form").style.display = "none";
    //increment the count
  }
}

function deleteRecipe(name) {
  let item = document.getElementById(name);
  if (item) {
    item.remove();
    localStorage.removeItem(name);
  }

  document.getElementById("view-recipe").style.display = "none";
}

function addInstruction() {
  let text = document.getElementById("add-instruction-text");
  // there is input
  if (text.value.length > 0) {
    let listElement = document.getElementById("instructions-list"); //actual element for storing it
    let count = tempInstructions.length + 1;

    tempInstructions.push(text.value);

    listElement.innerHTML += `
      <div class="instruction" id="instruction${count}">
       <div class="instruction-number">${count}.</div>
          <div class="instruction-text">
              ${text.value}
          </div>
          <img
            class="remove-instruction"
            src="icons/trash.png"
            width="20"
            height="20"
            onclick="removeInstruction(${count - 1})"
          />
      </div>
    `;
    text.value = "";
  } else {
    alert("Please enter an instruction");
  }
}

// highk is the same as above just changed elements
function addIngredient() {
  let text = document.getElementById("add-ingredient-text");
  // there is input
  if (text.value.length > 0) {
    let listElement = document.getElementById("ingredients-list"); //actual element for storing it

    tempIngredients.push(text.value);

    listElement.innerHTML += `
      <div class="ingredient" id="ingredient${tempIngredients.length}">
       <div class="ingredient-dash">- </div>
          <div class="ingredient-text">
              ${text.value}
          </div>
          <img
            class="remove-ingredient"
            src="icons/trash.png"
            width="20"
            height="20"
            onclick="removeIngredient(${tempIngredients.length})"
          />
      </div>
    `;
    text.value = "";
  } else {
    alert("Please enter an ingredient");
  }
}

function removeInstruction(index) {
  let listElement = document.getElementById("instructions-list"); //actual element for storing it
  tempInstructions.splice(index, 1);

  // big updating logic here
  let add = "";
  console.log(tempInstructions);
  // iterate through all entries and relabel them based on new locations
  for (const [ind, text] of tempInstructions.entries()) {
    console.log(ind, text);
    add += `
    <div class="instruction" id="instruction${ind + 1}">
      <div class="instruction-number">${ind + 1}.</div>
        <div class="instruction-text">
            ${text}
        </div>
        <img
          class="remove-instruction"
          src="icons/trash.png"
          width="20"
          height="20"
          onclick="removeInstruction(${ind})"
        />
    </div>
  `;
  }

  listElement.innerHTML = add;
}

//very similar to above but no need to update the numbers
function removeIngredient(index) {
  tempIngredients.splice(index, 1);
  let element = document.getElementById("ingredient" + index);
  element.remove();
}

function renderList() {
  // Need to: get search criteria
  // if search criteria empty, get everything and render it
  // if search criteria, search through all recipes and only include
  // those that fit the search criteria. maybe this can be a function or smth
  // need a search algorithm
  // if no matches, display a message or something
  let val = searchInput.value.trim().toLowerCase();
  let recipeScroll = document.getElementById("recipe-scroll");

  // returns a lowercased table of all keys in the localstorage, including the initialized value which has to be pruned
  let allRecipes = Object.keys(localStorage);
  // list of recipes that fit the search criteria
  let validRecipes = [];

  for (let key of allRecipes) {
    if (key.toLowerCase().includes(val) && key != "initialized") {
      validRecipes.push(key);
    }
  }

  if (currSort == "az") {
    validRecipes.sort((a, b) => a.localeCompare(b));
  } else if (currSort == "za") {
    validRecipes.sort((a, b) => b.localeCompare(a));
  }

  if (difficultyFilter) {
    validRecipes = validRecipes.filter((key) => {
      let recipe = JSON.parse(localStorage.getItem(key));
      return recipe[0].toLowerCase() == difficultyFilter;
    });
  }

  if (filterIngredients.length > 0) {
    validRecipes = validRecipes.filter((key) => {
      let recipe = JSON.parse(localStorage.getItem(key));
      let ingredients = recipe[3];
      let found = false;
      for (let str of ingredients) {
        for (let filtered of filterIngredients) {
          if (str.toLowerCase().includes(filtered)) {
            found = true;
            break;
          }
        }
      }
      return found;
    });
  }

  recipeScroll.innerHTML = "";

  if (validRecipes.length == 0) {
    recipeScroll.innerHTML += `
    <div id="no-match">
    No matches in your recipe book.
    </div>
    `;
  } else {
    for (let key of validRecipes) {
      let arr = JSON.parse(localStorage.getItem(key));
      recipeScroll.innerHTML += `
    
      <div class="recipe" id="${key}" onclick="openRecipeView('${key}')">
        <div class="recipe-details">
          <div class="recipe-title">${key}</div>

          <div class="recipe-time-difficulty">
            <div class="recipe-difficulty">${arr[0]}</div>
            <div class="recipe-time">${arr[1]}</div>
          </div>
        </div>

      </div>
    
    `;
    }
  }
}

function toggleFilter() {
  if (!filterOpen) {
    document.getElementById("view-filters").style.display = "flex";
    filterOpen = true;
  } else {
    document.getElementById("view-filters").style.display = "none";
    filterOpen = false;
  }
}

function togglePill(parameter, state) {
  let element = null;
  if (parameter == "difficulty") {
    element = document.getElementById("filter-difficulty");
  } else if (parameter == "ingredients") {
    element = document.getElementById("filter-ingredients");
  }

  if (state == "open") {
    element.style.display = "flex";
  } else if (state == "close") {
    element.style.display = "none";
  }
}

function toggleDifficulty(parameter) {
  let easyPill = document.getElementById("easy-pill");
  let medPill = document.getElementById("medium-pill");
  let hardPill = document.getElementById("hard-pill");

  easyPill.classList.remove("active");
  medPill.classList.remove("active");
  hardPill.classList.remove("active");

  if (!difficultyFilter || difficultyFilter != parameter) {
    if (parameter == "easy") {
      easyPill.classList.add("active");
    } else if (parameter == "medium") {
      medPill.classList.add("active");
    } else if (parameter == "hard") {
      hardPill.classList.add("active");
    }
    difficultyFilter = parameter;
    document.getElementById("difficulty-pill").classList.add("active");
  } else {
    difficultyFilter = null;
    document.getElementById("difficulty-pill").classList.remove("active");
  }
  renderList();
}

function toggleSort(parameter) {
  azElement.classList.remove("active");
  zaElement.classList.remove("active");
  // shortestElement.classList.remove("active");
  // longestElement.classList.remove("active");

  currSort = parameter;
  if (parameter == "az") {
    azElement.classList.add("active");
  } else if (parameter == "za") {
    zaElement.classList.add("active");
    // } else if (parameter == "shortest") {
    // shortestElement.classList.add("active");
    // } else if (parameter == "longest") {
    // longestElement.classList.add("active");
  }
  renderList();
}

function addIngredientToFilter() {
  let text = document.getElementById("filter-ingredient-text");
  // there is input
  if (text.value.length > 0) {
    let listElement = document.getElementById("filter-ingredient-list"); //actual element for storing it

    filterIngredients.push(text.value);

    listElement.innerHTML += `
      <div class="ingredient" id="filterIngredient${tempIngredients.length}">
       <div class="ingredient-dash">- </div>
          <div class="ingredient-text">
              ${text.value}
          </div>
          <img
            class="remove-ingredient"
            src="icons/trash.png"
            width="20"
            height="20"
            onclick="removeIngredientFromFilter(${tempIngredients.length})"
          />
      </div>
    `;
    text.value = "";
    document.getElementById("ingredients-pill").classList.add("active");
    renderList();
  } else {
    alert("Please enter an ingredient");
  }
}

function removeIngredientFromFilter(index) {
  filterIngredients.splice(index, 1);
  let element = document.getElementById("filterIngredient" + index);
  element.remove();
  if (filterIngredients.length == 0) {
    document.getElementById("ingredients-pill").classList.remove("active");
  }
  renderList();
}

//upon the document loading, populate the webpage as needed
document.addEventListener("DOMContentLoaded", () => {
  // document.getElementById("recipe-scroll").innerHTML = "";

  if (!localStorage.getItem("initialized")) {
    localStorage.clear();
    const data = {
      "Spaghetti Carbonara": [
        "Medium",
        "30 min",
        [
          "12 oz spaghetti",
          "4 oz pancetta",
          "2 large eggs",
          "1 egg yolk",
          "1 cup grated Parmesan cheese",
          "1 tsp black pepper",
          "Salt",
        ],
        [
          "Bring a large pot of salted water to a boil and cook the spaghetti.",
          "Cook the pancetta in a skillet until crisp.",
          "Whisk together the eggs, egg yolk, Parmesan, and black pepper in a bowl.",
          "Drain the pasta, reserving some pasta water.",
          "Toss the hot pasta with the pancetta.",
          "Remove from heat and stir in the egg mixture.",
          "Add reserved pasta water as needed to create a creamy sauce.",
          "Serve immediately.",
        ],
      ],
      "Chicken Stir Fry": [
        "Easy",
        "25 min",
        [
          "1 lb chicken breast",
          "2 cups broccoli florets",
          "1 bell pepper",
          "2 tbsp soy sauce",
          "1 tbsp sesame oil",
          "2 cloves garlic",
          "1 tsp ginger",
        ],
        [
          "Slice the chicken and vegetables.",
          "Heat sesame oil in a wok or skillet.",
          "Cook the chicken until browned.",
          "Add the garlic and ginger and cook briefly.",
          "Add the vegetables and stir-fry until tender-crisp.",
          "Stir in the soy sauce.",
          "Cook for another 2 minutes and serve.",
        ],
      ],
      "Classic Pancakes": [
        "Easy",
        "20 min",
        [
          "1.5 cups all-purpose flour",
          "3.5 tsp baking powder",
          "1 tbsp sugar",
          "1.25 cups milk",
          "1 egg",
          "3 tbsp melted butter",
        ],
        [
          "Combine the dry ingredients in a bowl.",
          "Whisk together the milk, egg, and butter.",
          "Mix the wet and dry ingredients until combined.",
          "Heat a lightly greased skillet.",
          "Pour batter onto the skillet.",
          "Cook until bubbles form on the surface.",
          "Flip and cook until golden brown.",
          "Serve warm.",
        ],
      ],
      "Beef Chili": [
        "Medium",
        "1 h 15 min",
        [
          "1 lb ground beef",
          "1 onion",
          "2 cans kidney beans",
          "1 can diced tomatoes",
          "2 tbsp chili powder",
          "1 tsp cumin",
          "Salt",
        ],
        [
          "Brown the ground beef in a large pot.",
          "Add the onion and cook until softened.",
          "Stir in the chili powder and cumin.",
          "Add the tomatoes and beans.",
          "Bring to a simmer.",
          "Cook for 1 hour, stirring occasionally.",
          "Season with salt and serve.",
        ],
      ],
      "Vegetable Curry": [
        "Medium",
        "45 min",
        [
          "1 onion",
          "2 carrots",
          "1 potato",
          "1 can coconut milk",
          "2 tbsp curry powder",
          "1 tbsp vegetable oil",
          "Salt",
        ],
        [
          "Dice the vegetables.",
          "Heat oil in a pot and saute the onion.",
          "Add the carrots and potato.",
          "Stir in the curry powder.",
          "Pour in the coconut milk.",
          "Simmer until the vegetables are tender.",
          "Season with salt and serve.",
        ],
      ],
      "Chocolate Chip Cookies": [
        "Easy",
        "35 min",
        [
          "2.25 cups flour",
          "1 tsp baking soda",
          "1 cup butter",
          "0.75 cup sugar",
          "0.75 cup brown sugar",
          "2 eggs",
          "2 cups chocolate chips",
        ],
        [
          "Preheat the oven to 375 F.",
          "Cream together the butter and sugars.",
          "Add the eggs and mix well.",
          "Stir in the flour and baking soda.",
          "Fold in the chocolate chips.",
          "Drop spoonfuls of dough onto baking sheets.",
          "Bake for 9 to 11 minutes.",
          "Cool before serving.",
        ],
      ],
      Lasagna: [
        "Hard",
        "2 h",
        [
          "12 lasagna noodles",
          "1 lb ground beef",
          "3 cups marinara sauce",
          "15 oz ricotta cheese",
          "2 cups mozzarella cheese",
          "0.5 cup Parmesan cheese",
        ],
        [
          "Cook the lasagna noodles according to package directions.",
          "Brown the ground beef.",
          "Mix ricotta with half the Parmesan.",
          "Spread a layer of sauce in a baking dish.",
          "Layer noodles, ricotta mixture, beef, sauce, and mozzarella.",
          "Repeat the layers.",
          "Top with remaining cheese.",
          "Bake at 375 F for 45 minutes.",
          "Rest for 15 minutes before serving.",
        ],
      ],
      "Greek Salad": [
        "Easy",
        "15 min",
        [
          "2 tomatoes",
          "1 cucumber",
          "0.5 red onion",
          "0.5 cup feta cheese",
          "2 tbsp olive oil",
          "1 tbsp lemon juice",
          "Salt",
          "Pepper",
        ],
        [
          "Chop the tomatoes, cucumber, and onion.",
          "Combine the vegetables in a bowl.",
          "Add the feta cheese.",
          "Whisk together the olive oil and lemon juice.",
          "Pour the dressing over the salad.",
          "Season with salt and pepper.",
          "Toss and serve.",
        ],
      ],
      "Roast Chicken": [
        "Medium",
        "1 h 30 min",
        [
          "1 whole chicken",
          "2 tbsp olive oil",
          "1 tsp salt",
          "1 tsp black pepper",
          "1 tsp paprika",
          "2 cloves garlic",
        ],
        [
          "Preheat the oven to 425 F.",
          "Pat the chicken dry.",
          "Rub the chicken with oil and seasonings.",
          "Place the chicken in a roasting pan.",
          "Roast until the internal temperature reaches 165 F.",
          "Rest for 15 minutes.",
          "Carve and serve.",
        ],
      ],
      "Beef Wellington": [
        "Hard",
        "3 h",
        [
          "2 lb beef tenderloin",
          "8 oz mushrooms",
          "6 slices prosciutto",
          "1 sheet puff pastry",
          "1 egg",
          "2 tbsp mustard",
        ],
        [
          "Sear the beef tenderloin on all sides.",
          "Finely chop and cook the mushrooms until dry.",
          "Brush the beef with mustard.",
          "Wrap the beef with prosciutto and mushrooms.",
          "Encase the wrapped beef in puff pastry.",
          "Brush with beaten egg.",
          "Chill for 20 minutes.",
          "Bake at 400 F until golden brown.",
          "Rest before slicing and serving.",
        ],
      ],
    };

    for (const [key, value] of Object.entries(data)) {
      // console.log(key, value)
      console.log(value);
      localStorage.setItem(key, JSON.stringify(value));
    }

    localStorage.setItem("initialized", true);
  }

  renderList();
});

searchInput.addEventListener("input", renderList);
