window.addEventListener('load', () => {
  displayPopup();
});

const body = document.body;
const popup = document.querySelector('.popup-container');

const displayPopup = () => {
  popup.classList.add('active');
};

// body.addEventListener('load', displayPopup);
