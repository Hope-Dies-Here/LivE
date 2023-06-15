const select = document.querySelector("#select-ch")
const name = document.querySelector("#name-input")
const nameContainer = document.querySelector("#name-input-cont")
select.addEventListener("change", () => {
  const selectedIndex = select.selectedIndex;
const selectedOption = select.options[selectedIndex].textContent;
  name.value = selectedOption.trim()
  // if(select.value == "648951b95baab6ab268e48d3"){
  if(name.value == "Other Links"){
    nameContainer.style = "display: flex"
  } else {
    nameContainer.style = "display: none"
  }
})