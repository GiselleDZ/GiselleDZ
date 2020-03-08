/* eslint-disable no-alert */

/**************
 *   SLICE 1
 **************/


//  const coffeeStorage = window.localStorage

//  function loadStorage(coffeeStorage, data){
//    if (coffeeStorage.coffee){
//      getCoffeeStorage(data)
//    }
//  }

//  function setCoffeeSorage (data){
//   coffeeStorage.setItem('coffee', data.coffee )
//   coffeeStorage.setItem('producers',data.producers)
//   coffeeStorage.setItem('totalCPS', data.totalCPS )

// }

// function getCoffeeStorage (data){
//   data.coffee = coffeeStorage.getItem('coffee')
//   data.producers = coffeeStorage.getItem('producers')
//   data.totalCPS = coffeeStorage.getItem('totalCPS')
// }

// loadStorage(coffeeStorage,data)


function updateCoffeeView(coffeeQty, data) {
  // if (coffeeQty === 0){
  //   loadStorage(coffeeStorage,data)
  // }
  let coffeeCounter = document.getElementById('coffee_counter');
  innerText = document.createTextNode(coffeeQty)
  coffeeCounter.appendChild(innerText);
  coffeeCounter.innerText = coffeeQty;
  return coffeeCounter.innerText
}

function clickCoffee(data) {
  updateCoffeeView(data.coffee +1)
  data.coffee += 1
  // setCoffeeSorage (data)
  if (data.coffee >= 100 ){
    renderProducers(data)
  }
}

/**************
 *   SLICE 2
 **************/

function unlockProducers(producers, coffeeCount) {
  return producers.filter(producer => {
    if (coffeeCount >= (producer.price / 2) || producer.unlocked === true){
      producer.unlocked = true
    } 
    return producer
  })
}

function getUnlockedProducers(data) {
  let arrOfUnlockedProducers = [];
  data.producers.filter(producer =>{
    if (producer.unlocked === true){
      arrOfUnlockedProducers.push(producer)
    }
  })
  return arrOfUnlockedProducers
}

function makeDisplayNameFromId(id) {
  // return id
  let lowerCaseId = id.toLowerCase().split('');
   return lowerCaseId.map((letter, index) =>{
    if (index === 0 || lowerCaseId[index-1] === '_'){
      // console.log(letter.toUpperCase())
      return letter.toUpperCase()
    } else if (letter === '_'){
      return ' ';
    } else {
      return letter;
    }
  }).join('')
}

// You shouldn't need to edit this function-- its tests should pass once you've written makeDisplayNameFromId

function makeProducerDiv(producer) {
  const containerDiv = document.createElement('div');
  containerDiv.className = 'producer';
  const displayName = makeDisplayNameFromId(producer.id);
  const currentCost = producer.price;
  const html = `
  <div class="producer-column">
    <div class="producer-title">${displayName}</div>
    <button type="button" id="buy_${producer.id}">Buy</button>
  </div>
  <div class="producer-column">
    <div>Quantity: ${producer.qty}</div>
    <div>Coffee/second: ${producer.cps}</div>
    <div>Cost: ${currentCost} coffee</div>
  </div>
  `;
  containerDiv.innerHTML = html;
  return containerDiv;
}

function deleteAllChildNodes(parent) {
  const children = parent.childNodes;
  children.forEach(child =>{
    parent.removeChild(child)
  })
  if (parent.childNodes.length > 0){
    deleteAllChildNodes(parent)
  }
}




function renderProducers(data) {

  let producerContainer = document.getElementById('producer_container')
  let producersInData = data.producers
  let coffeeCounter = data.coffee

  unlockProducers(producersInData,coffeeCounter)

  unlockedProducers = getUnlockedProducers(data)

  deleteAllChildNodes(producerContainer)

  unlockedProducers.forEach(producer =>{
    producerContainer.appendChild(makeProducerDiv(producer))
    // producerContainer.innerText += producer.id
  })
}







/**************
 *   SLICE 3
 **************/

function getProducerById(data, producerId) {
  let producerRetrived
  data.producers.filter(producer =>{
    if (producer.id === producerId) {
      producerRetrived = producer
    }
  })
  return producerRetrived
}

function canAffordProducer(data, producerId) {
  let producerCompare = getProducerById(data,producerId)
  // console.log(typeof producerCompare)
  if (data.coffee > producerCompare.price ){
    return true
  }
  else {
    return false
  }
}

function updateCPSView(cps) {
  const cpsIndicator = document.getElementById('cps')
  cpsIndicator.innerText = cps
}

function updatePrice(oldPrice) {
  // return oldPrice
  return Math.floor(oldPrice * 1.25)
}

function attemptToBuyProducer(data, producerId) {
  let currentProducer = getProducerById(data,producerId)

  if (canAffordProducer(data,producerId) === true){
    currentProducer.qty ++
    data.coffee -= currentProducer.price
    currentProducer.price = updatePrice(currentProducer.price);
    data.totalCPS += currentProducer.cps 
    updateCPSView(data.totalCPS)
    return true
  } else{
    return false
  }
}

function buyButtonClick(event, data) {

  let producersToCheck = data.producers
  producersToCheck.filter(p =>{
    if (event.target.tagName === 'BUTTON'){
      if (event.target.id.includes(p.id)) {
        if (attemptToBuyProducer(data, p.id ) === false){
          window.alert('Not enough coffee!')
        }
        else {
          // attemptToBuyProducer(data, p.id)
          renderProducers(data)
          updateCoffeeView(data.coffee)
        }
      }
    }
  })
}

function tick(data) {
  data.coffee += data.totalCPS
  renderProducers(data)
  updateCoffeeView(data.coffee)
}



/*************************
 *  Start your engines!
 *************************/

// You don't need to edit any of the code below
// But it is worth reading so you know what it does!

// So far we've just defined some functions; we haven't actually
// called any of them. Now it's time to get things moving.

// We'll begin with a check to see if we're in a web browser; if we're just running this code in node for purposes of testing, we don't want to 'start the engines'.

// How does this check work? Node gives us access to a global variable /// called `process`, but this variable is undefined in the browser. So,
// we can see if we're in node by checking to see if `process` exists.
if (typeof process === 'undefined') {
  // Get starting data from the window object
  // (This comes from data.js)
  const data = window.data;

  


  // Add an event listener to the giant coffee emoji
  const bigCoffee = document.getElementById('big_coffee');
  bigCoffee.addEventListener('click', () => clickCoffee(data));

  // Add an event listener to the container that holds all of the producers
  // Pass in the browser event and our data object to the event listener
  const producerContainer = document.getElementById('producer_container');
  producerContainer.addEventListener('click', event => {
    buyButtonClick(event, data);
  });

  // Call the tick function passing in the data object once per second
  setInterval(() => tick(data), 1000);
}
// Meanwhile, if we aren't in a browser and are instead in node
// we'll need to exports the code written here so we can import and
// Don't worry if it's not clear exactly what's going on here;
// We just need this to run the tests in Mocha.
else if (process) {
  module.exports = {
    updateCoffeeView,
    clickCoffee,
    unlockProducers,
    getUnlockedProducers,
    makeDisplayNameFromId,
    makeProducerDiv,
    deleteAllChildNodes,
    renderProducers,
    updateCPSView,
    getProducerById,
    canAffordProducer,
    updatePrice,
    attemptToBuyProducer,
    buyButtonClick,
    tick
  };
}

