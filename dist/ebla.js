(function (exports) {
'use strict';

/**
 * isArray
 */

var isArray = Array.isArray;

/**
 * toString
 */

var str = Object.prototype.toString;

/**
 * Whether or not the given `val`
 * is an array.
 *
 * example:
 *
 *        isArray([]);
 *        // > true
 *        isArray(arguments);
 *        // > false
 *        isArray('');
 *        // > false
 *
 * @param {mixed} val
 * @return {bool}
 */

var isArray_1 = isArray || function (val) {
  return !! val && '[object Array]' == str.call(val);
};

var isWindow = function (obj) {

  if (obj == null) {
    return false;
  }

  var o = Object(obj);

  return o === o.window;
};

var isFunction_1 = isFunction;

var toString = Object.prototype.toString;

function isFunction (fn) {
  var string = toString.call(fn);
  return string === '[object Function]' ||
    (typeof fn === 'function' && string !== '[object RegExp]') ||
    (typeof window !== 'undefined' &&
     // IE8 and below
     (fn === window.setTimeout ||
      fn === window.alert ||
      fn === window.confirm ||
      fn === window.prompt))
}

var isArrayLike = function (obj) {

  if (!obj) {
    return false;
  }

  if (isArray_1(obj)) {
    return true;
  }

  if (isFunction_1(obj) || isWindow(obj)) {
    return false;
  }

  obj = Object(obj);

  var length = 'length' in obj && obj.length;

  if (obj.nodeType === 1 && length) {
    return true;
  }

  return length === 0 ||
    typeof length === 'number' && length > 0 && ( length - 1 ) in obj;
};

// Production steps of ECMA-262, Edition 6, 22.1.2.1
// Reference: http://www.ecma-international.org/ecma-262/6.0/#sec-array.from
var polyfill = (function() {
  var isCallable = function(fn) {
    return typeof fn === 'function';
  };
  var toInteger = function (value) {
    var number = Number(value);
    if (isNaN(number)) { return 0; }
    if (number === 0 || !isFinite(number)) { return number; }
    return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
  };
  var maxSafeInteger = Math.pow(2, 53) - 1;
  var toLength = function (value) {
    var len = toInteger(value);
    return Math.min(Math.max(len, 0), maxSafeInteger);
  };
  var iteratorProp = function(value) {
    if(value != null) {
      if(['string','number','boolean','symbol'].indexOf(typeof value) > -1){
        return Symbol.iterator;
      } else if (
        (typeof Symbol !== 'undefined') &&
        ('iterator' in Symbol) &&
        (Symbol.iterator in value)
      ) {
        return Symbol.iterator;
      }
      // Support "@@iterator" placeholder, Gecko 27 to Gecko 35
      else if ('@@iterator' in value) {
        return '@@iterator';
      }
    }
  };
  var getMethod = function(O, P) {
    // Assert: IsPropertyKey(P) is true.
    if (O != null && P != null) {
      // Let func be GetV(O, P).
      var func = O[P];
      // ReturnIfAbrupt(func).
      // If func is either undefined or null, return undefined.
      if(func == null) {
        return void 0;
      }
      // If IsCallable(func) is false, throw a TypeError exception.
      if (!isCallable(func)) {
        throw new TypeError(func + ' is not a function');
      }
      return func;
    }
  };
  var iteratorStep = function(iterator) {
    // Let result be IteratorNext(iterator).
    // ReturnIfAbrupt(result).
    var result = iterator.next();
    // Let done be IteratorComplete(result).
    // ReturnIfAbrupt(done).
    var done = Boolean(result.done);
    // If done is true, return false.
    if(done) {
      return false;
    }
    // Return result.
    return result;
  };

  // The length property of the from method is 1.
  return function from(items /*, mapFn, thisArg */ ) {
    'use strict';

    // 1. Let C be the this value.
    var C = this;

    // 2. If mapfn is undefined, let mapping be false.
    var mapFn = arguments.length > 1 ? arguments[1] : void 0;

    var T;
    if (typeof mapFn !== 'undefined') {
      // 3. else
      //   a. If IsCallable(mapfn) is false, throw a TypeError exception.
      if (!isCallable(mapFn)) {
        throw new TypeError(
          'Array.from: when provided, the second argument must be a function'
        );
      }

      //   b. If thisArg was supplied, let T be thisArg; else let T
      //      be undefined.
      if (arguments.length > 2) {
        T = arguments[2];
      }
      //   c. Let mapping be true (implied by mapFn)
    }

    var A, k;

    // 4. Let usingIterator be GetMethod(items, @@iterator).
    // 5. ReturnIfAbrupt(usingIterator).
    var usingIterator = getMethod(items, iteratorProp(items));

    // 6. If usingIterator is not undefined, then
    if (usingIterator !== void 0) {
      // a. If IsConstructor(C) is true, then
      //   i. Let A be the result of calling the [[Construct]]
      //      internal method of C with an empty argument list.
      // b. Else,
      //   i. Let A be the result of the abstract operation ArrayCreate
      //      with argument 0.
      // c. ReturnIfAbrupt(A).
      A = isCallable(C) ? Object(new C()) : [];

      // d. Let iterator be GetIterator(items, usingIterator).
      var iterator = usingIterator.call(items);

      // e. ReturnIfAbrupt(iterator).
      if (iterator == null) {
        throw new TypeError(
          'Array.from requires an array-like or iterable object'
        );
      }

      // f. Let k be 0.
      k = 0;

      // g. Repeat
      var next, nextValue;
      while (true) {
        // i. Let Pk be ToString(k).
        // ii. Let next be IteratorStep(iterator).
        // iii. ReturnIfAbrupt(next).
        next = iteratorStep(iterator);

        // iv. If next is false, then
        if (!next) {

          // 1. Let setStatus be Set(A, "length", k, true).
          // 2. ReturnIfAbrupt(setStatus).
          A.length = k;

          // 3. Return A.
          return A;
        }
        // v. Let nextValue be IteratorValue(next).
        // vi. ReturnIfAbrupt(nextValue)
        nextValue = next.value;

        // vii. If mapping is true, then
        //   1. Let mappedValue be Call(mapfn, T, «nextValue, k»).
        //   2. If mappedValue is an abrupt completion, return
        //      IteratorClose(iterator, mappedValue).
        //   3. Let mappedValue be mappedValue.[[value]].
        // viii. Else, let mappedValue be nextValue.
        // ix.  Let defineStatus be the result of
        //      CreateDataPropertyOrThrow(A, Pk, mappedValue).
        // x. [TODO] If defineStatus is an abrupt completion, return
        //    IteratorClose(iterator, defineStatus).
        if (mapFn) {
          A[k] = mapFn.call(T, nextValue, k);
        }
        else {
          A[k] = nextValue;
        }
        // xi. Increase k by 1.
        k++;
      }
      // 7. Assert: items is not an Iterable so assume it is
      //    an array-like object.
    } else {

      // 8. Let arrayLike be ToObject(items).
      var arrayLike = Object(items);

      // 9. ReturnIfAbrupt(items).
      if (items == null) {
        throw new TypeError(
          'Array.from requires an array-like object - not null or undefined'
        );
      }

      // 10. Let len be ToLength(Get(arrayLike, "length")).
      // 11. ReturnIfAbrupt(len).
      var len = toLength(arrayLike.length);

      // 12. If IsConstructor(C) is true, then
      //     a. Let A be Construct(C, «len»).
      // 13. Else
      //     a. Let A be ArrayCreate(len).
      // 14. ReturnIfAbrupt(A).
      A = isCallable(C) ? Object(new C(len)) : new Array(len);

      // 15. Let k be 0.
      k = 0;
      // 16. Repeat, while k < len… (also steps a - h)
      var kValue;
      while (k < len) {
        kValue = arrayLike[k];
        if (mapFn) {
          A[k] = mapFn.call(T, kValue, k);
        }
        else {
          A[k] = kValue;
        }
        k++;
      }
      // 17. Let setStatus be Set(A, "length", len, true).
      // 18. ReturnIfAbrupt(setStatus).
      A.length = len;
      // 19. Return A.
    }
    return A;
  };
})();

var arrayFrom = (typeof Array.from === 'function' ?
  Array.from :
  polyfill
);

function preserveCamelCase(str) {
	var isLastCharLower = false;
	var isLastCharUpper = false;
	var isLastLastCharUpper = false;

	for (var i = 0; i < str.length; i++) {
		var c = str[i];

		if (isLastCharLower && /[a-zA-Z]/.test(c) && c.toUpperCase() === c) {
			str = str.substr(0, i) + '-' + str.substr(i);
			isLastCharLower = false;
			isLastLastCharUpper = isLastCharUpper;
			isLastCharUpper = true;
			i++;
		} else if (isLastCharUpper && isLastLastCharUpper && /[a-zA-Z]/.test(c) && c.toLowerCase() === c) {
			str = str.substr(0, i - 1) + '-' + str.substr(i - 1);
			isLastLastCharUpper = isLastCharUpper;
			isLastCharUpper = false;
			isLastCharLower = true;
		} else {
			isLastCharLower = c.toLowerCase() === c;
			isLastLastCharUpper = isLastCharUpper;
			isLastCharUpper = c.toUpperCase() === c;
		}
	}

	return str;
}

var camelcase = function (str) {
	if (arguments.length > 1) {
		str = Array.from(arguments)
			.map(function (x) { return x.trim(); })
			.filter(function (x) { return x.length; })
			.join('-');
	} else {
		str = str.trim();
	}

	if (str.length === 0) {
		return '';
	}

	if (str.length === 1) {
		return str.toLowerCase();
	}

	if (/^[a-z0-9]+$/.test(str)) {
		return str;
	}

	var hasUpperCase = str !== str.toLowerCase();

	if (hasUpperCase) {
		str = preserveCamelCase(str);
	}

	return str
		.replace(/^[_.\- ]+/, '')
		.toLowerCase()
		.replace(/[_.\- ]+(\w|$)/g, function (m, p1) { return p1.toUpperCase(); });
};

/*!
 * isobject <https://github.com/jonschlinkert/isobject>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

var isobject = function isObject(val) {
  return val != null && typeof val === 'object' && Array.isArray(val) === false;
};

//No such module
function isDocumentFragment(v){
    return (v + '') === '[object DocumentFragment]';
}

function isElemental(v){
    return isDocumentFragment(v) || isElement(v);
}

//isElement exists as a module, but it's not viable
function isElement(input) {

  return (input != null)
    && (typeof input === 'object')
    && (input.nodeType === Node.ELEMENT_NODE)
    && (typeof input.style === 'object')
    && (typeof input.ownerDocument === 'object');
}

function isDate(v){
    return Object.prototype.toString.call(v) === '[object Date]';
}

function toHTML(){
    var arguments$1 = arguments;

    var values = [], len = arguments.length;
    while ( len-- ) { values[ len ] = arguments$1[ len ]; }


    return values.map(function (v){
        if(v === void 0) { return ''; }

        if(isobject(v) && v.hasOwnProperty('element')){
            v = v.element;
        }

        if(typeof v === 'string'){
            return v;
        }

        if(isElement(v)){
            return v.outerHTML;
        }else if(isDocumentFragment(v)){
            var d = document.createElement('div');
            d.appendChild(v.cloneNode(true));
            return d.innerHTML;
        }
    }).join('');
}

function stringToFragment(str){
    var d = document.createElement('div');
    //A fragment allows a single source of entry
    //to multiple children without a parent
    var frag = document.createDocumentFragment();
    //NOTE: Nested paragraph tags get screwed up in innerHTML.
    //This also happens with other certain mixes of tags.
    d.innerHTML = str;
    while(d.firstChild){
        frag.appendChild(d.firstChild);
    }
    return frag;
}

function stringToElement(str){
    var frag = stringToFragment(str);
    //Sometimes we can get away with a single child
    if(frag.children.length === 1){
        return frag.removeChild(frag.firstChild);
    }
    return frag;
}

var localeOptions = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
};

var language = window.navigator.userLanguage
|| window.navigator.language;

function toLocaleString(v){
    try{
        return v.toLocaleString(
            language,
            localeOptions
        );
    }catch(e){
        return v + '';
    }
}

function objectToString(v){
    var str = '';
    if(isDate(v)){
        //Make it pretty when the date is a lone value
        return toLocaleString(v);
    }

    if(v.constructor === Object){
        //Let Date be the ISO standard for JSON objects
        try{
            return JSON.stringify(v, null, 2);
        }catch(e){}
    }
    //All other objects are toStringed
    //This way user space toString is considered
    return v + '';
}

function setData(el, data){
    if(!el.dataset) { return; }
    Object.keys(data).forEach(
        function (key){ return el.dataset[camelcase(key)] = data[key]; }
    );
    return el;
}

function setAttributes(el, attributes){
    if(!el.setAttribute) { return; }
    if([3, //text
        8, //comment
        2  //attribute
    ].indexOf(el.nodeType) !== -1) { return; }

    Object.keys(attributes).forEach(function (key){
        el.setAttribute(key, attributes[key] + '');
    });
    return el;
}

function setStyles(el, styles){
    var allstyles = window.getComputedStyle(el);
    if(!el.style) { return; }
    Object.keys(styles).forEach(function (key){
        if(allstyles[key] === void 0){
            el.style.setProperty(
                '--'+decamelize(key, '-'),
                styles[key] + ''
            );
            return;
        }
        el.style[camelcase(key)] = styles[key] + '';
    });
}

//import isObject from 'isobject';
function toElement(v){
    var arguments$1 = arguments;

    var values = [], len = arguments.length - 1;
    while ( len-- > 0 ) { values[ len ] = arguments$1[ len + 1 ]; }


    if(typeof v !== 'string' && isArrayLike(v)){

        v = arrayFrom(v);

        if(values.length){
            var html = v.reduce(function (html, str, i){
                return html + str + toHTML(values[i]);
            }, '');
            return convert(html);
        }

        return v.reduce(function (frag, value){
            frag.appendChild(convert(value));
            return frag;
        }, document.createDocumentFragment());

    }

    return convert(v);
}

function convert(v){

    if(isobject(v)){
        if(v.hasOwnProperty('element')) { v = v.element; }

        if(isobject(v)){
            if(isElemental(v) || v === document){
                return v;
            }

            if(v.hasOwnProperty('tag')){
                return objectToDOM(v);
            }

            v = objectToString(v);
        }
    }

    try{
        var el = document.querySelector(v);
        if(el) { return el; }
    }catch(e){}

    return stringToElement(v);
}


function objectToDOM(obj){

    var el, parentNode = null, keys = Object.keys(obj), index;

    var hadKey = function (key){
        if((index = keys.indexOf(key + '')) !== -1){
            keys.splice(index, 1);
            return true;
        }
        return false;
    };

    if(hadKey('tag')){
        el = document.createElement(obj.tag.toLowerCase());
    }else{
        throw new Error('obj must have a "tag" property with a DOM tag name');
    }

    if(hadKey('attributes') && isobject(obj.attributes)){
        setAttributes(el, obj.attributes);
    }

    if(hadKey('data') && isobject(obj.data)){
        setData(el, obj.data);
    }

    if(hadKey('innerHTML')){
        el.innerHTML = toHTML(obj.innerHTML);
    }

    if(hadKey('head')){
        el.appendChild(toElement(obj.head));
    }

    if(hadKey('children') && isArrayLike(obj.children)){
        appendChildren(el, obj.children);
    }

    if(hadKey('foot')){
        el.appendChild(toElement(obj.foot));
    }

    if(hadKey('style') && isobject(obj.style)){
        setStyles(el, obj.style);
    }

    if(hadKey('parent')){
        parentNode = toElement(obj.parent);
    }

    keys.forEach(function (key){
        if(obj[key] !== 'function' && !isobject(obj[key])){
            el[key] = obj[key];
        }
    });

    if(parentNode){
        parentNode.appendChild(el);
    }

    return el;
}



function appendChildren(el, children){
    arrayFrom(children).forEach(function (child){
        el.appendChild(toElement(child));
    });
    return el;
}

/*
object-assign
(c) Sindre Sorhus
@license MIT
*/

/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

var objectAssign = shouldUseNative() ? Object.assign : function (target, source) {
	var arguments$1 = arguments;

	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments$1[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

var decamelize$1 = function (str, sep) {
	if (typeof str !== 'string') {
		throw new TypeError('Expected a string');
	}

	sep = typeof sep === 'undefined' ? '_' : sep;

	return str
		.replace(/([a-z\d])([A-Z])/g, '$1' + sep + '$2')
		.replace(/([A-Z]+)([A-Z][a-z\d]+)/g, '$1' + sep + '$2')
		.toLowerCase();
};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var rgbHex = createCommonjsModule(function (module) {
'use strict';
/* eslint-disable no-mixed-operators */
module.exports = function (red, green, blue, alpha) {
	var isPercent = (red + (alpha || '')).toString().includes('%');

	if (typeof red === 'string') {
		var res = red.match(/(0?\.?\d{1,3})%?\b/g).map(Number);
		// TODO: use destructuring when targeting Node.js 6
		red = res[0];
		green = res[1];
		blue = res[2];
		alpha = res[3];
	} else if (alpha !== undefined) {
		alpha = parseFloat(alpha);
	}

	if (typeof red !== 'number' ||
		typeof green !== 'number' ||
		typeof blue !== 'number' ||
		red > 255 ||
		green > 255 ||
		blue > 255) {
		throw new TypeError('Expected three numbers below 256');
	}

	if (typeof alpha === 'number') {
		if (!isPercent && alpha >= 0 && alpha <= 1) {
			alpha = Math.round(255 * alpha);
		} else if (isPercent && alpha >= 0 && alpha <= 100) {
			alpha = Math.round(255 * alpha / 100);
		} else {
			throw new TypeError(("Expected alpha value (" + alpha + ") as a fraction or percentage"));
		}
		alpha = (alpha | 1 << 8).toString(16).slice(1);
	} else {
		alpha = '';
	}

	return ((blue | green << 8 | red << 16) | 1 << 24).toString(16).slice(1) + alpha;
};
});

//all properties are available
//using getComputedStyle(element)
//document.documentElement gets :root pseudo stuff
function cssProxy(
    element,
    props,
    pseudo
){
    if ( element === void 0 ) { element = document.documentElement; }
    if ( props === void 0 ) { props = {}; }

    if(typeof props !== 'object'){
        props = {};
    }

    var allstyles = getComputedStyle(element, pseudo);

    function getName(name){
        //Computed styles contain all the properties.
        if(allstyles[name] === void 0){
            //supporting camelcase properties
            return '--'+decamelize$1(name, '-');
        }
        return decamelize$1(name, '-');
    }

    var css = Object.assign(Object.create(null), ( obj = {
        setProperty: function setProperty(name, value, priority){
            element.style.setProperty(name, value, priority);
        },
        getProperty: function getProperty(name){
            return allstyles.getPropertyValue(name);
        },
        cssGet: function cssGet(name){
            if(nameOnElement(element, name)){
                return element.style[name];
            }
            var v = this.getProperty(getName(name));
            return !v || !v.length ? undefined : v.trim();
        },
        cssSet: function cssSet(name, value, priority){
            this.setProperty(getName(name), convertValue(value), priority);
        },
        remove: function remove(name){
            element.style.removeProperty(name);
        },
        setAll: function setAll(){
            var arguments$1 = arguments;

            var this$1 = this;
            var propObjects = [], len = arguments.length;
            while ( len-- ) { propObjects[ len ] = arguments$1[ len ]; }

            propObjects.forEach(function (props){
                Object.keys(props).forEach(function (key){
                    this$1.cssSet(key, props[key]);
                });
            });
            return this;
        }
    }, obj[Symbol.toPrimitive] = function (hint){
            return '[object CSSProxy]';
        }, obj ));
    var obj;

    var proxy = new Proxy(css, {
        get: function get(target, name){
            //Return methods
            if(typeof target[name] === 'function')
                { return target[name].bind(target); }
            //Return properties
            return target.cssGet(name);
        },
        set: function set(target, name, value){
            target.cssSet(name, value);
            return true;
        }
    });

    Object.keys(props).forEach(function (key){
        proxy[key] = props[key];
    });

    return proxy;
}

function nameOnElement(e, name){
    return !/[-]{2}/.test(name) && e.style[name] !== undefined;
}

/*
Setting variables, from variables works different.
document.documentElement.style.setProperty("--my-bg-colour", "var(--my-fg-colour)");*/
function convertValue(value){
    if(/[-]{2}/.test(value + '')){
        return ("var(--" + (decamelize$1(value + '')) + ")");
    }else {
        return value;
    }
}

var props = (function (){
    //Renamed properties, and properties with unique behaviors
    //are assigned directly to the original props object
    var props = {
        parent: {
            get: function get(){ return this.element.parentNode; }
        },
        first:{
            get: function get(){
                return this.element.firstChild;
            },
            set: function set(value){
                if(this.element.firstChild !== void 0){
                    return this.element.replaceChild(
                        get(value), this.element.firstChild
                    );
                }
                this.element.appendChild(get(value));
            }
        },
        last: {
            get: function get(){
                return this.element.lastChild;
            },
            set: function set(value){
                if(this.element.lastChild !== void 0){
                    return this.element.replaceChild(
                        get(value), this.element.lastChild
                    );
                }
                this.element.appendChild(get(value));
            }
        },
        children: {
            get: function get(){
                return arrayFrom(this.element.children);
            },
            set: function set(children){
                var this$1 = this;

                this.element.innerHTML = '';
                arrayFrom(children).forEach(function (child){
                    this$1.element.appendChild(get(child));
                });
            }
        },
        childNodes: {
            get: function get(){
                return arrayFrom(this.element.childNodes);
            }
        },
        style: {
            get: function get(){
                if(this._style === void 0){
                    if(Proxy === void 0) { return this.element.style; }
                    this._style = cssProxy(this.element);
                }
                return this._style;
            }
        },
        root: {
            get: function get(){
                return this.element.rootNode;
            }
        }
    };


    //Define simpler getters, and setters
    ['value', 'innerHTML', 'outerHTML', 'textContent',
    'className', 'classList']
    .forEach(function (prop){
        props[prop] = {
            get: function get(){
                return this.element[prop];
            },
            set: function set(value){
                this.element[prop] = value;
            }
        };
    });

    //Define simpler getters
    ['nodeName', 'nextSibling', 'nodeType', 'nodeName']
    .forEach(function (prop){
        props[prop] = {
            get: function get(){
                return this.element[prop];
            }
        };
    });

    //Enumerable properties are easier to debug
    Object.keys(props).forEach(function (key){ return props[key].enumerable = true; });
    return props;
})();


function mixin(dest){
    Object.defineProperties(dest, props);
    return dest;
}

function get(e){
    if(e.element !== void 0) { return e.element; }
    return e;
}

var prefix = ['webkit', 'moz', 'ms', 'o'];

var requestAnimationFrame = function () {

  for (var i = 0, limit = prefix.length; i < limit && !window.requestAnimationFrame; ++i) {
    window.requestAnimationFrame = window[prefix[i] + 'RequestAnimationFrame'];
  }

  if (!window.requestAnimationFrame) {
    (function () {
      var lastTime = 0;

      window.requestAnimationFrame = function (callback) {
        var now = new Date().getTime();
        var ttc = Math.max(0, 16 - now - lastTime);
        var timer = window.setTimeout(function () {
          return callback(now + ttc);
        }, ttc);

        lastTime = now + ttc;

        return timer;
      };
    })();
  }

  return window.requestAnimationFrame.bind(window);
}();

var cancelAnimationFrame = function () {

  for (var i = 0, limit = prefix.length; i < limit && !window.cancelAnimationFrame; ++i) {
    window.cancelAnimationFrame = window[prefix[i] + 'CancelAnimationFrame'] || window[prefix[i] + 'CancelRequestAnimationFrame'];
  }

  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function (timer) {
      window.clearTimeout(timer);
    };
  }

  return window.cancelAnimationFrame.bind(window);
}();

var Ebla = function Ebla(value){
    var this$1 = this;
    var values = [], len = arguments.length - 1;
    while ( len-- > 0 ) values[ len ] = arguments[ len + 1 ];

    mixin(this);
    this.element = toElement.apply(void 0, [ value ].concat( values ));
    Ebla.plugins.forEach(function (plugin){ return plugin.init.call(this$1); });
};
Ebla.prototype.appendTo = function appendTo (v){
    v.appendChild(this.element);
    return this;
};
Ebla.prototype.append = function append (){
        var this$1 = this;
        var values = [], len = arguments.length;
        while ( len-- ) values[ len ] = arguments[ len ];

    values.forEach(function (value){
        this$1.element.appendChild(toElement(value));
    });
    return this;
};
Ebla.prototype.prepend = function prepend (){
        var this$1 = this;
        var values = [], len = arguments.length;
        while ( len-- ) values[ len ] = arguments[ len ];

    values.forEach(function (value){
        this$1.element.insertBefore(
            toElement(value),
            this$1.first
        );
    });
    return this;
};
Ebla.prototype.before = function before (){
        var this$1 = this;
        var values = [], len = arguments.length;
        while ( len-- ) values[ len ] = arguments[ len ];

    if(this.element.parentNode){
        values.forEach(function (value){
            this$1.element.parentNode.insertBefore(
                toElement(value),
                this$1.element
            );
        });

    }
    return this;
};
Ebla.prototype.after = function after (){
        var this$1 = this;
        var values = [], len = arguments.length;
        while ( len-- ) values[ len ] = arguments[ len ];

    if(this.element.parentNode){
        values.forEach(function (value){
            this$1.element.parentNode.insertBefore(
                toElement(value),
                this$1.element.nextSibling
            );
        });
    }
    return this;
};
Ebla.prototype.html = function html (s){
    if(s === void 0) { return this.element.innerHTML; }
    this.element.innerHTML = toHTML(s);
    return this;
};
Ebla.prototype.text = function text (s){
    if(s === void 0) { return this.element.textContent; }
    this.element.textContent = s;
    return this;
};
Ebla.prototype.attr = function attr (name, value){
        var this$1 = this;

    if(value === void 0){
        if(typeof name === 'object'){
            Object.keys(name).forEach(function (key){
                this$1.element.setAttribute(key, name[key]);
            });
            return this;
        }
        return this.element.getAttribute(name);

    }
    this.element.setAttribute(name, value);
    return this;
};
Ebla.prototype.prop = function prop (name, value){
        var this$1 = this;

    if(value === void 0){
        if(typeof name === 'object'){
            Object.keys(name).forEach(function (key){
                this$1.element[key] = name[key];
            });
            return this;
        }
        return this.element[name];
    }
    this.element[name] = value;
    return this;
};
Ebla.prototype.css = function css (source){
        var this$1 = this;

    Object.keys(source).forEach(function (key){
        this$1.style[key] = source[key];
    });
};
Ebla.prototype.clone = function clone (deep){
    return new (this.constructor)(this.element.cloneNode(deep));
};
Ebla.prototype.contains = function contains (v){
    return this.element.contains(v);
};
Ebla.prototype.animate = function animate (){
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

    return (ref = this.element).animate.apply(ref, args);
        var ref;
};
Ebla.prototype.generate = function generate$1 (){
        var this$1 = this;

    return generate(function (){ return this$1.element.cloneNode(true); });
};

function E(value){
    var values = [], len = arguments.length - 1;
    while ( len-- > 0 ) values[ len ] = arguments[ len + 1 ];

    if(this instanceof Ebla){
        Ebla.call.apply(Ebla, [ this, value ].concat( values ));
    }else if(value instanceof Ebla){
        return value;
    }

    return new (Function.prototype.bind.apply( Ebla, [ null ].concat( [value], values) ));
}

E.prototype = Object.create(Ebla.prototype);

Ebla.plugins = [];
objectAssign(E, {
    fragment: function fragment(){
        return document.createDocumentFragment();
    },
    plugin: function plugin(create){
        var control = create(Ebla.prototype);
        if(typeof control === 'function'){
            if(typeof control['init'] !== 'function'){
                return;
            }
            Elba.plugins.push(control);
        }
    }
});

function select(s){
    try{
        return arrayFrom(
            document.querySelectorAll(s)
        ).map(function (e){ return E(e); });
    }catch(e){
        throw e;
    }
}

function spawn(v, count){
    if ( count === void 0 ) count = 1;

    if(typeof callback !== 'function'){
        var items = [];
        var e = E(v);
        for(var i=0; i<count; i++){
            items.push(e.clone());
        }
        return items;
    }
}

var ElementGenerator = function ElementGenerator(create, parent){
    if ( parent === void 0 ) parent = null;

    this._create = create;
    if(isobject(parent) && !isElement(parent)){
        parent = parent.element;
    }

    this._parent = isElement(parent) ? parent : null;
};
ElementGenerator.prototype.create = function create (){
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

    var create = this._create;
    return ElementGenerator.getElementAsync(
        create.apply(void 0, args),
        this._parent
    );
};
ElementGenerator.getElementAsync = function getElementAsync (v, parent){
        if ( parent === void 0 ) parent = null;

    return new Promise(function (resolve, reject){
        requestAnimationFrame(function (){
            try{
                if(parent && isElement(parent)){
                    return resolve(E(v).appendTo(parent));
                }
                resolve(E(v));
            }catch(e){ reject(e); }
        });
    });
};
ElementGenerator.prototype[Symbol.iterator] = function (){
    return {
        next: function next(){
                var args = [], len = arguments.length;
                while ( len-- ) args[ len ] = arguments[ len ];

            return (ref = this).create.apply(ref, args);
                var ref;
        },
        done: function done(){
            return false;
        }
    };
};

function generate(create, parent){
    var value;
    if(typeof create !== 'function'){
        value = create;
        create = function (){ return value; };
    }
    return new ElementGenerator(create, parent);
}

exports.E = E;
exports.select = select;
exports.spawn = spawn;
exports.generate = generate;

}((this.ebla = this.ebla || {})));
//# sourceMappingURL=ebla.js.map
