// minimum margin of content to bottom of page
const marginBottom = 50;
// DOM-element of <page></page>
let page;
// all dom elements
let elements;

/**
 * gets all DOM-elements on page
 * @return {HTMLElement[]} DOM-elements
 */
const getAllDOMElements = () => {
    elements = document.getElementsByTagName('*');
}

/**
 * gets DOM-element of #resumeX
 * @return {HTMLElement}
 */
const getResumeDOMElement = () => {
    return page.children[0];
}

/**
 * sets letiable 'page' to DOM-element of <page></page>
 */
const setPageDOMElement = () => {
    page = document.getElementsByTagName('page')[0];
}

/**
 * checks whether font needs to be fixed, and if fixes it
 */
const checkFont = () => {
    const resume = getResumeDOMElement();
    if (contentIsGreaterThanPage(resume)) fixFont();
}

/**
 * checks whether content is greater than page
 * @param  {HTMLElement} resume
 * @return {boolean}        false if content fits to page
 */
const contentIsGreaterThanPage = resume => {
    const pageHeight = page.offsetHeight;
    const resumeHeight = resume.offsetHeight + marginBottom;
    if (pageHeight < resumeHeight) return true;
    else return false;
}

/**
 * gets font size of DOM-elemnt
 * @param  {HTMLElement} element
 * @return {number}         font size of element
 */
const getFontSizeOfElement = element => {
    const style = window
        .getComputedStyle(element, null)
        .getPropertyValue('font-size');
    return parseFloat(style);
}

/**
 * sets font size of DOM-element
 * @param {HTMLElement} element
 * @param {number} fontSize
 */
const setFontSizeOfElement = (element, fontSize) => {
    element.style.fontSize = fontSize + 'px';
}

/**
 * decreases font size of all DOM-elements
 */
const decreaseFontSizes = () => {
    let current, newFontSize;
    for (let i = 0; i < elements.length; i++) {
        current = elements[i];
        newFontSize = getFontSizeOfElement(current) * 0.99;
        setFontSizeOfElement(current, newFontSize);
    }
}

/**
 * decreases font size until content fits to page
 */
const fixFont = () => {
    decreaseFontSizes();
    const resume = getResumeDOMElement();
    if (contentIsGreaterThanPage(resume)) fixFont();
}

/**
 * checks if DOM-element has box-shadow
 * @param  {HTMLElement}  element
 * @return {string} '' if no shadow, otherwise shadow e.g. 'rgba(0, 0, 0, 0.137255) 0px 2px 2px 0px'
 */
const hasBoxShadow = element => {
    const style = window
        .getComputedStyle(element, null)
        .getPropertyValue('box-shadow');
    if (style != 'none') return style;
    else return '';
}

/**
 * gets absolute position of element
 * @param  {HTMLElement} element
 * @return {{}}
 */
const getAbsolutePositionOfElement = element => {
    return {
        top: element.getBoundingClientRect().top,
        left: element.getBoundingClientRect().left
    }
}


/**
 * removes box shadow from element
 * @param  {HTMLElement} element
 */
const removeBoxShadowOfElement = element => {
    element.style.boxShadow = 'none';
}


/**
 * gets border radius of element
 * @param  {HTMLElement} element
 * @return {String}         e.g. '50%'
 */
const getBorderRadiusOfElement = element => {
    return window
        .getComputedStyle(element, null)
        .getPropertyValue('border-radius');
}

/**
 * adds new box shadow
 * @param {HTMLElement} element
 * @param {{}} position  e.g. { left: 10, top: 100}
 * @param {string} boxShadow e.g. 'rgba(0, 0, 0, 0.137255) 0px 2px 2px 0px'
 */
const addNewBoxShadow = (element, position, boxShadow) => {
    let div = document.createElement('div');
    div.style.height = element.offsetHeight;
    div.style.width = element.offsetWidth;
    div.style.borderRadius = getBorderRadiusOfElement(element);
    div.style.position = 'absolute';
    div.style.boxShadow = boxShadow;
    div.style.webkitPrintColorAdjust = 'exact';
    div.style.webkitFilter = 'opacity(1)';
    div.style.top = position.top;
    div.style.left = position.left;
    document.getElementsByTagName('body')[0].appendChild(div);
}

/**
 * fixes box shadow of element
 * @param  {HTMLElement} element
 * @param  {string} boxShadow e.g. 'rgba(0, 0, 0, 0.137255) 0px 2px 2px 0px'
 */
const fixBoxShadow = (element, boxShadow) => {
    const position = getAbsolutePositionOfElement(element);
    removeBoxShadowOfElement(element);
    addNewBoxShadow(element, position, boxShadow);
}

/**
 * gets all elements with shadows
 * @return {HTMLElement[]} elements with shadows
 */
const getElementsWithShadows = () => {
    let current, boxShadow;
    let ret = [];
    for (let i = 0; i < elements.length; i++) {
        current = elements[i];
        boxShadow = hasBoxShadow(current);
        if (hasBoxShadow(current) != '') ret.push({
            element: current,
            shadow: boxShadow
        });
    }
    return ret;
}

/**
 * fixes shadows, since normal box-shadow cannot be printed in chrome,
 * see: http://stackoverflow.com/questions/13975198/text-shadow-and-box-shadow-while-printing-chrome
 */
const fixBoxShadows = () => {
    const elementsWithShadow = getElementsWithShadows();
    for (let i = 0; i < elementsWithShadow.length; i++) {
        fixBoxShadow(elementsWithShadow[i].element, elementsWithShadow[i].shadow);
    }
}

const isResume = () => {
    if (document.getElementsByTagName('page')[0]) return true;
    else return false;
}

const fixResume = () => {
    if (!isResume()) return;
    getAllDOMElements();
    fixBoxShadows();
    setPageDOMElement();
    checkFont();
}

fixResume();
