<template>
    <BasicLayout>
        <template v-slot:center>
            <div v-show="status === 'pre'" class="info">
                    接下来开始练习
            </div>
            <div v-show="status === 'done'" class="info">
                接下来开始正式测试
            </div>

            <div v-if="status==='test'">
                <div class="wrap">
                    <div class="box">
                        第{{ pointer + 1 }}题
                    </div>

                    <div class="box">
                        答题倒计时
                        <div class="time">
                            {{ second }}
                        </div>秒
                    </div>

                    <div>
                        <div class="prompt">
                            请预测下一位数字是
                        </div>
                        <div class="prompt">
                            {{ result[pointer].display }}
                        </div>
                    </div>

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

                    <div v-show="before">
                        <div class="prompt">
                            你多大程度上信任自己的答案：
                        </div>
                        <div>
                            <el-radio-group v-model="result[pointer].confidence" @change="giveRec">
                                <template v-for="(item, index) in items">
                                    <el-radio-button :label="index +1" :key="index"></el-radio-button>
                                </template>
                            </el-radio-group>
                        </div>

                        <div class="prompt"></div>
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

                <el-dialog  title="预测"
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
                    answer: "31231",
                    display: "3133?",
                    before: "",
                    after: "",
                    rate: "",
                    sexual: "female",
                    reliability: "high",
                    recAns: "1",
                    spendTime: 11
                }, {
                    answer: "23123",
                    display: "2213?",
                    before: "",
                    after: "",
                    rate: "",
                    sexual: "female",
                    reliability: "high",
                    recAns: "2",
                    spendTime: 0
                },{
                    answer: "12312",
                    display: "1211?",
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
                let url = "https://91happy.oss-cn-shenzhen.aliyuncs.com/videos/"
                url = `${url}${person.sexual}/${person.recAns}.mp4`;
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
                let pp = this.result[this.pointer];

                if (!pp.before) {
                    this.$message.warning("请选择答案");
                    return;
                };

                if (!pp.confidence) {
                    this.$message.warning("请选择信任度");
                    return;
                }

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
        color: white;
        text-align: center;
        margin-top: 300px;
    }
    .prompt {
        margin: 30px 0;
        color: white;
        font-size: 22px;
    }
    .box {
        margin: 20px ;
        font-size: 25px;
        color: white;
    }
    .time {
        display: inline-block;
        margin: 0 20px;
    }
    .wrap>div{
        text-align: center;
    }.prompt {
         margin: 30px 0;
         color: white;
         font-size: 22px;
     }
    .box {
        margin: 20px ;
        font-size: 25px;
        color: white;
    }
    .time {
        display: inline-block;
        margin: 0 20px;
    }
    .wrap>div{
        text-align: center;
    }
</style>