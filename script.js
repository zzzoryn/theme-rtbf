// Vanilla JS debounce function, by Josh W. Comeau:
// https://www.joshwcomeau.com/snippets/javascript/debounce/
function debounce(callback, wait) {
  let timeoutId = null;
  return (...args) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      callback.apply(null, args);
    }, wait);
  };
}

// Define variables for search field
let searchFormFilledClassName = "search-has-value";
let searchFormSelector = "form[role='search']";

// Clear the search input, and then return focus to it
function clearSearchInput(event) {
  event.target.closest(searchFormSelector).classList.remove(searchFormFilledClassName);

  let input;
  if (event.target.tagName === "INPUT") {
    input = event.target;
  } else if (event.target.tagName === "BUTTON") {
    input = event.target.previousElementSibling;
  } else {
    input = event.target.closest("button").previousElementSibling;
  }
  input.value = "";
  input.focus();
}

// Have the search input and clear button respond
// when someone presses the escape key, per:
// https://twitter.com/adambsilver/status/1152452833234554880
function clearSearchInputOnKeypress(event) {
  const searchInputDeleteKeys = ["Delete", "Escape"];
  if (searchInputDeleteKeys.includes(event.key)) {
    clearSearchInput(event);
  }
}

// Create an HTML button that all users -- especially keyboard users --
// can interact with, to clear the search input.
// To learn more about this, see:
// https://adrianroselli.com/2019/07/ignore-typesearch.html#Delete
// https://www.scottohara.me/blog/2022/02/19/custom-clear-buttons.html
function buildClearSearchButton(inputId) {
  const button = document.createElement("button");
  button.setAttribute("type", "button");
  button.setAttribute("aria-controls", inputId);
  button.classList.add("clear-button");
  const buttonLabel = window.searchClearButtonLabelLocalized;
  const icon = `<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' focusable='false' role='img' viewBox='0 0 12 12' aria-label='${buttonLabel}'><path stroke='currentColor' stroke-linecap='round' stroke-width='2' d='M3 9l6-6m0 6L3 3'/></svg>`;
  button.innerHTML = icon;
  button.addEventListener("click", clearSearchInput);
  button.addEventListener("keyup", clearSearchInputOnKeypress);
  return button;
}

// Append the clear button to the search form
function appendClearSearchButton(input, form) {
  searchClearButton = buildClearSearchButton(input.id);
  form.append(searchClearButton);
  if (input.value.length > 0) {
    form.classList.add(searchFormFilledClassName);
  }
}

// Add a class to the search form when the input has a value;
// Remove that class from the search form when the input doesn't have a value.
// Do this on a delay, rather than on every keystroke.
const toggleClearSearchButtonAvailability = debounce(function(event) {
  const form = event.target.closest(searchFormSelector);
  form.classList.toggle(searchFormFilledClassName, event.target.value.length > 0);
}, 200)

