window.onhashchange = window.onload = function() {
  var recetteId = window.location.hash.slice(1, window.location.hash.length)
  console.log(recetteId)
  get_recette_by_id(recetteId);
}

function rate_recette() {
  $.ajax({
    url: "../API/index.php?controller=recettes&action=comment",
    type: "POST",
    dataType: 'json',
    data: {
      author: $('#first_name').val() + ' ' + $('#last_name').val(),
      comment: $('#comment').val(),
      rate: 5,
      id: window.location.hash.replace('#', '')
    },
    success: function (data) {
      if (data) {
        build_recette(data);
      }
    }
  });
}

function get_recette_by_id(id) {
  $.ajax({
    url: "../API/index.php?controller=recettes&action=getById",
    type: "POST",
    dataType: 'json',
    data: {id: id},
    success: function (data) {
      console.log(data);
      if (data) {
        build_recette(data);
      }
    }
  });
}

function build_recette(data) {
  var colors = ["1abc9c","2ecc71","3498db","9b59b6","34495e","f1c40f","e67e22","e74c3c"];

  // INGREDIENTS
  var ingredients_container = $("#ingredients>ul");
  var ingredients = JSON.parse(data.ingredients);
  var color = colors[Math.floor(Math.random()*10) % colors.length]
  $("#ingredients").css('background', '#'+color).css('border', '0px')
  $("#ingredients > ul > li").css('background', '#'+color).css('border', '0px').css('color', 'white')
  ingredients.forEach((v,w) => {
    ingredients_container.append(`<li class="collection-item" style="border: 0px; color: white;background: #${color}"><div>${v.amount}${v.unit} ${v.name}<a target="blank" href="https://www.amazon.fr/s/ref=nb_sb_noss_2?__mk_fr_FR=%C3%85M%C3%85%C5%BD%C3%95%C3%91&url=srs%3D10547409031%26search-alias%3Dpantry&field-keywords=${v.name}" class="secondary-content"><i class="material-icons">send</i></a></div></li>`)
  })

  // STEPS
  var steps = JSON.parse(data.array_to_json);
  var steps_container = $("#steps_container");
  steps.forEach((instruction, step) => {
    color = colors[step + Math.floor(Math.random()*10) % colors.length]
    steps_container.append(`
      <div class="carousel-item white-text" style="background: #${color}" href="#two!">
      <h2>Etape ${step+1}</h2>
      <p class="white-text instruction">${instruction}</p>
      </div>
      `)
    })


    // COMMENTAIRES






    $('.carousel.carousel-slider').carousel({full_width: true});
  }



  function next() {
    $('.carousel.carousel-slider').carousel("next");
  }

  function prev() {
    $('.carousel.carousel-slider').carousel("prev");
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
