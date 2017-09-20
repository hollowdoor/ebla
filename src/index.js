import { toElement, toHTML, isElement } from 'dom-elementals';
import arrayFrom from 'array-from';
import objectAssign from 'object-assign';
import isObject from 'isobject';
import { mixinDOMProperties } from 'dom-properties-mixin';
import { mixinDOMEvents } from 'dom-events-mixin';
import { requestAnimationFrame } from 'animation-frame-polyfill';
import computedStyles from 'computed-styles';

class Ebla {
    constructor(value, ...values){
        mixinDOMProperties(this);
        this.element = toElement(value, ...values);
        Ebla.plugins.forEach(plugin=>plugin.init.call(this));
    }
    appendTo(v){
        v.appendChild(this.element);
        return this;
    }
    append(...values){
        values.forEach(value=>{
            this.element.appendChild(toElement(value));
        });
        return this;
    }
    prepend(...values){
        values.forEach(value=>{
            this.element.insertBefore(
                toElement(value),
                this.first
            );
        });
        return this;
    }
    before(...values){
        if(this.element.parentNode){
            values.forEach(value=>{
                this.element.parentNode.insertBefore(
                    toElement(value),
                    this.element
                );
            });

        }
        return this;
    }
    after(...values){
        if(this.element.parentNode){
            values.forEach(value=>{
                this.element.parentNode.insertBefore(
                    toElement(value),
                    this.element.nextSibling
                );
            });
        }
        return this;
    }
    html(s){
        if(s === void 0) return this.element.innerHTML;
        this.element.innerHTML = toHTML(s);
        return this;
    }
    text(s){
        if(s === void 0) return this.element.textContent;
        this.element.textContent = s;
        return this;
    }
    attr(name, value){
        if(value === void 0){
            if(typeof name === 'object'){
                Object.keys(name).forEach(key=>{
                    this.element.setAttribute(key, name[key]);
                });
                return this;
            }
            return this.element.getAttribute(name);

        }
        this.element.setAttribute(name, value);
        return this;
    }
    prop(name, value){
        if(value === void 0){
            if(typeof name === 'object'){
                Object.keys(name).forEach(key=>{
                    this.element[key] = name[key];
                });
                return this;
            }
            return this.element[name];
        }
        this.element[name] = value;
        return this;
    }
    css(source){
        Object.keys(source).forEach(key=>{
            this.style[key] = source[key];
        });
    }
    clone(deep){
        return new (this.constructor)(this.element.cloneNode(deep));
    }
    contains(v){
        return this.element.contains(v);
    }
    animate(...args){
        return this.element.animate(...args);
    }
    getComputeStyles(){
        return computedStyles(this.element);
    }
    generate(){
        return generate(()=>this.element.cloneNode(true));
    }
}

mixinDOMEvents(Ebla.prototype);

export function E(value, ...values){
    if(this instanceof Ebla){
        Ebla.call(this, value, ...values);
    }else if(value instanceof Ebla){
        return value;
    }

    return new Ebla(value, ...values);
}

E.prototype = Object.create(Ebla.prototype);

Ebla.plugins = [];
objectAssign(E, {
    fragment(){
        return document.createDocumentFragment();
    },
    plugin(create){
        let control = create(Ebla.prototype);
        if(typeof control === 'function'){
            if(typeof control['init'] !== 'function'){
                return;
            }
            Elba.plugins.push(control);
        }
    }
});

export function select(s){
    try{
        return arrayFrom(
            document.querySelectorAll(s)
        ).map(e=>E(e));
    }catch(e){
        throw e;
    }
}

export function spawn(v, count = 1){
    if(typeof callback !== 'function'){
        const items = [];
        const e = E(v);
        for(let i=0; i<count; i++){
            items.push(e.clone());
        }
        return items;
    }
}

class ElementGenerator {
    constructor(create, parent = null){
        this._create = create;
        if(isObject(parent) && !isElement(parent)){
            parent = parent.element;
        }

        this._parent = isElement(parent) ? parent : null;
    }
    create(...args){
        let create = this._create;
        return ElementGenerator.getElementAsync(
            create(...args),
            this._parent
        );
    }
    static getElementAsync(v, parent = null){
        return new Promise((resolve, reject)=>{
            requestAnimationFrame(()=>{
                try{
                    if(parent && isElement(parent)){
                        return resolve(E(v).appendTo(parent));
                    }
                    resolve(E(v));
                }catch(e){ reject(e); }
            });
        });
    }
    [Symbol.iterator](){
        return {
            next(...args){
                return this.create(...args);
            },
            done(){
                return false;
            }
        };
    }
}

export function generate(create, parent){
    let value;
    if(typeof create !== 'function'){
        value = create;
        create = ()=>value;
    }
    return new ElementGenerator(create, parent);
}
