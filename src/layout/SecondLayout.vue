<template>
    <el-row>
        <el-col :span="2">
        </el-col>
        <el-col :span="10">
            <slot name="left"></slot>
        </el-col>
        <el-col :span="10">
            <slot name="right"></slot>
        </el-col>
        <el-col :span="2">
        </el-col>
    </el-row>
</template>

<script>
    export default {
        name: "SecondLayout"
    }
</script>

<style scoped>
    .el-row {
        background-color: #42b983;
        height: 100vh;
    }
    .el-row>.el-col {
        height: 100%;
    }
</style>