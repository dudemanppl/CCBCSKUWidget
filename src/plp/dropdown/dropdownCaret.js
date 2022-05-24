/**
 * Creates dropdown caret
 */

const dropdownCaret = () => {
  const newDropdownCaret = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'svg'
  );

  newDropdownCaret.classList.add('dropdown-caret');

  if (onCompetitiveCyclist) {
    newDropdownCaret.classList.add('cc');
  }
  newDropdownCaret.setAttribute('viewBox', '0 0 256 256');

  const svgPath = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'path'
  );

  svgPath.setAttribute(
    'd',
    'M203.628 107.72c-5.613 5.9-64.759 63.566-64.759 63.566-3.007 3.149-6.939 4.714-10.87 4.714-3.945 0-7.876-1.567-10.87-4.714 0 0-59.145-57.665-64.773-63.565-5.613-5.9-6-16.501 0-22.812 6.014-6.296 14.386-6.79 21.738 0l53.905 52.908 53.891-52.894c7.365-6.79 15.752-6.296 21.738 0 6.014 6.296 5.641 16.912 0 22.797z'
  );

  svgPath.classList.add('caret-path');

  newDropdownCaret.append(svgPath);

  return newDropdownCaret;
};

// removeIf(production)
module.exports = { dropdownCaret };
// endRemoveIf(production)