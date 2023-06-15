const select = document.querySelector("#select-ch")
const name = document.querySelector("#name-input")
const nameContainer = document.querySelector("#name-input-cont")

const selectedIndex = select.selectedIndex;
const selectedOption = select.options[selectedIndex].textContent;
name.value = selectedOption.trim()
if(name.value == "Other Links"){
  nameContainer.style = "display: flex"
} else {
  nameContainer.style = "display: none"
}