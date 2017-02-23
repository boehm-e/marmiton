window.onhashchange = window.onload = function() {
  var recetteId = window.location.hash.slice(1, window.location.hash.length)
  console.log(recetteId)
  get_recette_by_id(recetteId);
}


function get_recette_by_id(id) {
  $.ajax({
    url: "../API/index.php?controller=recettes&action=getById",
    type: "POST",
    dataType: 'json',
    data: {id: id},
    success: function (data) {
      if (data) {
        console.log(data);
        build_recette(data);
      }
    }
  });
}

function build_recette(data) {
  var steps = JSON.parse(data.array_to_json);
  var steps_container = $("#steps_container");
  var colors = ["1abc9c","2ecc71","3498db","9b59b6","34495e","f1c40f","e67e22","e74c3c"];
  steps.forEach((instruction, step) => {
    color = colors[step + Math.floor(Math.random()*10) % colors.length]
    steps_container.append(`
      <div class="carousel-item white-text" style="background: #${color}" href="#two!">
      <h2>Etape ${step+1}</h2>
      <p class="white-text instruction">${instruction}</p>
      </div>
      `)
    })

    $('.carousel.carousel-slider').carousel({full_width: true});
  }

  function next() {
    $('.carousel.carousel-slider').carousel("next");
  }

  function prev() {
    $('.carousel.carousel-slider').carousel("next");
  }






  if (annyang) {
    annyang.setLanguage('fr-FR');
    console.log("ANNYANG")
    var commands = {
      'suivant':   next(),
      'precedent': prev()
    };
    annyang.addCommands(commands);
    annyang.start();


  } else {
    console.log("NO ANNYANG");
  }
