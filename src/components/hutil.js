import _ from 'lodash';

function getType(obj) {
    return Object.prototype.toString.call(obj).slice(8, -1);
}

function getFilterData(data,filter) {
    let result = {
        data: [],
        nodes: [],
    };
    result.nodes.push({
        id: data.id,
        title:data.name,
        name: data.name,
        threat:data.threat,
        root:true,
    });
    let child = filterDfs(data.children, data.id,filter);
    if (child) {
        result.data = result.data.concat(child.data);
        result.nodes = result.nodes.concat(child.nodes);
    }

    return result;
}

function filterDfs(data, parentId, filter) {
    if (!data||data.length==0) return;
    
    let result = data.reduce((acc, current) => {
        let temp = filterDfs(current.children, current.id, filter);
        if (temp || filter(current)) {
            let val = generate(current, parentId);
            acc.data.push(val[0]);
            acc.nodes.push(val[1]);
            if (temp) {
                Array.prototype.push.apply(acc.data, temp.data);
                Array.prototype.push.apply(acc.nodes, temp.nodes);
            }
        }

        return acc;
    }, {
        data: [],
        nodes: [],
    });

    if (result.data.length > 0) {
        return result;
    }
}

function generate(obj, parentId) {
    let result = [];
    result[0] = {
        from: parentId,
        to: obj.id
    };

    result[1] = {
        id: obj.id,
        title: obj.name,
        name: obj.name,
        threat:obj.threat,
    };

    return result;
}

function getChildren(obj, id) {
    if (!obj) return;
    if (obj.id === id) {
        return _.reduce(obj.children || [], (acc, item) => {
            const val = generate(item, id);
            acc.data.push(val[0]);
            acc.nodes.push(val[1]);

            return acc;
        }, {
            data: [],
            nodes: [],
        });
    } else {
        if (obj.children) {
            for (let item of obj.children) {
                let val = getChildren(item, id);
                if (val) return val;
            }
        }
    }
}

function dfsFindIds(tree, id) {
    if (tree.id === id) {
        return _.reduce(tree.children||[], (acc, item) => {
            Array.prototype.push.apply(acc, dfsGetIds(item));

            return acc;
        }, []);
    } else {
        if(tree.children){
            for (let obj of tree.children) {
                let val = dfsFindIds(obj, id);
                if (val) {
                    return val;
                }
            }
        }
    }
}

function dfsGetIds(tree) {

    return _.reduce(tree.children||[], (acc, item) => {
        Array.prototype.push.apply(acc, dfsGetIds(item));
        return acc;
    }, [tree.id]);
}



function deepFilter(data,tree,id){
    let filters = dfsFindIds(tree,id);

    return {
        data:_.filter(data.data,item=>!_.includes(filters,item.to)),
        nodes:_.filter(data.nodes,node=>node.root || !_.includes(filters,node.id)),
    }
}

export {
    getFilterData,
    getChildren,
    deepFilter,
};