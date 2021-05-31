 

export default class DynamicProperty {
    constructor(value) {
        this._value = undefined;
        this._hasClone = false;
        this._hasEquals = false;
        this._definitionChanged = new Cesium.Event();
        this._constant = false;
        this.setValue(value);     
    } 

    get isConstant(){
        return this._constant;
    }
    set isConstant(value){
        if (this._constant !== value) {
            this._constant = value;
            this._definitionChanged.raiseEvent(this);
        }
    }
    get definitionChanged(){
        return this._definitionChanged;
    }

    getValue(time, result) {
        return this._hasClone ? this._value.clone(result) : this._value;
    }
    setValue (value) {
        var oldValue = this._value;
        if (oldValue !== value) {
            var isDefined = Cesium.defined(value);
            var hasClone = isDefined && typeof value.clone === 'function';
            var hasEquals = isDefined && typeof value.equals === 'function';

            this._hasClone = hasClone;
            this._hasEquals = hasEquals;

            var changed = !hasEquals || !value.equals(oldValue);
            if (changed) {
                this._value = !hasClone ? value : value.clone();
                this._definitionChanged.raiseEvent(this);
            }
        }
    }
    equals(other) {
        return this === other || //
               (other instanceof DynamicProperty && //
                ((!this._hasEquals && (this._value === other._value)) || //
                (this._hasEquals && this._value.equals(other._value))));
    }

    valueOf(other) {
        return this._value;
    }

   toString(other) {
        return String(this._value);
    }
      
}