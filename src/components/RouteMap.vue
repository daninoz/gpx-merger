<template>
  <div class="map">
    <l-map ref="map" :zoom="zoom" :center="center">
      <l-marker v-if="$store.state.activePoint" :lat-lng="$store.state.activePoint.coordinates" />
      <l-tile-layer :url="url" />
    </l-map>
  </div>
</template>

<script>
import L from "leaflet";
import "leaflet-gpx";
import { LMap, LTileLayer, LMarker } from "vue2-leaflet";
import { mapGetters } from "vuex";

export default {
  name: "RouteMap",
  components: {
    LMap,
    LTileLayer,
    LMarker
  },
  data() {
    return {
      url: "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
      zoom: 3,
      center: [47.41322, -1.219482],
      bounds: null,
      waypoints: [],
      overlays: [],
      mapBounds: []
    };
  },
  computed: {
    ...mapGetters(["routeStrings"])
  },
  watch: {
    routeStrings() {
      if (this.routeStrings.length) {
        const { mapObject } = this.$refs.map;

        if (this.overlays.length) {
          this.overlays.forEach(overlay => {
            mapObject.removeLayer(overlay);
          });
          this.overlays = [];
          this.mapBounds = [];
        }

        this.routeStrings.forEach((gpxString, index) => {
          this.overlays.push(
            new L.GPX(gpxString, {
              async: true,
              polyline_options: {
                color: this.$store.state.routes[index].color
              }
            })
              .on("loaded", e => {
                this.mapBounds.push(e.target.getBounds());
                if (
                  this.$store.state.forceFitBounds &&
                  this.mapBounds.length == this.routeStrings.length
                ) {
                  setTimeout(() => {
                    mapObject.fitBounds(this.mapBounds);
                    this.$store.commit("set-force-fit-bounds", false);
                  }, 1000);
                }
              })
              .addTo(mapObject)
          );
        });
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.map {
  flex-grow: 1;
  height: 100%;
}
</style>
