function bests() {
  for (var i = 0; i < 3; i++) {
    $('#best').append(`
      <div class="col s4">
      <div class="card horizontal">
      <div class="card-image">
      <img src="http://lorempixel.com/100/190/nature/7">
      </div>
      <div class="card-stacked">
      <div class="card-content">
      <p>I am a very simple card. I am good at containing small bits of information.</p>
      </div>
      <div class="card-action">
      <a href="#">This is a link</a>
      </div>
      </div>
      </div>
      </div>
      `
    )
  }
}

function categories(array) {
  $('#categories').empty()
  for (var i = 0; i < array.length; i++) {
    $('#categories').append(`
      <div class="col s12 m3">
      <div class="card">
      <div class="card-image">
      <img src="${array[i].picture}">
      <div class="card-action">
      <a href="#">${array[i].name}</a>
      </div>
      </div>
      </div>
      `
    )
  }
}

bests();
