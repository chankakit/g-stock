<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { contactInfo } from '../../assets/share-card-contact.js'

let dmFont = new FontFace('Armata', 'url(https://fonts.gstatic.com/s/armata/v20/gokvH63_HV5jQ-ENkzR2YWivmA.woff2)')
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

const dynamicLogoUrl = ref('/imgs/share-card/te-style/logo-d-red@2x.png')
if(props.stock.change_pct < 0) {
  dynamicLogoUrl.value = '/imgs/share-card/te-style/logo-d-green@2x.png'
}

const fontFamily = "'Armata', 'PingFang SC', 'Microsoft Yahei', sans-serif"
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
  let brandImg = new Image()
  brandImg.src = dynamicLogoUrl.value
  brandImg.onload = () => {
    ctx.drawImage(brandImg, padding.left, padding.top, brandImg.width / 2, brandImg.height / 2)
  }

  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
  ctx.font = `12px ${fontFamily}`
  ctx.fillText('Relative price strength'.toUpperCase() , padding.left, 92)

  ctx.font = `11px ${fontFamily}`
  let nextElementXPos = width - padding.right - ctx.measureText(contactInfo.value).width
  ctx.fillText(contactInfo.value , nextElementXPos, height - padding.bottom / 2)
  nextElementXPos = nextElementXPos - ctx.measureText(contactInfo.type).width - 4
  ctx.fillText(contactInfo.type , nextElementXPos, height - padding.bottom / 2)
}

// 绘制名称
function drawStockTitle(ctx) {
  ctx.fillStyle = '#F2FCFE'
  ctx.shadowColor = 'rgba(255,255,255,0.35)'
  ctx.shadowBlur = 20
  ctx.font = `900 24px ${fontFamily}`
  ctx.fillText(props.stock.company_abbr, padding.left, 154)
  ctx.shadowBlur = 0

  ctx.fillStyle = 'rgba(255,255,255,0.6)'

  ctx.font = `500 13px ${fontFamily}`
  ctx.fillText(`${props.stock.company_code}.${(props.stock.bk).substring(0, 2).toUpperCase()}` , padding.left, 176)

  ctx.font = `500 12px ${fontFamily}`
  ctx.fillText(props.date , width - padding.right - ctx.measureText(props.date).width, 143)
}

function drawDataBox(x, y, boxWidth, boxHeight, title, value, ctx) {
  const boxPadding = 12
  const boxBGColor = '#1D1D1D'
  const titleColor = 'rgba(255,255,255,0.6)'
  const valueColor = '#FFF'

  ctx.fillStyle = boxBGColor
  ctx.fillRect(x, y, boxWidth, boxHeight)

  ctx.textAlign = 'right'
  
  ctx.font = `12px ${fontFamily}`
  let titlePos = {
    x: x + boxWidth - boxPadding,
    y: y + boxHeight / 2 - 11
  }
  ctx.fillStyle = titleColor
  ctx.fillText(title, titlePos.x, titlePos.y)

  ctx.font = `20px ${fontFamily}`
  let valuePos = {
    x: x + boxWidth - boxPadding,
    y: y + boxHeight / 2 + (ctx.measureText(value).fontBoundingBoxAscent + ctx.measureText(value).fontBoundingBoxDescent) - 6
  }

  ctx.shadowBlur = 20
  ctx.fillStyle = valueColor
  ctx.fillText(value, valuePos.x, valuePos.y)
  ctx.shadowBlur = 0
}

// 绘制第一行
function drawFirstRow(ctx) {
  const gap = 9
  const rowItemNum = 3
  let boxYPos = 194
  let boxSize = {
    width: (contentWidth - (gap * (rowItemNum - 1))) / rowItemNum,
    height: 72
  }

  if(props.stock.close == '停牌') {
    drawDataBox(padding.left + (boxSize.width + gap) * 0, boxYPos, boxSize.width, boxSize.height, 'CLOSE', props.stock.close, ctx)
    drawDataBox(padding.left + (boxSize.width + gap) * 2, boxYPos, boxSize.width, boxSize.height, 'RVOL', props.stock.rvol, ctx)
  } else {
    drawDataBox(padding.left + (boxSize.width + gap) * 0, boxYPos, boxSize.width, boxSize.height, 'CLOSE', props.stock.close.toFixed(2), ctx)
    drawDataBox(padding.left + (boxSize.width + gap) * 2, boxYPos, boxSize.width, boxSize.height, 'RVOL', props.stock.rvol.toFixed(2), ctx)
  }

  drawDataBox(padding.left +(boxSize.width + gap) * 1, boxYPos, boxSize.width, boxSize.height, 'MA[10]', props.stock.m10, ctx)
}

