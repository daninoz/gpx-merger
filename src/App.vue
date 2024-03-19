<template>
  <div id="app">
    <container :routes="this.$store.state.routes" />
    <route-map />
  </div>
</template>

<script>
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";

import Container from "@/components/Container";
import RouteMap from "@/components/RouteMap";

delete Icon.Default.prototype._getIconUrl;

Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png")
});

export default {
  name: "App",
  components: {
    Container,
    RouteMap
  },
  data() {
    return {
      files: []
    };
  }
};
</script>

<style>
body {
  width: 100%;
  height: 100vh;
  margin: 0;
}

#app {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
  overflow: hidden;
}
</style>
