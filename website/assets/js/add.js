var INGREDIENTS = document.getElementById('ingredients');
var CATEGORY = document.getElementById('category');
var INSTRUCTION = document.getElementById('instruction');
var PICTURE = document.getElementById('picture');
var NBR = document.getElementById('nbr');
var NAME = document.getElementById('name');
var C_plus = document.getElementsByClassName('plus');
var C_remove = document.getElementsByClassName('remove');
var C_ingredients = INGREDIENTS.getElementsByClassName('ingredients');
var T_select = document.getElementsByTagName('select');

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
	plus.onclick = function(e){
	    e.preventDefault();
	    e.stopPropagation();
	    Array.from(INGREDIENTS.getElementsByTagName('ul')).forEach(function(ul) {
		var div = document.createElement('div');
		div.innerHTML = [
		    '<li class="collection-item row ingredients">',
		    '<input placeholder="nom" class="col s5 name">',
		    '<input placeholder="quantitee" class="col s2 amount">',
		    '<input placeholder="unite" class="col s3 unit">',
		    '<i class="material-icons col s1"></i>',
		    '<i class="material-icons col s1 delete" onclick="this.parentNode.remove()">delete</i>',
		    '</li>'
		].join('');
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

    // GET RECETTE
    var name = NAME.value;
    var nbrPersonne = parseInt(NBR.value);
    var category = parseInt(CATEGORY.value);
    var instruction = INSTRUCTION.value;
    var recette = {name: name, nbrPersonne: nbrPersonne, category: category, instruction: instruction};

    ret.ingredients = ingredients;
    ret.recette = recette;

    return ret;
}

function create() {
    var data = new FormData();
    data.append("file_upload", PICTURE.files[0]);
    data.append("recette", JSON.stringify(buildRecette()));

    $.ajax({
	url: "../API/index.php?controller=recettes&action=upload",
	type: "POST",
	data: data,
	processData: false,
	contentType: false,
	success: function (data) {
            Materialize.toast('Recette enregistree avec success !', 4000);
	}
    });
}
