<script setup>
import { ref, onMounted, computed } from 'vue'
import { contactInfo } from '../../assets/share-card-contact.js'

const props = defineProps({
  stock: Object,
  date: String
})

let rpsDaysKey = Object.keys(props.stock).filter(keyName => keyName.includes('rps'))
rpsDaysKey.pop()
rpsDaysKey.reverse()

const numColor = computed(() => ({
  'red': props.stock.change_pct > 0,
  'green': props.stock.change_pct < 0,
}))

const dynamicLogoUrl = ref('/imgs/share-card/default/logo-red@2x.png')
if(props.stock.change_pct < 0) {
  dynamicLogoUrl.value = '/imgs/share-card/default/logo-green@2x.png'
}

const width = 390
const height = 600
const padding = {
  top: 24,
  right: 24,
  bottom: 24,
  left: 24
}
const contentWidth = width - padding.left - padding.right

// 绘制页眉页脚
function drawHeaderFooter(ctx) {
  ctx.fillStyle = 'rgba(255,255,255,0.5)'
  ctx.font = "500 12px 'Ubuntu', sans-serif"
  ctx.fillText('个股 RPS 强度' , padding.left, 32)
  ctx.fillText(props.date , width - padding.right - ctx.measureText(props.date).width, 32)
  
  let nextElementXPos = width - padding.right - ctx.measureText(contactInfo.value).width
  ctx.fillText(contactInfo.value , nextElementXPos, height - padding.bottom)
  ctx.font = "400 12px 'Ubuntu', sans-serif"
  nextElementXPos = nextElementXPos - ctx.measureText(contactInfo.type).width - 4
  ctx.fillText(contactInfo.type , nextElementXPos, height - padding.bottom)
  
  let brandImg = new Image()
  brandImg.src = dynamicLogoUrl.value
  brandImg.onload = () => {
    ctx.drawImage(brandImg, padding.left, height - padding.bottom - brandImg.height / 2, brandImg.width / 2, brandImg.height / 2)
  }
}

// 绘制名称
function drawStockTitle(ctx) {
  ctx.textBaseline = 'top'
  // 创建线性渐变
  let titleGradient = ctx.createLinearGradient(0, 95, 0, 121)
  titleGradient.addColorStop(0, 'rgba(255,255,255,1)')
  titleGradient.addColorStop(1, 'rgba(255,255,255,0.65)')
  ctx.fillStyle = titleGradient
  ctx.font = "700 28px 'Ubuntu', sans-serif"
  ctx.fillText(props.stock.company_abbr, padding.left, 96)

  ctx.fillStyle = 'rgba(255,255,255,0.6)'
  ctx.font = "500 14px 'Ubuntu', sans-serif"
  ctx.fillText(`${props.stock.company_code}.${(props.stock.bk).substring(0, 2).toUpperCase()}` , padding.left, 132)
}

// 绘制股价数据
function drawStockPrice(ctx) {
  ctx.strokeStyle = 'rgba(255,255,255,0.15)'
  ctx.beginPath()
  ctx.moveTo(padding.left, 168)
  ctx.lineTo(padding.left + contentWidth, 168)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(padding.left, 245)
  ctx.lineTo(padding.left + contentWidth, 245)
  ctx.stroke()

  ctx.textBaseline = 'alphabetic'
  if(props.stock.close == '停牌') {
    ctx.fillStyle = '#FFFFFF'
    ctx.font = "700 24px 'Ubuntu', sans-serif"
    ctx.fillText(props.stock.close, padding.left, 203)
  } else {
    ctx.fillStyle = numColor.value.red ? '#FF293B' : '#00BA92'
    ctx.font = "700 24px Ubuntu, sans-serif"
    let drawText = props.stock.close.toFixed(2)
    ctx.fillText(drawText, padding.left, 203)
    let nextTextXPos = padding.left + ctx.measureText(drawText).width
    ctx.font = "500 16px 'Ubuntu', sans-serif"
    drawText = `${numColor.value.red ? '+' : ''}${props.stock.change_abs.toFixed(2)}`
    ctx.fillText(drawText, nextTextXPos + 16, 203)
    nextTextXPos = nextTextXPos + 16 + ctx.measureText(drawText).width
    drawText = `${numColor.value.red ? '+' : ''}${props.stock.change_pct.toFixed(2)}%`
    ctx.fillText(drawText, nextTextXPos + 8, 203)
  }

  ctx.fillStyle = '#FFFFFF'
  ctx.font = "500 12px 'Ubuntu', sans-serif"

  let nextElementXPos = padding.left
  let drawText = '量比  停牌'
  if(props.stock.rvol === '停牌') {
    // 
  } else {
    drawText = `量比  ${props.stock.rvol.toFixed(2)}`
  }
  
  ctx.fillText(drawText, padding.left, 227)

  nextElementXPos = nextElementXPos + ctx.measureText(drawText).width + 8
  ctx.beginPath()
  ctx.moveTo(nextElementXPos, 217)
  ctx.lineTo(nextElementXPos, 228)
  ctx.stroke()

  nextElementXPos = nextElementXPos + 8
  drawText = `MA10  ${props.stock.m10.toFixed(2)}`
  ctx.fillText(drawText, nextElementXPos, 227)

  nextElementXPos = nextElementXPos + ctx.measureText(drawText).width + 8
  ctx.beginPath()
  ctx.moveTo(nextElementXPos, 217)
  ctx.lineTo(nextElementXPos, 228)
  ctx.stroke()

  nextElementXPos = nextElementXPos + 8
  drawText = `MA10 偏离  ${props.stock.m10_offset_pct > 0 ? '+' : ''}${props.stock.m10_offset_pct.toFixed(2)}% (${props.stock.m10_offset_pct > 0 ? '+' : ''}${(props.stock.m10 * props.stock.m10_offset_pct / 100).toFixed(2)})`
  ctx.fillText(drawText, nextElementXPos, 227)
}

