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


var xhrRequest = {
    GET: function(obj, callback) {
	var req = new XMLHttpRequest();
	req.open('GET', obj.url, true);
	req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	req.onreadystatechange = function(e) {
	    if (req.readyState == 4) {
		callback({event: e, responseText: req.responseText, status: req.status, xhr: req});
	    }
	};
	req.send();
    },

    POST: function(obj, callback) {
	var fd = new FormData();
	if (obj.jsonParams)
	    Object.keys(obj.jsonParams).forEach(function(key) {
		fd.append(key, obj.jsonParams[key]);
	    });
	var req = new XMLHttpRequest();
	req.open('POST', obj.url, true);
	req.onreadystatechange = function(e) {
	    if (req.readyState == 4)
		callback({event: e, responseText: req.responseText, status: req.status, xhr: req});
	};
	req.send(fd);
    }
};


var SIDEBAR = document.getElementById('sidebar');
var SEARCH = document.getElementById('autocompleteState');
var LOADER = document.getElementById('loader');
var C_autocompleteOption = document.getElementsByClassName('autocomplete-option');
var C_autocompleteContent = document.getElementsByClassName('autocomplete-content');



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
      </div>`);
  }
}

function categories(array) {
    $('#categories').empty();
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
      </div>`);
    }
}

bests();
