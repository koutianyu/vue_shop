<template>
    <div>
        <!--面包屑导航区-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片视图区域-->
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
                </el-col>
            </el-row>
        </el-card>
        <!--添加分类的对话框-->
        <el-dialog @close="addCateDialogClosed"
                title="添加分类"
                :visible.sync="addCateDialogVisible"
                width="50%">
                <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
                    <el-form-item label="分类名称：" prop="cat_name">
                        <el-input v-model="addCateForm.cat_name"></el-input>
                    </el-form-item>
                    <el-form-item label="父级分类：" >
                        <el-cascader
                                v-model="selectedKeys"
                                :options="parentCateList"
                                :props="cascaderProps"
                                @change="parentCateChange" clearable change-on-seleted></el-cascader>

                    </el-form-item>
                </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCateDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCate">确 定</el-button>
            </span>
        </el-dialog>
        <!--表格-->
        <el-table
                :data="cateList"
                style="width: 100%;margin-bottom: 20px;"
                row-key="cat_id"
                border
                :tree-props="{children: 'children',}">
            <el-table-column type="index"></el-table-column>
            <el-table-column
                    prop="cat_name"
                    label="分类名称" >
            </el-table-column>
            <el-table-column
                    label="是否有效">
                <template slot-scope="scope">
                    <i class="el-icon-success" v-if="scope.row.cat_deleted===false" style="color: lightgreen"></i>
                    <i class="el-icon-error" v-else style="color: red"></i>
                </template>
            </el-table-column>
            <el-table-column label="排序">
                <template slot-scope="scope">
                    <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
                    <el-tag type="success" size="mini" v-else-if="scope.row.cat_level===1">二级</el-tag>
                    <el-tag type="warning" size="mini"v-else>三级</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" size="=mini" icon="el-icon-edit">编辑</el-button>
                    <el-button type="warning" size="=mini" icon="el-icon-delete">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--分页区域-->
        <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[3, 5, 10, 15]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
        </el-pagination>


    </div>
</template>

<script>
    export default {
        name: "Cate",
        data(){
            return{
                /*商品分类的数据列表。默认为空*/
                cateList:[],
                /*查询条件*/
                queryInfo: {
                    type : 3,
                    pagenum : 1,
                    pagesize : 5
                },
                /*商品总数据条数*/
                total :0,
                /*控制添加分类对话框的显示与隐藏*/
                addCateDialogVisible : false,
                /*添加分类的表单数据对象*/
                addCateForm :{
                    /*将要添加的分类名称*/
                    cat_name :'',
                    /*父级分类的id*/
                    cat_pid : 0,
                    /*分类的等级 默认为一级*/
                    cat_level :0 ,

                },
                /*添加分类表单的验证规则对象*/
                addCateFormRules :{
                    cat_name :{ required: true, message: '请输入分类名称', trigger: 'blur'},
                },
                /*父级分类的列表*/
                parentCateList :[],
                /**/
                cascaderProps :{
                    expandTrigger: 'hover',
                    value :'cat_id',
                    label : 'cat_name',
                    children: 'children',
                    checkStrictly :true
                },
                /*选中的父级分类id数组*/
                selectedKeys :[],

            }
        },
        created() {
            this.getCateList()
        },
        methods :{
            /*获取商品分类的数据*/
            async getCateList(){
                const {data:res} = await this.$http.get('categories',{params:this.queryInfo});
                if (res.meta.status!==200){
                    return this.$message.error('获取商品分类失败')
                }else {
                    console.log(res.data.result);
                    /*把数据列表赋值给 cateList*/
                    this.cateList = res.data.result
                    /*为总数据条数赋值*/
                    this.total = res.data.total
                }

            },
            /*监听pagesize改变的事件*/
            handleSizeChange(newSize){
                this.queryInfo.pagesize = newSize
                this.getCateList()
            },
            /*监听Pagenumber改变的事件*/
            handleCurrentChange(newPage){
                this.queryInfo.pagenum =  newPage
                this.getCateList()

            },
            /*点击按钮展示添加分类的对话框*/
            showAddCateDialog(){
                this.getParentCateList()
                this.addCateDialogVisible = true


            },
            /*获取父级分类的数据列表*/
            async getParentCateList(){
                const {data :res } = await this.$http.get('categories',{params:{type:2}});

                if (res.meta.status !==200){
                    return this.$message.error('获取父级分类失败')
                }else {
                    this.parentCateList = res.data
                }

            },
            /*选择项触发变化函数*/
            parentCateChange(){
                /*如果selectedKeys的长度大于0 就有选中 反正没有选中*/
                if (this.selectedKeys.length > 0){
                    /*父及分类的ID*/
                    this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length-1]
                    /*当前分类等级赋值*/
                    this.addCateForm.cat_level = this.selectedKeys.length

                }else {
                    this.addCateForm.cat_pid = 0
                    this.addCateForm.cat_level = 0
                }

            },
            /*添加分类对话框 确认按钮*/
            addCate(){
               this.$refs.addCateFormRef.validate(async valid =>{
                   if (!valid){
                       return
                   }else {
                       const {data: res} = await this.$http.post('categories',this.addCateForm);
                       if (res.meta.status!==201){
                           this.$message.error('添加分类失败')
                       }else {
                           this.$message.success('添加分类成功')
                           this.getCateList()
                           this.addCateDialogVisible =false
                       }

                   }
               })
            },
            /*监听添加对话框的关闭事件，重置表单数据*/
            addCateDialogClosed(){
                this.$refs.addCateFormRef.resetFields()
                this.selectedKeys = []
                this.addCateForm.cat_pid = 0
                this.addCateForm.cat_level = 0
            }
        }
    }
</script>

<style scoped>
    .el-cascader{
        width: 100%;
    }

</style>