<template>
    <el-container class="home-container">
        <!--//头部区-->
        <el-header>
            <div>
                <img src="../assets/heima.png" alt="">
                <span>电商后台管理系统</span>
            </div>
            <el-button type="info" @click="logout">退出</el-button>
        </el-header>
      <!--  //页面主题区-->
        <el-container>
         <!--   //侧边-->
            <el-aside :width="isCollapse?'56px': '200px'">
                <div class="toggle-button" @click="toggleCollapse">|||</div>
                <!--侧边栏菜单区-->
                <el-menu :default-active="this.$route.path" :router="true" background-color="#373D41" text-color="#fff" active-text-color="#409EFF" :unique-opened="true" :collapse="isCollapse" :collapse-transition="false">
                    <!--一级菜单-->
                    <el-submenu v-for='item in menuList' :key="item.id" :index="item.id+''">
                        <!--一级菜单模板区-->
                        <template slot="title">
                            <!--图标-->
                            <i :class="iconsOgj[item.id]" class="iconfont"></i>
                            <!--文本-->
                            <span>{{item.authName}}</span>
                        </template>
                        <!--二级菜单-->
                        <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children">
                            <template slot="title">
                                <!--图标-->
                                <i class="el-icon-menu"></i>
                                <!--文本-->
                                <span>{{subItem.authName}}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
           <!-- //主体-->
            <el-main>
                <!--//welcome页面占位符-->
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    export default {
        data(){
            return{
                //左侧菜单数据
                menuList:[],
                iconsOgj:{125: 'el-icon-user' , '103': 'el-icon-lock' ,'101': 'el-icon-shopping-cart-2','102': 'el-icon-files','145': 'el-icon-notebook-2'},
                //是否折叠左侧菜单数据  默认不折叠
                isCollapse : false
            }
        },
        name: "Home",
        methods:{
            logout(){
                window.sessionStorage.removeItem('token');
                this.$router.replace('/login');
            },
            //获取所有的菜单
            async getMenuList(){
                const {data:res} = await this.$http.get('menus');
                if (res.meta.status!==200){
                    return this.$message.error(res.meta.msg)
                }else {
                    this.menuList = res.data
                }

            },
            //点击按钮，切换菜单的折叠与展开
            toggleCollapse(){
                this.isCollapse = !this. isCollapse


            }

        },
        created(){
            this.getMenuList()
        }
    }
</script>

<style lang="less"scoped>
    .home-container{
        height: 100%;
    }
    .el-header{
        background-color: #373D41;
        display: flex;
        justify-content: space-between;
        padding-left: 0px;
        align-items: center;
        color: #fff;
        font-size: 20px;
        >div{
            display: flex;
            align-items: center;
        }
        span{
            margin-left: 15px;
        }
    }
    .el-aside{
        background-color: #333744;
        .el-menu{
            border-right: 0px;
        }
    }
    .el-main{
        background-color: #eaedf1;
    }
    .iconfont{
        margin-right: 10px;
    }
    .toggle-button{
        background-color: #4A5064;
        font-size: 15px;
        line-height: 24px;
        color: #fff;
        text-align: center;
        letter-spacing: 0.2em;
        cursor: pointer;
    }

</style>