/**
 * Returns array of elements given IDs
 *
 * @param  {...string} elemID Any number of element IDs to get
 * @returns {Element[]}
 */

const getByID = (...elemID) => {
  const elements = [];

  for (const id of elemID) {
    const element = document.getElementById(id);

    elements.push(element);
  }

  return elements;
};

const [accountTypeButtonContainer, accountFeaturesList] = getByID(
  'account-type',
  'account-features'
);

const accountTypeButtons = accountTypeButtonContainer.children;

/**
 * Changes which features are shown based on which account type is selected
 *
 * @param {Object} event MouseEvent
 * @param {Element} event.target
 */

const accountTypeButtonHandler = ({ target }) => {
  if (target.classList.value !== 'curr') {
    for (const button of accountTypeButtons) {
      button.classList.toggle('curr');
    }

    const newClass = target.innerText.toLowerCase();

    accountFeaturesList.classList = newClass;
  }
};

for (const button of accountTypeButtons) {
  button.onclick = accountTypeButtonHandler;
}
