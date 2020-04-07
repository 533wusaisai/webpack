import './assets/css/index.css'
class presons {
    constructor(name){
        this.name = name
    }
    getName(){
        return this.name
    }
};
let p = new presons('ss');
console.log(p.getName)