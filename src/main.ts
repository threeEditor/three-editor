import { createApp } from "vue";
import "./style.scss";
import "normalize.css";
import App from "./App.vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
let app = createApp(App);
app.use(ElementPlus);
app.mount("#app");
