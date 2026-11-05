function openRecipeForm() {
  document.getElementById("add-form").style.display = "flex";
}

function closeRecipeForm() {
  document.getElementById("add-form").style.display = "none";
}

function openRecipeView(name) {
  let item = localStorage.getItem(name);
  console.log(name, item)
  if (item) {
    item = JSON.parse(item)
    document.getElementById("difficulty-view").innerHTML = item[0]
    document.getElementById("duration-view").innerHTML = item[1]

    let ingredients = document.getElementById("view-ingredients")
    ingredients.innerHTML = ""

    for (const [ind, text] of item[2].entries()) {
      ingredients.innerHTML += `
      <div class="ingredient" id="ingredient${ind}">
        <div class="ingredient-dash">- </div>
        <div class="ingredient-text">
            ${text}
      </div>
      `
    }

    let instructions = document.getElementById("view-instructions")
    instructions.innerHTML = ""
    for (const [ind, text] of item[3].entries()) {
      instructions.innerHTML += `
      <div class="instruction" >
        <div class="instruction-number">${ind + 1}.</div>
        <div class="instruction-text">
          ${text}
        </div>
      </div>
      `

    }
    document.getElementById("title").innerHTML = `<h1>${name}</h1>`
    document.getElementById("view-recipe").style.display = "flex"

    document.getElementById("view-buttons").innerHTML = `
        <div class="button" id="delete-recipe" onclick="deleteRecipe('${name}')">Delete Recipe</div>
        <div class="button" id="close-recipe" onclick="closeRecipeView()">Close</div>
    
    `


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
    console.log(localStorage.getItem(recipeName.value))
    if (localStorage.getItem(recipeName.value)) {
      alert("Recipe with this name already exists. Please choose another")
      return
    }
    let instructionsTable =
      JSON.parse(localStorage.getItem("temp-instructions")) ?? []; //storage for adding instructions
    let ingredientsTable =
      JSON.parse(localStorage.getItem("temp-ingredients")) ?? []; //storage for adding instructions
    let recipe = [difficulty.value, duration.value, ingredientsTable, instructionsTable];
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

    localStorage.setItem(
      "recipe-count",
      parseInt(localStorage.getItem("recipe-count")) + 1,
    );

    localStorage.removeItem("temp-instructions");
    localStorage.removeItem("temp-ingredients");

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
    localStorage.removeItem(name)
  }

  document.getElementById("view-recipe").style.display = "none";
}

function addInstruction() {
  let text = document.getElementById("add-instruction-text");
  // there is input
  if (text.value.length > 0) {
    let instructionsTable =
      JSON.parse(localStorage.getItem("temp-instructions")) ?? []; //storage for adding instructions
    let listElement = document.getElementById("instructions-list"); //actual element for storing it
    let count = instructionsTable.length + 1;

    console.log(instructionsTable);
    instructionsTable.push(text.value);

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

    localStorage.setItem(
      "temp-instructions",
      JSON.stringify(instructionsTable),
    );
  } else {
    alert("Please enter an instruction");
  }
}

// highk is the same as above just changed elements
function addIngredient() {
  let text = document.getElementById("add-ingredient-text");
  // there is input
  if (text.value.length > 0) {
    let ingredientsTable =
      JSON.parse(localStorage.getItem("temp-ingredients")) ?? []; //storage for adding instructions
    let listElement = document.getElementById("ingredients-list"); //actual element for storing it

    console.log(ingredientsTable);
    ingredientsTable.push(text.value);

    listElement.innerHTML += `
      <div class="ingredient" id="ingredient${ingredientsTable.length}">
       <div class="ingredient-dash">- </div>
          <div class="ingredient-text">
              ${text.value}
          </div>
          <img
            class="remove-ingredient"
            src="icons/trash.png"
            width="20"
            height="20"
            onclick="removeIngredient(${ingredientsTable.length})"
          />
      </div>
    `;
    text.value = "";

    localStorage.setItem("temp-ingredients", JSON.stringify(ingredientsTable));
  } else {
    alert("Please enter an ingredient");
  }
}

function removeInstruction(index) {
  let listElement = document.getElementById("instructions-list"); //actual element for storing it
  let instructionsTable = JSON.parse(localStorage.getItem("temp-instructions"));
  instructionsTable.splice(index, 1);

  // big updating logic here
  let add = "";
  console.log(instructionsTable);
  // iterate through all entries and relabel them based on new locations
  for (const [ind, text] of instructionsTable.entries()) {
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

  localStorage.setItem("temp-instructions", JSON.stringify(instructionsTable));
}

//very similar to above but no need to update the numbers
function removeIngredient(index) {
  let listElement = document.getElementById("ingredients-list"); //actual element for storing it
  let ingredientsTable = JSON.parse(localStorage.getItem("temp-ingredients"));
  ingredientsTable.splice(index, 1);

  // big updating logic here
  let add = "";
  console.log(ingredientsTable);
  // iterate through all entries and relabel them based on new locations

  let element = document.getElementById("ingredient" + index);
  element.remove();

  localStorage.setItem("temp-ingredients", JSON.stringify(ingredientsTable));
}

//upon the document loading, populate the webpage as needed
document.addEventListener("DOMContentLoaded", () => {
  localStorage.setItem("recipe-count", "0");


  // document.getElementById("recipe-scroll").innerHTML = "";

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    const arr = JSON.parse(localStorage.getItem(key))
    if (key != "temp-instructions" && key != "temp-ingredients" && key != "recipe-count") {
      document.getElementById("recipe-scroll").innerHTML += `
    
      <div class="recipe" id="${key}" onclick="openRecipeView('${key}')">
        <div class="recipe-details">
          <div class="recipe-title">${key}</div>

          <div class="recipe-time-difficulty">
            <div class="recipe-difficulty">${arr[0]}</div>
            <div class="recipe-time">${arr[1]}</div>
          </div>
        </div>

      </div>
    
    `
    }
  }

});
