function lookupForward(context, componentName) {
    let parent = context.$parent;
    let name = parent.$options.name;

    while (parent && (!name || name !== componentName)) {
        parent = parent.$parent;
        if (parent) {
            name = parent.$options.name;
        }
    }

    return parent;
};

function lookdownForward(context, componentName) {
    let children = context.$children;
    let matchComponents = [];
    children.forEach(child => {
        if (child.$options.name === componentName) {
            matchComponents.push(child);
        } else {
            matchComponents = matchComponents.concat(lookdownForward(child, componentName));
        }
    });

    return matchComponents;
};

export default {
    methods: {
        dispatch(componentName, eventName, params) {
            const targetComponent = lookupForward(this, componentName);
            if (targetComponent) {
                this.$emit.apply(targetComponent, [eventName].concat(params));
            }
        },
        broadcast(componentName,eventName,params){
            const components = lookdownForward(this,componentName);
            components.forEach(component=>{
                this.$emit.apply(component,[eventName].concat(params));
            });
        }
    },
};