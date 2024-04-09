<script setup lang='jsx'>
import { ref, toRaw, onMounted, computed, watch } from 'vue'
import { TableV2SortOrder } from 'element-plus'
import { columns } from './components/TableColumnConfig.jsx'
import { defaultFiltersConfig } from './components/FilterConfig.js'
import IndexGraphic from './components/IndexGraphic.vue'
import StockPopup from './components/StockPopup.vue'
import DescriptionPopup from './components/DescriptionPopup.vue'


const props = defineEmits({
  stockDialogShow: Boolean,
})

const dataRoot = 'https://cdn.sanity.io/files/ilbimbym/production/'

// 最后更新时间字段
const lastUpdateDate = ref('')

// 指数 数据
const indexData = ref({})

// RPS 数据
// 原始数据，用于筛选
let originalData = []
// 筛选处理后的数据
const processedData = ref([])
// 数量改变时，需要页码复位到第一页
watch(processedData, () => {
  currentPage.value = 1
  pageCount.value = Math.floor(processedData.value.length / pageSize.value) + 1
})

let jsonFile = {}
fetch('https://ilbimbym.api.sanity.io/v2022-03-07/data/query/production?query=*%5B_type+%3D%3D+%27temp%27%5D%7B%0A++name%2C%0A++rps%7Basset%7D%2C%0A++sse%7Basset%7D%2C%0A%7D')
  .then((response) => response.json())
  .then((json) => {
    jsonFile.rpsFile = json.result[0].rps.asset._ref.split('-')
    jsonFile.sseFile = json.result[0].sse.asset._ref.split('-')

    // 载入 指数 数据
    fetch(dataRoot + jsonFile.sseFile[1] + '.json')
      .then((response) => response.json())
      .then((json) => {
        indexData.value = json
        lastUpdateDate.value = indexData.value.date.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3')
      })

    // 载入 rps 数据
    fetch(dataRoot + jsonFile.rpsFile[1] + '.json')
      .then((response) => response.json())
      .then((json) => {
        originalData = json  
        let ps = originalData[Math.floor(originalData.length * Math.random())]
        // 设置搜索框的 placeholder 文本
        searchInputPlaceholder.value = ps.company_code + ' / ' + ps.company_abbr + ' / ' + ps.company_pinyin
        processedData.value = json
        // 默认按 RPS 60 倒序展示
        const defaultSortArgs = {
          key: 'rps_60',
          order: TableV2SortOrder.DESC
        }
        onSort(defaultSortArgs)
      })
  })

// 搜索框相关
// 搜索字串
const showStockDialog = ref(false)
const dialogStock = ref({})
const searchInputDiv = ref()
const searchInputPlaceholder = ref('')
const searchText = ref('')
// 搜索执行函数
const querySearch = (queryString, cb) => {
  // console.log(`search: ${queryString}`)
  let results = []
  if(isNaN(Number(queryString))) {
    if(queryString.length > 1) {
      results = originalData.filter(searchFilter(queryString))
      // 如果列表为空则返回 -1 代表没结果，要分别写两次是不想在字数不够的时候出现没结果的提示
      // 如果写在回调函数前，那么在输入字数不够的时候也会出现没结果的提示
      if(results.length === 0) { results = [-1] }
    }
  } else {
    if(queryString.length > 4) {
      results = originalData.filter(searchFilter(queryString))
      if(results.length === 0) { results = [-1] }
    }
  }
  cb(results)
}
// 搜索筛选器
const searchFilter = (queryString) => {
  return (stock) => {
    return (
      stock.company_code.includes(queryString) || 
      stock.company_abbr.includes(queryString) ||
      stock.company_pinyin.toLowerCase().includes(queryString.toLowerCase())
    )
  }
}
// 点击搜索列表中 item 后动作
function handleSelect(item) {
  if(item === -1) {
    return
  }
  dialogStock.value = item
  showStockDialog.value = true
  searchText.value = ''
}
function handleEnter(item) {
  if(item.length === 1) {
    searchInputDiv.value.close()
    searchInputDiv.value.blur()
    handleSelect(item[0])
    searchInputDiv.value.suggestions = []
  }
}

