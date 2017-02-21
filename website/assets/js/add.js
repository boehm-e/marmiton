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

    var instructions = Array.from(C_ingredients).map(function(instruction, i) {
	var name = instruction.getElementsByClassName('instruction')[0].value;
	var index = i;

	return {instruction: instruction, index: index};
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

function send() {
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
