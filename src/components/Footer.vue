<script setup>
import { credits } from '../assets/credits.js'

</script>

<template>
    <footer>
        <div class="footer-pattern"></div>
        <div class="flex-h-center content-margin" style="flex: 1">
            <div class="flex-h-center" style="margin-top: -4px;">
                <img src="/imgs/logo.svg" alt="logo">
                <p class="text-s" style="opacity: .4;">声明：本工具数据仅供参考，不作为任何投资建议。投资有风险，抄顶需谨慎。</p>
            </div>
            <div class="credits">
                <a class="credit" v-for="c in credits" @click="creditClickHandler(c)">
                    <div class="credit-icon">
                        <img :src="'/imgs/soical-media-icon/' + c.icon + '.svg'" style="width: 16px">
                    </div>
                    <div class="credit-info">
                        <div class="credit-name">{{ c.name }}</div>
                        <div class="credit-desc">{{ c.desc }}</div>
                        <Transition name="slide-up" mode="out-in">
                            <div class="credit-tip" v-if="c.showClickStatus">微信号已复制</div>
                        </Transition>
                    </div>
                </a>
            </div>
        </div>
    </footer>
</template>

<style lang="scss" scoped>
footer {
  margin-top: 48px;
  width: 100%;
  display: flex;
  flex-direction: column;
  height: 96px;
  background: linear-gradient(180deg, #1B1C24 0%, #1F2029 100%);
  .text-s {
    margin: 19px 0 5px 16px;
  }
  .credits {
    display: flex;
    gap: 24px;   
    .credit {
      display: flex;
      gap: 8px;
      align-items: center;
      color: white;
      opacity: .7;
      cursor: pointer;
    }
    .credit:hover {
      opacity: 1;
    }
    .credit-icon {
      height: 16px;
    }
    .credit-name {
      line-height: 14px;
      font-size: 14px;
      font-weight: 550;
    }
    .credit-desc {
      margin: 4px 0 0 -1px;
      line-height: 12px;
      font-size: 12px;
      color: rgba(255, 255, 255, 0.7);
    }
    .credit-tip {
      position: absolute;
      margin: -60px 0 0 -34px;
      padding: 6px 8px;
      line-height: 12px;
      font-size: 12px;
      border-radius: 4px;
      background-color: #313453;
    }
  }
}
.footer-pattern {
  width: 100%;
  height: 8px;
  background: repeating-linear-gradient(
    -45deg,
    transparent 5px,
    transparent ,
    rgba(white, .08) 10px,
    rgba(white, .08) 15px
  );
}
</style>