// 分页器设置
// 当前页码
const currentPage = ref(1)
// 每页数量
const pageSize = ref(20)
const pageCount = ref(1)
// 更改每页数量时，页码复位到第一页
watch(pageSize, () => {
  currentPage.value = 1
  pageCount.value = Math.floor(processedData.value.length / pageSize.value) + 1
})
watch(currentPage, () => {
  stockTableV1.value.setScrollTop(0)
})
const arrowKeyChangePage = (e) => {
  console.log(e)
}


// 表格相关
const stockTableV1 = ref()
// 排序设置
const sortState = ref({
  key: '',
  order: TableV2SortOrder.ASC,
})
// 排序运行函数
const onSort = (sortBy) => {
  if(sortState.value.key === sortBy.key) {
    // 如果是点击同一列，就直接相反排序
    processedData.value.reverse()
    if(sortState.value.order === 'asc') { sortBy.order = 'desc' }
    else { sortBy.order = 'asc' }
  } else {
    // 如果不是同一列，则默认按倒序处理
    processedData.value.sort((a, b) =>{
      if(a[sortBy.key] === '停牌') return 1
      if(b[sortBy.key] === '停牌') return -1
      return -(a[sortBy.key] - b[sortBy.key])
    });
    sortBy.order = 'desc'
  }
  currentPage.value = 1
  sortState.value = sortBy
}
// 分割处理后数据，用于分页展示
const slicedData = computed(() => {
  const chunkSize = pageSize.value
  let chunks = []
  for(let i = 0; i < processedData.value.length; i += chunkSize) {
    chunks.push(processedData.value.slice(i, i + chunkSize))
  }
  return chunks
})
// 赋值到当前页数据，用于展示
const tableData = computed(() => {
  if(slicedData.value.length == 0) {
    return []
  } else {
    return slicedData.value[currentPage.value-1]
  }
})

// 设置V2偶数行的背景样式
const evenRowClass = ({ rowIndex }) => {
  if (rowIndex % 2 === 1) {
    return 'even-row'
  }
  return ''
}
// 设置V2表头高度，数组中有多少个，就有多少行
const headerRowHeight = ref([50])
// 自定义的V2表头渲染函数
const CustomizedHeader = (({ cells, columns, headerIndex }) => {
  // 第一行保持原来的
  if(headerIndex === 0) {
    return cells
  }
  // 第二行用于展示 filter 状态
  if(headerIndex === 1) {
    let filterCells = []
    columns.forEach((column, columnIndex) => {
      let cellClass = "filter-row"
      column.align === "right" ? cellClass += " is-align-right" : ''
      const cellStyle = (column.flexGrow === 1 ? "flex: 1 1 auto; " : "flex: 0 1 auto; ") + `width: ${column.width}px`

      let cellContent = ''
      if(columnIndex === 0) { cellContent = "Filter ON"}
      else if(columnIndex === 1) { cellContent = "" }
      else { 
        const min = filters[columnIndex-2].min === -Infinity ? '-∞' : filters[columnIndex-2].min
        const max = filters[columnIndex-2].max === +Infinity ? '+∞' : filters[columnIndex-2].max
        cellContent = filters[columnIndex-2].isOn ? `[${min}, ${max}]` : ""
      }

      let filterRowCell = 
        <div class={cellClass} style={cellStyle}>
          {cellContent}
        </div>
      filterCells.push(filterRowCell)
    });

    let dom = 
      <div class="el-table-v2__header-row is-customized el-table-v2__dynamic-header-row" style="width: 100%; background: #222230;">
        { filterCells }
      </div>
    return dom
  }
})
// 点击V1表头触发排序的入口
const elTableV1Sort = (column) => {
  if(column.sortable) {
    let sortBy = {
      key: column.key,
    }
    onSort(sortBy)
  }
}
const filterSort = (sortBy) => {
  if(sortBy.key === '') { 
    sortBy.key = sortState.value.key
    sortBy.order = sortState.value.order
  }
  if(sortBy.order === 'desc') {
    processedData.value.sort((a, b) =>{
      if(a[sortBy.key] === '停牌') return 1
      if(b[sortBy.key] === '停牌') return -1
      return -(a[sortBy.key] - b[sortBy.key])
    });
  } else {
    processedData.value.sort((a, b) =>{
      if(a[sortBy.key] === '停牌') return -1
      if(b[sortBy.key] === '停牌') return 1
      return (a[sortBy.key] - b[sortBy.key])
    });
  }
  sortState.value = sortBy
}





