import Vue from 'vue'
import Vuex from 'vuex'

import home from './modules/home'
import movie from './modules/movie'
import read from './modules/read'
import weather from './modules/weather'
import getters from './getters'
import actions from './actions'
import mutations from './mutations'
import state from './state'
// import music from './modules/music'

Vue.use(Vuex)

const store = new Vuex.Store({
	getters,
	actions,
	mutations,
	state,
  modules: {
    home: {
      namespaced: true,
      ...home
    },
    movie: {
      namespaced: true,
      ...movie
    },
    read: {
      namespaced: true,
      ...read
    },
    weather: {
      namespaced: true,
      ...weather
    }
  }
})

export default store
