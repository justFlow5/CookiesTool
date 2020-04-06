const body = document.body;

const popup = document.querySelector('#cookie-container');
const cookiesInfo = document.querySelector('#cookies-info');
const cookiesRejection = document.querySelector('#cookie-rejection');

const cookieWrapper = document.querySelector('#cookie-wrapper');

const acceptButton = document.querySelector('#accept');
const rejectButton = document.querySelector('#reject');

const acceptSecond = document.querySelector('#accept-second');
const getBack = document.querySelector('#getBack');

const vendorsButton = document.querySelector('#vendors-button');
const backButton = document.querySelector('.back-btn-handler');
const selectAllCheckbox = document.querySelector('#select-all-input');

let allVendors;
let agreedVendors;
let dataFromAPI;

// const correctIcon = document.querySelector('#correctIcon');

// const selectAllLabel = document.querySelector('#select-all-label');

const vendorsContainer = document.querySelector(
  '#vendor-list-content-container'
);

let isVendorList = false;

const displayPopup = () => {
  popup.classList.add('active');
};

acceptButton.addEventListener('click', () => {
  handleDecision('accept');
});

acceptSecond.addEventListener('click', () => {
  handleDecision('accept');
});

rejectButton.addEventListener('click', () => {
  handleDecision('reject');
});

getBack.addEventListener('click', () => {
  cookiesRejection.classList.add('hide');
  cookiesInfo.classList.remove('hide');
});

const handleDecision = (decision) => {
  if (decision === 'accept') {
    const checkedVendors = getAgreedVendorsData();
    setCookie('vendors', `${checkedVendors}`, 1);
    cookieWrapper.style.display = 'none';

    window.removeEventListener('scroll', noScroll);
  } else if (decision === 'reject') {
    cookiesInfo.classList.add('hide');
    cookiesRejection.classList.remove('hide');
  }
};

// body.addEventListener('load', displayPopup);
const toggleVendors = () => {
  const vendors = document.getElementById('vendor-list');

  if (isVendorList) {
    vendors.classList.add('hide');
  } else {
    vendors.classList.remove('hide');
  }

  isVendorList = !isVendorList;
};
//  GET VENDORS FROM API
const getVendors = async (url) => {
  const response = await fetch(url);
  const json = await response.json();
  //   const vendorList = json.vendors;
  //   console.log(vendorList);
  return json.vendors;
};

let vendorList = getVendors('https://api.optad360.com/vendorlist');

//  END GET VENDORS FROM API

vendorsButton.addEventListener('click', () => {
  toggleVendors();
});

backButton.addEventListener('click', () => {
  toggleVendors();
});

selectAllCheckbox.addEventListener('change', () => {
  if (selectAllCheckbox.checked) {
    allVendors.forEach((checkbox) => {
      checkbox.checked = true;
    });
  } else {
    allVendors.forEach((checkbox) => {
      checkbox.checked = false;
    });
  }
});

const allVendorsChecked = (checkboxesGroup) => {
  const checkboxesArray = Array.from(checkboxesGroup);

  let allChecked = checkboxesArray.every((checkbox) => {
    // if (!checkbox.checked) return false;
    return checkbox.checked === true;
  });

  return allChecked;
};

const loadVendors = async () => {
  dataFromAPI = await vendorList;
  dataFromAPI.forEach((vendor) => {
    let vendorItem = document.createElement('li');
    let vendorInfo = document.createElement('div');
    let vendorCompany = document.createElement('p');
    let vendorLink = document.createElement('a');
    let checkboxContainer = document.createElement('div');
    let checkboxInput = document.createElement('input');
    let checkboxLabel = document.createElement('label');

    // CREATING DOM TREE FOR EACH VENDOR
    vendorItem.appendChild(vendorInfo);
    vendorItem.appendChild(checkboxContainer);

    vendorInfo.appendChild(vendorCompany);
    vendorInfo.appendChild(vendorLink);

    checkboxContainer.appendChild(checkboxInput);
    checkboxContainer.appendChild(checkboxLabel);

    // SETTING ATTRIBUTES
    vendorItem.setAttribute('class', 'vendor-item');
    vendorInfo.setAttribute('class', 'vendor-info');
    vendorCompany.setAttribute('class', 'vendor-company');
    checkboxContainer.setAttribute('class', 'checkbox-container');

    setAttributes(vendorLink, {
      href: `${vendor.policyUrl}`,
      class: 'vendor-link',
      target: '_blank',
      rel: 'noopener noreferrer',
    });

    setAttributes(checkboxInput, {
      id: `${vendor.id}`,
      class: 'checkbox-input checkbox-input-vendor',
      type: 'checkbox',
      checked: 'true',
    });

    setAttributes(checkboxLabel, {
      class: 'checkbox-label',
      for: `${vendor.id}`,
    });

    vendorLink.innerHTML = 'Wyświetl politykę prywatności';

    // SETTING COMPANY NAME
    vendorCompany.innerHTML = vendor.name;

    checkboxInput.addEventListener('change', () => {
      if (!checkboxInput.checked) {
        selectAllCheckbox.checked = false;
      } else {
        if (allVendorsChecked(allVendors)) {
          selectAllCheckbox.checked = true;
        }
      }
    });
    // ADDING COMPLETE VENDOR ITEM TO THE VENDOR LIST
    // console.log('vendorLink', vendorItem);
    vendorsContainer.appendChild(vendorItem);
  });
  allVendors = document.querySelectorAll('.checkbox-input-vendor');
};

loadVendors();

// HELPER FUNCTIONS

// set multiple attributes to a given element
const setAttributes = (el, attrs) => {
  for (let key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
};

// ADDING 1 DAY TO COOKIE
function setCookie(c_name, value, exdays) {
  var c_value = encodeURI(value);

  if (exdays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    c_value += '; expires=' + exdate.toUTCString();
  }
  document.cookie = c_name + '=' + c_value;
}

function getCookie(c_name) {
  var i,
    x,
    y,
    cookies = document.cookie.split(';');

  for (i = 0; i < cookies.length; i++) {
    x = cookies[i].substr(0, cookies[i].indexOf('='));
    y = cookies[i].substr(cookies[i].indexOf('=') + 1);
    x = x.replace(/^\s+|\s+$/g, '');

    if (x === c_name) {
      return decodeURI(y);
    }
  }
}

// window.setTimeout(function() {
//   // When the cookie exists, do not show the popup!
//   if (getCookie('displayedPopupNewsletter')) {
//     return;
//   }

//   DiviPopup.openPopup('#get-newsletter');

//   // The popup was displayed. Set the cookie for 1 day.
//   setCookie('displayedPopupNewsletter', 'yes', 1);
// }, 3000);

const getAgreedVendorsData = () => {
  // let theArray = Array.from(allVendors);
  let agreedVendors = getAgreedVendors();

  return JSON.stringify(
    dataFromAPI.filter((vendorApi) =>
      agreedVendors.some(
        (vendorAgreed) => vendorApi.id === parseInt(vendorAgreed, 10)
      )
    )
  );
};

//  GET CHECKED VENDORS
const getAgreedVendors = () => {
  const vendorsArray = Array.from(allVendors);

  return vendorsArray.reduce((results, vendor) => {
    if (vendor.checked === true) results.push(vendor.id); // modify is a fictitious function that would apply some change to the items in the array
    return results;
  }, []);
};

setTimeout(displayPopup, 3000);

function noScroll() {
  window.scrollTo(0, 0);
}

window.addEventListener('load', () => {
  if (!getCookie('vendors')) {
    return;
  }

  // block scrolling option
  window.addEventListener('scroll', noScroll);
  displayPopup();
});
