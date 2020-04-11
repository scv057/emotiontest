<template>
    <BasicLayout style="background: white">
        <template v-slot:center v-if="isInit">
            <div v-show="!finished && !rest">
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

                <el-dialog  title="智能助理"
                            :visible.sync="dialogVisable"
                            :before-close="handleClose"
                            center>
                    <video slot="footer" class="el-dialog--center" :src="videoSrc" typeof="video/mp4" controls="controls" id="recVideo" width="480" height="480" ></video>
                </el-dialog>
                <el-dialog title="统计"
                           :visible.sync="review"
                           :before-close="closeCount"
                           center>
                    上一轮答题情况：
                    共计6题; 答对{{ succCount }}题
                </el-dialog>
            </div>
            <div v-show="finished" class="info">
                恭喜你，完成了所有的测试！休息一下吧！
            </div>
            <div v-show="rest" class="info">
                恭喜你完成一半了，休息30秒先吧！
            </div>
            </template>
    </BasicLayout>
</template>

<script>
    import BasicLayout from "@/layout/BasicLayout";

    export default {
        name: "Test",
        components: {
            BasicLayout,
        },
        mounted() {
            // 初始化全局
            this.result = Array.from({length: 48}, () => {
                let answer = this.genAnum();
                let display = this.mask(answer);
                return {
                    answer: answer, // 正确答案, 为六个数字
                    display : display, // 展示 五个数字+？
                    before: '', // 提示前选的数字
                    after: '',  // 提示后的数字
                    confidence: 0, // 自信程度
                    rate: '',   //相信程度
                    sexual: '', // 推荐人的性别
                    recAns: answer[5], // 视频推荐的答案
                    reliability: '', // 可靠性high, low
                    spendTime: 0,   // 初选耗时
                    spendTimeL: 0   // 后面耗时
                }
            });
            this.testType = JSON.parse(sessionStorage.getItem("person")).testType;

            let r = Math.random() < 0.5;
            for (let i = 0; i < 2; i++) {
                for (let j = 0; j < 24; j++) {
                    if (r){
                        if (i == 0) {
                            this.result[i * 24 + j].reliability = 'high';
                        } else {
                            this.result[i * 24 + j].reliability = 'low';
                        }
                    } else {
                        if (i == 1) {
                            this.result[i * 24 + j].reliability = 'high';
                        } else {
                            this.result[i * 24 + j].reliability = 'low';
                        }
                    }
                }
            }

            for (let i = 0; i < 2; i++) {
                let r = Math.random() < 0.5;
                for (let j = 0; j < 24; j++) {
                    if (r) {
                        if (j < 12) {
                            this.result[i * 24 + j].sexual = 'male';
                        } else {
                            this.result[i * 24 + j].sexual = 'female'
                        }
                    } else {
                        if (j < 12) {
                            this.result[i * 24 + j].sexual = 'female';
                        } else {
                            this.result[i * 24 + j].sexual = 'male'
                        }
                    }
                }
            }

            if (r) {
                // 前20个每五个抽一个
                for (let i = 0; i < 4; i++) {
                    let idx = this.choice(1)[0];
                    let iin = this.result[idx + 6 * i].recAns;
                    let rec = this.change(iin);
                    this.result[idx + 6 * i].recAns = rec;
                }
                // 后20个每五个抽三个
                for (let i = 0; i < 4; i++) {
                    let idx = this.choice(3);
                    for (let j of idx) {
                        let iin = this.result[j + 6 * i + 24].recAns;
                        this.result[j + 6 * i + 24].recAns = this.change(iin);
                    }
                }
            } else {
                for (let i = 0; i < 4; i++) {
                    let idx = this.choice(1)[0];
                    let iin = this.result[idx + 6 * i + 24].recAns;
                    this.result[idx + 6 * i + 24].recAns = this.change(iin);
                }
                for (let i = 0; i < 4; i++) {
                    let idx = this.choice(3);
                    for (let j of idx) {
                        let iin = this.result[j + 6 * i].recAns;
                        this.result[j + 6 * i].recAns = this.change(iin);
                    }
                }
            }

            this.isInit = true;
            this.$nextTick(this.subTime);
        },
        data() {
            return {
                fg: 0,
                testType: "",
                rest: false,
                finished: false,
                succCount: 0,
                review: false,
                timeId: undefined,
                second: 10,
                isInit: false,
                pointer: 0,
                sequence: "12312312",
                dialogVisable: false,
                before: true,
                items: [1,2,3,4,5,6,7],
                result: []
            }
        },
        computed: {
            videoSrc: function () {
                let pointer = this.pointer;
                let person = this.result[pointer];
                let type = this.testType;
                let url = "https://91happy.oss-cn-shenzhen.aliyuncs.com/"
                url = `${url}${type}/${person.sexual}/${person.recAns}.mp4`;
                return url;
            }
        },
        methods: {
            mask(str) {
                let res = "";
                for (let i = 0; i < 5; i++) {
                    let r = Math.random();
                    if (r < 0.4) {
                        res += this.change(str[i]);
                    } else {
                        res += str[i];
                    }
                }
                return res+"?";
            },
            closeCount() {
                let self = this;
                this.review = false;
                this.succCount = 0;
                if (this.pointer >= 47) {
                    this.finished = true;
                } else if (this.pointer === 24){
                    self.rest = true;
                    clearInterval(this.timeId);
                    setTimeout(function () {
                        self.rest = false;
                        self.subTime(0);
                    }, 30000);
                } else {
                    this.subTime(0);
                }
            },
            subTime(status) {
                this.timeId ? clearInterval(this.timeId) : undefined;
                this.timeId = undefined;
                this.second = 10;
                let self = this;
                this.timeId = setInterval(function () {
                    status ? self.result[self.pointer].spendTimeL += 1 : self.result[self.pointer].spendTime += 1;
                    if (self.second > 0) {
                        self.second -= 1;
                    } else {
                        self.$message({
                            type: 'warning',
                            message: "请立刻做答！！",
                            duration: 1000
                        })
                    }
                }, 1000);
            },
            nextRound() {
                let t = this.result[this.pointer];
                if (!t.after || !t.rate) {
                    this.$message.warning("请先完成做答");
                    return;
                }


                if ((this.pointer + 1) % 6 === 0) {
                    let p = this.pointer;
                    let succCount = 0;
                    for (let i = 0; i < 6; i++) {
                        let info = this.result[p - i];
                        if (info.after === info.answer[5]) {
                            succCount += 1;
                        }
                    }
                    this.succCount = succCount;
                    this.review = true;
                }

                if (this.pointer === 47) {
                    clearInterval(this.timeId);
                    const url = "/api";
                    let data = {};
                    let person = JSON.parse(sessionStorage.getItem('person'));
                    person.testType === "videos" ? person.testType = 'human' : person.testType = 'wave';
                    data['person'] = person;
                    data['result'] = this.result;
                    fetch(url, {
                        method: 'POST',
                        body: JSON.stringify(data),
                        headers: new Headers({
                            'Content-Type': 'application/json'
                        })
                    }).then(res => {
                            console.log(res);
                    }).catch(error => {
                            console.error('Error:', error)
                        });
                    return;
                }

                this.pointer += 1;
                this.before = true;
                if (!this.review) {
                    this.subTime(0);
                }
            },
            giveRec() {
                clearInterval(this.timeId);

                this.dialogVisable = true;
                let video = document.getElementById("recVideo");
                video.play();
            },
            genAnum() {
                let start = this.fg % 3;
                let num = this.sequence.slice(start, start + 6);
                this.fg += 1;
                return num;
            },
            handleClose() {
                this.before = false;
                this.dialogVisable = false;
                this.subTime(1);
            },
            choice(num) {
                let res = [];
                for (let i = 0; i < num; i++) {
                    let n = parseInt(Math.random() * 5);
                    if (n in res) {
                        res.push(n + 1);
                    } else {
                        res.push(parseInt(Math.random() * 5));
                    }
                }
                return res;
            },
            change(num){
                let a = Math.random(), r;
                switch (num) {
                    case '1':
                        a < 0.5 ? r = 2 : r = 3;
                        break
                    case '2':
                        a < 0.5 ? r = 1 : r = 3;
                        break
                    case '3':
                        a < 0.5 ? r = 2 : r = 1;
                        break
                }
                return String(r);
            }
        }
    };
</script>

<style scoped>
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
    .info {
        font-size: 35px;
        color: white;
        text-align: center;
        margin-top: 300px;
    }
    video {
        width: 480px;
        height: 480px;
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