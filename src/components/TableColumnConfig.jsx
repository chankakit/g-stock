// 列设置
// rps 列宽度
const rpsColumnWidth = 100
// rps 高亮阈值
const highlightThreshold = 87

// 单数组的单元格自定义渲染函数
function singleNumCellDom(data, highlightValue=null, decimalPoint=2) {
  let domClass = 'cell-main-text'
  if(highlightValue) {
    domClass = domClass + (data>=highlightValue ? ' highlight' : '')
  }
  let dom = <div class={domClass}>{ data.toFixed(decimalPoint) }</div>
  return dom
}

export const columnsLeft = [
  {
    "dataKey": "stock",
    "key": "stock",
    "title": "股票",
    "width": 100,
    "minWidth": 98,
    "align": "left",
    "flexGrow": 1,
    "fixed": true,
    "cellRendererV1": (rowData) => {
      let dom = 
      <div style={"cursor: pointer;"}>
        <div class='cell-main-text'>{ rowData.company_abbr }</div>
        <div class='cell-tip-text' style='opacity: .5; text-transform: uppercase;'>{ rowData.company_code }.{ (rowData.bk).substring(0,2) }</div>
      </div>
      return dom
    }
  },
  {
    "dataKey": "close",
    "key": "close",
    "title": "收盘",
    "width": 100,
    "align": "right",
    "fixed": false,
    "cellRendererV1": (rowData) => <div class='cell-main-text'>{ rowData.close === '停牌' ? '停牌' : rowData.close.toFixed(2) }</div>,
  },
]

