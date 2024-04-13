<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

const props = defineProps({
  stock: Object,
  visable: Boolean,
})

const emit = defineEmits(['update:visable'])

const stockChangeNumClass = computed(() => ({
    'mid-num': true,
    'change': true,
    'red': props.stock.change_pct > 0,
    'green': props.stock.change_pct < 0,
}))

let rpsDaysKey = Object.keys(props.stock).filter(keyName => keyName.includes('rps'))
rpsDaysKey.pop()

onMounted(() => {
  document.body['style']['overflow'] = 'hidden'
})
onUnmounted(() => {
  document.body.removeAttribute('style')
})
</script>

<template>
  <div class="overlay">
    <div class="modal" @click="$emit('update:visable', false)"></div>
    <div class="stock-detail">
      <div class="btn-close" @click="$emit('update:visable', false)">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="white" xmlns="http://www.w3.org/2000/svg">
          <circle cx="10" cy="10" r="8"  fill-opacity=".01"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20ZM6.99478 5.22697C6.50662 4.73881 5.71517 4.73881 5.22701 5.22697C4.73886 5.71512 4.73886 6.50658 5.22701 6.99474L8.23221 9.99994L5.22701 13.0051C4.73886 13.4933 4.73886 14.2848 5.22701 14.7729C5.71517 15.2611 6.50662 15.2611 6.99478 14.7729L9.99998 11.7677L13.0052 14.7729C13.4933 15.2611 14.2848 15.2611 14.773 14.7729C15.2611 14.2848 15.2611 13.4933 14.773 13.0051L11.7677 9.99994L14.773 6.99474C15.2611 6.50658 15.2611 5.71512 14.773 5.22697C14.2848 4.73881 13.4933 4.73881 13.0052 5.22697L9.99998 8.23217L6.99478 5.22697Z" />
        </svg>
      </div>
      <div class="stock-info">
        <h2 class="stock-name">{{ stock.company_abbr }}</h2>
        <h4 class="stock-code">{{ stock.company_code }}.{{ (stock.bk).substring(0,2).toUpperCase() }}</h4>
      </div>
      <div class="stock-latest-price" v-if="stock.close === '停牌'">
        <div class="big-num close">{{ stock.close }}</div>
      </div>
      <div class="stock-latest-price" v-else>
        <div class="flex" style="margin-bottom: 8px; align-items: baseline;">
          <div class="big-num close">{{ stock.close.toFixed(2) }}</div>
          <div :class="stockChangeNumClass">
            <span>{{ stock.change_pct>0 ? '+' : '' }}{{ stock.change_pct.toFixed(2) }}%</span>
            <span style="margin-left: 8px;">{{ stock.change_pct>0 ? '+' : '' }}{{ stock.change_abs.toFixed(2) }}</span>
          </div>
        </div>
        <div class="flex">
          <div class="mid-num rvol">MA10 偏离 {{ stock.m10_offset_pct>0 ? '+' : '' }}{{ stock.m10_offset_pct.toFixed(2) }}%</div>
          <div class="mid-num rvol" :class="{'highlight': stock.rvol>=2.5}" style="margin-left: 20px;">量比 {{ stock.rvol.toFixed(2) }}</div>
        </div>
      </div>
      <ul class="rps-list flex-h-center">
        <li class="rps-card"
            v-for="(rpsKey, index) in rpsDaysKey.reverse()"
            >
          <div class="rps-key">{{ rpsKey.toUpperCase().replace('_', ' ') }}</div>
          <div class="rps-value" :class="{highlight: stock[rpsKey]>=87}">{{ stock[rpsKey].toFixed(2) }}</div>
        </li>
        <li class="rps-card">
          <div class="rps-key">RPS Mean</div>
          <div class="rps-value" :class="{highlight: stock['rps_mean']>=87}">{{ stock['rps_mean'].toFixed(2) }}</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.overlay {
  position: fixed;
  left: 0;
  right: 0;
  top: -30px;
  bottom: 0;
  background-color: rgba(#0E0E15, 0.5);
  z-index: 99;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.modal {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}

.stock-detail {
  position: relative;
  padding: 24px;
  width: 60%;
  border-radius: 10px;
  background: rgba(40, 42, 63, 0.7);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: 0px 18px 46px rgba(9, 9, 23, 0.28);
  z-index: 100;
  .btn-close {
    position: absolute;
    box-sizing: border-box;
    width: 28px;
    height: 28px;
    padding: 4px;
    top: 18px;
    right: 18px;
    cursor: pointer;
    opacity: .6;
    transition: opacity .3s ease-in-out;
  }
  .btn-close:hover {
    opacity: 7;
  }
  .stock-name {
    margin-bottom: 8px;
    font-size: 32px;
  }
  .stock-code {
    font-size: 16px;
    font-weight: 500;
    opacity: .6;
  }
  .stock-latest-price {
    margin-top: 16px;
  }
  .change {
    margin: 0 16px;
  }
  .big-num {
    font-size: 28px;
    font-weight: 550;
  }
  .mid-num {
    font-size: 20px;
  }
  .rps-list {
    gap: 8px;
    list-style: none;
    margin-top: 24px;
    flex-wrap: wrap;
  }
  .rps-card {
    box-sizing: border-box;
    flex: 1;
    padding: 12px 16px 20px 16px;
    border-radius: 6px;
    font-weight: 700;
    background-color: #282A3F;
    box-shadow: 0px 4px 20px rgb(20 26 42 / 10%);
  }
  .rps-key {
    margin-bottom: 6px;
    font-size: 14px;
  }
  .rps-value {
    font-size: 28px;
  }
  @media only screen and (max-width: 600px) {
    width: 72%;
    .mid-num {
      font-size: 16px;
    }
  }
}
</style>
