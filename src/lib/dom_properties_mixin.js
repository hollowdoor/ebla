import arrayFrom from 'array-from';

const props = (()=>{
    const props = {
        style: {
            get(){
                if(!this._style){
                    if(Proxy === void 0) return this.element.style;
                    if(isElement(el)){
                        this._style = cssProxy(el);
                    }else if(el === window || el === document){
                        this._style = cssProxy();
                    }
                }
                return this._style;
            }
        },
        parent: {
            get(){ return this.element.parentNode; }
        },
        first:{
            get(){
                return this.element.firstChild;
            }
        },
        last: {
            get(){
                return this.element.lastChild;
            }
        },
        nodeName: {
            get(){
                return this.element.nodeName;
            }
        },
        children: {
            get(){
                return toArray(this.element.children);
            },
            set(children){
                this.element.innerHTML = '';
                toArray(children).forEach(child=>{
                    this.element.appendChild(child);
                });
            }
        },
        childNodes: {
            get(){
                return toArray(this.element.childNodes);
            }
        },
        value: {
            set(value){
                this.element.value = value;
            },
            get(){
                return this.element.value;
            }
        },
        innerHTML: {
            set(html){
                this.element.innerHTML = html;
            }
        }
    };

    Object.keys(props).forEach(prop=>prop.enumerable = true);
    return props;
})();

export function mixin(dest){
    Object.defineProperties(dest, props);
    return dest;
}

export function mixinDOMProperties(dest){
    return mix(dest);
}

export props;
