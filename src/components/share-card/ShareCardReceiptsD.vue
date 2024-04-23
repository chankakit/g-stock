<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { contactInfo } from '../../assets/share-card-contact.js'

let dmFont = new FontFace('DM Serif Display', 'url(https://fonts.gstatic.com/s/dmserifdisplay/v15/-nFnOHM81r4j6k0gjAW3mujVU2B2G_Bx0vrx52g.woff2)')
dmFont.load().then(() => {
  drawCanvas()
})

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

const dynamicLogoUrl = ref('/imgs/share-card/receipts/logo-l-red@2x.png')
if(props.stock.change_pct < 0) {
  dynamicLogoUrl.value = '/imgs/share-card/receipts/logo-l-green@2x.png'
}

const fontFamily = "'DM Serif Display', 'Noto Serif SC', 'Songti SC', serif"
const width = 390
const height = 600
const padding = {
  top: 24,
  right: 24,
  bottom: 24,
  left: 24
}
const contentWidth = width - padding.left - padding.right


function drawLine(x, y, lenght, ctx, direction = 0) {
  // 0: 横向，1: 竖向
  ctx.beginPath()
  ctx.moveTo(x, y)
  if(direction === 0) {
    ctx.lineTo(x + lenght, y)
  } else {
    ctx.lineTo(x, y + lenght)
  }
  ctx.stroke()
}

// 绘制页眉页脚
function drawHeaderFooter(ctx) {
  ctx.fillStyle = 'rgba(232,227,209,0.5)'
  ctx.font = `500 12px ${fontFamily}`
  ctx.fillText(props.date , width - padding.right - ctx.measureText(props.date).width, 32)
  let titleImg = new Image()
  titleImg.src = '/imgs/share-card/receipts/receipts-title-l.svg'
  titleImg.onload = () => {
    ctx.drawImage(titleImg, padding.left, padding.top)
  }
  
  ctx.font = "500 12px 'Ubuntu', sans-serif"
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
  ctx.fillStyle = '#E8E3D1'
  ctx.font = `900 28px ${fontFamily}`
  ctx.fillText(props.stock.company_abbr, padding.left, 142)

  ctx.fillStyle = 'rgba(232,227,209,0.6)'

  ctx.font = `500 14px ${fontFamily}`
  ctx.fillText(`${props.stock.company_code}.${(props.stock.bk).substring(0, 2).toUpperCase()}` , padding.left, 176)
}

function drawDataBox(x, y, boxWidth, boxHeight, title, value, ctx) {
  ctx.fillStyle = 'rgba(232,227,209,0.8)'
  ctx.font = `500 12px ${fontFamily}`
  ctx.textAlign = 'center'
  let titlePos = {
    x: x + boxWidth / 2,
    y: y + boxHeight / 2 - (ctx.measureText(title).fontBoundingBoxAscent + ctx.measureText(title).fontBoundingBoxDescent) / 2
  }
  ctx.textBaseline = 'alphabetic'
  ctx.fillText(title, titlePos.x, titlePos.y)

  ctx.fillStyle = numColor.value.red ? '#C34B4B' : '#429B65'
  ctx.font = `600 24px /24px ${fontFamily}`

  let valuePos = {
    x: x + boxWidth / 2,
    y: y + boxHeight / 2 + (ctx.measureText(value).fontBoundingBoxAscent + ctx.measureText(value).fontBoundingBoxDescent) / 2
  }
  
  ctx.fillText(value, valuePos.x, valuePos.y)
}

// 绘制股价数据
function drawStockPrice(ctx) {
  ctx.strokeStyle = 'rgba(255,255,255,0.15)'
  let boxYPos = 208
  let boxSize = {
    width: contentWidth / 1,
    height: 70
  }

  drawLine(padding.left, boxYPos, contentWidth, ctx)
  drawLine(padding.left, boxYPos + boxSize.height, contentWidth, ctx)

  if(props.stock.close == '停牌') {
    ctx.fillStyle = '#E8E3D1'
    ctx.font = `600 24px ${fontFamily}`
    ctx.fillText('停牌', padding.left, 233)
  } else {
    boxSize.width = contentWidth / 3

    drawDataBox(padding.left + boxSize.width * 0, boxYPos, boxSize.width, boxSize.height, '收盘', props.stock.close.toFixed(2), ctx)
    drawDataBox(padding.left + boxSize.width * 1, boxYPos, boxSize.width, boxSize.height, '涨跌额', `${props.stock.change_abs > 0 ? '+' : ''}${props.stock.change_abs.toFixed(2)}`, ctx)
    drawDataBox(padding.left + boxSize.width * 2, boxYPos, boxSize.width, boxSize.height, '涨跌幅', `${props.stock.change_pct > 0 ? '+' : ''}${props.stock.change_pct.toFixed(2)}%`, ctx)
    drawLine(padding.left + boxSize.width * 1, boxYPos + 10, 50, ctx, 1)
    drawLine(padding.left + boxSize.width * 2, boxYPos + 10, 50, ctx, 1)
  }
}

