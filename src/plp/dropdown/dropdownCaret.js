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
  newDropdownCaret.setAttribute('viewBox', '0 0 24 24');

  const svgPath = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'path'
  );

  svgPath.setAttribute('d', 'M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z');

  svgPath.classList.add('caret-path');

  newDropdownCaret.append(svgPath);

  return newDropdownCaret;
};
