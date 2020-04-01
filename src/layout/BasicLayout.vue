<template>
    <el-row>
        <el-col :span="2">
        </el-col>
        <el-col :span="20">
            <slot name="center"></slot>
        </el-col>
        <el-col :span="2">
        </el-col>
    </el-row>
</template>

<script>
    export default {
        name: "basic"
    }
</script>

<style scoped>
    .el-row {
        background-image: url("../assets/imgs/cover_bg.svg");
        height: 100vh;
        background-position: center center;
        background-size: cover;
        background-repeat: no-repeat;
    }
    .el-row>.el-col {
        height: 100%;
    }
</style>