function drawDataBox1(x, y, boxWidth, boxHeight, title, value, ctx) {
  ctx.fillStyle = 'rgba(232,227,209,0.8)'
  ctx.font = `500 12px ${fontFamily}`
  ctx.textAlign = 'center'

  let titlePos = {
    x: x + boxWidth / 2,
    y: y + boxHeight / 2 - (ctx.measureText(title).fontBoundingBoxAscent + ctx.measureText(title).fontBoundingBoxDescent) / 1.7
  }
  ctx.textBaseline = 'alphabetic'
  ctx.fillText(title, titlePos.x, titlePos.y)

  ctx.fillStyle = '#E8E3D1'
  ctx.font = `600 20px ${fontFamily}`
  let valuePos = {
    x: x + boxWidth / 2,
    y: y + boxHeight / 2 + (ctx.measureText(value).fontBoundingBoxAscent + ctx.measureText(value).fontBoundingBoxDescent) / 1.7
  }
  ctx.fillText(value, valuePos.x, valuePos.y)
}

function drawStockOtherData(ctx) {
  let boxYPos = 290
  let boxSize = {
    width: 159,
    height: 77
  }

  if(props.stock.rvol == '停牌') {
    drawDataBox1(padding.left, boxYPos + boxSize.height * 0, boxSize.width, boxSize.height, '量比', '停牌', ctx)
  } else {
    drawDataBox1(padding.left, boxYPos + boxSize.height * 0, boxSize.width, boxSize.height, '量比', props.stock.rvol.toFixed(2), ctx)
  }
  
  drawDataBox1(padding.left, boxYPos + boxSize.height * 1, boxSize.width, boxSize.height, 'MA10', props.stock.m10.toFixed(2), ctx)

  ctx.fillStyle = 'rgba(232,227,209,0.8)'
  ctx.font = `500 12px ${fontFamily}`

  let titlePos = {
    x: padding.left + boxSize.width / 2,
    y: boxYPos + boxSize.height * 2 + boxSize.height / 2 - (ctx.measureText('MA10 偏离').fontBoundingBoxAscent + ctx.measureText('MA10 偏离').fontBoundingBoxDescent) / 1.4
  }
  ctx.textBaseline = 'alphabetic'
  ctx.fillText('MA10 偏离', titlePos.x, titlePos.y)

  ctx.fillStyle = '#E8E3D1'
  ctx.font = `600 20px ${fontFamily}`
  let drawText = `${props.stock.m10_offset_pct > 0 ? '+' : ''}${props.stock.m10_offset_pct.toFixed(2)}%`
  let valuePos = {
    x: padding.left + boxSize.width / 2,
    y: boxYPos + boxSize.height * 2 + boxSize.height / 2 + (ctx.measureText(drawText).fontBoundingBoxAscent + ctx.measureText(drawText).fontBoundingBoxDescent) / 2.7
  }

  ctx.fillText(drawText, valuePos.x, valuePos.y)

  ctx.font = `600 14px ${fontFamily}`
  drawText = `(${props.stock.m10_offset_pct > 0 ? '+' : ''}${(props.stock.m10 * props.stock.m10_offset_pct / 100).toFixed(2)})`
  valuePos = {
    x: padding.left + boxSize.width / 2,
    y: boxYPos + boxSize.height * 2 + boxSize.height / 2 + 28
  }

  ctx.fillText(drawText, valuePos.x, valuePos.y)

  drawLine(padding.left, boxYPos + boxSize.height * 1, boxSize.width, ctx)
  drawLine(padding.left, boxYPos + boxSize.height * 2, boxSize.width, ctx)
  drawLine(width / 2, boxYPos, boxSize.height * 3, ctx, 1)
}

