<template>
    <BasicLayout style="background: white">
        <template v-slot:center>
            <div v-show="status === 'pre'" class="info">
                    接下来开始练习
            </div>
            <div v-show="status === 'done'" class="info">
                接下来开始正式测试
            </div>

            <div v-if="status==='test'">
                <div class="header">
                    <div class="left">第{{ pointer +1 }}题</div>
                    <div class="right">
                        答题倒计时
                        <div class="time">
                            {{ second }}
                        </div>秒
                    </div>
                </div>
                <hr>
                <div class="wrap">
                    <div>
                        <div class="prompt">
                            请预测下一位数字是
                        </div>
                        <div class="prompt blue">
                            {{ result[pointer].display.split('').join('-') }}
                        </div>
                    </div>

                    <div style="height: 120px"></div>

                    <div v-show="before">
                        <div class="prompt">
                            你的答案是？
                        </div>
                        <div>
                            <el-radio-group v-model="result[pointer].before" @change="giveRec">
                                <el-radio-button label="1"></el-radio-button>
                                <el-radio-button label="2"></el-radio-button>
                                <el-radio-button label="3"></el-radio-button>
                            </el-radio-group>
                        </div>
                    </div>

                    <div v-show="!before">
                        <div class="prompt">
                            你的最终答案是？
                        </div>
                        <div>
                            <el-radio-group v-model="result[pointer].after">
                                <el-radio-button label="1"></el-radio-button>
                                <el-radio-button label="2"></el-radio-button>
                                <el-radio-button label="3"></el-radio-button>
                            </el-radio-group>
                        </div>
                    </div>

                    <div style="height: 80px"></div>

                    <div v-show="!before">
                        <div class="prompt">
                            你多大程度上信任助理的推荐
                        </div>
                        <div>
                            <el-radio-group v-model="result[pointer].rate">
                                <template v-for="(item, index) in items">
                                    <el-radio-button :label="index +1" :key="index"></el-radio-button>
                                </template>
                            </el-radio-group>
                        </div>

                        <div class="prompt"></div>

                        <div>
                            <el-button type="success" @click="nextRound">进入下一题</el-button>
                        </div>
                    </div>

                </div>

                <el-dialog  title="智能推荐助手"
                            :visible.sync="dialogVisable"
                            :before-close="handleClose"
                            center>
                    <video slot="footer" class="el-dialog--center" :src="videoSrc" typeof="video/mp4" controls="controls"  width="480" height="480" ></video>
                </el-dialog>
            </div>
        </template>
    </BasicLayout>
</template>

<script>
    import BasicLayout from "@/layout/BasicLayout";

    export default {
        name: "Trytry",
        components: {
            BasicLayout
        },
        mounted() {
            let self = this;
            setTimeout(function () {
                self.status = "test";
                self.subTime();
            }, 2000)
        },
        data(){
            return {
                status: 'pre',
                timeId: undefined,
                second: 10,
                pointer: 0,
                dialogVisable: false,
                before: true,
                items: [1,2,3,4,5,6,7],
                result: [{
                    answer: "123123",
                    display: "21311?",
                    before: "",
                    after: "",
                    rate: "",
                    sexual: "female",
                    reliability: "high",
                    recAns: "1",
                    spendTime: 11
                }, {
                    answer: "231231",
                    display: "22133?",
                    before: "",
                    after: "",
                    rate: "",
                    sexual: "female",
                    reliability: "high",
                    recAns: "2",
                    spendTime: 0
                },{
                    answer: "312312",
                    display: "31231?",
                    before: "",
                    after: "",
                    rate: "",
                    sexual: "male",
                    reliability: "high",
                    recAns: "2",
                    spendTime: 0
                }]
            }
        },
        computed: {
            videoSrc: function () {
                let pointer = this.pointer;
                let person = this.result[pointer];
                let type = JSON.parse(sessionStorage.getItem('person')).testType;
                let url = "https://91happy.oss-cn-shenzhen.aliyuncs.com/"
                url = `${url}${type}/${person.sexual}/${person.recAns}.mp4`;
                return url;
            }
        },
        methods: {
            subTime() {
                let self = this;
                this.timeId =  setInterval(function () {
                    if (self.second > 0) {
                        self.second -= 1;
                    } else {
                        self.$message.warning("请立刻做答！！");
                    }
                }, 1000);
            },
            giveRec() {
                this.timeId ? clearInterval(this.timeId) : undefined;
                this.timeId = undefined;
                this.dialogVisable = true;
            },
            nextRound() {
                if (this.pointer === 2) {
                    let self = this;
                    this.$message.info("恭喜你已经完成了练习");
                    this.status = "done";
                    setTimeout(function () {
                        self.$router.push({path: '/test'})
                    }, 2000);
                    return;
                }
                this.pointer += 1;
                this.second = 10;
                this.before = true;
            },
            handleClose() {
                this.before = false;
                this.dialogVisable = false;
            },
        }
    }
</script>

<style scoped>
    .info {
        font-size: 35px;
        text-align: center;
        margin-top: 300px;
    }
    .prompt {
        margin: 30px 0;
        font-size: 22px;
    }
    .time {
        display: inline-block;
        margin: 0 20px;
    }
    .wrap>div{
        text-align: center;
    }
    .prompt {
         margin: 30px 0;
         font-size: 22px;
     }
    .time {
        display: inline-block;
        margin: 0 20px;
    }
    .wrap>div{
        text-align: center;
    }
    .header {
        margin-top: 20px;
        height: 40px;
        font-size: 18px;
    }
    .left {
        float: left;
    }
    .right {
        float: right;
    }
    .blue {
        color: #1b1be5;
    }
</style>