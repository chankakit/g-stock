<script setup>
import html2canvas from 'html2canvas'
import { ref, onMounted, onUnmounted, computed } from 'vue'
import ShareCardDefault from './ShareCardDefault.vue'
import ShareCardReceiptsD from './ShareCardReceiptsD.vue'
import ShareCardReceiptsL from './ShareCardReceiptsL.vue'
import ShareCardTE from './ShareCardTE.vue'

function getCurrentStyleIndexFromCookie() {
  const cookie = document.cookie
  const cookieArray = cookie.split(';')
  const cookieObj = {}
  cookieArray.forEach(c => {
    const [key, value] = c.trim().split('=')
    cookieObj[key] = value
  })
  return cookieObj
}

const currentStyleIndex = ref(0)
if(getCurrentStyleIndexFromCookie().currentStyleIndex) {
  currentStyleIndex.value = Number(getCurrentStyleIndexFromCookie().currentStyleIndex)
} else {
  document.cookie =`currentStyleIndex=0`;
}

const props = defineProps({
  stock: Object,
  visable: Boolean,
  date: String,
})

const shareImgStyles = {
  ShareCardDefault,
  ShareCardReceiptsD,
  ShareCardReceiptsL,
  ShareCardTE
}
const shareImgStylesList = [
  'ShareCardDefault',
  'ShareCardReceiptsD',
  'ShareCardReceiptsL',
  'ShareCardTE'
]

const currentStyle = ref(shareImgStylesList[currentStyleIndex.value])

// 传入数字 1 代表下一个，传入数字 -1 代表上一个
function changeStyle(act) {
  currentStyleIndex.value = currentStyleIndex.value + act
  currentStyle.value = shareImgStylesList[currentStyleIndex.value]
  document.cookie =`currentStyleIndex=${currentStyleIndex.value}`;
}

const scaleRatio = ref(1.0)

async function saveImage(filename) {
  document.getElementById('preview-frame').style.borderRadius = 0
  const canvas = await html2canvas(document.getElementById('preview-frame'))
  canvas.getContext("2d", {willReadFrequently: true})
  document.getElementById('preview-frame').style.borderRadius = '8px'
  const imgUrl = canvas.toDataURL('image/png')
  const link = document.createElement('a')
  link.download = filename
  link.href = imgUrl
  link.click()
}

onMounted(() => {
  scaleRatio.value = document.getElementById('preview-frame').getBoundingClientRect().width / 390.0
})
</script>

<template>
  <div class="share-popup">
    <div class="image-preview" id="preview-frame">
      <KeepAlive>
        <component 
          :is="shareImgStyles[currentStyle]"
          :stock="stock"
          :date="date"
          class="share-image"
          :style="{ transform: 'scale(' + scaleRatio +')' }">
        </component>
      </KeepAlive>
    </div>
    <div class="flex-h-center actions">
      <div class="flex-h-center btn-change btn-general" :class="{ 'disabled': currentStyleIndex < 1 }"
        @click="changeStyle(-1)">
        <img src="/imgs/share-card/ic-next.svg" style="transform: rotate(180deg);">
      </div>
      <div class="flex-h-center btn-general btn-save" style="gap: 6px;"
        @click="saveImage(stock.company_code + '_' + date.replaceAll('-', '') + '_rps')"
      >
        <img src="/imgs/share-card/ic-save.svg"> 保存图片
      </div>
      <div class="flex-h-center btn-change btn-general" :class="{ 'disabled': currentStyleIndex > (shareImgStylesList.length-2) }"
        @click="changeStyle(1)">
        <img src="/imgs/share-card/ic-next.svg">
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.btn-change {
  width: 56px;
}
.btn-general {
  height: 36px;
  justify-content: center;
  border-radius: 8px;
  background-color: #40446A;
  user-select: none;
  cursor: pointer;
  transform: scale(1);
  transition: all 0.1s ease-in;
}
.btn-general:hover {
  background-color: #494D77;
}
.btn-general:active {
  background-color: #323553;
  transform: scale(0.95);
}
.disabled {
  opacity: 0.3;
  pointer-events:none;
}
.btn-save {
  flex: 1;
  font-size: 14px;
}
.share-popup {
  box-sizing: border-box;
  padding: 16px;
  max-width: 422px;
  width: 90%;
  border-radius: 10px;
  background: rgb(40, 42, 63);
  box-shadow: 0px 18px 46px rgba(9, 9, 23, 0.28);
  z-index: 101;
  user-select: none;
  .image-preview {
    width: 100%;
    aspect-ratio: 390 / 600;
    margin-bottom: 16px;
    border-radius: 8px;
    overflow: hidden;
    -webkit-mask-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAA5JREFUeNpiYGBgAAgwAAAEAAGbA+oJAAAAAElFTkSuQmCC);
    background-color: black;
  }
  #preview-frame {
    aspect-ratio: 390 / 600;
  }
  .share-image {
    transform-origin: 0 0;
  }
  .actions {
    gap: 8px;
  }
  
}
</style>
