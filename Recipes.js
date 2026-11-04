function addRecipe() {
  document;
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
document.addEventListener("DOMContentLoaded", () => {});
