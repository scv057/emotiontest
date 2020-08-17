<template>
  <BasicLayout style="background: white">
    <template v-slot:center>
      <el-dialog  title="智能助理"
                  :visible.sync="dialogVisable"
                  :before-close="handleClose"
                  center>
        <video slot="footer" class="el-dialog--center" :src="videoSrc" typeof="video/mp4" controls="controls" id="recVideo" width="480" height="480" ></video>
      </el-dialog>

      <el-dialog :visible.sync="amiright"
                 @close="onedone"
                 center>
        <div style="height: 300px">
          <h1 style="text-align: center;    margin: 70px;">
            经过后期检查
          </h1>
          <h1 style="text-align: center;    margin: 70px;">
            本次健康助理预测{{ rorw }}
          </h1>
        </div>
      </el-dialog>

      <div v-show="!finished">
        <div class="header">
          <div class="left">第{{ pointer +1 }}次预测</div>
          <div class="right">
            倒计时
            <div class="time">
              {{ second }}
            </div>秒
          </div>
        </div>
        <hr>
        <div class="wrap">
          <el-table :data="status"
                    border
                    style="width: 100%">
          <el-table-column
          prop="bloodPressure">
            <template slot="header" slot-scope="scope" @click="console.log(scope)">
              <div>
                <div>静息血压</div>
                <small>一般范围90~140</small>
              </div>
            </template>
          </el-table-column>
          <el-table-column
              prop="bloodGlucose">
            <template slot="header" slot-scope="scope" @click="console.log(scope)">
              <div>
                <div>空腹血糖</div>
                <small>一般范围 &lt;=120mg </small>
              </div>
            </template>
          </el-table-column>
            <el-table-column
                prop="heartRate"
                label="最高心率">
            </el-table-column>
            <el-table-column
                prop="st"
                label="运动相对休息的ST抑制">
            </el-table-column>
          </el-table>
          <div style="margin-top: 50px"
              v-show="!showP">
            <el-button type="primary"
                       @click="showPrediction"
            >查看智能助理的预测</el-button>
          </div>
          <div style="margin-top: 50px"
          v-show="showP">
            <div class="prompt">
              你认为该种情况下，是否应该去医院检查
            </div>
            <div id="gohos">
              <el-radio
                  v-model="item[pointer].answer"
                  label="A.去做检查">A.去做检查</el-radio>
              <el-radio
                  v-model="item[pointer].answer"
                  label="B.不去做检查">B.不去做检查</el-radio>

            </div>
            <div class="prompt">
              你多大程度上信任助理的推荐
            </div>
            <div style="margin-bottom: 30px">
              <el-radio-group v-model="item[pointer].trust">
                <template v-for="(item, index) in rateRange">
                  <el-radio-button :label="index +1" :key="index"></el-radio-button>
                </template>
              </el-radio-group>
            </div>
            <el-button type="primary"
                       @click="nextRound"
            >下一题</el-button>
          </div>
        </div>
      </div>
      <div v-show="finished" class="info">
        所有测试已完成，感谢你的参与
      </div>
    </template>
  </BasicLayout>
</template>

<script>
import BasicLayout from "@/layout/BasicLayout";

export default {
  name: "Heath",
  components: {BasicLayout},
  computed: {
    status() {
      return [this.item[this.pointer]];
    },
    videoSrc() {
      // todo 补充视频链接
      let t = 'd';
      let p = this.item[this.pointer].prediction;
      return `https://91happy.oss-cn-shenzhen.aliyuncs.com/videos/heath/${t}${p}.mp4`
    },
    rorw() {
      const m = {
        'low': false,
        'high': true
      }
      let i = this.item[this.pointer];
      return m[i.prediction] === i.sick ? '正确' : '错误';
    }
  },
  data() {
    return {
      amiright: false,
      timeID: undefined,
      rateRange: [1, 2, 3, 4, 5, 6, 7],
      item: [
        {
          bloodPressure: 130,
          bloodGlucose: 120,
          heartRate: 142,
          st: 0.6,
          prediction: 'low',
          sick: false,
          answer: null,
          trust: 0
        },
        {
          bloodPressure: 110,
          bloodGlucose: 101,
          heartRate: 168,
          st: 1,
          prediction: 'low',
          sick: false,
          answer: null,
          trust: 0
        },
        {
          bloodPressure: 130,
          bloodGlucose: 105,
          heartRate: 187,
          st: 3.5,
          prediction: 'high',
          sick: true,
          answer: null,
          trust: 0
        },
        {
          bloodPressure: 120,
          bloodGlucose: 110,
          heartRate: 160,
          st: 1.8,
          prediction: 'low',
          sick: false,
          answer: null,
          trust: 0
        },
        {
          bloodPressure: 132,
          bloodGlucose: 106,
          heartRate: 173,
          st: 3.2,
          prediction: 'high',
          sick: false,
          answer: null,
          trust: 0
        },
        {
          bloodPressure: 110,
          bloodGlucose: 100,
          heartRate: 144,
          st: 1.8,
          prediction: 'high',
          sick: true,
          answer: null,
          trust: 0
        },
        {
          bloodPressure: 140,
          bloodGlucose: 107,
          heartRate: 158,
          st: 0,
          prediction: 'low',
          sick: false,
          answer: null,
          trust: 0
        },
        {
          bloodPressure: 120,
          bloodGlucose: 103,
          heartRate: 139,
          st: 2,
          prediction: 'low',
          sick: false,
          answer: null,
          trust: 0
        },
        {
          bloodPressure: 120,
          bloodGlucose: 115,
          heartRate: 178,
          st: 0.8,
          prediction: 'low',
          sick: true,
          answer: null,
          trust: 0
        },
        {
          bloodPressure: 150,
          bloodGlucose: 107,
          heartRate: 174,
          st: 1.6,
          prediction: 'high',
          sick: true,
          answer: null,
          trust: 0
        },
        {
          bloodPressure: 138,
          bloodGlucose: 122,
          heartRate: 174,
          st: 1.4,
          prediction: 'low',
          sick: false,
          answer: null,
          trust: 0
        },
        {
          bloodPressure: 120,
          bloodGlucose: 105,
          heartRate: 103,
          st: 1.4,
          prediction: 'low',
          sick: false,
          answer: null,
          trust: 0
        }
      ],
      finished: false,
      pointer: 0,
      second: 20,
      showP: false,
      dialogVisable: false,
    }
  },
  methods: {
    nextRound() {
      // todo check
      let i = this.item[this.pointer];
      if (i.answer && i.trust) {
        this.amiright = true;
        i.endTime = new Date().getTime();
        console.log(i);
      } else {
        this.$message.warning('请做出选择');
      }
    },
    subTime() {

    },
    showPrediction() {
      // todo 展示预测
      this.dialogVisable = true;
      // let video = document.getElementById("recVideo");
      // video.play();
    },
    handleClose() {
      this.dialogVisable = false;
      this.showP = true;
      // todo 开始计时
      let i = this.item[this.pointer];
      i.startTime = new Date().getTime();
      this.subTime();
    },
    onedone() {
      if (this.pointer === 11) {
        this.finished = true;
        // todo 上传保存
        const url = "/api111";
        let data = {};
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
      } else {
        this.pointer += 1;
      }
      this.amiright = false;
      this.showP = false;
    }
  },
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
.wrap {
  padding-top: 60px;
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
#gohos span{
  color: black;
}
</style>