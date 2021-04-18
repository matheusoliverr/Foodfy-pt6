
const currentPage = location.pathname
const menuItems = document.querySelectorAll(".header-links a")

for(item of menuItems){
    if(currentPage.includes(item.getAttribute("href"))){
        item.classList.add("open")
    }
}

let radioInput = document.querySelector('.input-area.radio input[type="radio"]')

let radioValue = radioInput.checked

radioInput.addEventListener("click", ()=>{
    console.log(radioValue)

    if(radioValue==true){
        radioValue=false
        radioInput.checked=false
        console.log(radioValue)
    }
    else if(radioValue==false){
        radioValue=true
        radioInput.checked=true
        console.log(`a${radioValue}`)
    }
})


