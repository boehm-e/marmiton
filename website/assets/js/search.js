// Perform search


function updateSearch(data) { // to much ul, find the moment when the ul are to be removed !
    if (SEARCH.hasClass('autocomplete') && Array.isArray(data)) {
	var inputContainer = SEARCH.parentNode;
	var ul = document.createElement('ul');
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
SEARCH.onkeyup = function() {
    var val = SEARCH.value.trim();
    LOADER.style.display = 'block';
    Array.from(C_autocompleteContent).forEach(function(el) {
	el.style.width = SEARCH.offsetWidth + 'px';
    });
    if (val != '' && document.activeElement == SEARCH) {
	var req = xhrRequest.GET({url: "../API/index.php?controller=recettes&action=search&q="+val}, function(data) {
	    var res = JSON.parse(data.responseText);
	    categories(res);
	    updateSearch(res);
	    Array.from(C_autocompleteContent).forEach(function(el) {
		Array.from(el.getElementsByTagName('li')).forEach(function(li) {
		    console.log(li);
		    li.addClass('hide');
		});
	    });
	    Array.from(C_autocompleteContent).forEach(function(el) {
		Array.from(el.getElementsByTagName('li'))
		    .filter(function(li) {
			Array.from(C_autocompleteContent).forEach(function(el) {
				el.removeClass('hide');
			});
			var check = true;
			for (var i in val) {
			    if (val[i].toLowerCase() !== li.textContent.toLowerCase()[i])
				check = false;
			};
			return check ? li.textContent.toLowerCase().indexOf(val.toLowerCase()) !== -1 : false;
		    })
		    .forEach(function(li) {
			li.removeClass('hide');
		    });
		LOADER.style.display = 'none';

	    });
	});
	// cancel all search requests
	requests.forEach(function(request, i, arr) {
	    if (request)
		request.abort();
	    arr.splice(i, 1);
	});
	requests.push(req);
    } else {
	Array.from(C_autocompleteContent).forEach(function(el) {
	    Array.from(el.getElementsByTagName('li')).forEach(function(li) {
		li.addClass('hide');
	    }); // pas exact, only search first level
	}); // children('li').addClass('hide');
    }
};
