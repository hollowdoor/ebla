import { isElement, toElement, toHTML } from 'dom-elementals';
import arrayFrom from 'array-from';
import objectAssign from 'object-assign';
import isObject from 'isobject';
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
    if(isObject(parent) && !isElement(parent)){
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

export { E, select, spawn, generate };
//# sourceMappingURL=bundle.es.js.map
