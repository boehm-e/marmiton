HTMLElement.prototype.removeClass = function(classToRemove) {
    var split = this.className.split(" ");
    split.splice(split.indexOf(classToRemove), 1).join(" ");
    this.className = split;
};

HTMLElement.prototype.addClass = function(classToAdd) {
    if (!this.hasClass(classToAdd))
	this.className += " " + classToAdd;
};

HTMLElement.prototype.hasClass = function(classInQuestion) {
    return this.className.indexOf(classInQuestion) != -1;
};

HTMLElement.prototype.toogleClass = function(className) {
    if (this.hasClass(className))
	this.removeClass(className);
    else
	this.addClass(className);
};

HTMLElement.prototype.remove = function() {
    this.parentNode.removeChild(this);
};






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
