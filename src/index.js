import { toElement, toHTML, isElement } from 'dom-elementals';
import arrayFrom from 'array-from';
import { mixin } from 'dom-properties-mixin';
import { requestAnimationFrame } from 'animation-frame-polyfill';

class Ebla {
    constructor(value, ...values){
        mixin(this);
        this.element = toElement(value, ...values);
        Ebla.plugins.forEach(plugin=>plugin.init.call(this));
    }
    contains(v){
        return this.element.contains(v);
    }
    append(v){
        this.element.appendChild(element(v).element);
        return this;
    }
    appendTo(v){
        new Ebla(v).append(this.element);
        return this;
    }
    prepend(v){
        this.element.insertBefore(
            element(v).element,
            this.first
        );
        return this;
    }
    html(s){
        if(!defined(s)) return this.element.innerHTML;
        this.element.innerHTML = '';
        this.append(s);
        return this;
    }
    text(s){
        if(!defined(s)) return this.element.textContent;
        this.element.textContent = s;
        return this;
    }
    attr(name, value){
        if(defined(value)){
            this.element.setAttribute(name, value);
        }
        return this.element.getAttribute(name);
    }
    prop(name, value){
        if(defined(value)){
            this.element[name] = value;
        }
        return this.element[name];
    }
    clone(deep){
        return new Ebla(this.element.cloneNode(deep));
    }
    animate(...args){
        return this.element.animate(...args);
    }
    generate(){
        return generate(()=>this.element.cloneNode(true));
    }
}

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
E.plugin = function createPlugin(create){
    let control = create(Ebla.prototype);
    if(typeof control === 'function'){
        if(typeof control['init'] !== 'function'){
            return;
        }
        Elba.plugins.push(control);
    }
};

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
    constructor(create){
        this._create = create;
    }
    create(...args){
        return ElementGenerator.getElementAsync(
            (this._create)(...args)
        );
    }
    static getElementAsync(v){
        return new Promise((resolve, reject)=>{
            requestAnimationFrame(()=>{
                try{
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

export function generate(create){
    let value;
    if(create !== 'function'){
        value = create;
        create = ()=>value;
    }
    return new ElementGenerator(create);
}
