// Perform search
var $input = $("#autocompleteState");
function updateSearch(data) {
  if ($input.hasClass('autocomplete')) {
    var $array = data;
    $inputDiv = $input.closest('.input-field'); // Div to append on
    if ($array !== '') {
      var $html = '<ul class="autocomplete-content hide">';

      for (var i = 0; i < $array.length; i++) {
        if ($array[i]['path'] !== '' && $array[i]['path'] !== undefined && $array[i]['path'] !== null && $array[i]['class'] !== undefined && $array[i]['class'] !== '') {
          $html += '<li class="autocomplete-option"><img src="' + $array[i]['path'] + '" class="' + $array[i]['class'] + '"><span>' + $array[i]['value'] + '</span></li>';
        } else {
          $html += '<li class="autocomplete-option"><span>' + $array[i]['value'] + '</span></li>';
        }
      }
      $html += '</ul>';
      $inputDiv.append($html);
      function highlight(string) {
        $('.autocomplete-content li').each(function() {
          var matchStart = $(this).text().toLowerCase().indexOf("" + string.toLowerCase() + ""),
          matchEnd = matchStart + string.length - 1,
          beforeMatch = $(this).text().slice(0, matchStart),
          matchText = $(this).text().slice(matchStart, matchEnd + 1),
          afterMatch = $(this).text().slice(matchEnd + 1);
          $(this).html("<span>" + beforeMatch + "<span class='highlight'>" + matchText + "</span>" + afterMatch + "</span>");
        });
      }
      $('.autocomplete-option').click(function() {
        $input.val($(this).text().trim());
        $('.autocomplete-option').addClass('hide');
      });
    } else {
      return false;
    }
  }
}

var requests = [];
// call api
$(document).on('keyup', $input, function() {
  $("#loader").css('display', 'block');
  var $val = $input.val().trim(),
  $select = $('.autocomplete-content');
  $select.css('width',$input.width());
  if ($val != '' && $('#autocompleteState').is(":focus")) {
    req = $.get( "../API/index.php?controller=recettes&action=search&q="+$val, function( data ) {
      var res = JSON.parse(data);
      categories(res);
      console.log(res);
      updateSearch(res);
      $select.children('li').addClass('hide');
      $select.children('li').filter(function() {
        $select.removeClass('hide'); // Show results
        var check = true;
        for (var i in $val) {
          if ($val[i].toLowerCase() !== $(this).text().toLowerCase()[i])
          check = false;
        };
        return check ? $(this).text().toLowerCase().indexOf($val.toLowerCase()) !== -1 : false;
      }).removeClass('hide');
      $("#loader").css('display', 'none');

    })
    // cancel all search requests
    for (var i=0; i<requests.length; i++) {
      requests[i].abort()
      requests.splice(i, 1);
    }
    requests.push(req);
  } else {
    $select.children('li').addClass('hide');
  }
});
