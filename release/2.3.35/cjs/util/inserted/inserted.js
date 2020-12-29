/*!
 * CanJS - 2.3.34
 * http://canjs.com/
 * Copyright (c) 2018 Bitovi
 * Mon, 30 Apr 2018 20:56:51 GMT
 * Licensed MIT
 */

/*can@2.3.34#util/inserted/inserted*/
var can = require('../can.js');
can.inserted = function (elems, document) {
    if (!elems.length) {
        return;
    }
    elems = can.makeArray(elems);
    var doc = document || elems[0].ownerDocument || elems[0], inDocument = false, root = can.$(doc.contains ? doc : doc.body), children;
    for (var i = 0, elem; (elem = elems[i]) !== undefined; i++) {
        if (!inDocument) {
            if (elem.getElementsByTagName) {
                if (can.has(root, elem).length) {
                    inDocument = true;
                } else {
                    return;
                }
            } else {
                continue;
            }
        }
        if (inDocument && elem.getElementsByTagName) {
            children = can.makeArray(elem.getElementsByTagName('*'));
            can.trigger(elem, 'inserted', [], false);
            for (var j = 0, child; (child = children[j]) !== undefined; j++) {
                can.trigger(child, 'inserted', [], false);
            }
        }
    }
};
can.appendChild = function (el, child, document) {
    var children;
    if (child.nodeType === 11) {
        children = can.makeArray(can.childNodes(child));
    } else {
        children = [child];
    }
    el.appendChild(child);
    can.inserted(children, document);
};
can.insertBefore = function (el, child, ref, document) {
    var children;
    if (child.nodeType === 11) {
        children = can.makeArray(can.childNodes(child));
    } else {
        children = [child];
    }
    el.insertBefore(child, ref);
    can.inserted(children, document);
};