// Filter 相关
const filterDropdown = ref()
let filters = defaultFiltersConfig
// 复制一份用于作为 筛选默认参数
const filtersDefault = structuredClone(filters)
// 复制一份用于作为 筛选面板设置参数展示
const filtersDisplay = ref(structuredClone(filters))
const isFilterOn = ref(false)
const triangleIconRotateDeg = ref(0)

// 筛选面板点击复位参数按钮
function resetFilter() {
  filtersDisplay.value = structuredClone(filtersDefault)
}
// 筛选面板点击确认按钮
function confirmFilter() {
  filters = structuredClone(toRaw(filtersDisplay.value))
  let tempStatus = false
  let firstKeyOn = ''
  filters.forEach(element => {
    if(firstKeyOn === '' && element.isOn) { firstKeyOn = element.key }
    tempStatus = element.isOn || tempStatus
  });
  // 表示是否有筛选项打开，用于是否打开头部的筛选行状态
  isFilterOn.value = tempStatus
  // 设置 V2 表格头部高度
  if(isFilterOn.value) {
    headerRowHeight.value = [50, 36]
  } else {
    headerRowHeight.value = [50]
  }
  // 执行筛选函数
  processedData.value = dataFiltering()

  const sortBy = {
    key: firstKeyOn,
    order: 'desc'
  }
  filterSort(sortBy)
  // 关闭面板
  filterDropdown.value.handleClose()
}
// 数据筛选执行函数
function dataFiltering() {
  let tempData = structuredClone(originalData)
  filters.forEach(element => {
    if(element.isOn) {
      // 留空即代表无限
      if(element.min === '') { element.min = -Infinity } else { element.min = Number(element.min) }
      if(element.max === '') { element.max = +Infinity } else { element.max = Number(element.max) }
      tempData = tempData.filter((stock) => {
        return (stock[element.key] >= element.min) && (stock[element.key] <= element.max)
      })
    }
  });
  return tempData
}
// 筛选面板展示/收起时执行
function filterPanelVisChange(visible) {
  // 设置三角形方向
  if (visible) {
    filtersDisplay.value = structuredClone(filters)
    triangleIconRotateDeg.value = 180
  } else {
    triangleIconRotateDeg.value = 0
  }
}


const viewPortHeight = ref(0)

// 控制表格动态高度
window.addEventListener('resize', resizeHandler)
function resizeHandler(e) {
  viewPortHeight.value = e.target.innerHeight
}
const tableHeight = computed(() => {
  // 64 是筛选栏高度 + 间距
  // 56 是分页高度 + 间距
  // 24 是上下各留空 12 px
  let tableHeight = 240
  if(tableData.value.length > 0) {
    const tableHeaderHeight = headerRowHeight.value.reduce((partialSum, a) => partialSum + a, 0) + 1
    tableHeight = Math.min((tableData.value.length * 49 + tableHeaderHeight), (viewPortHeight.value - 64 - 56 - 24))
  }
  
  return tableHeight
})

// 监听键盘按键事件
window.addEventListener('keydown', keydownHandler)
function keydownHandler(e) {
  if(document.activeElement === document.body && !showStockDialog.value) {
    if(e.code === 'ArrowRight') { 
      currentPage.value = Math.min(currentPage.value + 1, pageCount.value)
    }
    else if(e.code === 'ArrowLeft') { 
      currentPage.value = Math.max(1, currentPage.value - 1)
    }
  } else if(showStockDialog.value) {
    if(e.code === 'Escape') { 
      showStockDialog.value = false
    }
  }
}

