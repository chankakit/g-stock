<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { contactInfo } from '../../assets/share-card-contact.js'

const props = defineProps({
  stock: Object,
  date: String
})

const dynamicLogoUrl = ref('/imgs/share-card/te-style/logo-d-red@2x.png')
if(props.stock.change_pct < 0) {
  dynamicLogoUrl.value = '/imgs/share-card/te-style/logo-d-green@2x.png'
}

let rpsDaysKey = Object.keys(props.stock).filter(keyName => keyName.includes('rps'))
rpsDaysKey.pop()
rpsDaysKey = rpsDaysKey.reverse()

const numColor = computed(() => ({
  'red': props.stock.change_pct > 0,
  'green': props.stock.change_pct < 0,
}))

let rpsBarLength = {}
rpsDaysKey.forEach((i) => {
  rpsBarLength[i] = 0
})

const rpsMeanBarHeight = ref(0)

function calBarLength (value, domTotalLength) {
  let domLength = 0.0
  domLength = value / 100 * domTotalLength
  return domLength
}
onMounted(() => {
  rpsMeanBarHeight.value = calBarLength(props.stock.rps_mean, document.getElementById('rps-mean').getBoundingClientRect().height)
  const rpsItemTotalLength = document.getElementsByClassName('rps-item')[0].getBoundingClientRect().width
  rpsDaysKey.forEach((i) => {
    rpsBarLength[i] = calBarLength(props.stock[i], rpsItemTotalLength)
  })
})
</script>

<template>
  <div class="te-style">
    <div class="top">
      <div class="top-logo" style="margin-bottom: 29px;">
        <img :src="dynamicLogoUrl" width="96"/>
      </div>
      <div class="text-tiny" style="color: #363636;">Relative price strength</div>
    </div>
    
    <div class="stock-data">

      <img class="glass-highlight" src="/imgs/share-card/te-style/glass-highlight@2x.png" width="333" />
      
      <div class="flex" style="justify-content: space-between;align-items: flex-start;">
        <div class="stock-info">
          <h1 class="stock-name">{{ stock.company_abbr }}</h1>
          <h2 class="text-tiny white-60">{{ stock.company_code }}.{{ (stock.bk).substring(0, 2).toUpperCase() }}</h2>
        </div>
        <div class="flex-h-center white-60 text-tiny">{{ date }}</div>
      </div>
      
      <div class="regular-data">
        <div class="flex regular-data-row">
          <div class="data-box">
            <div class="data-key">CLOSE</div>
            <div v-if="stock.close === '停牌'" class="text-med">停牌</div>
            <div class="text-med" v-else>{{ stock.close.toFixed(2) }}</div>
          </div>
          <div class="data-box">
            <div class="data-key">MA[10]</div>
            <div class="text-med">{{ stock.m10.toFixed(2) }}</div>
          </div>
          <div class="data-box">
            <div class="data-key">RVOL</div>
            <div class="text-med" v-if="stock.rvol === '停牌'">停牌</div>
            <div class="text-med" :class="{ 'highlight': stock.rvol >= 2.5 }" v-else>{{stock.rvol.toFixed(2) }}</div>
          </div>
        </div>
        
        <div class="flex regular-data-row">
          <div class="data-box" style="flex:none; width: 108px;">
            <div class="data-key">CHANGE</div>
            <div :class="numColor" v-if="stock.close === '停牌'">
              <div class="text-med">停牌</div>
            </div>
            <div :class="numColor" v-else>
              <div class="text-med">{{ stock.change_pct > 0 ? '+' : '' }}{{ stock.change_abs.toFixed(2) }}</div>
              <div class="text-tiny">{{ stock.change_pct > 0 ? '+' : '' }}{{ stock.change_pct.toFixed(2) }}%</div>
            </div>
          </div>
          <div class="data-box">
            <div class="data-key">CLOSE-MA[10]_DIFF</div>
            <div class="">
              <div class="text-med">{{ (stock.close - stock.m10)>0? '+' : '' }}{{ (stock.m10 * stock.m10_offset_pct / 100).toFixed(2) }}</div>
              <div class="text-tiny">{{ stock.m10_offset_pct > 0 ? '+' : '' }}{{ stock.m10_offset_pct.toFixed(2) }}%</div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="flex rps-data">
        <ul class="rps-list">
          <li class="flex rps-item text-tiny" v-for="(rpsKey, index) in rpsDaysKey">
            <div class="rps-bar" :style="{width: rpsBarLength[rpsKey] + 'px'}"></div>
            <div class="rps-key white-60">{{ rpsKey.toUpperCase().replace('_', ' ') }}</div>
            <div :class="{ highlight: stock[rpsKey] >= 87 }" style="opacity:0.99; z-index: 3;">{{ stock[rpsKey].toFixed(2) }}</div>
          </li>
        </ul>
        <div id="rps-mean">
          <div class="rps-key white-60" style="position: absolute; top: 12px; right: 12px;">RPS Mean</div>
          <div class="rps-mean-bar" :style="{height: rpsMeanBarHeight + 'px'}">
            <div class="text-med">{{ stock['rps_mean'].toFixed(2) }}</div>
          </div>
        </div>
      </div>

    </div>
    <div class="flex-h-center footer">
      <div class="text-tiny">
        {{ contactInfo.type }}
        {{ contactInfo.value }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Armata&display=swap');
* {
  font-family: 'Armata', sans-serif;
}

.highlight {
  color: #F0450F;
}
.white-60 {
  opacity: .6;
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

.h-line {
  height: 1px;
  background-color: #fff;
  opacity: 0.2;
}

.te-style {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 390px;
  height: 600px;
  background-image: url(/imgs/share-card/te-style/share-card-bg@2x.png);
  background-size: 100%;
}
.glass-highlight {
  position: absolute;
  margin: -24px 0 0 -24px;
  z-index: 9;
}
.top {
  padding: 24px 24px 12px 24px;
}
.stock-data {
  padding: 24px;
  .stock-info {
    margin-bottom: 16px;
  }
  .stock-name {
    font-size: 24px;
  }
  .regular-data-row {
    gap: 9px;
    margin-bottom: 9px;
  }
  .data-box {
    box-sizing: border-box;
    padding: 12px;
    flex: 1;
    text-align: right;
    background-color: #1D1D1D;
  }
  .data-key {
    margin-bottom: 8px;
    font-size: 12px;
    opacity: .6;
  }
  .rps-data {
    gap: 9px;
  }
  .rps-list {
    display: flex;
    flex-direction: column;
    padding-right: 8px;
    flex: 1;
  }
  .rps-item {
    position: relative;
    align-items: center;
    justify-content: space-between;
    flex: 1;
    box-sizing: border-box;
    padding: 7px 0;
    flex-grow: 1;
  }
  .rps-item:not(:last-child) {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  .rps-key {
    font-size: 12px;
    color: #fff;
    opacity: .6;
    z-index: 3;
  }
  .rps-bar{
    position: absolute;
    height: 90%;
    background-color: #1D1D1D;
  }
  #rps-mean {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    width: 96px;
    text-align: right;
    background-color: #1D1D1D;
  }
  .rps-mean-bar {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 12px;
    width: 100%;
    background-color: #F0450F;
  }
}
.footer {
  height: 32px;
  padding: 0 24px;
  color: rgb(92, 92, 92);
}
</style>
