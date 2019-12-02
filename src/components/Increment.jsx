import { mapState, mapActions } from 'vuex';

export default {
    name: 'Increment',
    data() {
        return {
            a: 1,
            b: 2,
        };
    },
    computed: {
        ...mapState({
            count: state => state.count,
        })
    },
    methods: {
        increment() {
            this.$store.commit('increment');
        },
        change() {
            this.a = Math.random() * 1000;
            this.b = Math.random() * 100;
        },
    },
    render() {
        return (<div class="aaaa">
            <p>{this.a}{this.b}</p>
            <p>{this.count}</p>
            <button onClick={this.increment}>Increment</button>
            <button onClick={this.change}>ClickMe</button>
        </div>);
    }
};