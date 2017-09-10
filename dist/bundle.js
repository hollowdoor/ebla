'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var domElementals = require('dom-elementals');
var arrayFrom = _interopDefault(require('array-from'));
var objectAssign = _interopDefault(require('object-assign'));
var domPropertiesMixin = require('dom-properties-mixin');
var animationFramePolyfill = require('animation-frame-polyfill');

var Ebla = function Ebla(value){
    var this$1 = this;
    var values = [], len = arguments.length - 1;
    while ( len-- > 0 ) values[ len ] = arguments[ len + 1 ];

    domPropertiesMixin.mixin(this);
    this.element = domElementals.toElement.apply(void 0, [ value ].concat( values ));
    Ebla.plugins.forEach(function (plugin){ return plugin.init.call(this$1); });
};
Ebla.prototype.contains = function contains (v){
    return this.element.contains(v);
};
Ebla.prototype.append = function append (v){
    this.element.appendChild(domElementals.toElement(v));
    return this;
};
Ebla.prototype.appendTo = function appendTo (v){
    v.appendChild(this.element);
    return this;
};
Ebla.prototype.prepend = function prepend (v){
    this.element.insertBefore(
        domElementals.toElement(v),
        this.first
    );
    return this;
};
Ebla.prototype.html = function html (s){
    if(s === void 0) { return this.element.innerHTML; }
    this.element.innerHTML = domElementals.toHTML(s);
    return this;
};
Ebla.prototype.text = function text (s){
    if(s === void 0) { return this.element.textContent; }
    this.element.textContent = s;
    return this;
};
Ebla.prototype.attr = function attr (name, value){
    if(value === void 0){
        this.element.setAttribute(name, value);
    }
    return this.element.getAttribute(name);
};
Ebla.prototype.prop = function prop (name, value){
    if(value === void 0){
        this.element[name] = value;
    }
    return this.element[name];
};
Ebla.prototype.clone = function clone (deep){
    return new Ebla(this.element.cloneNode(deep));
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
    this._parent = parent;
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
        animationFramePolyfill.requestAnimationFrame(function (){
            try{
                if(parent && domElementals.isElement(parent)){
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
//# sourceMappingURL=bundle.js.map
