import { mapState, mapActions } from 'vuex';

export default {
    name: 'Increment',
    props: {
        randomSay: String,
    },
    data() {
        return {
            digit: 1,
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
        incrementDigit() {
            ++this.digit;
        },
    },
    render() {
        return (<div>
            <slot name='instagram'></slot>
            <p>{this.randomSay}</p>
            <span>{this.digit}</span>
            <button onClick={this.incrementDigit}>WTF</button>
            <p>{this.count}</p>
            <button onClick={this.increment}>Increment</button>
        </div>);
    }
};