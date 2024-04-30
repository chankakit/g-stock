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
                <img src="/imgs/ic_info.svg"> RPS 选股说明
            </h3>
        </template>
        <template #default>
            <img src="/imgs/candlestick_chart.png" width="126" style="margin: -36px 0 0 -17px;">
            <div class="pop-up-title">全 A 金股雷达</div>
            <p class="pop-up-text">每个交易日收盘后，自动选出<span style="text-decoration: underline;">强度达标且量价齐升的</span>「每日优质股池」，适用于趋势投资。</p>
            <p class="pop-up-text" >RPS ：计算全 A 股的涨幅排名，得出的相对强度值，例：RPS 60 = 87， 代表 60 天内，某个个股的涨幅超过全市 87% 的股票，表现强势。</p>
            <p class="pop-up-text">信号：</p>
            <ul class="pop-up-text" style="padding-left: 16px;">
                <li>🎯 金股：强势、高性价比。</li>
                <li>⭐️ 优选：强势、有一定的性价比。</li>
                <li>谨 慎：领涨的龙头，谨慎追高。</li>
                <li> ➖ ：无特别信号。</li>
            </ul>          
            <p class="pop-up-text">使用：</p>
            <ul class="pop-up-text" style="padding-left: 16px;">
                <li>达标的「强度均值」为 87，黄色高亮显示。</li>
                <li>至少一个大周期 RPS 达标，才有追踪价值。</li>
                <li>请结合大盘趋势和个人的辅助方法做综合决策。</li>
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
