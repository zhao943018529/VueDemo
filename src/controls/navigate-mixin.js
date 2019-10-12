export default {
    data() {
        return {
            hoverIndex: -1,
        };
    },
    methods: {
        navigate(direction) {
            const s = this.activeOptions.length;
            const initialIndex = this.hoverIndex > -1 ? this.hoverIndex : 0;
            const increment = direction === "previous" ? -1 : 1;
            this.hoverIndex = (s + increment + initialIndex) % s;
        }
    },
}