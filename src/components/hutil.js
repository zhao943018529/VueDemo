import _ from 'lodash';

function getType(obj) {
    return Object.prototype.toString.call(obj).slice(8, -1);
}

function getFilterData(data, filter) {
    let result = {
        data: [],
        nodes: [],
    };
    result.nodes.push({
        id: data.id,
        title: data.name,
        name: data.name,
        threat: data.threat,
        root: true,
    });
    let child = filterDfs(data.children, data.id, filter);
    if (child) {
        result.data = result.data.concat(child.data);
        result.nodes = result.nodes.concat(child.nodes);
    }

    return result;
}

function filterDfs(data, parentId, filter) {
    if (!data || data.length == 0) return;

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
        to: obj.id,
        className: 'myhighchart'
    };

    result[1] = {
        id: obj.id,
        title: obj.name,
        name: obj.name,
        threat: obj.threat,
        className: 'myhighchart'
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
        return _.reduce(tree.children || [], (acc, item) => {
            Array.prototype.push.apply(acc, dfsGetIds(item));

            return acc;
        }, []);
    } else {
        if (tree.children) {
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

    return _.reduce(tree.children || [], (acc, item) => {
        Array.prototype.push.apply(acc, dfsGetIds(item));
        return acc;
    }, [tree.id]);
}



function deepFilter(data, tree, id) {
    let filters = dfsFindIds(tree, id);

    return {
        data: _.filter(data.data, item => !_.includes(filters, item.to)),
        nodes: _.filter(data.nodes, node => node.root || !_.includes(filters, node.id)),
    }
}

function generateLayout(go) {
    // Customize the TreeLayout to position all of the leaf nodes at the same vertical Y position.
    function FlatTreeLayout() {
        go.TreeLayout.call(this);  // call base constructor
    }
    go.Diagram.inherit(FlatTreeLayout, go.TreeLayout);

    // This assumes the TreeLayout.angle is 90 -- growing downward
    FlatTreeLayout.prototype.commitLayout = function () {
        go.TreeLayout.prototype.commitLayout.call(this);
        var x = -Infinity;
        this.network.vertexes.each(function (v) {
            x = Math.max(x, v.node.position.x);
        });
        this.network.vertexes.each(function (v) {
            if (v.destinationEdges.count === 0) {
                v.node.position = new go.Point(x, v.node.position.y);
                v.node.toEndSegmentLength = Math.abs(v.centerX - x);
            } else {
                v.node.toEndSegmentLength = 10;
            }
        });
    };

    return FlatTreeLayout;
}

function convertDiagramData(data) {
    let result = [];
    if (!data) return result;
    result = dfsConvert(data.children, data.id);
    result.unshift(createNode(data, null));
    return result;
}

function dfsConvert(data, parentId) {
    if (data && data.length == 0) return [];

    return _.reduce(data, (acc, cur) => {
        acc.push(createNode(cur, parentId));
        Array.prototype.push.apply(acc,
            dfsConvert(cur.children, cur.id));
        return acc;
    }, []);
}

function createNode(obj, parentId) {
    let result = {
        key: obj.id,
        text: obj.name,
        fill: obj.threat ? '#f68c06' : '#ccc',
        source: "https://image.flaticon.com/icons/png/512/69/69524.png",
        visible: obj.threat || !parentId,
    };
    if (parentId) {
        result.parent = parentId;
    }
    return result;
}

export {
    getFilterData,
    getChildren,
    deepFilter,
    generateLayout,
    convertDiagramData,
};