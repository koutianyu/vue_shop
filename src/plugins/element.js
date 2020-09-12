import Vue from 'vue'
//导入弹框提示组件
import {Button,Form,FormItem,Message,Input,Container,Header,Aside,Main,Menu,Submenu,MenuItem,Breadcrumb,BreadcrumbItem,Card,Row,Col,
        Table,TableColumn,Switch,Tooltip, Pagination,Dialog,MessageBox,Tag,Tree,Select,Option,Cascader} from "element-ui";

Vue.use(Option)
Vue.use(Cascader)
Vue.use(Select)
Vue.use(Tree)
Vue.use(Tag)
Vue.use(Button)
Vue.use(Table)
Vue.use(Dialog)
Vue.use(Switch)
Vue.use(TableColumn)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Submenu)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Tooltip)
Vue.use(Pagination)

Vue.prototype.$message =Message
Vue.prototype.$confirm =MessageBox.confirm
