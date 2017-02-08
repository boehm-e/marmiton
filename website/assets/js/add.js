// AFFICHER LES CATEGORIES
$.get( "../API/index.php?controller=recettes&action=getCategory", function( data ) {
  var data = JSON.parse(data);
  for (var i = 0; i < data.length; i++) {
    $("#category").append(`<option value="${data[i].id}">${data[i].name}</option>`);
  }
  $('select').material_select();
});
$(document).ready(function() {

  $('.plus').click(function(){
    $('#ingredients ul').append(`
      <li class="collection-item row ingredients">
      <input placeholder="nom" class="col s5 name">
      <input placeholder="quantitee" class="col s2 amount">
      <input placeholder="unite" class="col s3 unit">
      <i class="material-icons col s1"></i>
      <i class="material-icons col s1" onclick="this.parentNode.remove()">delete</i>
      </li>
      `);
    })
    $('.remove').click(function(){
      $(this).parent().parent().remove();
    })
  });

  function buildRecette() {
    let ret = {}
    // GET INGREDIENTS
    let ingredients = [];
    $("#ingredients .ingredients").map((v,w) => {
      let name = $(w).find('.name').val();
      let amount = $(w).find('.amount').val();
      let unit = $(w).find('.unit').val();
      ingredients.push({name, amount, unit})
    })

    // GET RECETTE
    let name = $('#name').val();
    let nbrPersonne = parseInt($('#nbr').val());
    let category = parseInt($('#category').val());
    let instruction = $('#instruction').val();
    let recette = {name, nbrPersonne, category, instruction};


    ret.ingredients = ingredients;
    ret.recette = recette;
    return ret;
  }

  // function create() {
  //
  //   var formData = new FormData($("#file"));
  //   console.log(formData);
  //   $.post( "http://localhost/marmiton/index.php?controller=recettes&action=create", { recette: JSON.stringify(buildRecette()) }, function( data ) {
  //     console.log(data);
  //   });
  // }


  function create() {
    var data = new FormData();
    data.append("file_upload", $('#picture')[0].files[0]);
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
