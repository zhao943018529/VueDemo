import _ from 'lodash';

export default {
    name: 'ListView',
    data() {
        return {
            list: [],
            current: 0,
            total: 0,
            observer: null,
        };
    },
    props: {
        size: Number,
    },
    created() {
        const arr = [];
        _.times(1000, i => {
            arr.push({ id: i, description: 'Hello Hanmei--' + i });
        });
        this.list = arr;
        this.total = arr.length;
        this.current = Math.min(this.size, this.total);
    },
    mounted() {
        this.observer = new IntersectionObserver(this.handleScrollMore, {
            root: this.$el,
            rootMargin: '0px',
            threshold:[0,0,.5,0],
        });
        this.observeLastChild();
    },
    updated() {

    },
    methods: {
        observeLastChild() {
            if(this.lastElement)this.observer.unobserve(this.lastElement);
            this.lastElement = this.$refs['content'].lastElementChild;
            this.observer.observe(this.lastElement);
        },
        handleScrollMore(entries) {
            if (this.current < this.total &&entries[0].intersectionRatio>0) {
                this.current = Math.min(this.current + this.size, this.total);
                this.$nextTick(() => {
                    this.observeLastChild();
                })
            }
        },
        renderItem(item, index) {
            return (<li class='list-item' key={item.id}>{item.description}</li>);
        },
        renderBody() {
            debugger;
            return (
                <ul class="list-content" ref="content">
                    {_.map(_.times(this.current, i => this.list[i]), (item, index) => this.renderItem(item, index))}
                </ul>
            );
        },
    },
    render() {
        return (<div class="list-view">
            {this.renderBody()}
        </div>)
    }
}