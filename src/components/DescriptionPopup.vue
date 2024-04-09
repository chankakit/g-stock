<script setup>
// import { ref, onMounted, onUnmounted, computed } from 'vue'
</script>

<template>
  <el-popover
        placement="bottom-end"
        :width="500"
        trigger="click"
        popper-class="desc-panel"
        popper-style="overflow: visible;
                    padding: 0 24px 20px 24px;
                    background: #363959;
                    border-radius: 8px;
                    box-shadow: 0px 4px 24px rgba(24, 25, 31, 0.5)"
    >
        <template #reference>
            <h3 class="desc-title" style="cursor: pointer;">
                <img src="/imgs/ic_info.svg"> RPS Screen
            </h3>
        </template>
        <template #default>
            <img src="/imgs/candlestick_chart.png" width="126" style="margin: -36px 0 0 -17px;">
            <div class="pop-up-title">全 A 欧奈尔相对强度 (RPS) 选股器</div>
            <p class="pop-up-text">用于选出<span style="text-decoration: underline;">强度达标且量价齐升的强势股票</span>。剔除了 ST 类和未满 1 年的新股，高亮显示强度达标个股，适用于趋势投资。</p>
            <p class="pop-up-text" >大周期为必须达标的 RPS250、RPS120、RPS60，小周期为判断短期是否强势的 RPS20、RPS10，RPS5 可用于筛选短期调整较大的个股。</p>
            <p class="pop-up-text">使用：</p>
            <ul class="pop-up-text" style="padding-left: 16px;">
                <li>坚持 RPS 优先一切的原则，至少一个大周期 RPS 达标才有追踪价值；</li>
                <li>达标阈值 87，基本面亮眼但被错杀的情况，可放宽到 80+；</li>
                <li>结合大盘和个股所在板块情况、调整是否充分、筹码分布等综合决策；</li>
            </ul>
        </template>
    </el-popover>
</template>

<style lang="scss" scoped>
.desc-panel {
  padding: 0 24px 16px 24px;
  .pop-up-title {
    margin: 0 0 8px 0;
    font-size: 20px;
    font-weight: bold;
    color: white;
  }
  .pop-up-text{
    line-height: 150%;
    font-size: 14px;
  }
}
</style>