// 该数组需要跟 FilterConfig.js 文件里的 
// defaultFiltersConfig 一致顺序和长度
export const columnsCanFilter = [
  {
    "dataKey": "change_pct",
    "key": "change_pct",
    "title": "涨跌",
    "subTitle": "涨跌额",
    "width": 100,
    "minWidth": 90,
    "align": "right",
    "flexGrow": 1,
    "sortable": true,
    "fixed": false,
    "headerCellRenderer": ({ column }) => 
      <div>
        <div class="el-table-v2__header-cell-text">{column.title}</div>
        <div class="el-table-v2__header-cell-sub-title">{column.subTitle}</div>
      </div>,
     "cellRendererV1": (rowData) => {
        let domClass = 'change-cell '
        if(rowData.change_pct === '停牌') {
          domClass = domClass + 'cell-main-text'
          let dom = <div class={domClass}>{ rowData.change_pct }</div>
          return dom
        } else {
          if(rowData.change_pct>0) { domClass += 'red' }
          else if(rowData.change_pct<0) { domClass += 'green' }
          let sign = rowData.change_pct>0 ? '+' : ''
          let cellBgColor = 'rgba(0, 0, 0, 0);'
          if(rowData.change_pct>5) { cellBgColor = 'rgba(255, 41, 59, 0.06);' }
          let cellStyle = 'background-color: ' + cellBgColor + 'height: 48px;'
          let dom = 
          <div class={domClass} style={cellStyle}>
            <div class='cell-main-text'>{ sign }{ rowData.change_pct.toFixed(2) }%</div>
            <div class='cell-tip-text'>{ sign }{ rowData.change_abs.toFixed(2) }</div>
          </div>
          return dom
        }
     }
  },
  {
    "dataKey": "m10_offset_pct",
    "key": "m10_offset_pct",
    "title": "M10 偏离",
    "subTitle": "M10",
    "width": 100,
    "minWidth": 90,
    "align": "right",
    "flexGrow": 1,
    "sortable": true,
    "fixed": false,
    "headerCellRenderer": ({ column }) => 
      <div>
        <div class="el-table-v2__header-cell-text">{column.title}</div>
        <div class="el-table-v2__header-cell-sub-title">{column.subTitle}</div>
      </div>,
     "cellRendererV1": (rowData) => {
        let domClass = 'change-cell '
        if(rowData.m10_offset_pct === '停牌') {
          domClass = domClass + 'cell-main-text'
          let dom = <div class={domClass}>{ rowData.m10_offset_pct }</div>
          return dom
        } else {
          if(rowData.m10_offset_pct>0) { domClass += 'red' }
          else if(rowData.m10_offset_pct<0) { domClass += 'green' }
          let sign = rowData.m10_offset_pct>0 ? '+' : ''
          let cellBgColor = 'rgba(0, 0, 0, 0);'
          if(rowData.m10_offset_pct>5) { cellBgColor = 'rgba(255, 41, 59, 0.06);' }
          let cellStyle = 'background-color: ' + cellBgColor + 'height: 48px;'
          let dom = 
          <div class={domClass} style={cellStyle}>
            <div class='cell-main-text'>{ sign }{ rowData.m10_offset_pct.toFixed(2) }%</div>
            <div class='cell-tip-text' style="opacity: .9;" >{ rowData.m10.toFixed(2) } ({rowData.m10_offset_pct > 0 ?  '+' : ''}{(rowData.m10 * rowData.m10_offset_pct / 100).toFixed(2)})</div>
          </div>
          return dom
        }
     }
  },
  {
    "dataKey": "rvol",
    "key": "rvol",
    "title": "量比",
    "sortable": true,
    "width": 90,
    "align": "right",
    "flexGrow": 1,
    "fixed": false,
    // "headerCellRenderer": ({ column }) => <div class="el-table-v2__header-cell-text custom-cell" style="border-right: 1.5px solid rgba(0,0,0,.2);">{column.title}</div>,
    "cellRendererV1": (rowData) => {
      let domClass = 'cell-main-text '
      if(rowData.rvol === '停牌') {
        let dom = <div class={domClass}>{ rowData.rvol }</div>
        return dom
      } else {
        domClass = domClass + (rowData.rvol>=2.5 ? ' highlight' : '')
        let dom = <div class={domClass}>{ rowData.rvol.toFixed(2) }</div>
        return dom
      }
    },
  },
  {
    "dataKey": "rps_250",
    "key": "rps_250",
    "title": "RPS 250",
    "sortable": true,
    "width": rpsColumnWidth,
    "align": "right",
    "flexGrow": 1,
    "fixed": false,
    "cellRendererV1": (rowData) => singleNumCellDom(rowData['rps_250'], highlightThreshold, 1)
  },
  {
    "dataKey": "rps_120",
    "key": "rps_120",
    "title": "RPS 120",
    "sortable": true,
    "width": rpsColumnWidth,
    "align": "right",
    "flexGrow": 1,
    "fixed": false,
    "cellRendererV1": (rowData) => singleNumCellDom(rowData['rps_120'], highlightThreshold, 1)
  },
  {
    "dataKey": "rps_60",
    "key": "rps_60",
    "title": "RPS 60",
    "sortable": true,
    "width": rpsColumnWidth,
    "align": "right",
    "flexGrow": 1,
    "fixed": false,
    "cellRendererV1": (rowData) => singleNumCellDom(rowData['rps_60'], highlightThreshold, 1),
  },
  {
    "dataKey": "rps_20",
    "key": "rps_20",
    "title": "RPS 20",
    "sortable": true,
    "width": rpsColumnWidth,
    "align": "right",
    "flexGrow": 1,
    "fixed": false,
    "cellRendererV1": (rowData) => singleNumCellDom(rowData['rps_20'], highlightThreshold, 1),
  },
  {
    "dataKey": "rps_10",
    "key": "rps_10",
    "title": "RPS 10",
    "sortable": true,
    "width": rpsColumnWidth,
    "align": "right",
    "flexGrow": 1,
    "fixed": false,
    "cellRendererV1": (rowData) => singleNumCellDom(rowData['rps_10'], highlightThreshold, 1),
  },
   /*{
    "dataKey": "rps_5",
    "key": "rps_5",
    "title": "RPS 5",
    "sortable": true,
    "width": rpsColumnWidth,
    "align": "right",
    "flexGrow": 1,
    "fixed": false,
    "cellRendererV1": (rowData) => singleNumCellDom(rowData['rps_5'], highlightThreshold, 1),
  }, */
  {
    "dataKey": "rps_mean",
    "key": "rps_mean",
    "title": "强度均值",
    "sortable": true,
    "width": rpsColumnWidth,
    "align": "right",
    "flexGrow": 1,
    "fixed": false,
    "cellRendererV1": (rowData) => singleNumCellDom(rowData['rps_mean'], highlightThreshold, 1),
  },
]

export const columnsRight = [
  {
    "dataKey": "g_stock",
    "key": "g_stock",
    "title": "金股",
    "sortable": true,
    "sortOrderBy": ['🎯 金股', '⭐️ 优选', '谨慎', '潜力', '-'],
    "width": rpsColumnWidth,
    "align": "right",
    "flexGrow": 1,
    "fixed": false,
    "cellRendererV1":  (rowData) => {
      let dom = 
      <div style={"cursor: pointer;"}>
        <div class='cell-main-text'>{ rowData.g_stock }</div>
      </div>
      return dom
    },
  },
]
