// 筛选参数
export const defaultFiltersConfig = [
    {
      isOn: false,
      name: "涨跌幅%",
      key: "change_pct",
      min: '',
      max: ''
    },
    {
      isOn: false,
      name: "M10偏离量",
      key: "m10_offset_pct",
      min: '',
      max: ''
    },
    {
      isOn: false,
      name: "量比",
      key: "rvol",
      min: 0,
      max: ''
    },
    {
      isOn: false,
      name: "RPS_250",
      key: "rps_250",
      min: 0,
      max: 100
    },
    {
      isOn: false,
      name: "RPS_120",
      key: "rps_120",
      min: 0,
      max: 100
    },
    {
      isOn: false,
      name: "RPS_60",
      key: "rps_60",
      min: 0,
      max: 100
    },
    {
      isOn: false,
      name: "RPS_20",
      key: "rps_20",
      min: 0,
      max: 100
    },
    {
      isOn: false,
      name: "RPS_10",
      key: "rps_10",
      min: 0,
      max: 100
    },
    /*{
      isOn: false,
      name: "RPS_5",
      key: "rps_5",
      min: 0,
      max: 100
    },*/
    {
      isOn: false,
      name: "强度均值",
      key: "rps_mean",
      min: 0,
      max: 100
    }
  ]