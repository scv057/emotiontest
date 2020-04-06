<template>
    <BasicLayout>
        <template v-slot:center>
            <div class="container">
                <div class="wrap">
                    <div class="title">
                        请输入您的姓名、年龄、性别等信息
                    </div>
                    <el-form label-width="80px"
                             :model="info"
                             :rules="rules"
                             ref="form">
                        <el-form-item label="姓名"
                                      prop="name">
                            <el-input v-model="info.name" placeholder="请输入姓名"></el-input>
                        </el-form-item>
                        <el-form-item label="年龄"
                                      prop="age">
                            <el-input v-model.number="info.age" placeholder="请输入年龄"></el-input>
                        </el-form-item>
                        <el-form-item label="性别" prop="sexual">
                            <el-radio-group v-model="info.sexual">
                                <el-radio label="男"></el-radio>
                                <el-radio label="女"></el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="success" @click="submit">提交</el-button>
                        </el-form-item>
                    </el-form>
<!--                    <el-button type="primary" @click="sendMessage">测试按钮</el-button>-->
                </div>
            </div>
        </template>
    </BasicLayout>
</template>

<script>
    import BasicLayout from "@/layout/BasicLayout";

    export default {
        name: "Index",
        components: {
            BasicLayout,
        },
        data() {
            return {
                rules: {
                    name: [{required: true, message: '姓名不能为空', trigger: 'blur'}],
                    age: [{required: true, message: '年龄不能为空', trigger: 'blur'},
                        {type: 'number', message: '请输入数字', trigger: 'change'}],
                    sexual: [{required: true, message: '性别不能为空', trigger: 'blur'}]
                },
                info: {
                    name: "",
                    age: "",
                    sexual: "",
                    testType: ""
                }
            }
        },
        methods: {
            submit(){
                this.$refs['form'].validate(
                    (valid) =>{
                        if (valid) {
                            window.location.href.match("test1") ? this.info.testType = "wave" : this.info.testType = "videos";
                            sessionStorage.setItem('person', JSON.stringify(this.info));
                            this.$message.info("点击登录后， 先开始3个练习题，然后才是正式答题。");
                            setTimeout(() => {
                                this.$router.push({path: 'try'})
                            }, 2000)
                        } else {
                            this.$message.warning("请填写完个人信息");
                        }
                    }
                )
            },
            sendMessage() {
                let data = {};
                data['person'] = JSON.parse(sessionStorage.getItem('person'));
                data['result'] = [{
                    answer: 'String',
                    display: 'String',
                    before: 'String',
                    after: 'String',
                    confidence: 'String',
                    rate: 'String',
                    sexual: 'String',
                    reliability: 'String',
                    recAns: 'String',
                    spendTime: 10,
                    spendTimeL: 10
                },{
                    answer: 'String',
                    display: 'String',
                    before: 'String',
                    after: 'String',
                    confidence: 'String',
                    rate: 'String',
                    sexual: 'String',
                    reliability: 'String',
                    recAns: 'String',
                    spendTime: 10,
                    spendTimeL: 10
                },{
                    answer: 'String',
                    display: 'String',
                    before: 'String',
                    after: 'String',
                    confidence: 'String',
                    rate: 'String',
                    sexual: 'String',
                    reliability: 'String',
                    recAns: 'String',
                    spendTime: 10,
                    spendTimeL: 10
                }];
                let url = "/api";
                fetch(url, {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: new Headers({
                        'Content-Type': 'application/json'
                    })
                }).then(res=>{
                    console.log(res);
                }).catch(err=>{
                    console.log(err);
                })
            }
        }
    }
</script>

<style scoped>
    .container {
        display: flex;
        height: 100%;
        justify-content: center;
    }
    .wrap {
        height: 400px;
        align-self: center;
    }
    .title {
        font-size: 70px;
        color: white;
        text-align: center;
        margin-bottom: 30px;
    }
    .el-button {
        width: 100%;
    }
</style>

<style>
    label.el-form-item__label, label.el-radio>*{
        color: white;
    }
</style>