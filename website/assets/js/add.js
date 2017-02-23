var INGREDIENTS = document.getElementById('ingredients');
var CATEGORY = document.getElementById('category');
var INSTRUCTIONS = document.getElementById('instructions');
var PICTURE = document.getElementById('picture');
var NBR = document.getElementById('nbr');
var NAME = document.getElementById('name');
var C_plus = document.getElementsByClassName('plus');
var C_remove = document.getElementsByClassName('remove');
var C_ingredients = INGREDIENTS.getElementsByClassName('ingredients');
var C_instructions = INSTRUCTIONS.getElementsByClassName('instructions');
var T_select = document.getElementsByTagName('select');

var plusContent = {
  ingredients: '<li class="collection-item row ingredients"><input placeholder="nom" class="col s5 name"><input placeholder="quantitee" class="col s2 amount"><input placeholder="unite" class="col s3 unit"><i class="material-icons col s1"></i><i class="material-icons col s1 delete" onclick="this.parentNode.remove()">delete</i></li>',
  instructions: '<li class="collection-item row instructions"><textarea placeholder="instruction" class="col s11 instruction"></textarea><i class="material-icons col s1 delete" onclick="this.parentNode.remove()">delete</i></li>'
};

// AFFICHER LES CATEGORIES
xhrRequest.GET({url: "../API/index.php?controller=recettes&action=getCategory"}, function(res) {
  var data = JSON.parse(res.responseText);
  data.forEach(function(optInfo) {
    var opt = document.createElement('option');
    opt.value = optInfo.id;
    opt.innerHTML = optInfo.name;
    CATEGORY.appendChild(opt);
  });
  Array.from(T_select).forEach(function(select) {
    $(select).material_select();
  });
});

document.addEventListener('DOMContentLoaded', function(e) {
  e.preventDefault();
  e.stopPropagation();

  Array.from(C_plus).forEach(function(plus) {
    var parentName = plus.parentNode.parentNode.parentNode.id; // ingredients or instructions
    plus.onclick = function(e){
      e.preventDefault();
      e.stopPropagation();

      var container = parentName == 'ingredients' ? INGREDIENTS : INSTRUCTIONS;
      Array.from(container.getElementsByTagName('ul')).forEach(function(ul) {
        var div = document.createElement('div');
        div.innerHTML = plusContent[parentName];
        ul.appendChild(div);
      });
    };
  });

  Array.from(C_remove).forEach(function(remove) {
    remove.onclick = function(e){
      e.preventDefault();
      e.stopPropagation();
      this.parentNode.parentNode.remove();
    };
  });
});

function buildRecette() {
  var ret = {};
  // GET INGREDIENTS
  var ingredients = Array.from(C_ingredients).map(function(ingredient) {
    var name = ingredient.getElementsByClassName('name')[0].value;
    var amount = ingredient.getElementsByClassName('amount')[0].value;
    var unit = ingredient.getElementsByClassName('unit')[0].value;

    return {name: name, amount: amount, unit: unit};
  });

  var instructions = Array.from(C_instructions).map(function(instruction, i) {
    var name = instruction.getElementsByClassName('instruction')[0].value;
    var index = i;

    return {instruction: name, index: index};
});


  // GET RECETTE
  var name = NAME.value;
  var nbrPersonne = parseInt(NBR.value);
  var category = parseInt(CATEGORY.value);
  var recette = {name: name, nbrPersonne: nbrPersonne, category: category};

  ret.ingredients = ingredients;
  ret.instructions = instructions;
  ret.recette = recette;

  return ret;
}

var similarityTreshHold = 0.8;

function send() {
    var data = new FormData();
    data.append("file_upload", PICTURE.files[0]);
    data.append("recette", JSON.stringify(buildRecette()));

    $.ajax({
	url: "../API/index.php?controller=recettes&action=getAll",
	type: "GET",
	success: function (recettes) {
	    var currentRecette = buildRecette();
	    var currentInstructions = currentRecette.instructions;

	    var cIns = currentInstructions
		    .map(function(el) {return el.instruction;})
		    .sort(function(a, b) {return a < b;});


	    var matchInstructions = recettes.filter(function(recette) {
		var ins = JSON.parse(recette.array_to_json)
			.sort(function(a, b) {return a < b;});

		var similarityTab = cIns.map(function(str1, i) {
		    var str2 = ins[
			ins.map(function(_str2, i) {
			    var sim = similarity(str1, _str2);
			    return {sim: sim, i: i};
			}).sort(function(a, b) {return a.sim < b.sim;})[0].i
		    ];
		    return similarity(str1, str2);
		});

		return similarityTab.reduce(function(pv, cv) {return pv + cv;}, 0) > similarityTreshHold;
	    });

	    var matchTitle = recettes.filter(function(recette) {
		return (similarity(recette.name, currentRecette.recette.name) > similarityTreshHold);
	    });


	    if (matchInstructions.length >= 1 || matchTitle.length >= 1)
		Materialize.toast('Votre recette n\'est pas acceptee car une autre est trop similaire', 4000);

	    $.ajax({
		url: "../API/index.php?controller=recettes&action=upload",
		type: "POST",
		data: data,
		processData: false,
		contentType: false,
		success: function (data) {
		    Materialize.toast('Image enregistree avec success !', 4000);

		}
	    });

	}
    });

}



function wordDistance(str1, str2) {
    str1 = str1.toLowerCase();
    str2 = str2.toLowerCase();

    var costs = [];
    for (var i = 0; i <= str1.length; i++) {
	var lastValue = i;
	for (var j = 0; j <= str2.length; j++) {
	    if (i == 0)
		costs[j] = j;
	    else {
		if (j > 0) {
		    var newValue = costs[j - 1];
		    if (str1.charAt(i - 1) != str2.charAt(j - 1))
			newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
		    costs[j - 1] = lastValue;
		    lastValue = newValue;
		}
	    }
	}
	if (i > 0)
	    costs[str2.length] = lastValue;
    }
    return costs[str2.length];
}

function similarity(str1, str2) {
    var longer = str1;
    var shorter = str2;
    if (str1.length < str2.length) {
	longer = str2;
	shorter = str1;
    }
    return (longer.length == 0) ? 1.0 : (longer.length - wordDistance(longer, shorter)) / parseFloat(longer.length);
}
