<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { contactInfo } from '../../assets/share-card-contact.js'

const props = defineProps({
  stock: Object,
  date: String
})

let rpsDaysKey = Object.keys(props.stock).filter(keyName => keyName.includes('rps'))
rpsDaysKey.pop()

const numColor = computed(() => ({
  'red': props.stock.change_pct > 0,
  'green': props.stock.change_pct < 0,
}))

const dynamicLogoUrl = ref('/imgs/share-card/receipts/logo-d-red@2x.png')
if(props.stock.change_pct < 0) {
  dynamicLogoUrl.value = '/imgs/share-card/receipts/logo-d-green@2x.png'
}

onMounted(() => {

})
</script>

<template>
  <div class="receipts-style">
    <div class="the-title" style="position: absolute;">
      <img src="/imgs/share-card/receipts/receipts-title-d.svg" />
    </div>
    <div class="flex white-50 text-tiny" style="justify-content: flex-end;">{{ date }}</div>
    <div class="stock-data">
      <div class="stock-info">
        <h1 class="text-large stock-name">{{ stock.company_abbr }}</h1>
        <h2 class="text-small white-60 t-med stock-code">{{ stock.company_code }}.{{ (stock.bk).substring(0, 2).toUpperCase() }}</h2>
      </div>
      <div class="stock-latest-price" v-if="stock.close === '停牌'">
        <div class="text-big t-bold">{{ stock.close }}</div>
      </div>
      <div class="flex stock-latest-price" v-else>
        <div class="stock-data-box">
          <div class="data-key">收盘</div>
          <div :class="numColor" class="text-big t-bold">{{ stock.close.toFixed(2) }}</div>
        </div>
        <div class="v-line"></div>
        <div class="stock-data-box">
          <div class="data-key">涨跌额</div>
          <div :class="numColor" class="text-big t-bold">{{ stock.change_pct > 0 ? '+' : '' }} {{ stock.change_abs.toFixed(2) }}</div>
        </div>
        <div class="v-line"></div>
        <div class="stock-data-box">
          <div class="data-key">涨跌幅</div>
          <div :class="numColor" class="text-big t-bold">{{ stock.change_pct > 0 ? '+' : '' }} {{ stock.change_pct.toFixed(2) }}%</div>
        </div>
      </div>
      <div class="flex" style="padding-bottom: 16px; border-bottom: 1px solid rgba(64, 71, 74, 0.6);">
        <div class="flex-v-center text-tiny t-med data-list" style="padding-right: 12px;">
          <div class="stock-data-box">
            <div class="data-key">量比</div>
            <div class="text-med">{{ stock.rvol.toFixed(2) }}</div>
          </div>
          <div class="h-line"></div>
          <div class="stock-data-box">
            <div class="data-key">MA10</div>
            <div class="text-med">{{ stock.m10.toFixed(2) }}</div>
          </div>
          <div class="h-line"></div>
          <div class="stock-data-box">
            <div class="data-key">MA10 偏离</div>
            <div class="text-med">
              {{ stock.m10_offset_pct > 0 ? '+' : '' }}
              {{ stock.m10_offset_pct.toFixed(2) }}%
              <div style="font-size: 14px;">( {{ (stock.close - stock.m10) > 0 ? '+' : '' }} {{ (stock.close - stock.m10).toFixed(2) }} )</div>
            </div>
          </div>
        </div>
        <div class="v-line"></div>
        <ul class="rps-list" style="padding-left: 12px;">
          <li class="rps-card" v-for="(rpsKey, index) in rpsDaysKey.reverse()">
            <div class="text-tiny t-med rps-key white-60">{{ rpsKey.toUpperCase().replace('_', ' ') }}</div>
            <div class="text-med t-bold" :class="{ highlight: stock[rpsKey] >= 87 }">{{ stock[rpsKey].toFixed(2) }}
            </div>
          </li>
          <div class="h-line"></div>
          <li class="rps-card">
            <div class="text-tiny t-med rps-key white-60" style="opacity: .9;">RPS Mean</div>
            <div class="text-med t-bold" :class="{ highlight: stock['rps_mean'] >= 87 }">{{ stock['rps_mean'].toFixed(2) }}</div>
          </li>
        </ul>
      </div>

    </div>
    <div class="flex-h-center footer">
      <img :src="dynamicLogoUrl" width="96">
      <div class="text-tiny white-50" style="font-family: 'Ubuntu', sans-serif;">
        {{ contactInfo.type }}
        {{ contactInfo.value }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;700&display=swap');
$mainColor: #40474A;
* {
  font-family: 'DM Serif Display', 'Noto Serif SC', 'Songti SC', serif;
  color: $mainColor;
}

.baseline-align {
  align-items: baseline;
}

.flex-v-center {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.red {
  color: #C34B4B;
}

.green {
  color: #429B65;
}
.text-large {
  font-size: 28px;
}

.text-big {
  font-size: 24px;
}

.text-med {
  font-size: 20px;
}

.text-small {
  font-size: 14px;
}

.text-tiny {
  font-size: 12px;
}

.t-bold {
  font-weight: 700;
}

.t-med {
  font-weight: 500;
}

.white-60 {
  color: $mainColor;
  opacity: .6;
}

.white-50 {
  color: $mainColor;
  opacity: .5;
}

.v-line {
  width: 1px;
  background-color: #40474A;
  opacity: 0.6;
}

.h-line {
  height: 1px;
  background-color: #40474A;
  opacity: 0.6;
}

.receipts-style {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 390px;
  height: 600px;
  padding: 24px 24px 18px 24px;
  background-color: #E8E3D1;
}

.data-list {
  flex: 1;
}

.stock-data {
  flex: 1;
  margin-top: 99px;

  .stock-name {
    color: $mainColor;
    font-weight: 900;
  }
  
  .stock-latest-price {
    margin: 10px 0;
    padding: 10px 0;
    border-top: 1px solid rgba(64, 71, 74, 0.6);
    border-bottom: 1px solid rgba(64, 71, 74, 0.6);
  }

  .stock-data-box {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  .data-key {
    font-size: 13px;
    font-weight: 400;
    margin-bottom: 4px;
    opacity: .7;
  }

  .rps-list {
    display: flex;
    flex: 1;
    flex-direction: column;
  }

  .rps-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 5px 0;
  }
}
.footer {
  align-items: flex-end;
}
</style>
