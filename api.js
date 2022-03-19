let meals, mealsBox, currentItems, chosenItems = [];

$(document).ready(function(){
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onload = function() {
      meals = JSON.parse(this.responseText);
    }
    xmlhttp.open("GET", "php/controller.php?cmd=1");
    xmlhttp.send();

    mealsBox = document.getElementById('mealsBox');
 })

 //$(window).load(console.log('jQuery cmd worked'))

 function getMeals() {
  if (!mealsBox.hasChildNodes()) {
    meals.forEach(element => {
      let id   = element.ID;
      let meal = element.Gerichte;
    
      let button = document.createElement('button');
      button.id        = "meal_" + id;
      button.className = "button";
      button.innerHTML = meal;
      mealsBox.appendChild(button)
    });

    getIncredients();
  }
}

function getIncredients() {
  // provide onlick function for button, which returns Gerichte-ID
  // from database; get from button id: 'meal_...'
  $('.meals').on("click","button",function() {
    let id_idx = this.id.indexOf("_") + 1;
    let data = {gerichte_id: this.id[id_idx]};

    console.log(data)
    
    const xmlhttp_incre = new XMLHttpRequest();
    xmlhttp_incre.onload = function() {
      currentItems = JSON.parse(this.responseText);
    }
    // set .open(..., ..., false) to make asynchronous request
    // (otherwise, code will go on before there is response from server)
    xmlhttp_incre.open("POST", "php/controller.php?cmd=2", false);
    xmlhttp_incre.send(JSON.stringify(data));

    let incredientsBox = document.getElementById('incredientsBox');
    children = incredientsBox.childNodes;
    if (incredientsBox.hasChildNodes()) {
      for (i=0, len=children.length; i < len; i++) {
        incredientsBox.removeChild(children[0]);
      }
    }
    currentItems.forEach(element => {
      let id       = element.ID;
      let itemName = element.Zutaten;

      let button = document.createElement('button');
      button.id = "incredient_" + id;
      button.className = "button";
      button.innerHTML = itemName;
      incredientsBox.appendChild(button);
    });

    listIncredient();
  });
}


function listIncredient() {
  let clicked = $._data(document.getElementById('incredientsBox'), "events")
  if (clicked == undefined) {
    $('.incredients').on("click","button",function() {
      let id_idx = this.id.indexOf("_") + 1;
      let id     = this.id[id_idx];
      let item_idx = currentItems.map(function(e) {
        return e.ID;
        }).indexOf(id);
      let item     = currentItems[item_idx];
      let itemName = item.Zutaten;

      chosenItems.push(item);
      
      let button = document.createElement('button');
      button.id        = "listedItem_" + id;
      button.className = "button";
      button.innerHTML = itemName;
      listBox.appendChild(button);
      });
    }
  }

  function checkIn() {
    console.log('checkIn')

    let data = [];
    chosenItems.forEach(element => {
      data.push(element.Zutaten);
    });

    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", "php/controller.php?cmd=3", false);
    xmlhttp.send(JSON.stringify(data));
  }


/* toDo:
- wenn Seite läd, aktuelle Einkaufsliste aus Datenbank abfragen
und anzeigen
- bevor aktuelle Einkaufsliste an DB gesendet, in DB löschen
*/




// $('Klasse').unbind("click") -> entferene onclick funktion
// von allen child buttons des div's der Klasse