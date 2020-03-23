import App from "../App_r.vue";
import MyTodos from "../components/MyTodos.vue";
import ESTree from "../components/ESTree.vue";
import HChart from "../components/HChart.vue";
import GoTree from "../components/GoTree.vue";
import DTree from "../components/DTree.jsx";
import DTree_t from "../components/DTree_t.jsx";
import ScatterHome from "./scatter/index.vue";

export default [
  {
    path: "/",
    component: App,
    children: [
      {
        path: "/scatter",
        component: ScatterHome
      },
      {
        path: "/",
        redirect: "/all"
      },
      {
        path: "/:type",
        component: MyTodos
      },
      {
        path: "/tree/index",
        component: ESTree
      },
      {
        path: "/htree/index",
        component: HChart
      },
      {
        path: "/gotree/index",
        component: GoTree
      },
      {
        path: "/dtree/index",
        component: DTree
      },
      {
        path: "/dtree_t/index",
        component: DTree_t
      }
    ]
  }
];
