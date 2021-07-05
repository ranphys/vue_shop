<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
        <div id="main" style="width: 600px;height:400px;"></div>
    </el-card>
    </div>
</template>

<script>
import echarts from 'echarts'
export default {
    data() {
        return {
            option: {
            title: {
                text: 'ECharts 入门示例'
            },
            tooltip: {},
            legend: {
                data:['销量']
            },
            xAxis: {
                data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
            },
            yAxis: {},
            series: [{
                name: '销量',
                type: 'bar',
                data: [5, 20, 36, 10, 10, 20]
            }]
        }

        }
    },
    async mounted() {
        var myChart = echarts.init(document.getElementById('main'));
        // 使用刚指定的配置项和数据显示图表。
        const{data:res} = await this.$http.get('reports/type/1')
        if(res.meta.status!==200) return this.$message.error('获取折线图失败')
        console.log(res.data);
        const result = Object.assign(res.data,this.option)
        myChart.setOption(result);
    }
}
</script>

<style lang="less" scoped>

</style>