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
        return (<div>{this.a}</div>);
    },
};