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
                            <el-radio-group v-model="result[pointer].after" @change="clrTimer">
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

                <el-dialog  title="智能助理"
                            :visible.sync="fb_ass_vis"
                            :before-close="fb_ass_close"
                            center>
                    <video slot="footer" class="el-dialog--center" :src="fbSrc" typeof="video/mp4" controls="controls" id="fbVideo" width="480" height="480" ></video>
                </el-dialog>

                <el-dialog title="统计"
                           :visible.sync="review"
                           :before-close="closeCount"
                           center>
                    上一轮答题情况：
                    共计6题; 答对{{ succCount }}题
                </el-dialog>

                <el-dialog title="答题反馈"
                           :visible="fb_vis"
                           :show-close="false"
                           center>
                    <el-form v-model="fb_form" label-positio="right" label-width="220px" id="fb_form">
                        <el-form-item label="我应对答题结果负责">
                            <el-rate :max="7" v-model="fb_form.responseI"></el-rate>
                        </el-form-item>
                        <el-form-item label="系统助理应对答题结果负责">
                            <el-rate :max="7" v-model="fb_form.responseU"></el-rate>
                        </el-form-item>
                        <el-form-item label="你认为谁对答题结果负主要责任">
                            <el-radio-group v-model="fb_form.responseOf">
                                <el-radio :label="0">我</el-radio>
                                <el-radio :label="1">系统助理</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="add_fb_result">确认提交</el-button>
                        </el-form-item>
                    </el-form>
                </el-dialog>
            </div>
            <div v-show="finished" class="info">
                所有测试已完成，感谢你的参与
            </div>
            <div v-show="rest" class="info">
                实验完成一半，请先休息{{ t }}秒。
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
            this.testType = JSON.parse(sessionStorage.getItem("person")).testType;
            // 初始化全局
            this.result = Array.from({length: 48}, () => {
                let answer = this.genAnum();
                // todo display 这逻辑是啥来着?以什么为准
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

            if (this.testType === "wave" || this.testType === "videos") {
                let r = Boolean(Math.random() < 0.5);
                let _tem_rate_map = {
                    true: "high",
                    false: "low"
                };

                for (let i = 0; i < 2; i++) {
                    for (let j = 0; j < 24; j++) {
                        if (i === 0) {
                            this.result[i * 24 + j].reliability = _tem_rate_map[r];
                        } else {
                            this.result[i * 24 + j].reliability = _tem_rate_map[!r];
                        }
                    }
                }

                let _tem_sex_map = {
                    true: "male",
                    false: "female"
                };
                for (let i = 0; i < 2; i++) {
                    let r = Boolean(Math.random() < 0.5);
                    for (let j = 0; j < 24; j++) {
                        if (j < 12) {
                            this.result[i * 24 + j].sexual = _tem_sex_map[r];
                        } else {
                            this.result[i * 24 + j].sexual = _tem_sex_map[!r];
                        }
                    }
                }

                // todo can improve
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
            } else if (this.testType === "page3" || this.testType === "page4") {
                // 初始化 可靠性
                for (let i = 0; i < 2; i++) {
                    for (let j = 0; j < 24; j++) {
                        if (i === 0) {
                            this.result[i * 24 + j].reliability = "100";
                        } else {
                            this.result[i * 24 + j].reliability = "2/3";
                        }
                    }
                }

                // 初始化性别
                let _tem_sex_map = {
                    true: "male",
                    false: "female"
                };
                for (let i = 0; i < 2; i++) {
                    let r = Boolean(Math.random() < 0.5);
                    for (let j = 0; j < 24; j++) {
                        if (j < 12) {
                            this.result[i * 24 + j].sexual = _tem_sex_map[r];
                        } else {
                            this.result[i * 24 + j].sexual = _tem_sex_map[!r];
                        }
                    }
                }

                // 初始化推荐答案
                let _wrongArr = this.choice(8, 24).map(x => x + 24);
                for (let i of _wrongArr) {
                    this.result[i].recAns = this.change(this.result[i].recAns);
                }
            }

            // todo 单元测试
            console.log(this.result);
            window.__vm__ = this;

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
                second: 20,
                isInit: false,
                pointer: 0,
                sequence: "1231212312",
                dialogVisable: false,
                before: true,
                items: [1,2,3,4,5,6,7],
                result: [],
                t: 30,
                ttid: undefined,
                // 管理是否需要弹出fb的状态
                feedback: false,
                fb_status: "ok",
                fbSrc: "",

                fb_vis: false,
                fb_ass_vis: false,
                fb_result: [],
                fb_form: {
                    responseI: 0,
                    responseU: 0,
                    responseOf: null,
                }
            }
        },
        computed: {
            videoSrc: function () {
                let pointer = this.pointer;
                let person = this.result[pointer];
                let type = this.testType;

                let url = "https://91happy.oss-cn-shenzhen.aliyuncs.com/"
                url = `${url}${type === "page3" || type === "page4" ? "videos" : type}/${person.sexual}/${person.recAns}.mp4`;
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
            fb_ass_close() {
                this.fb_ass_vis = false;
                this.fb_vis = true;
            },
            add_fb_result() {
                let dpcp = JSON.parse(JSON.stringify(this.fb_form))
                this.fb_result.push({response: dpcp, video: this.fbSrc ? this.fbSrc :""});
                this.fb_vis = false;
                this.fb_form.responseI = 0;
                this.fb_form.responseU = 0;
                this.fb_form.responseOf = null;
                if (this.pointer >= 47) {
                    this.finished = true;
                    let url = "/api";
                    let data = {};
                    let person = JSON.parse(sessionStorage.getItem('person'));
                    person.testType === "videos" ? person.testType = 'human' : undefined;
                    data['person'] = person;
                    data['result'] = this.result;
                    data['result2'] = this.fb_result;
                    fetch(url, {
                        method: 'POST',
                        body: JSON.stringify(data),
                        headers: new Headers({
                            'Content-Type': 'application/json'
                        })
                    }).then((res) => {
                        console.log(res);
                    }).catch(err => {
                        console.log(err)
                    });
                }
            },
            closeCount() {
                this.review = false;
                let self = this;
                if (this.testType === "page3" || this.fb_status === "not") {
                    this.fb_ass_vis = true;
                    let video = document.getElementById("fbVideo");
                    let playPromise  =  video.play();
                    if (playPromise !== undefined) {
                        playPromise.then(function() {
                            // Automatic playback started!
                        }).catch(function() {
                            // Automatic playback failed.
                            // Show a UI element to let the user manually start playback.
                            self.$message("不支持自动播放，请手动播放");
                        });
                    }
                    return;
                } else if (this.testType === "page4") {
                    this.fb_vis = true;
                    return;
                }

                this.succCount = 0;
                // todo 关闭提示后上传信息
                if (this.pointer >= 47) {
                    this.finished = true;
                    if (this.testType === 'videos' || this.testType === 'wave') {
                        const url = "/api";
                        let data = {};
                        let person = JSON.parse(sessionStorage.getItem('person'));
                        person.testType === "videos" ? person.testType = 'human' : undefined;
                        data['person'] = person;
                        data['result'] = this.result;
                        data['result2'] = [];

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
                    }
                } else if (this.pointer === 24 && this.testType !== "page3" && this.testType !== "page4") {
                    clearInterval(this.timeId);
                    self.rest = true;
                    self.ttid = setInterval(function () {
                        self.t -= 1;
                        if (self.t <= 0) {
                            clearInterval(self.ttid);
                        }
                    }, 1000);
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
                this.second = 20;
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
                    // 在这里加载视频
                    if (this.testType === "page3" || this.fb_status === "not") {
                        let t = this.succCount <= 3 ? "123" : "456";
                        let s = this.result[this.pointer - 1].sexual[0];
                        this.fbSrc = `https://91happy.oss-cn-shenzhen.aliyuncs.com/videos/${s}-${t}.mp4`;
                    }
                    this.review = true;
                }

                if (this.pointer === 47) {
                    clearInterval(this.timeId);
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
                let start = this.fg % 5;
                let num = this.sequence.slice(start, start + 6);
                this.fg += 1;
                return num;
            },
            handleClose() {
                this.before = false;
                this.dialogVisable = false;
                this.subTime(1);
            },
            // choice(num) {
            //     let res = [];
            //     for (let i = 0; i < num; i++) {
            //         let n = parseInt(Math.random() * 5);
            //         if (n in res) {
            //             res.push(n + 1);
            //         } else {
            //             res.push(parseInt(Math.random() * 5));
            //         }
            //     }
            //     return res;
            // },
            choice(count, all = 6) {
                let arr = [...Array(all).keys()];
                let res = [];
                while (res.length < count) {
                    let n = parseInt(Math.random() * (arr.length - 1));
                    res.push(arr[n]);
                    arr.splice(n, 1);
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
            },
            clrTimer(){
                clearInterval(this.timeId);
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

<style>
    #fb_form label.el-form-item__label, #fb_form label.el-radio>*{
        color: black;
    }
</style>