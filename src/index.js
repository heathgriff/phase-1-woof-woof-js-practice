// load dom
    // once dom content has loaded, run event listener
    // pass in callbacks:
        // fetch ALL dogs
        // add <span>"${dogName}"</span> to "dog-bar" div .forEach(dog)
            // add click event listener to each dogName span...using same .forEach?
document.addEventListener("DOMContentLoaded", () => {
    const dogBar = document.querySelector("#dog-bar") 
    const dogUrl = "http://localhost:3000/pups"
    const dogInfo = document.querySelector("#dog-info")
    const goodDogFilter = document.querySelector('#good-dog-filter')
    goodDogFilter.addEventListener('click', filterDogs)
    // fetchDogs().then(renderDogBar)  is another way to chain the fetch request (instead of a second .then() chained directly to fetch())
    fetchDogs()

    function fetchDogs() {
        return fetch(dogUrl)
        .then(resp => resp.json())
        .then(dogs => renderDogBar(dogs))
    }

    function renderDogBar(dogs) {
        dogs.forEach(dog => addDogToDogBar(dog))  // dogs.forEach(addDogToDogBar) works too
        
    }

    function addDogToDogBar(dog) {
        const span = document.createElement("span")
        span.innerText = dog.name
        span.setAttribute("data-id", dog.id)
        dogBar.append(span)
        //console.log(span)
        span.addEventListener("click", showAPup)
    }

    function showAPup(e) {
        //console.log("CLICK")
        //console.log(e.target)
        const pupId = e.target.getAttribute("data-id")
        console.log(pupId)

        fetch(`${dogUrl}/${pupId}`)
        .then(resp => resp.json())
        .then (dog => {
            //const goodOrBad = dog.isGoodDog = !dog.isGoodDog
            const goodOrBad = dog.isGoodDog ? "good dog!" : "bad dog~"
            dogInfo.innerHTML = 
            `<img src="${dog.image}" />
             <h2>${dog.name}</h2>
             <button data-id=${dog.id}>${goodOrBad}</button>`
             const button = dogInfo.querySelector("button")
             button.addEventListener("click", toggleDog)
        })

    }

    function toggleDog(e) {
        // console.log("ITS ALIVE")
        // toggle the button text between good dog/bad dog
        // need the innerText of the button
        const toggleText = e.target.innerText.slice(0, -5)
        // console.log(toggleText)
        const isGoodDog = toggleText === "good" ? true :false
        const newStatus = isGoodDog ? "bad dog~" : "good dog!"
        const dogId = e.target.dataset.id
        //debugger;
        // console.log(dogId)
        fetch(`${dogUrl}/${dogId}`, {
            method: "PATCH", 
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({isGoodDog: !isGoodDog})
        }).then(resp => resp.json())

        e.target.innerText = newStatus

    }

    function filterDogs(e){
        dogBar.innerHTML = ""
        console.log("it works")
        const onOrOff = e.target.innerText.split(": ")[1]
        console.log(onOrOff)
        // const filterStatus = onOrOff === "OFF" ? true : false
        // const newFilter = filterStatus ? "ON" : "OFF"
        if (onOrOff === "OFF"){
            e.target.innerText = "Filter good dogs: ON"
            fetchDogs()
            .then(dogs => dogs.filter(dog => dog.isGoodDog))
            .then(goodDogs => renderDogBar)
        } else {
            e.target.innerText = "Filter good dogs: OFF"
            fetchDogs()
        }


    }

    //console.log(dogBar)
})


// callback function for dogInfo click event listener
// function renderAPup()
    // for the pup clicked on, 
    // display dogName, dogImg, isGoodDogStatus in "dog-info" div - using .append()
        // dogImg = img tag with pup's imgURL
        // dogName = 'h2'
        // isGoodDogStatus = .innerText() on button says "good dog!" or "bad dog!" based on truth of isGoodDog
            // <img src="dog_image_url" />
            // <h2>Mr. Bonkers</h2>
            // <button>Good Dog!</button>
    // attach click event listener to isGoodDogStatus button 

// callback function for isGoodDog click event listener
    // function isGoodDogMaybe()
        // When a user clicks the Good Dog/Bad Dog button, two things should happen:
        // The button's text should change from Good to Bad or Bad to Good
        // The corresponding pup object in the database should be updated to reflect the new isGoodDog value:
            // You can update a dog by making a PATCH request to /pups/:id and including the updated isGoodDog status in the body of the request.