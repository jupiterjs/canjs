/*!
 * CanJS - 2.3.32
 * http://canjs.com/
 * Copyright (c) 2017 Bitovi
 * Mon, 02 Oct 2017 16:48:35 GMT
 * Licensed MIT
 */

/*can@2.3.32#map/lazy/nested_reference*/
steal('can/util', function (can) {
    var pathIterator = function (root, propPath, callback) {
        var props = propPath.split('.'), cur = root, part;
        while (part = props.shift()) {
            cur = cur[part];
            if (callback) {
                callback(cur, part);
            }
        }
        return cur;
    };
    var ArrIndex = function (array) {
        this.array = array;
    };
    ArrIndex.prototype.toString = function () {
        return '' + can.inArray(this.item, this.array);
    };
    var NestedReference = function (root) {
        this.root = root;
        this.references = [];
    };
    NestedReference.ArrIndex = ArrIndex;
    can.extend(NestedReference.prototype, {
        make: function (propPath) {
            var path = [], arrIndex;
            if (can.isArray(this.root) || this.root instanceof can.LazyList) {
                arrIndex = new ArrIndex(this.root);
            }
            pathIterator(this.root, propPath, function (item, prop) {
                if (arrIndex) {
                    arrIndex.item = item;
                    path.push(arrIndex);
                    arrIndex = undefined;
                } else {
                    path.push(prop);
                    if (can.isArray(item)) {
                        arrIndex = new ArrIndex(item);
                    }
                }
            });
            var pathFunc = function () {
                return path.join('.');
            };
            this.references.push(pathFunc);
            return pathFunc;
        },
        removeChildren: function (path, callback) {
            var i = 0;
            while (i < this.references.length) {
                var reference = this.references[i]();
                if (reference.indexOf(path) === 0) {
                    callback(this.get(reference), reference);
                    this.references.splice(i, 1);
                } else {
                    i++;
                }
            }
        },
        get: function (path) {
            return pathIterator(this.root, path);
        },
        each: function (callback) {
            var self = this;
            can.each(this.references, function (ref) {
                var path = ref();
                callback(self.get(path), ref, path);
            });
        }
    });
    can.NestedReference = NestedReference;
});