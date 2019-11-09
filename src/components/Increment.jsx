import { mapState, mapActions } from 'vuex';

export default {
    name: 'Increment',
    computed: {
        ...mapState({
            count: state => state.count,
        })
    },
    methods: {
        increment() {
            this.$store.commit('increment');
        },
    },
    render() {
        return (<div>
            <p>{this.count}</p>
            <button onClick={this.increment}>Increment</button>
        </div>);
    }
};