// Perform search


function updateSearch(data) {
    console.log(data);
    if (SEARCH.hasClass('autocomplete') && Array.isArray(data)) {
	var inputContainer = SEARCH.parentNode;
	var ul = document.createElement('ul'); //'<ul class="autocomplete-content hide">';
	var li = data.map(function(el, i) {
	    return ['', undefined, null].filter(function(no) {return no == el.path || no == el.class;}) == 0
		? '<li class="autocomplete-option"><img src="' + el.path + '" class="' + el.class + '"><span>' + el.value + '</span></li>'
		: '<li class="autocomplete-option"><span>' + el.value + '</span></li>';
	}).join('');
	ul.className = 'autocomplete-content hide';
	ul.innerHTML = li;
	inputContainer.appendChild(ul);

	function highlight(string) {
	    Array.from(document.querySelectorAll('.autocomplete-content li')).forEach(function(li) {
		var matchStart = li.textContent.toLowerCase().indexOf("" + string.toLowerCase() + ""),
		    matchEnd = matchStart + string.length - 1,
		    beforeMatch = li.textContent.slice(0, matchStart),
		    matchText = li.textContent.slice(matchStart, matchEnd + 1),
		    afterMatch = li.textContent.slice(matchEnd + 1);
		li.innerHTML = "<span>" + beforeMatch + "<span class='highlight'>" + matchText + "</span>" + afterMatch + "</span>";
	    });
	}

	Array.from(C_autocompleteOption).forEach(function (el) {
	    el.onclick = function(e) {
		e.preventDefault();
		e.stopPropagation();
		SEARCH.value = el.textContent.trim();
		Array.from(C_autocompleteOption).forEach(function (el) {
		    el.addClass('hide');
		});
	    };
	});
	return true;
    } else {
	return false;
    }
}

var requests = [];
// call api
$(document).on('keyup', SEARCH, function() {
  $("#loader").css('display', 'block');
  var $val = SEARCH.value.trim(),
  $select = $('.autocomplete-content');
  $select.css('width',SEARCH.offsetWidth);
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