document.addEventListener('DOMContentLoaded', function() {
  // Key map
  var ENTER = 13;
  var ESCAPE = 27;
  var SPACE = 32;
  var UP = 38;
  var DOWN = 40;
  var TAB = 9;

  function closest (element, selector) {
    if (Element.prototype.closest) {
      return element.closest(selector);
    }
    do {
      if (Element.prototype.matches && element.matches(selector)
        || Element.prototype.msMatchesSelector && element.msMatchesSelector(selector)
        || Element.prototype.webkitMatchesSelector && element.webkitMatchesSelector(selector)) {
        return element;
      }
      element = element.parentElement || element.parentNode;
    } while (element !== null && element.nodeType === 1);
    return null;
  }

  // Set up clear functionality for the search field
  const searchForms = [...document.querySelectorAll(searchFormSelector)];
  const searchInputs = searchForms.map(form => form.querySelector("input[type='search']"));
  searchInputs.forEach((input) => {
    appendClearSearchButton(input, input.closest(searchFormSelector));
    input.addEventListener("keyup", clearSearchInputOnKeypress);
    input.addEventListener("keyup", toggleClearSearchButtonAvailability);
  });

  // social share popups
  Array.prototype.forEach.call(document.querySelectorAll('.share a'), function(anchor) {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      window.open(this.href, '', 'height = 500, width = 500');
    });
  });

  // In some cases we should preserve focus after page reload
  function saveFocus() {
    var activeElementId = document.activeElement.getAttribute("id");
    sessionStorage.setItem('returnFocusTo', '#' + activeElementId);
  }
  var returnFocusTo = sessionStorage.getItem('returnFocusTo');
  if (returnFocusTo) {
    sessionStorage.removeItem('returnFocusTo');
    var returnFocusToEl = document.querySelector(returnFocusTo);
    returnFocusToEl && returnFocusToEl.focus && returnFocusToEl.focus();
  }

  // show form controls when the textarea receives focus or backbutton is used and value exists
  var commentContainerTextarea = document.querySelector('.comment-container textarea'),
    commentContainerFormControls = document.querySelector('.comment-form-controls, .comment-ccs');

  if (commentContainerTextarea) {
    commentContainerTextarea.addEventListener('focus', function focusCommentContainerTextarea() {
      commentContainerFormControls.style.display = 'block';
      commentContainerTextarea.removeEventListener('focus', focusCommentContainerTextarea);
    });

    if (commentContainerTextarea.value !== '') {
      commentContainerFormControls.style.display = 'block';
    }
  }

  // Expand Request comment form when Add to conversation is clicked
  var showRequestCommentContainerTrigger = document.querySelector('.request-container .comment-container .comment-show-container'),
    requestCommentFields = document.querySelectorAll('.request-container .comment-container .comment-fields'),
    requestCommentSubmit = document.querySelector('.request-container .comment-container .request-submit-comment');

  if (showRequestCommentContainerTrigger) {
    showRequestCommentContainerTrigger.addEventListener('click', function() {
      showRequestCommentContainerTrigger.style.display = 'none';
      Array.prototype.forEach.call(requestCommentFields, function(e) { e.style.display = 'block'; });
      requestCommentSubmit.style.display = 'inline-block';

      if (commentContainerTextarea) {
        commentContainerTextarea.focus();
      }
    });
  }

  // Mark as solved button
  var requestMarkAsSolvedButton = document.querySelector('.request-container .mark-as-solved:not([data-disabled])'),
    requestMarkAsSolvedCheckbox = document.querySelector('.request-container .comment-container input[type=checkbox]'),
    requestCommentSubmitButton = document.querySelector('.request-container .comment-container input[type=submit]');

  if (requestMarkAsSolvedButton) {
    requestMarkAsSolvedButton.addEventListener('click', function() {
      requestMarkAsSolvedCheckbox.setAttribute('checked', true);
      requestCommentSubmitButton.disabled = true;
      this.setAttribute('data-disabled', true);
      // Element.closest is not supported in IE11
      closest(this, 'form').submit();
    });
  }

  // Change Mark as solved text according to whether comment is filled
  var requestCommentTextarea = document.querySelector('.request-container .comment-container textarea');

  var usesWysiwyg = requestCommentTextarea && requestCommentTextarea.dataset.helper === "wysiwyg";

  function isEmptyPlaintext(s) {
    return s.trim() === '';
  }

  function isEmptyHtml(xml) {
    var doc = new DOMParser().parseFromString(`<_>${xml}</_>`, "text/xml");
    var img = doc.querySelector("img");
    return img === null && isEmptyPlaintext(doc.children[0].textContent);
  }

  var isEmpty = usesWysiwyg ? isEmptyHtml : isEmptyPlaintext;

  if (requestCommentTextarea) {
    requestCommentTextarea.addEventListener('input', function() {
      if (isEmpty(requestCommentTextarea.value)) {
        if (requestMarkAsSolvedButton) {
          requestMarkAsSolvedButton.innerText = requestMarkAsSolvedButton.getAttribute('data-solve-translation');
        }
        requestCommentSubmitButton.disabled = true;
      } else {
        if (requestMarkAsSolvedButton) {
          requestMarkAsSolvedButton.innerText = requestMarkAsSolvedButton.getAttribute('data-solve-and-submit-translation');
        }
        requestCommentSubmitButton.disabled = false;
      }
    });
  }

  // Disable submit button if textarea is empty
  if (requestCommentTextarea && isEmpty(requestCommentTextarea.value)) {
    requestCommentSubmitButton.disabled = true;
  }

  // Submit requests filter form on status or organization change in the request list page
  Array.prototype.forEach.call(document.querySelectorAll('#request-status-select, #request-organization-select'), function(el) {
    el.addEventListener('change', function(e) {
      e.stopPropagation();
      saveFocus();
      closest(this, 'form').submit();
    });
  });

  // Submit requests filter form on search in the request list page
  var quickSearch = document.querySelector('#quick-search');
  quickSearch && quickSearch.addEventListener('keyup', function(e) {
    if (e.keyCode === ENTER) {
      e.stopPropagation();
      saveFocus();
      closest(this, 'form').submit();
    }
  });

  function toggleNavigation(toggle, menu) {
    var isExpanded = menu.getAttribute('aria-expanded') === 'true';
    menu.setAttribute('aria-expanded', !isExpanded);
    toggle.setAttribute('aria-expanded', !isExpanded);
  }

  function closeNavigation(toggle, menu) {
    menu.setAttribute('aria-expanded', false);
    toggle.setAttribute('aria-expanded', false);
    toggle.focus();
  }

  var menuButton = document.querySelector('.js-menu-button-mobile');
  var menuList = document.querySelector('#user-nav-mobile');

  menuButton.addEventListener('click', function(e) {
    e.stopPropagation();
    toggleNavigation(this, menuList);
  });


  menuList.addEventListener('keyup', function(e) {
    if (e.keyCode === ESCAPE) {
      e.stopPropagation();
      closeNavigation(menuButton, this);
    }
  });

  // Toggles expanded aria to collapsible elements
  var collapsible = document.querySelectorAll('.collapsible-nav, .collapsible-sidebar');

  Array.prototype.forEach.call(collapsible, function(el) {
    var toggle = el.querySelector('.collapsible-nav-toggle, .collapsible-sidebar-toggle');

    el.addEventListener('click', function(e) {
      toggleNavigation(toggle, this);
    });

    el.addEventListener('keyup', function(e) {
      if (e.keyCode === ESCAPE) {
        closeNavigation(toggle, this);
      }
    });
  });

  // Submit organization form in the request page
  var requestOrganisationSelect = document.querySelector('#request-organization select');

  if (requestOrganisationSelect) {
    requestOrganisationSelect.addEventListener('change', function() {
      closest(this, 'form').submit();
    });
  }

  // If multibrand search has more than 5 help centers or categories collapse the list
  var multibrandFilterLists = document.querySelectorAll(".multibrand-filter-list");
  Array.prototype.forEach.call(multibrandFilterLists, function(filter) {
    if (filter.children.length > 6) {
      // Display the show more button
      var trigger = filter.querySelector(".see-all-filters");
      trigger.setAttribute("aria-hidden", false);

      // Add event handler for click
      trigger.addEventListener("click", function(e) {
        e.stopPropagation();
        trigger.parentNode.removeChild(trigger);
        filter.classList.remove("multibrand-filter-list--collapsed")
      })
    }
  });

  // If there are any error notifications below an input field, focus that field
  var notificationElm = document.querySelector(".notification-error");
  if (
    notificationElm &&
    notificationElm.previousElementSibling &&
    typeof notificationElm.previousElementSibling.focus === "function"
  ) {
    notificationElm.previousElementSibling.focus();
  }

  // Dropdowns

  function Dropdown(toggle, menu) {
    this.toggle = toggle;
    this.menu = menu;

    this.menuPlacement = {
      top: menu.classList.contains("dropdown-menu-top"),
      end: menu.classList.contains("dropdown-menu-end")
    };

    this.toggle.addEventListener("click", this.clickHandler.bind(this));
    this.toggle.addEventListener("keydown", this.toggleKeyHandler.bind(this));
    this.menu.addEventListener("keydown", this.menuKeyHandler.bind(this));
  }

  Dropdown.prototype = {

    get isExpanded() {
      return this.menu.getAttribute("aria-expanded") === "true";
    },

    get menuItems() {
      return Array.prototype.slice.call(this.menu.querySelectorAll("[role='menuitem']"));
    },

    dismiss: function() {
      if (!this.isExpanded) return;

      this.menu.setAttribute("aria-expanded", false);
      this.menu.classList.remove("dropdown-menu-end", "dropdown-menu-top");
    },

    open: function() {
      if (this.isExpanded) return;

      this.menu.setAttribute("aria-expanded", true);
      this.handleOverflow();
    },

    handleOverflow: function() {
      var rect = this.menu.getBoundingClientRect();

      var overflow = {
        right: rect.left < 0 || rect.left + rect.width > window.innerWidth,
        bottom: rect.top < 0 || rect.top + rect.height > window.innerHeight
      };

      if (overflow.right || this.menuPlacement.end) {
        this.menu.classList.add("dropdown-menu-end");
      }

      if (overflow.bottom || this.menuPlacement.top) {
        this.menu.classList.add("dropdown-menu-top");
      }

      if (this.menu.getBoundingClientRect().top < 0) {
        this.menu.classList.remove("dropdown-menu-top")
      }
    },

    focusNextMenuItem: function(currentItem) {
      if (!this.menuItems.length) return;

      var currentIndex = this.menuItems.indexOf(currentItem);
      var nextIndex = currentIndex === this.menuItems.length - 1 || currentIndex < 0 ? 0 : currentIndex + 1;

      this.menuItems[nextIndex].focus();
    },

    focusPreviousMenuItem: function(currentItem) {
      if (!this.menuItems.length) return;

      var currentIndex = this.menuItems.indexOf(currentItem);
      var previousIndex = currentIndex <= 0 ? this.menuItems.length - 1 : currentIndex - 1;

      this.menuItems[previousIndex].focus();
    },

    clickHandler: function() {
      if (this.isExpanded) {
        this.dismiss();
      } else {
        this.open();
      }
    },

    toggleKeyHandler: function(e) {
      switch (e.keyCode) {
        case ENTER:
        case SPACE:
        case DOWN:
          e.preventDefault();
          this.open();
          this.focusNextMenuItem();
          break;
        case UP:
          e.preventDefault();
          this.open();
          this.focusPreviousMenuItem();
          break;
        case ESCAPE:
          this.dismiss();
          this.toggle.focus();
          break;
      }
    },

    menuKeyHandler: function(e) {
      var firstItem = this.menuItems[0];
      var lastItem = this.menuItems[this.menuItems.length - 1];
      var currentElement = e.target;

      switch (e.keyCode) {
        case ESCAPE:
          this.dismiss();
          this.toggle.focus();
          break;
        case DOWN:
          e.preventDefault();
          this.focusNextMenuItem(currentElement);
          break;
        case UP:
          e.preventDefault();
          this.focusPreviousMenuItem(currentElement);
          break;
        case TAB:
          if (e.shiftKey) {
            if (currentElement === firstItem) {
              this.dismiss();
            } else {
              e.preventDefault();
              this.focusPreviousMenuItem(currentElement);
            }
          } else if (currentElement === lastItem) {
            this.dismiss();
          } else {
            e.preventDefault();
            this.focusNextMenuItem(currentElement);
          }
          break;
        case ENTER:
        case SPACE:
          e.preventDefault();
          currentElement.click();
          break;
      }
    }
  }

  var dropdowns = [];
  var dropdownToggles = Array.prototype.slice.call(document.querySelectorAll(".dropdown-toggle"));

  dropdownToggles.forEach(function(toggle) {
    var menu = toggle.nextElementSibling;
    if (menu && menu.classList.contains("dropdown-menu")) {
      dropdowns.push(new Dropdown(toggle, menu));
    }
  });

  document.addEventListener("click", function(evt) {
    dropdowns.forEach(function(dropdown) {
      if (!dropdown.toggle.contains(evt.target)) {
        dropdown.dismiss();
      }
    });
  });
});