function drawRpsBox(x, y, width, height, title, value, ctx) {
  const boxBGColor = 'rgb(39, 39, 46)'
  const titleColor = 'rgba(255, 255, 255, 0.6)'
  const valueColor = {
    normal: '#FFFFFF',
    highlight: '#FFBF1D'
  }
  const boxPadding = 12

  ctx.fillStyle = boxBGColor
  ctx.beginPath()
  ctx.roundRect(x, y, width, height, 8)
  ctx.fill()

  ctx.fillStyle = titleColor
  ctx.textBaseline = 'top'
  ctx.font = "500 12px 'Ubuntu', sans-serif"
  ctx.fillText(title, x + boxPadding, y + boxPadding + 2)

  if(value > 87) {
    ctx.fillStyle = valueColor.highlight
  } else {
    ctx.fillStyle = valueColor.normal
  }
  
  ctx.textBaseline = 'alphabetic'
  ctx.font = "700 20px 'Ubuntu', sans-serif"
  ctx.fillText(value.toFixed(2), x + boxPadding, y + height - boxPadding - 3)
}

function drawRpsArea(ctx) {
  // 绘制 rps 部分
  const gap = 6
  const itemNumPerRow = 3
  const boxWidth = (contentWidth - gap * (itemNumPerRow - 1)) / 3
  const boxHeight = 65
  const firstRowYPos = 266

  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < itemNumPerRow; col++) {
      drawRpsBox( col * (boxWidth + gap) + padding.left, firstRowYPos + row * (gap + boxHeight), 
                  boxWidth, boxHeight, 
                  rpsDaysKey[col + row * 3].toUpperCase().replace('_', ' '), 
                  props.stock[rpsDaysKey[col + row * 3]], 
                  ctx)
    }
  }
  drawRpsBox(padding.left, 408, contentWidth, boxHeight, 'RPS Mean', props.stock['rps_mean'], ctx)
}

function drawCanvas() {
  const ratio = window.devicePixelRatio || 1
  let canvas = document.getElementById('share-card-canvas')

  canvas.width = width * ratio
  canvas.height = height * ratio

  canvas.style.width = width + 'px'
  canvas.style.height = height + 'px'
  
  if(canvas.getContext) {
    let ctx = canvas.getContext('2d')
    ctx.scale(ratio, ratio)

    // 绘制背景颜色
    ctx.fillStyle = '#19191C'
    ctx.fillRect(0, 0, width, height)

    // 绘制背景纹理
    let bgPattern = new Image()
    bgPattern.src = '/imgs/bg_pattern.svg'
    bgPattern.onload = () => {
      let patternCanvas = document.createElement('canvas')
      let patternCtx = patternCanvas.getContext('2d')
      patternCanvas.width = bgPattern.width / 2
      patternCanvas.height = bgPattern.height / 2
      patternCtx.drawImage(bgPattern, 0, 0, bgPattern.width, bgPattern.height, 0, 0, patternCanvas.width, patternCanvas.height)

      const ptrn = ctx.createPattern(patternCanvas, "repeat")
      ctx.fillStyle = ptrn
      ctx.fillRect(0, 0, width, height)

      drawHeaderFooter(ctx)
      drawStockTitle(ctx)
      drawStockPrice(ctx)
      drawRpsArea(ctx)
    }
  } else {
    console.log('no dom')
  }
}


onMounted(() => {
  drawCanvas()
})
</script>

<template>
  <canvas id="share-card-canvas"></canvas>
</template>

<style lang="scss" scoped>
#share-card-canvas {
  position: absolute;
}
</style>
