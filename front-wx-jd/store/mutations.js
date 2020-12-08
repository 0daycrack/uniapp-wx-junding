import * as types from './mutations_type.js'
export default {
  [types.SET_SELECTED_LOCATION] (state, data) {
    state.selectedLocation = data
  },
  [types.SET_SELECTED_SEARCH] (state, data) {
    state.selectedSearch = data
  }
}