$(function () {
    {
        var unknown = '-';

        // screen
        var screenSize = '';
        if (screen.width) {
            width = (screen.width) ? screen.width : '';
            height = (screen.height) ? screen.height : '';
            screenSize += '' + width + " x " + height;
        }

        // browser
        var nVer = navigator.appVersion;
        var nAgt = navigator.userAgent;
        var browser = navigator.appName;
        var version = '' + parseFloat(navigator.appVersion);
        var majorVersion = parseInt(navigator.appVersion, 10);
        var nameOffset, verOffset, ix;

        // Opera
        if ((verOffset = nAgt.indexOf('Opera')) != -1) {
            browser = 'Opera';
            version = nAgt.substring(verOffset + 6);
            if ((verOffset = nAgt.indexOf('Version')) != -1) {
                version = nAgt.substring(verOffset + 8);
            }
        }
        // Opera Next
        if ((verOffset = nAgt.indexOf('OPR')) != -1) {
            browser = 'Opera';
            version = nAgt.substring(verOffset + 4);
        }
        // Legacy Edge
        else if ((verOffset = nAgt.indexOf('Edge')) != -1) {
            browser = 'Microsoft Legacy Edge';
            version = nAgt.substring(verOffset + 5);
        }
        // Edge (Chromium)
        else if ((verOffset = nAgt.indexOf('Edg')) != -1) {
            browser = 'Microsoft Edge';
            version = nAgt.substring(verOffset + 4);
        }
        // MSIE
        else if ((verOffset = nAgt.indexOf('MSIE')) != -1) {
            browser = 'Microsoft Internet Explorer';
            version = nAgt.substring(verOffset + 5);
        }
        // Chrome
        else if ((verOffset = nAgt.indexOf('Chrome')) != -1) {
            browser = 'Chrome';
            version = nAgt.substring(verOffset + 7);
        }
        // Safari
        else if ((verOffset = nAgt.indexOf('Safari')) != -1) {
            browser = 'Safari';
            version = nAgt.substring(verOffset + 7);
            if ((verOffset = nAgt.indexOf('Version')) != -1) {
                version = nAgt.substring(verOffset + 8);
            }
        }
        // Firefox
        else if ((verOffset = nAgt.indexOf('Firefox')) != -1) {
            browser = 'Firefox';
            version = nAgt.substring(verOffset + 8);
        }
        // MSIE 11+
        else if (nAgt.indexOf('Trident/') != -1) {
            browser = 'Microsoft Internet Explorer';
            version = nAgt.substring(nAgt.indexOf('rv:') + 3);
        }
        // Other browsers
        else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) < (verOffset = nAgt.lastIndexOf('/'))) {
            browser = nAgt.substring(nameOffset, verOffset);
            version = nAgt.substring(verOffset + 1);
            if (browser.toLowerCase() == browser.toUpperCase()) {
                browser = navigator.appName;
            }
        }
        // trim the version string
        if ((ix = version.indexOf(';')) != -1) version = version.substring(0, ix);
        if ((ix = version.indexOf(' ')) != -1) version = version.substring(0, ix);
        if ((ix = version.indexOf(')')) != -1) version = version.substring(0, ix);

        majorVersion = parseInt('' + version, 10);
        if (isNaN(majorVersion)) {
            version = '' + parseFloat(navigator.appVersion);
            majorVersion = parseInt(navigator.appVersion, 10);
        }

        // mobile version
        var mobile = /Mobile|mini|Fennec|Android|iP(ad|od|hone)/.test(nVer);

        // cookie
        var cookieEnabled = (navigator.cookieEnabled) ? true : false;

        if (typeof navigator.cookieEnabled == 'undefined' && !cookieEnabled) {
            document.cookie = 'testcookie';
            cookieEnabled = (document.cookie.indexOf('testcookie') != -1) ? true : false;
        }

        // system
        var os = unknown;
        var clientStrings = [
            {s:'Windows 10', r:/(Windows 10.0|Windows NT 10.0)/},
            {s:'Windows 8.1', r:/(Windows 8.1|Windows NT 6.3)/},
            {s:'Windows 8', r:/(Windows 8|Windows NT 6.2)/},
            {s:'Windows 7', r:/(Windows 7|Windows NT 6.1)/},
            {s:'Windows Vista', r:/Windows NT 6.0/},
            {s:'Windows Server 2003', r:/Windows NT 5.2/},
            {s:'Windows XP', r:/(Windows NT 5.1|Windows XP)/},
            {s:'Windows 2000', r:/(Windows NT 5.0|Windows 2000)/},
            {s:'Windows ME', r:/(Win 9x 4.90|Windows ME)/},
            {s:'Windows 98', r:/(Windows 98|Win98)/},
            {s:'Windows 95', r:/(Windows 95|Win95|Windows_95)/},
            {s:'Windows NT 4.0', r:/(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/},
            {s:'Windows CE', r:/Windows CE/},
            {s:'Windows 3.11', r:/Win16/},
            {s:'Android', r:/Android/},
            {s:'Open BSD', r:/OpenBSD/},
            {s:'Sun OS', r:/SunOS/},
            {s:'Chrome OS', r:/CrOS/},
            {s:'Linux', r:/(Linux|X11(?!.*CrOS))/},
            {s:'iOS', r:/(iPhone|iPad|iPod)/},
            {s:'Mac OS X', r:/Mac OS X/},
            {s:'Mac OS', r:/(Mac OS|MacPPC|MacIntel|Mac_PowerPC|Macintosh)/},
            {s:'QNX', r:/QNX/},
            {s:'UNIX', r:/UNIX/},
            {s:'BeOS', r:/BeOS/},
            {s:'OS/2', r:/OS\/2/},
            {s:'Search Bot', r:/(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/}
        ];
        for (var id in clientStrings) {
            var cs = clientStrings[id];
            if (cs.r.test(nAgt)) {
                os = cs.s;
                break;
            }
        }

        var osVersion = unknown;

        if (/Windows/.test(os)) {
            osVersion = /Windows (.*)/.exec(os)[1];
            os = 'Windows';
        }

        switch (os) {
            case 'Mac OS':
            case 'Mac OS X':
            case 'Android':
                osVersion = /(?:Android|Mac OS|Mac OS X|MacPPC|MacIntel|Mac_PowerPC|Macintosh) ([\.\_\d]+)/.exec(nAgt)[1];
                break;

            case 'iOS':
                osVersion = /OS (\d+)_(\d+)_?(\d+)?/.exec(nVer);
                osVersion = osVersion[1] + '.' + osVersion[2] + '.' + (osVersion[3] | 0);
                break;
        }

        // flash (you'll need to include swfobject)
        /* script src="//ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js" */
        var flashVersion = 'no check';
        if (typeof swfobject != 'undefined') {
            var fv = swfobject.getFlashPlayerVersion();
            if (fv.major > 0) {
                flashVersion = fv.major + '.' + fv.minor + ' r' + fv.release;
            }
            else  {
                flashVersion = unknown;
            }
        }
    }

    window.jscd = {
        screen: screenSize,
        browser: browser,
        browserVersion: version,
        browserMajorVersion: majorVersion,
        mobile: mobile,
        os: os,
        osVersion: osVersion,
        cookies: cookieEnabled,
        flashVersion: flashVersion
    };

  var $technicalSpecificationField = $('#request_custom_fields_13077908080401');

  if ($technicalSpecificationField.length) {
    $.get('https://api.db-ip.com/v2/free/self', function(data) {
      var fieldValue = 'Platform: ' + window.jscd.os + ' ' + window.jscd.osVersion;
  		fieldValue += '\nBrowser: ' + window.jscd.browser + ' ' + window.jscd.browserVersion;
  		fieldValue += '\nViewport: ' + window.jscd.screen;
      fieldValue += '\nLanguage: ' + navigator.language;
      fieldValue += '\nIP: ' + data.ipAddress;
      fieldValue += '\nAddress: ' + data.city + ', ' + data.stateProv + ', ' + data.countryName;

      $technicalSpecificationField.val(fieldValue);
    });
  }
});

