<template>
    <div>
        <!--面包屑导航区-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片视图区-->
        <el-card>
            <!--搜索与添加区-->
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-input placeholder="请输入内容" v-model="queryInfo.query"  clearable @clear="getUserList">
                            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                        </el-input>
                    </el-col>
                    <el-col :span="4">
                        <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
                    </el-col>
                </el-row>
            <!--用户列表区域-->
            <el-table border :stripe="true"
                    :data="userList"
                    style="width: 100%">
                <el-table-column
                       type="index">
                </el-table-column>
                <el-table-column
                        prop="username"
                        label="姓名"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="email"
                        label="邮箱"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="mobile"
                        label="电话">
                </el-table-column>
                <el-table-column
                        prop="role_name"
                        label="角色">
                </el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <!--修改按钮-->
                        <el-button @click="showEditDialog(scope.row.id)" type="primary" icon="el-icon-edit" size="mini" round></el-button>
                        <!--删除按钮-->
                        <el-button type="danger" @click="removeUserById(scope.row.id)" icon="el-icon-delete" size="mini" round></el-button>
                        <!--分配角色按钮-->
                        <el-tooltip :enterable="false"  effect="dark" content="分配角色" placement="top" >
                            <el-button @click="setRole(scope.row)" type="warning" size="mini" icon="el-icon-star-off" round></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页区域-->
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum"
                    :page-sizes="[1, 2, 4, 100]"
                    :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>

        </el-card>
        <!-- 添加用户的对话狂-->
        <el-dialog @close="addDialogClosed"
                title="添加用户"
                :visible.sync="addDialogVisible"
                width="50%">
            <!--内容主题区-->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addForm.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <!--底部按钮区-->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button @click="addUser" type="primary" >确 定</el-button>
            </span>
        </el-dialog>
        <!--修改用户的对话框-->
        <el-dialog @close="editDialogClosed"
                title="修改用户"
                :visible.sync="editDialogVisible"
                width="50%">
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px" >
                <el-form-item label="用户名">
                    <el-input v-model="editForm.username" disabled ></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="editForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUserInfo">确 定</el-button>
            </span>
        </el-dialog>

        <!--分配角色的对话框-->
        <el-dialog @close="setRoleClosed"
                title="分配角色"
                :visible.sync="setShowDialogVisible"
                width="50%">
            <div>
                <p>当前的用户{{userInfo.username}}</p>
                <p>当前的角色{{userInfo.role_name}}</p>
                <p>分配新角色</p>
                <el-select v-model="selectedRoleId" placeholder="请选择">
                    <el-option
                            v-for="item in rolesList"
                            :key="item.id"
                            :label="item.roleName"
                            :value="item.id">
                    </el-option>
                </el-select>

            </div>
            <span slot="footer" class="dialog-footer">
    <el-button @click="setShowDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
  </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "Users",
        data(){
            /*验证邮箱的规则*/
            var checkEmail = (rule,value,cb) =>{
                /*验证邮箱的正则表达式*/
                const regEmail =  /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
                if (regEmail.test(value)){
                    return cb
                }else {
                    cb(new Error('请输入一个合法的邮箱'))
                }
            }
            var checkMobile = (rule,value,cb) =>{
                const regMobile =/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
                if (regMobile.test(value)){
                    return cb
                }else {
                    cb(new Error('请输入一个合法的手机号码'))
                }

            }
            return{

                /*获取用户列表的参数对象*/
                queryInfo:{
                    query:'',
                    pagenum: 1,
                    pagesize: 2
                },
                userList:[],
                total:0,
                /*控制添加用户对话框的显示与隐藏*/
                addDialogVisible : false,
                /*控制修改用户对话框的显示与隐藏*/
                editDialogVisible :false,
                /*添加用户的表单数据*/
                addForm :{
                    username:'',
                    password:'',
                    email :'',
                    mobile:''
                },
                /*添加表单的验证规则对象*/
                addFormRules :{
                    username :[
                        { required: true, message: '请输入用户名', trigger: 'blur'},
                        { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                    ],
                    password :[
                        { required: true, message: '请输入密码', trigger: 'blur'},
                        { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                    ],
                    email :[
                        { required: true, message: '请输入邮箱', trigger: 'blur'},
                        {validator : checkEmail ,trigger: 'blur'}
                    ],
                    mobile :[
                        { required: true, message: '请输入手机', trigger: 'blur'},
                        {validator : checkMobile ,trigger: 'blur'}
                    ],
                },
                /*编辑表单的验证规则对象*/
                editFormRules :{
                    email :[
                        { required: true, message: '请输入邮箱', trigger: 'blur'},
                        {validator : checkEmail ,trigger: 'blur'}
                    ],
                    mobile :[
                        { required: true, message: '请输入手机', trigger: 'blur'},
                        {validator : checkMobile ,trigger: 'blur'}
                    ],

                },
                /*根据id查询到的用户信息*/
                editForm :{

                },
                /*控制角色分配对话框的显示与隐藏*/
                setShowDialogVisible : false,
                /*需要被分配角色的用户信息*/
                userInfo : {},
                /*所有的角色数据列表*/
                rolesList :[],
                /*分配角色对话框的选中角色Id*/
                selectedRoleId:'',


            }
    },
        created(){
            this.getUserList()

    },
        methods:{
            async getUserList(){
                const {data : res} =  await this.$http.get('users',{params:this.queryInfo});
                if(res.meta.status!==200){
                        //失败
                    return this.$message.error(res.meta.msg)
                }else {
                    //成功
                    this.userList = res.data.users
                    this.total = res.data.total

                }
            },
            /*监听pagesize改变的事件*/
            handleSizeChange(newSize){
                this.queryInfo.pagesize = newSize
                this.getUserList()

            },
            /*监听页码值改变的事件*/
            handleCurrentChange(newPage){
                this.queryInfo.pagenum = newPage
                this.getUserList()

            },
            /*监听 switch 开关状态的改变*/
            async userStateChanged(userInfo){
               const {data:res } = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`);
               if (res.meta.status!==200){
                   userInfo.mg_state = !userInfo.mg_state
                   /*请求失败*/
                   return this.$message.error('更新用户状态失败')
               }else {
                   this.$message.success('更新用户状态成功')
               }


            },
            /*监听添加用户对话框的关闭事件*/
            addDialogClosed(){
                this.$refs.addFormRef.resetFields();
            },
            /*监听添加用户对话框的关闭事件*/
            editDialogClosed(){
                this.$refs.editFormRef.resetFields();
            },
            /*点击按钮添加新用户   添加用户有问题*/
            addUser(){
                this.$refs.addFormRef.validate( async valid => {
                    alert(valid)
                    if (!valid){
                       return this.$message.error("请填写完整用户信息");
                   }else {
                       /*可以发起添加用户的网络请求*/
                       const {data:res} = await this.$http.post('users',this.addForm);
                       if (res.meta.status!==201){
                           return this.$message.error('添加用户失败')
                       }else {
                           this.$message.success('添加用户成功')
                           /*隐藏添加用户的对话框*/
                           this.addDialogVisible = false
                           /*刷新用户列表*/
                           this.getUserList()
                       }
                   }
                })

            },
            /*修改用户信息 并提交*/
            editUserInfo(){
                this.$refs.editFormRef.validate(valid =>{
                   alert(valid)
                })

            },
            /*根据id删除对应的用户信息*/
            async removeUserById(id){
                /*弹框询问用户是否数据*/
                const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => err);
                /*
                    用户确认删除则返回 confirm 取消则返回cancel
                * */
                if (confirmResult!=='confirm'){
                    return this.$message.info('已经取消删除操作')
                }else {
                    const {data:res} = await this.$http.delete('users/'+id);
                    if (res.meta.status!==200){
                        return this.$message.error('删除用户失败')
                    }else {
                        this.$message.success('删除用户成功')
                        this.getUserList(1,2)
                    }
                }

            },
            /*展示编辑用户的对话框*/
            async showEditDialog(id){

                const {data:res}  = await this.$http.get('users/'+id);
                if (res.meta.status!==200){
                    return this.$message.error('查询用户信息失败')
                }else {
                    this.editForm = res.data
                }
                this.editDialogVisible = true
            },
            /*展示分配角色的对话框*/
            async setRole(userInfo){
                this.userInfo = userInfo

                /*在显示对话框之前。 先获取到所有角色的列表*/
                const {data :res } = await this.$http.get('roles');
                if (res.meta.status!==200){
                    return  this.$message.error('获取角色列表失败')
                }else {
                    this.rolesList  = res.data
                }
                this.setShowDialogVisible = true
            },
            /*分配角色对话框的确认按钮监听*/
            async saveRoleInfo(){
                if (!this.selectedRoleId){
                    return this.$message.error("请选择要分配的角色")
                }else {
                    const {data :res} = await this.$http.put(`users/${this.userInfo.id}/role`,{rid : this.selectedRoleId});
                    if (res.meta.status!==200){
                        this.$message.error("更新角色失败")
                    }else {
                        this.$message.success("更新角色成功")

                        this.getUserList()
                        this.setShowDialogVisible = false
                    }
                }

            },
            /*监听分配角色的对话框的关闭*/
            setRoleClosed(){

                this.selectedRoleId =''
                this.userInfo = ' '

            }
        },



    }
</script>

<style scoped>

</style>