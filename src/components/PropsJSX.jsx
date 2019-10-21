export default {
    name:"PropsJSX",
    data(){
        return {
            value:1111,
        };
    },
    props:{
        a:String,
        b:Number,
        c:Boolean,
    },
    render() {
        debugger;
        return (<div>{this.a}</div>);
    },
};