const credits = ref([
  {
    "icon": "wechat",
    "name": "jer",
    "desc": "oasisFM",
    "link": "",
    "qrcode": ""
  },])

function creditClickHandler(c) {
  if(c.icon === 'wechat') {
    c.showClickStatus = true
    setTimeout(function() { c.showClickStatus = false }, 2500);
    navigator.clipboard.writeText(c.desc);
  } else {
    if(c.link != '') { window.open(c.link, '_blank') }
  }
}

onMounted(() => {
  viewPortHeight.value = window.innerHeight
})
</script>

<template>
  <Transition name="fade">
    <StockPopup v-model:visable="showStockDialog" :stock="dialogStock" v-if="showStockDialog"></StockPopup>
  </Transition>

  <header class="flex-h-center">
    <a href="/">
      <img src="/imgs/logo.svg" alt="logo">
    </a>
    <!-- <el-button type="primary" round @click="downloadXlsx">
      <download class="btn-icon" theme="outline" :strokeWidth="5"/>下载全表
    </el-button> -->
  </header>
  <div class="content-wrap content-margin">
    <div class="overview-wrap flex-h-center">
      <div class="overview" v-if="indexData.graphic_data">
        <div class="graphic">
          <IndexGraphic 
            :changePct="indexData.change_pct"
            :graphicData="indexData.graphic_data">
          </IndexGraphic>
        </div>
        <div class="graphic-text">
          <h4 class="index-title text-white-60">SSE COMPOSITE INDEX</h4>
          <span class="num-l" :class="{ red: indexData.change_pct>0, green: indexData.change_pct<0  }">{{ indexData.close.toFixed(2) }}</span>
          <span class="num-m" :class="{ red: indexData.change_pct>0, green: indexData.change_pct<0  }">{{ indexData.change_pct>0 ? '+' : '' }}{{ indexData.change_pct.toFixed(2) }}%</span>
        </div>
      </div>
      <div class="desc">
        <p class="update-time-text text-white-60">LAST UPDATE <span style="white-space: nowrap;">{{ lastUpdateDate }}</span></p>
        <DescriptionPopup />
      </div>
    </div>
    <div class="table-wrap" id="section-table">
      <div class="filter-wrap flex-h-center">
        <el-dropdown trigger="click" ref="filterDropdown" placement="bottom-start" @visible-change="filterPanelVisChange">
          <el-button size="large" type="primary" >
            <img class="btn-icon" src="/imgs/ic_filter_setting.svg" width="14"/>
            <span>筛选</span>
            <div class="drop-down-triangle" :style="{ 'transform': 'rotate(' + triangleIconRotateDeg + 'deg)' }">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.6784 9.01442C5.36506 9.51575 4.63494 9.51575 4.3216 9.01442L0.764999 3.32385C0.431975 2.79101 0.81505 2.09985 1.4434 2.09985L8.5566 2.09985C9.18495 2.09985 9.56802 2.79102 9.235 3.32385L5.6784 9.01442Z" fill="white"/>
              </svg>
            </div>
          </el-button>
          <template #dropdown>
            <div class="filter-panel">
              <ul class="filters-list">
                <li class="filter-item" v-for="filter in filtersDisplay">
                  <el-checkbox v-model="filter.isOn" label="" />
                  <div class="flex-h-center filter-cfg" :class="{ disabled: !filter.isOn, blue: filter.isOn }">
                    <el-input v-model="filter.min" :disabled="!filter.isOn" @focus="$event.target.select()" class="filter-input" type="number"/>
                    <span class="filter-text">≤</span>
                    <span class="filter-text title">{{ filter.name }}</span>
                    <span class="filter-text">≤</span>
                    <el-input v-model="filter.max" :disabled="!filter.isOn" @focus="$event.target.select()" class="filter-input" type="number"/>
                  </div>
                </li>
              </ul>
              <div class="filter-actions">
                <el-button round style="width: 72px;" @click="resetFilter">复位</el-button>
                <el-button round type="primary" style="width: 72px;" @click="confirmFilter">应用</el-button>
              </div>
            </div>
          </template>
        </el-dropdown>
        <el-autocomplete
          v-model="searchText"
          :fetch-suggestions="querySearch"
          :trigger-on-focus="false"
          ref="searchInputDiv"
          value-key="company_code"
          clearable
          size="large"
          :maxlength="6"
          :placeholder="searchInputPlaceholder"
          @select="handleSelect"
          @keyup.enter="handleEnter(searchInputDiv.suggestions)"
          style="width: 320px;"
        >
          <template #default="{ item }">
            <div v-if="item === -1">NO DATA</div>
            <div v-else>
              <span class="search-list-item-code">{{ item.company_code }}</span>
              <span class="search-list-item-abbr">{{ item.company_abbr }}</span>
            </div>
          </template>
        </el-autocomplete>
      </div>
      <div class="stock-table">
        <el-table :data="tableData" style="width: 100%" stripe
          ref="stockTableV1"
          :height="tableHeight"
          row-class-name="el-table-v1-row"
          header-row-class-name="el-table-v1-header">
          <el-table-column
            v-for="col in columns" 
            :prop="col.key"
            :label="col.title"
            :align="col.align"
            :fixed="col.fixed"
            :min-width="col.minWidth">
            <template #default="scope">
              <component :is="col.cellRendererV1(scope.row)"/>
            </template>
            <template #header="scope">
              <div>
                <div class="el-table-v1-header title-row" :class="{'sortable-header': col.sortable}"
                  :style="{ height: headerRowHeight[0]+'px', justifyContent: col.align === 'right' ? 'flex-end' : 'flex-start' }"
                  @click="elTableV1Sort(col)">
                  {{ scope.column.label }}
                  <div class="el-table-v1-sort" v-show="col.sortable && sortState.key === col.key" style="height: 16px;">
                    <div class="sort-icon" v-show="sortState.order === 'desc'">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none"><path fill="#fff" d="M8.416 9.148a.2.2 0 0 0-.156.325l3.584 4.48c.08.1.232.1.312 0l3.584-4.48a.2.2 0 0 0-.156-.325H12.89a.2.2 0 0 1-.2-.2V3.91a.2.2 0 0 0-.2-.2h-1.015a.2.2 0 0 0-.2.2v5.038a.2.2 0 0 1-.2.2H8.416Z"/><path fill="#fff" fill-rule="evenodd" d="M4 4.2c0-.11.09-.2.2-.2h2.6c.11 0 .2.09.2.2v.6a.2.2 0 0 1-.2.2H4.2a.2.2 0 0 1-.2-.2v-.6Zm0 3c0-.11.09-.2.2-.2h2.6c.11 0 .2.09.2.2v.6a.2.2 0 0 1-.2.2H4.2a.2.2 0 0 1-.2-.2v-.6Zm0 3c0-.11.09-.2.2-.2h2.6c.11 0 .2.09.2.2v.6a.2.2 0 0 1-.2.2H4.2a.2.2 0 0 1-.2-.2v-.6Z" clip-rule="evenodd"/></svg>
                    </div>
                    <div class="sort-icon" v-show="sortState.order === 'asc'">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none"><path fill="#fff" d="M15.584 7a.2.2 0 0 0 .156-.325l-3.584-4.48a.2.2 0 0 0-.312 0L8.26 6.675A.2.2 0 0 0 8.416 7h2.694c.11 0 .2.09.2.2v5.038c0 .11.09.2.2.2h1.015a.2.2 0 0 0 .2-.2V7.2c0-.11.09-.2.2-.2h2.659Z"/><path fill="#fff" fill-rule="evenodd" d="M4 5.2c0-.11.09-.2.2-.2h2.6c.11 0 .2.09.2.2v.6a.2.2 0 0 1-.2.2H4.2a.2.2 0 0 1-.2-.2v-.6Zm0 3c0-.11.09-.2.2-.2h2.6c.11 0 .2.09.2.2v.6a.2.2 0 0 1-.2.2H4.2a.2.2 0 0 1-.2-.2v-.6Zm0 3c0-.11.09-.2.2-.2h2.6c.11 0 .2.09.2.2v.6a.2.2 0 0 1-.2.2H4.2a.2.2 0 0 1-.2-.2v-.6Z" clip-rule="evenodd"/></svg>
                    </div>
                  </div>
                </div>
                <div class="el-table-v1-header filter-row" v-show="headerRowHeight.length > 1" :style="{height: headerRowHeight[1]+'px', justifyContent: col.align === 'right' ? 'flex-end' : 'flex-start'}">
                  <span class="filter-text" v-if="scope.column.no === 0">Filter ON</span>
                  <span class="filter-text" v-if="scope.column.no > 1 && filters[scope.column.no-2].isOn">
                    [{{ filters[scope.column.no-2].min === -Infinity ? '-∞' : filters[scope.column.no-2].min }},
                     {{ filters[scope.column.no-2].max === +Infinity ? '+∞' : filters[scope.column.no-2].max }}]
                  </span>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination-wrapper" style="display: flex; justify-content: end;">
        <el-pagination 
        background
        layout="total, sizes, prev, pager, next"
        v-model:current-page="currentPage"
        :total="processedData.length"
        v-model:page-size="pageSize"
        :page-sizes="[20, 50, 100]" />
      </div>
    </div>
  </div>
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