function drawMonoText(text, x, y, eachCharWidth, ctx) {
  
  const textArray = text.split('')
  ctx.textAlign = "center"
  textArray.forEach((char, i) => {
    ctx.fillText(char, x + eachCharWidth * i + eachCharWidth / 2, y)
  })
  ctx.textAlign = "start"
}

function drawRpsBox(x, y, boxWidth, boxHeight, title, value, ctx) {
  const titleColor = 'rgba(235, 227, 209, 0.7)'
  const valueColor = '#E8E3D1'

  ctx.fillStyle = titleColor
  ctx.textBaseline = 'alphabetic'
  ctx.textAlign = "start"
  ctx.font = `600 12px ${fontFamily}`

  let titlePos = {
    x: x,
    y: y + boxHeight / 2 + ctx.measureText(title).actualBoundingBoxAscent / 2 
  }
  ctx.fillText(title, titlePos.x, titlePos.y)

  ctx.fillStyle = valueColor
  ctx.font = `600 20px ${fontFamily}`
  let eachCharWidth = 11
  let dotCharWidth = 8
  
  let valueTextArray = value.split('')
  let valueTextObj = {
    beforeDot: value.split('.')[0],
    afterDot: value.split('.')[1]
  }
  
  // console.log(valueTextObj)
  let valuePos = {
    x: x + boxWidth - eachCharWidth * (valueTextArray.length - 1) - dotCharWidth, // 8px 是小数点在 20px 的预设宽度（字体原宽度是 6px）
    y: y + boxHeight / 2  + ctx.measureText(value).actualBoundingBoxAscent / 2
  }
  drawMonoText(valueTextObj.beforeDot, valuePos.x, valuePos.y, eachCharWidth, ctx)
  valuePos.x = x + boxWidth - eachCharWidth * valueTextObj.afterDot.split('').length - dotCharWidth
  drawMonoText('.', valuePos.x, valuePos.y, dotCharWidth, ctx)
  valuePos.x = x + boxWidth - eachCharWidth * valueTextObj.afterDot.split('').length
  drawMonoText(valueTextObj.afterDot, valuePos.x, valuePos.y, eachCharWidth, ctx)
}

function drawRpsArea(ctx) {
  // 绘制 rps 部分
  let boxXPos = width / 2 + 12
  let boxYPos = 290
  let boxSize = {
    width: contentWidth / 2 - 12,
    height: 33
  }

  for(let i = 0; i < rpsDaysKey.length; i++) {
    drawRpsBox(boxXPos, boxYPos + boxSize.height * i, boxSize.width, boxSize.height, rpsDaysKey[i].toUpperCase().replace('_', ' '), props.stock[rpsDaysKey[i]].toFixed(2), ctx)
  }
  drawLine(boxXPos, boxYPos + boxSize.height * (rpsDaysKey.length), boxSize.width, ctx)
  drawRpsBox(boxXPos, boxYPos + boxSize.height * (rpsDaysKey.length), boxSize.width, boxSize.height, 'RPS Mean', props.stock['rps_mean'].toFixed(2), ctx)
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
    ctx.fillStyle = '#1C1C1A'
    ctx.fillRect(0, 0, width, height)

    drawHeaderFooter(ctx)
    drawStockTitle(ctx)
    drawStockPrice(ctx)
    drawStockOtherData(ctx)
    drawRpsArea(ctx)
    drawLine(padding.left, 532, contentWidth, ctx)
  } else {
    console.log('no dom')
  }
}

onMounted(() => {
  drawCanvas()
})
</script>

<template>
  <div>
    <div id="load-font">LGfs
      <span class="bold">鸿雁于飞，肃肃其羽。之子于征，劬劳于野。爰及矜人，哀此鳏寡。</span>
      <span class="normal">鸿雁于飞，哀鸣嗷嗷。维此哲人，谓我劬劳。维彼愚人，谓我宣骄。</span>
    </div>
    <canvas id="share-card-canvas"></canvas>
  </div>
</template>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;700&display=swap');
#share-card-canvas {
  position: absolute;
}
* {
  font-family: 'DM Serif Display', 'Noto Serif SC', 'Songti SC', serif;
}
#load-font {
  position: absolute;
  color: #1C1C1A;
  font-size: 3px;
  opacity: 0.01;
  z-index: -2;
}
.bold {
  font-weight: 700;
}
.normal {
  font-weight: 400;
}
</style>