function drawDataBox1(x, y, boxWidth, boxHeight, title, value1, value2, valueColor, ctx) {
  const boxPadding = 12
  const boxBGColor = '#1D1D1D'
  const titleColor = 'rgba(255,255,255,0.6)'

  ctx.fillStyle = boxBGColor
  ctx.fillRect(x, y, boxWidth, boxHeight)

  ctx.textAlign = 'right'

  ctx.font = `12px ${fontFamily}`
  let titlePos = {
    x: x + boxWidth - boxPadding,
    y: y + boxHeight / 2 - 19
  }
  ctx.fillStyle = titleColor
  ctx.fillText(title, titlePos.x, titlePos.y)

  ctx.fillStyle = valueColor
  ctx.shadowBlur = 20
  ctx.font = `20px ${fontFamily}`
  let valuePos = {
    x: x + boxWidth - boxPadding,
    y: y + boxHeight / 2 + (ctx.measureText(value1).fontBoundingBoxAscent + ctx.measureText(value1).fontBoundingBoxDescent) - 13
  }
  ctx.fillText(value1, valuePos.x, valuePos.y)

  ctx.font = `12px ${fontFamily}`
  valuePos = {
    x: x + boxWidth - boxPadding,
    y: y + boxHeight / 2 + (ctx.measureText(value2).fontBoundingBoxAscent + ctx.measureText(value2).fontBoundingBoxDescent) + 13
  }
  ctx.globalAlpha = 0.8
  ctx.fillText(value2, valuePos.x, valuePos.y)

  ctx.globalAlpha = 1
  ctx.shadowColor = 'rgba(255,255,255,0.35)'
  ctx.shadowBlur = 0
}

