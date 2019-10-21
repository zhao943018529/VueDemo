import _ from 'lodash';
import Option from './Option.jsx';
import PropsJSX from './PropsJSX.jsx';

function getPropData(node, keys) {
    if(!node.componentOptions)return {};
    const propsData = node.componentOptions.propsData;
    const result = {};
    _.forEach(keys, key => result[key] = propsData[key]);

    return result;
}

export default {
    name: 'MyApple',
    comments: {
        Option,
    },
    Options: {
        gg: 11
    },
    props: {
        name: String,
    },
    data() {
        return {
            ff: '1111',
        };
    },
    methods: {
        renderOptions() {
            const keys = ['key', 'value'];

            return (<ul>{_.map(this.$slots.default, child => {
                const option = getPropData(child, keys);
                return (
                    <li>
                        {option.key + "---" + option.value}
                    </li>
                );
            })}</ul>);
        },
    },
    render() {
        debugger;
        const propsData={props:{a:'111111',b:11111,c:true},attrs:{}};

        return (<div>{this.renderOptions()}
        <PropsJSX {...propsData}>iiiiiiii</PropsJSX>
        </div>);
    },
}