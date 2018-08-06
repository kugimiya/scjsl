/**
 * Replace text of nodes to text from data attribute.
 * @param {NodeList} elements 
 */
exports.replace = function (elements) {
    elements.forEach(function (elm) {
        elm.textContent = elm.dataset.jsNewText.toString();
        elm.text = elm.dataset.jsNewText.toString();
    });
}