// RTBF Custom
$(function() {

  // get user infos
  var roles = ['anonymous', 'end_user', 'agent', 'manager'];

  var user_role = window.HelpCenter.user.role
  var user_locale = window.HelpCenter.user.locale !== undefined ? window.HelpCenter.user.locale : 'fr-fr';

  if(roles.indexOf(user_role) === -1 && user_role !== undefined) {
    roles.push(user_role);
  }
  user_role = user_role === undefined ? roles[0] : user_role;

  // get id and template name
  var urlParams = new URLSearchParams(window.location.search);
  var _location = window.location.href.split('/fr-fr/');
  if (_location.length > 1) {
    var _split = _location[1].split('-')[0];
    var _templatename = _split.split('/')[0];
    var _templateid = parseInt(_split.split('/')[1]);
  }

  if(urlParams.has('query')) {
    $('#query').val(urlParams.get("query"))
  }

  // get navigation info via breadcrumb
  const $breadcrumb = $('.breadcrumbs');
  let breadcrumb = [];
  if($breadcrumb.length > 0) {
    $breadcrumb.find('li').each(function() {
      const $link = $(this).find('a');
      const label = $(this).text().trim();
      const urlParams = $link.length > 0 ? $link.attr('href').split('/fr-fr/') : [];
      let split, type = null, id = null;

      if (urlParams.length > 1) {
        split = urlParams[1].split('/');
        type = split[0];
        id = parseInt(split[1].split('-')[0]);
      }

      breadcrumb.push({ "label": label, "type": type, "id": id });
    })

    if(_templatename === 'articles') {
      breadcrumb.push({
        "label": $('#main-content h1:first-of-type').text().trim(),
        "type": _templatename,
        "id": _templateid
      });
    }
  }

  var findCategory = function(breadcrumb) {
      for (var i = 0; i < breadcrumb.length; i++) {
          if (breadcrumb[i].type === "categories") {
              return breadcrumb[i];
          }
      }
      return null;
  }

  var categoriesList = function(_categories) {
    $.ajax({
      url: '/api/v2/help_center/categories.json',
      type: 'GET',
      dataType: 'json',
      success: _categories
    });
  };

  var $aside = $('.js-aside');
  if($aside.length > 0) {
    var currentCategoryId = _templatename === 'categories' ? _templateid : findCategory(breadcrumb).id;
    var _list = ''
    var itemClass = $aside.data('item-class') + ' ';
    var currentItemClass = $aside.data('current-item-class');
    var iconClass = $aside.data('icon-class') + ' ';
    var currentIconClass = $aside.data('current-icon-class');
    var icon, url;

    var excludedCategories = ['General'];
    if(!['agent', 'manager'].includes(user_role)) {
      excludedCategories.push('Interne');
    }

    categoriesList(function(data){
      $(data.categories).each(function (idx, itm) {
        if (!excludedCategories.includes(itm.name)) {
          icon = $('.js-icons').find('.js-icon-'+itm.id).length > 0 ? $('.js-icons').find('.js-icon-'+itm.id).clone().addClass(iconClass + ' ' + (currentCategoryId === itm.id ? currentIconClass : ''))[0].outerHTML : '';
          url = itm.html_url.split('rtbf.be')[1];
          _list = _list + '<li>'+
            '<a class="' + itemClass + ' ' + (currentCategoryId === itm.id ? currentItemClass : '') +
            '" href="' + itm.html_url + '" id="' + itm.id + '">' +
            icon +
            itm.name +
            '</a></li>'
        }
      });
      $('.js-aside').find('.js-list').html(_list);
    });

    var $listToggle = $('.js-list-toggle');
    var $listToggleLabel = $listToggle.find('.js-list-toggle-label');
    var $target = $('#' + $listToggle.attr('aria-controls'));

    $listToggle.on('click', function() {
      var ariaExpandedValue = $(this).attr('aria-expanded')
      var isExpanded = ariaExpandedValue === 'true';
      var labelOn = $(this).data('on')
      var labelOff = $(this).data('off')

      $(this).attr('aria-expanded', !isExpanded)

      var label = !isExpanded ? labelOn : labelOff;
      $listToggleLabel.text(label);
      $target.toggleClass('hidden', isExpanded)
      $listToggle.find('.js-icon').toggleClass('rotate-180', !isExpanded)
    })
  }

  // Shortcut List
  const shortcutContentHTML = $('.js-shortcut-content').html();
  const $shortcutPlacholder = $('.js-shortcut-list');

  if($shortcutPlacholder.length > 0) {
    $shortcutPlacholder.html(shortcutContentHTML)
  }
});

// P+ AZ
// lien entre article et formulaire
$(function() {
  var afticleForms = {
    connexion: 19855456949137,
    alerte: 20100548744337,
    mediation: 18756575623057
  };

  $('[data-article-contact]').each(function(i, element) {
    var $element = $(element);
    var labelName = $element.attr('data-article-contact').split('|').filter(function(identifier) {
      return !!afticleForms[identifier.toLowerCase()];
    })[0];

    var newRequestURL = '/hc/' + window.theme.locale + '/requests/new';

    if (labelName) {
      newRequestURL += '?ticket_form_id=' + afticleForms[labelName.toLowerCase()];
    }

    $element.attr('href', newRequestURL);
  });
});
