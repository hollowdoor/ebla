'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var domElementals = require('dom-elementals');
var arrayFrom = _interopDefault(require('array-from'));
var domPropertiesMixin = require('dom-properties-mixin');
var animationFramePolyfill = require('animation-frame-polyfill');

var Ebla = function Ebla(value){
    var this$1 = this;
    var values = [], len = arguments.length - 1;
    while ( len-- > 0 ) values[ len ] = arguments[ len + 1 ];

    domPropertiesMixin.mixin(this);
    this.element = domElementals.toElement.apply(void 0, [ value ].concat( values ));
    Ebla.plugins.forEach(function (plugin){ return plugin(this$1); });
};
Ebla.prototype.contains = function contains (v){
    return this.element.contains(v);
};
Ebla.prototype.append = function append (v){
    this.element.appendChild(element(v).element);
    return this;
};
Ebla.prototype.appendTo = function appendTo (v){
    new Ebla(v).append(this.element);
    return this;
};
Ebla.prototype.prepend = function prepend (v){
    this.element.insertBefore(
        element(v).element,
        this.first
    );
    return this;
};
Ebla.prototype.html = function html (s){
    if(!defined(s)) { return this.element.innerHTML; }
    this.element.innerHTML = '';
    this.append(s);
    return this;
};
Ebla.prototype.text = function text (s){
    if(!defined(s)) { return this.element.textContent; }
    this.element.textContent = s;
    return this;
};
Ebla.prototype.attr = function attr (name, value){
    if(defined(value)){
        this.element.setAttribute(name, value);
    }
    return this.element.getAttribute(name);
};
Ebla.prototype.prop = function prop (name, value){
    if(defined(value)){
        this.element[name] = value;
    }
    return this.element[name];
};
Ebla.prototype.clone = function clone (deep){
    return new Ebla(this.element.cloneNode(deep));
};
Ebla.prototype.generate = function generate$1 (){
    return generate(domElementals.toHTML(this.element));
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

E.plugin = function createPlugin(ref){
    var create = ref.create;
    var onInstance = ref.onInstance;

    create(Ebla.prototype);
    if(onInstance)
        { Ebla.plugins.push(onInstance); }
};

function select(s){
    try{
        return arrayFrom(
            document.querySelectorAll(s)
        ).map(E);
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

var ElementGenerator = function ElementGenerator(create){
    this._create = create;
};
ElementGenerator.prototype.create = function create (){
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

    return createElementAsync((this._create).apply(void 0, args));
};
ElementGenerator.prototype[Symbol.iterator] = function (){
    return {
        next: function next(){
            return this.create();
        },
        done: function done(){
            return false;
        }
    };
};

function generate(create){
    var value;
    if(create !== 'function'){
        value = create;
        create = function (){ return value; };
    }
    return new ElementGenerator(create);
}

function createElementAsync(v){
    return new Promise(function (resolve, reject){
        animationFramePolyfill.requestAnimationFrame(function (){
            try{
                resolve(E(v));
            }catch(e){ reject(e); }
        });
    });
}

exports.E = E;
exports.select = select;
exports.spawn = spawn;
exports.generate = generate;
//# sourceMappingURL=bundle.js.map
