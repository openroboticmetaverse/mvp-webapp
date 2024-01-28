import DefaultLayout from "./layouts/DefaultLayout.vue";
import TheViewer from "./pages/TheViewer.vue"
export const routes = [
    {
        path: '/',
        layout: DefaultLayout,
        children: [{
            path: '',
            component:  TheViewer,
        }],

    }
];
