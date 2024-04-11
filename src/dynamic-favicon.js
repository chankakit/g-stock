export function dynamicFavicon(index_change_pct) {
  // console.log(index_change_pct)
  document.querySelector('link[rel="icon"]').href = index_change_pct < 0 ? '/favicn_green.png' : '/favicn_red.png'
}