// 绘制第二行
function drawSecondRow(ctx) {
  const gap = 9
  const rowItemNum = 3
  let boxYPos = 275
  let boxSize = {
    width: (contentWidth - (gap * (rowItemNum - 1))) / rowItemNum,
    height: 87
  }

  if(props.stock.change_pct == '停牌') {
    drawDataBox1(padding.left + (boxSize.width + gap) * 0, boxYPos, boxSize.width, boxSize.height, 'CHANGE', '停牌', '', '#fff', ctx)
  } else {
    let valueColor = '#fff'
    if(props.stock.change_abs > 0) {
      valueColor = '#ff293b'
      ctx.shadowColor = '#ff293b'
    } else if (props.stock.change_abs < 0) {
      valueColor = '#00ba92'
      ctx.shadowColor = '#00ba92'
    }
    
    drawDataBox1(padding.left + (boxSize.width + gap) * 0, boxYPos, 
                boxSize.width, boxSize.height, 
                'CHANGE', 
                `${props.stock.change_abs > 0 ? '+' : ''}${props.stock.change_abs.toFixed(2)}`,
                `${props.stock.change_abs > 0 ? '+' : ''}${props.stock.change_pct.toFixed(2)}%`,
                valueColor,
                ctx)
  }
  let valueColor = '#fff'
  drawDataBox1(padding.left +(boxSize.width + gap) * 1, boxYPos, 
               boxSize.width * 2 + gap, boxSize.height, 
               'CLOSE-MA[10]_DIFF', 
               `${props.stock.m10_offset_pct > 0 ? '+' : ''}${(props.stock.m10 * props.stock.m10_offset_pct / 100).toFixed(2)}`,
               `${props.stock.m10_offset_pct > 0 ? '+' : ''}${props.stock.m10_offset_pct.toFixed(2)}%`,
               valueColor,
               ctx)
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
  const titleColor = 'rgba(235, 255, 255, 0.6)'
  const valueColor = value > 87 ? '#F0450F' : '#FFF'

  ctx.fillStyle = titleColor
  ctx.textBaseline = 'alphabetic'
  ctx.font = `12px ${fontFamily}`

  let titlePos = {
    x: x,
    y: y + boxHeight / 2 + ctx.measureText(title).actualBoundingBoxAscent / 2 
  }
  ctx.fillText(title, titlePos.x, titlePos.y)

  ctx.fillStyle = valueColor
  let eachCharWidth = 9
  let dotCharWidth = 4
  
  let valueTextArray = value.split('')
  let valueTextObj = {
    beforeDot: value.split('.')[0],
    afterDot: value.split('.')[1]
  }
  
  let valuePos = {
    x: x + boxWidth - eachCharWidth * (valueTextArray.length - 1) - dotCharWidth,
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
  let boxXPos = padding.left
  let boxYPos = 371
  let boxSize = {
    width: 217,
    height: 29
  }
  ctx.textAlign = 'start'
  ctx.strokeStyle = 'rgba(255,255,255,0.1)'
  for(let i = 0; i < rpsDaysKey.length; i++) {
    drawRpsBox(boxXPos, boxYPos + boxSize.height * i, boxSize.width, boxSize.height, rpsDaysKey[i].toUpperCase().replace('_', ' '), props.stock[rpsDaysKey[i]].toFixed(2), ctx)
    if(i < 5) {
      drawLine(boxXPos, boxYPos + boxSize.height * (i + 1), boxSize.width, ctx)
    }
  }
  
  ctx.fillStyle = '#1D1D1D'
  boxXPos = 258
  boxSize.width = 108
  boxSize.height = 174

  ctx.fillRect(boxXPos, boxYPos, boxSize.width, boxSize.height)

  let barHeight = props.stock.rps_mean / 100 * boxSize.height
  ctx.fillStyle = '#F0450F'
  ctx.fillRect(boxXPos, boxYPos + (boxSize.height - barHeight), boxSize.width, barHeight)
  
  ctx.textAlign = 'right'
  ctx.fillStyle = 'rgba(255,255,255,0.6)'
  ctx.fillText('RPS_MEAN', padding.left + contentWidth - 12 , boxYPos + 24)

  ctx.font = `20px ${fontFamily}`
  ctx.fillStyle = '#FFF'
  ctx.shadowBlur = 20
  ctx.fillText(props.stock.rps_mean, padding.left + contentWidth - 12 , boxYPos + boxSize.height - 16)
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
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, width, height)

    // 绘制背景纹理
    let bgPattern = new Image()
    bgPattern.src = '/imgs/share-card/te-style/abs.png'
    bgPattern.onload = () => {
      let patternCanvas = document.createElement('canvas')
      let patternCtx = patternCanvas.getContext('2d')
      patternCanvas.width = bgPattern.width / 2
      patternCanvas.height = bgPattern.height / 2
      patternCtx.drawImage(bgPattern, 0, 0, bgPattern.width, bgPattern.height, 0, 0, patternCanvas.width, patternCanvas.height)
      const ptrn = ctx.createPattern(patternCanvas, "repeat")
      ctx.fillStyle = ptrn
      ctx.fillRect(0, 0, width, height)

      // 创建线性渐变
      ctx.globalCompositeOperation = 'multiply'
      let titleGradient = ctx.createLinearGradient(0, 0, width / 2, height)
      titleGradient.addColorStop(0, '#FFF')
      titleGradient.addColorStop(1, '#999')
      ctx.fillStyle = titleGradient
      ctx.fillRect(0, 0, width, height)
      ctx.globalCompositeOperation = 'source-over'

      drawHeaderFooter(ctx)

      ctx.fillStyle = '#141414'
      ctx.fillRect(0, 107, width, 462)

      drawStockTitle(ctx)
      drawFirstRow(ctx)
      drawSecondRow(ctx)
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
  <div>
    <div id="load-font">LGfs</div>
    <canvas id="share-card-canvas"></canvas>
  </div>
</template>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Armata&display=swap');
#share-card-canvas {
  position: absolute;
}
* {
  font-family: 'Armata', sans-serif;
}
#load-font {
  position: absolute;
  color: #1C1C1A;
  font-size: 3px;
  opacity: 0.01;
  z-index: -2;
}
</style>
