import Vue from 'vue'
import Vuex from 'vuex'

import helper from '@/helpers/helper'
import { cloneDeep } from 'lodash'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    routes: [],
    activePoint: null,
    activeRoute: -1,
    forceFitBounds: false,
  },
  mutations: {
    ['add-route'](state, file) {
      helper.convertRoutetoHash(file, (err, route) => {
        if (!err) {
          state.routes.push(route)
        }
      })
    },
    
    ['delete-point'](state, payload) {
      state.routes[payload.routeIndex].gpx.trk[0].trkseg[0].trkpt.splice(payload.pointIndex, 1)
    },

    ['delete-after-point'](state, payload) {
      const total = state.routes[payload.routeIndex].gpx.trk[0].trkseg[0].trkpt.length
      state.routes[payload.routeIndex].gpx.trk[0].trkseg[0].trkpt.splice(payload.pointIndex + 1, total - payload.pointIndex)
    },

    ['delete-before-point'](state, payload) {
      state.routes[payload.routeIndex].gpx.trk[0].trkseg[0].trkpt.splice(0, payload.pointIndex)
    },

    ['split'](state, payload) {
      const total = state.routes[payload.routeIndex].gpx.trk[0].trkseg[0].trkpt.length
      const routeB = cloneDeep(state.routes[payload.routeIndex])
      
      state.routes[payload.routeIndex].gpx.trk[0].trkseg[0].trkpt.splice(payload.pointIndex, total - payload.pointIndex)
      routeB.gpx.trk[0].trkseg[0].trkpt.splice(0, payload.pointIndex)

      state.routes.splice(payload.routeIndex + 1, 0, routeB)
    },

    ['reverse'](state, routeIndex) {
      state.routes[routeIndex].gpx.trk[0].trkseg[0].trkpt.reverse()
    },

    ['remove'](state, routeIndex) {
      state.routes.splice(routeIndex, 1)
    },

    ['join'](state, routeIndex) {
      const gpxA = state.routes[routeIndex]
      const gpxBPoints = state.routes[routeIndex + 1].gpx.trk[0].trkseg[0].trkpt

      gpxA.gpx.trk[0].trkseg[0].trkpt.push(...gpxBPoints)

      state.routes.splice(routeIndex, 2, gpxA)
    },

    ['duplicate'](state, routeIndex) {
      const routeB = cloneDeep(state.routes[routeIndex])

      state.routes.splice(routeIndex, 0, routeB)
    },

    ['move-up'](state, routeIndex) {
      const route = state.routes[routeIndex]

      state.routes.splice(routeIndex, 1)
      state.routes.splice(routeIndex - 1, 0, route)
    },

    ['move-down'](state, routeIndex) {
      const route = state.routes[routeIndex]

      state.routes.splice(routeIndex, 1)
      state.routes.splice(routeIndex + 1, 0, route)
    },

    ['set-active-point'](state, point) {
      state.activePoint = point
    },

    ['set-active-route'](state, index) {
      if (state.activeRoute === index) {
        state.activeRoute = -1
      } else {
        state.activeRoute = index
      }
    },

    ['force-active-route'](state, index) {
      state.activeRoute = index
    },

    ['go-prev-point'](state) {
      if (!state.activePoint) return

      const activeRouteIndex = state.activePoint.routeIndex
      const activePointIndex = state.activePoint.pointIndex
      const nextPoint = {}
      

      if (activePointIndex > 0) {
        nextPoint.routeIndex = activeRouteIndex
        nextPoint.pointIndex = activePointIndex - 1
        nextPoint.coordinates = [
          state.routes[activeRouteIndex].gpx.trk[0].trkseg[0].trkpt[activePointIndex - 1].$.lat,
          state.routes[activeRouteIndex].gpx.trk[0].trkseg[0].trkpt[activePointIndex - 1].$.lon
        ]
      } else if (activeRouteIndex > 0) {
        const prevRouteLastPoint = state.routes[activeRouteIndex - 1].gpx.trk[0].trkseg[0].trkpt.length - 1
        nextPoint.routeIndex = activeRouteIndex - 1
        nextPoint.pointIndex = prevRouteLastPoint
        nextPoint.coordinates = [
          state.routes[activeRouteIndex - 1].gpx.trk[0].trkseg[0].trkpt[prevRouteLastPoint].$.lat,
          state.routes[activeRouteIndex - 1].gpx.trk[0].trkseg[0].trkpt[prevRouteLastPoint].$.lon
        ]
        state.activeRoute = activeRouteIndex - 1
      } else {
        return
      }

      state.activePoint = nextPoint
    },

    ['go-next-point'](state) {
      if (!state.activePoint) return

      const activeRouteIndex = state.activePoint.routeIndex
      const activePointIndex = state.activePoint.pointIndex
      const totalRoutes = state.routes.length
      const activeRouteTotalPoints = state.routes[activeRouteIndex].gpx.trk[0].trkseg[0].trkpt.length
      const nextPoint = {}
      

      if (activePointIndex < activeRouteTotalPoints - 1) {
        nextPoint.routeIndex = activeRouteIndex
        nextPoint.pointIndex = activePointIndex + 1
        nextPoint.coordinates = [
          state.routes[activeRouteIndex].gpx.trk[0].trkseg[0].trkpt[activePointIndex + 1].$.lat,
          state.routes[activeRouteIndex].gpx.trk[0].trkseg[0].trkpt[activePointIndex + 1].$.lon
        ]
      } else if (activeRouteIndex < totalRoutes - 1) {
        nextPoint.routeIndex = activeRouteIndex + 1
        nextPoint.pointIndex = 0
        nextPoint.coordinates = [
          state.routes[activeRouteIndex + 1].gpx.trk[0].trkseg[0].trkpt[0].$.lat,
          state.routes[activeRouteIndex + 1].gpx.trk[0].trkseg[0].trkpt[0].$.lon
        ]
        state.activeRoute = activeRouteIndex + 1
      } else {
        return
      }

      state.activePoint = nextPoint
    },

    ['go-current-point'](state) {
      if (!state.activePoint) return

      const activeRouteIndex = state.activePoint.routeIndex
      const activePointIndex = state.activePoint.pointIndex

      state.activePoint = {
        routeIndex: activeRouteIndex,
        pointIndex: activePointIndex,
        coordinates: [
          state.routes[activeRouteIndex].gpx.trk[0].trkseg[0].trkpt[activePointIndex].$.lat,
          state.routes[activeRouteIndex].gpx.trk[0].trkseg[0].trkpt[activePointIndex].$.lon
        ]
      }
    },

    ['go-first-point'](state) {
      const activeRouteIndex = state.activePoint.routeIndex

      state.activePoint = {
        routeIndex: activeRouteIndex,
        pointIndex: 0,
        coordinates: [
          state.routes[activeRouteIndex].gpx.trk[0].trkseg[0].trkpt[0].$.lat,
          state.routes[activeRouteIndex].gpx.trk[0].trkseg[0].trkpt[0].$.lon
        ]
      }
    },

    ['go-last-point'](state) {
      const activeRouteIndex = state.activePoint.routeIndex
      const activeRouteTotalPoints = state.routes[activeRouteIndex].gpx.trk[0].trkseg[0].trkpt.length

      state.activePoint = {
        routeIndex: activeRouteIndex,
        pointIndex: activeRouteTotalPoints - 1,
        coordinates: [
          state.routes[activeRouteIndex].gpx.trk[0].trkseg[0].trkpt[activeRouteTotalPoints - 1].$.lat,
          state.routes[activeRouteIndex].gpx.trk[0].trkseg[0].trkpt[activeRouteTotalPoints - 1].$.lon
        ]
      }
    },

    ['go-next-route'](state) {
      const nextRouteIndex = state.activePoint.routeIndex + 1

      state.activePoint = {
        routeIndex: nextRouteIndex,
        pointIndex: 0,
        coordinates: [
          state.routes[nextRouteIndex].gpx.trk[0].trkseg[0].trkpt[0].$.lat,
          state.routes[nextRouteIndex].gpx.trk[0].trkseg[0].trkpt[0].$.lon
        ]
      }
    },

    ['invert-active-point'](state) {
      const activeRouteIndex = state.activePoint.routeIndex
      const activeRouteTotalPoints = state.routes[activeRouteIndex].gpx.trk[0].trkseg[0].trkpt.length

      state.activePoint = {
        routeIndex: activeRouteIndex,
        pointIndex: activeRouteTotalPoints - state.activePoint.pointIndex - 1,
        coordinates: state.activePoint.coordinates
      }
    },

    ['set-force-fit-bounds'](state, payload) {
      state.forceFitBounds = payload;
    },
  },
  actions: {    
    ['delete-point']({ commit, state }, payload) {
      const totalRoutePoints = state.routes[payload.routeIndex].gpx.trk[0].trkseg[0].trkpt.length

      commit('delete-point', payload);

      if (payload.pointIndex === totalRoutePoints - 1) {
        commit('go-prev-point');
      } else {
        commit('go-current-point');
      }
    },
    ['delete-before-point']({ commit }, payload) {
      commit('delete-before-point', payload);
      commit('go-first-point');
    },
    ['delete-after-point']({ commit }, payload) {
      commit('delete-after-point', payload);
      commit('go-last-point');
    },
    ['split']({ commit, state }, payload) {
      commit('split', payload);
      commit('go-next-route');
      commit('set-active-route', state.activeRoute + 1);
    },
    ['reverse']({ commit, state }, payload) {
      commit('reverse', payload);

      if (state.activePoint && state.activePoint.routeIndex == payload) {
        commit('invert-active-point');
      }
    },
    ['join']({ commit, state }, payload) {
      const totalRoutePoints = state.routes[payload].gpx.trk[0].trkseg[0].trkpt.length

      commit('join', payload);

      if (state.activePoint && state.activePoint.routeIndex == payload + 1) {
        let newPoint = {
          routeIndex: payload,
          pointIndex: totalRoutePoints + state.activePoint.pointIndex,
          coordinates: state.activePoint.coordinates
        }

        commit('set-active-point', newPoint);
        commit('force-active-route', payload);
      }
    },
    ['remove']({ commit, state }, payload) {

      if (state.activePoint && payload === state.activePoint.routeIndex) {
        commit('force-active-route', -1);
        commit('set-active-point', null);
        commit('set-force-fit-bounds', true)
      }

      commit('remove', payload);
    },
    ['move-up']({commit, state}, payload) {
      commit('move-up', payload)

      let newPoint = {
        pointIndex: state.activePoint.pointIndex,
        coordinates: state.activePoint.coordinates
      }

      if (state.activePoint.routeIndex === payload) {
        newPoint.routeIndex = payload - 1;

        commit('set-active-point', newPoint);
      } else if (state.activePoint.routeIndex === payload - 1) {
        newPoint.routeIndex = payload;

        commit('set-active-point', newPoint);
      }

      if (state.activeRoute === payload) {
        commit('force-active-route', payload - 1)
      } else if (state.activeRoute === payload - 1) {
        commit('force-active-route', payload)
      }
    },
    ['move-down']({commit, state}, payload) {
      commit('move-down', payload)

      let newPoint = {
        pointIndex: state.activePoint.pointIndex,
        coordinates: state.activePoint.coordinates
      }

      if (state.activePoint.routeIndex === payload) {
        newPoint.routeIndex = payload + 1;

        commit('set-active-point', newPoint);
      } else if (state.activePoint.routeIndex === payload + 1) {
        newPoint.routeIndex = payload;

        commit('set-active-point', newPoint);
      }

      if (state.activeRoute === payload) {
        commit('force-active-route', payload + 1)
      } else if (state.activeRoute === payload + 1) {
        commit('force-active-route', payload)
      }
    }
  },
  getters: {
    routeStrings(state) {
      return state.routes.map((route) => {
        return helper.convertHashToRoute(route)
      })
    }
  }
});