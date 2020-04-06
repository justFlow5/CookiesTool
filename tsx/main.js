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

const handleDecision = decision => {
  if (decision === 'accept') {
    cookieWrapper.style.display = 'none';
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
const getVendors = async url => {
  const response = await fetch(url);
  const json = await response.json();
  //   const vendorList = json.vendors;
  //   console.log(vendorList);
  return json.vendors;
};

let vendorList = getVendors('https://api.optad360.com/vendorlist');

//  END GET VENDORS FROM API

window.addEventListener('load', () => {
  displayPopup();
});

// stop scroll
// if (chuj.visibility === 'hidden') {
//   window.addEventListener('scroll', noScroll);
// } else if (chuj.visibility === 'visible') {
//   window.removeEventListener('scroll', noScroll);
// }

// function noScroll() {
//   window.scrollTo(0, 0);
// }
// stop scroll

vendorsButton.addEventListener('click', () => {
  toggleVendors();
});

backButton.addEventListener('click', () => {
  toggleVendors();
});

selectAllCheckbox.addEventListener('change', () => {
  // console.log(selectAllCheckbox.checked);
  // allVendors = document.querySelectorAll('.checkbox-input-vendor');

  // console.log(allVendors.length);

  if (selectAllCheckbox.checked) {
    allVendors.forEach(checkbox => {
      checkbox.checked = true;
    });
  } else {
    allVendors.forEach(checkbox => {
      checkbox.checked = false;
    });
  }
});

const allVendorsChecked = checkboxesGroup => {
  const checkboxesArray = Array.from(checkboxesGroup);

  let allChecked = checkboxesArray.every(checkbox => {
    // if (!checkbox.checked) return false;
    return checkbox.checked === true;
  });

  return allChecked;
};

const loadVendors = async () => {
  const myList = await vendorList;
  myList.forEach(vendor => {
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
      rel: 'noopener noreferrer'
    });

    setAttributes(checkboxInput, {
      id: `${vendor.id}`,
      class: 'checkbox-input checkbox-input-vendor',
      type: 'checkbox',
      checked: 'true'
    });

    setAttributes(checkboxLabel, {
      class: 'checkbox-label',
      for: `${vendor.id}`
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
