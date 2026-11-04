function openRecipeForm() {
  document.getElementById("add-form").style.display = "flex";
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
    let instructionsTable =
      JSON.parse(localStorage.getItem("temp-instructions")) ?? []; //storage for adding instructions
    let ingredientsTable =
      JSON.parse(localStorage.getItem("temp-ingredients")) ?? []; //storage for adding instructions
    let recipe = [difficulty, duration, ingredientsTable, instructionsTable];
    let recipeScroll = document.getElementById("recipe-scroll");

    recipeScroll.innerHTML += `
      <div class="recipe" id="${recipeName.value}">
        <div class="recipe-details">
          <div class="recipe-title">${recipeName.value}</div>

          <div class="recipe-time-difficulty">
            <div class="recipe-difficulty">${difficulty.value}</div>
            <div class="recipe-time">${duration.value}</div>
          </div>
        </div>

      </div>
    
    `;

    localStorage.setItem(recipeName, JSON.stringify(recipe)); //add recipe to localstorage

    localStorage.setItem(
      "recipe-count",
      parseInt(localStorage.getItem("recipe-count")) + 1,
    );

    document.getElementById("add-form").style.display = "none";
    //increment the count
  }
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
});
