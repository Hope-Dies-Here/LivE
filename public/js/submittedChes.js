const buttons = document.querySelectorAll(".del-btn")
const dat = document.querySelector("#dat")
buttons.forEach(btn => {
  btn.addEventListener("click", (e) => {
    console.log(e.target.dataset.val)
    let choice = confirm("Are you sure to delete...?")
    if(choice == true) window.location.href = `/demo/delete-challenge?from=${btn.dataset.from}&id=${btn.dataset.id}`
  })
  
})

const stars = document.querySelectorAll(".star")
const label = document.querySelector("label")
let clicked = false
stars.forEach(star => {
  star.addEventListener("click", (e) => {
    const item = e.target
    item.nextElementSibling.style = `background: url("/img/st.png") no-repeat center center; background-size: contain;`
  })
})
