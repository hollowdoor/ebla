import { toElement, toHTML } from 'dom-elementals';
import arrayFrom from 'array-from';
import { mixin } from 'dom-properties-mixin';
import { requestAnimationFrame } from 'animation-frame-polyfill';

var Ebla = function Ebla(value){
    var this$1 = this;
    var values = [], len = arguments.length - 1;
    while ( len-- > 0 ) values[ len ] = arguments[ len + 1 ];

    mixin(this);
    this.element = toElement.apply(void 0, [ value ].concat( values ));
    Ebla.plugins.forEach(function (plugin){ return plugin.init.call(this$1); });
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
E.plugin = function createPlugin(create){
    var control = create(Ebla.prototype);
    if(typeof control === 'function'){
        if(typeof control['init'] !== 'function'){
            return;
        }
        Elba.plugins.push(control);
    }
};

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

var ElementGenerator = function ElementGenerator(create){
    this._create = create;
};
ElementGenerator.prototype.create = function create (){
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

    return ElementGenerator.getElementAsync(
        (this._create).apply(void 0, args)
    );
};
ElementGenerator.getElementAsync = function getElementAsync (v){
    return new Promise(function (resolve, reject){
        requestAnimationFrame(function (){
            try{
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

function generate(create){
    var value;
    if(create !== 'function'){
        value = create;
        create = function (){ return value; };
    }
    return new ElementGenerator(create);
}

export { E, select, spawn, generate };
//# sourceMappingURL=bundle.es.js.map