<style lang="scss">
.fade-enter-active, .fade-leave-active {
  transform: translateY(0);
  transition: all 0.4s cubic-bezier(.45,0,.25,1);
}
.fade-enter-from, .fade-leave-to {
  transform: translateY(20px);
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.4s cubic-bezier(.45,0,.25,1);
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(7px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-7px);
}

.overview-wrap {
  margin: 64px 0 32px 0;
  align-items: flex-end;
}
.index-title {
  font-size: 14px;
}
.graphic {
  width: 400px;
  position: absolute;
}
.graphic-text {
  z-index: 1;
  position: relative;
}
.desc {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-bottom: 5px;
  text-align: right;
  .update-time-text {
    font-size: 14px;
    font-weight: 500;
  }
  .desc-title {
    font-size: 32px;
    font-weight: 700;
  }
}

.stock-table {
  margin: 24px 0;
  border-radius: 8px;
  overflow: hidden;
  background-color: #1F2026;
  .el-table-v1-row {
    height: 48px;
  }
  
  .el-table th.el-table__cell {
    background: #242534;
  }
  thead {
    background-color: rgba(#2E3152, 0.3);
  }
  .el-table-v1-header {
    .sortable-header {
      cursor: pointer;
    }
    .sortable-header:hover {
      .el-table-v1-sort {
        display: block !important;
      }
    }
    .filter-row {
      // padding: 0;
      margin: 0 -12px;
      background: #212230;
      padding: 0 12px;
    }
    .filter-text {
      font-family: 'Consolas', sans-serif;
    }
  }
  .sort-icon {
    display: inline-block;
    width: 16px;
    height: 16px;
  }
  .change-cell {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-right: 12px;
    margin-right: -12px;
  }
}

.filter-panel {
  width: 352px;
  font-weight: 700;
  background-color: #363959;
  .disabled {
    opacity: .3;
  }
  .filter-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 10px 16px;
    box-sizing: border-box;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }
  .filter-cfg {
    flex: 1;
  }
  .filter-text {
    font-weight: 700;
    font-size: 14px;
    line-height: 16px;
  }
  .filter-input {
    width: 64px;
    input {
      text-align: center;
    }
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
    }
  }
  .title {
    width: 72px;
    text-align: center;
  }
  .filter-actions {
    display: flex;
    justify-content: end;
    padding: 12px 16px;
    background-color: #2C2E48;
  }
}
.search-list-item-code {
  margin-right: 8px;
}

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
