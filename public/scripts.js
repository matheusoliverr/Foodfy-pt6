const recipeImage = document.querySelectorAll('.recipe-img')

for(let image of recipeImage){
    const imageId = image.getAttribute("id")
    image.addEventListener("click", function(){
        window.location.href = `/recipes/${imageId}`
    })
}

const details = document.querySelectorAll('.detail')


for(let detail of details){
    const detailsTitle = detail.querySelector('.details-title')
    const content = detail.querySelector('.details-content')
    detailsTitle.querySelector('.button').addEventListener("click", function(){
        const hidden = content.classList.contains('hidden')
        if(hidden){
            content.classList.remove('hidden')
            detailsTitle.querySelector('.button').innerHTML = "ESCONDER"
        }
        else{
            content.classList.add('hidden')
            detailsTitle.querySelector('.button').innerHTML = "MOSTRAR"
        }
    }
)}

// ADMIN

function redirectButtonToIdLocation(button){
    const page = button.getAttribute("id")

    location.href = `${page}`
}


function addNewInput(event){
    const inputArea = event.target.parentNode
    const inputArray = inputArea.querySelector(".input-array")
    const latestInputs = inputArray.querySelectorAll(".latest-inputs")

    const newInput = latestInputs[latestInputs.length - 1].cloneNode(true)

    if(newInput.children[0].value == "") return false

    newInput.children[0].value = ""

    inputArray.appendChild(newInput)
}

// LOGIN

let loginInput = document.querySelectorAll('#login-form .input-area input')
console.log(loginInput)
const error = document.querySelector('.messages.error')
console.log(error)

if(error){
    console.log(loginInput)
    loginInput.forEach(login => {
        login.classList.add("error")
    })
        
}









