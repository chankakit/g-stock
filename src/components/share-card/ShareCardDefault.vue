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

const dynamicLogoUrl = ref('/imgs/share-card/default/logo-red@2x.png')
if(props.stock.change_pct < 0) {
  dynamicLogoUrl.value = '/imgs/share-card/default/logo-green@2x.png'
}

onMounted(() => {

})
</script>

<template>
  <div class="default-style">
    <div class="flex-h-center white-50">
      <span class="text-tiny">个股 RPS 强度</span>
      <span class="text-tiny">{{ date }}</span>
    </div>
    <div class="stock-data">
      <div class="stock-info">
        <h1 class="text-large stock-name">{{ stock.company_abbr }}</h1>
        <h2 class="text-small white-60 t-med">{{ stock.company_code }}.{{ (stock.bk).substring(0, 2).toUpperCase() }}</h2>
      </div>

      <div class="stock-latest-price" v-if="stock.close === '停牌'">
        <div class="text-big close">{{ stock.close }}</div>
      </div>
      <div class="stock-latest-price" v-else>
        <div class="flex baseline-align" style="margin-bottom: 8px;">
          <div :class="numColor" class="text-big t-bold">{{ stock.close.toFixed(2) }}</div>
          <div :class="numColor" class="text-regular t-med" style="margin-left: 16px;">
            <span>{{ stock.change_pct > 0 ? '+' : '' }}{{ stock.change_abs.toFixed(2) }}</span>
            <span style="margin-left: 8px;">{{ stock.change_pct > 0 ? '+' : '' }}{{ stock.change_pct.toFixed(2) }}%</span>
          </div>
        </div>
        <div class="flex text-tiny t-med">
          <div :class="{ 'highlight': stock.rvol >= 2.5 }"><span class="data-key">量比</span>{{stock.rvol.toFixed(2) }}</div>
          <div class="v-line"></div>
          <div><span class="data-key">MA10</span>{{ stock.m10.toFixed(2) }}</div>
          <div class="v-line"></div>
          <div>
            <span class="data-key">MA10 偏离</span>
            {{ stock.m10_offset_pct > 0 ? '+' : '' }}
            {{ stock.m10_offset_pct.toFixed(2) }}% 
            ({{ (stock.close - stock.m10)>0? '+' : '' }} {{ (stock.close - stock.m10).toFixed(2) }})</div>
        </div>
      </div>

      <ul class="rps-list flex-h-center">
        <li class="rps-card" v-for="(rpsKey, index) in rpsDaysKey.reverse()">
          <div class="text-tiny t-med rps-key white-60">{{ rpsKey.toUpperCase().replace('_', ' ') }}</div>
          <div class="text-med t-bold" :class="{ highlight: stock[rpsKey] >= 87 }">{{ stock[rpsKey].toFixed(2) }}</div>
        </li>
        <li class="rps-card">
          <div class="text-tiny t-med rps-key white-60">RPS Mean</div>
          <div class="text-med t-bold" :class="{ highlight: stock['rps_mean'] >= 87 }">{{ stock['rps_mean'].toFixed(2)
            }}</div>
        </li>
      </ul>
    </div>
    <div class="flex-h-center footer">
      <img :src="dynamicLogoUrl" width="96">
      <div class="text-tiny white-50">
        {{ contactInfo.type }}
        {{ contactInfo.value }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.baseline-align {
  align-items: baseline;
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
.text-regular {
  font-size: 16px;
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
  color: #fff;
  opacity: .6;
}

.white-50 {
  color: #fff;
  opacity: .5;
}

.v-line {
  margin: 0 8px;
  width: 1px;
  background-color: #fff;
  opacity: 0.3;
}

.default-style {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 390px;
  height: 600px;
  padding: 24px 24px 18px 24px;
  background-color: #19191c;
  background-image: url(/imgs/bg_pattern.svg);
  background-size: 24.4px;
  background-position-y: -5px;
}
.stock-data {
  flex: 1;
  margin-top: 58px;
  .stock-name {
    // background: -webkit-linear-gradient(rgb(255,255,255), rgba(255,255,255,.7));
    // -webkit-background-clip: text;
    // background-clip: text;
    // -webkit-text-fill-color: transparent;
    margin-bottom: 4px;
  }
  .stock-latest-price {
    margin: 20px 0;
    padding: 12px 0 16px 0;
    border-top: 1px solid rgba(255,255,255,0.1);
    border-bottom: 1px solid rgba(255,255,255,0.1);
  }
  .data-key {
    margin-right: 6px;
    opacity: .7;
  }
  .rps-list {
    flex-wrap: wrap;
    gap: 6px;
  }
  .rps-card {
    box-sizing: border-box;
    width: 110px;
    flex-grow: 1;
    padding: 12px;
    border-radius: 8px;
    background-color: #27272E;
    .rps-key {
      margin-bottom: 4px;
    }
  }
}
.footer {
  align-items: flex-end;
}
</style>
