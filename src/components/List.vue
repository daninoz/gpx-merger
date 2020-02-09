<template>
  <ul class="collection" :class="{ active: $store.state.activeRoute === index }">
    <li
      v-for="(point, pointIndex) in points"
      :key="pointIndex"
      tabindex="0"
      class="collection-item"
      :class="{ active: 
        $store.state.activePoint &&
        $store.state.activePoint.routeIndex === index &&
        $store.state.activePoint.pointIndex === pointIndex }"
      @click="setActivePoint(point.$.lat, point.$.lon, pointIndex)"
      @keyup.down.prevent="$store.commit('go-next-point')"
      @keyup.up.prevent="$store.commit('go-prev-point')"
      @keyup.delete.prevent="deletePoint(pointIndex)"
    >
      Point number: {{ pointIndex }}
      <div
        v-if="$store.state.activePoint &&
          $store.state.activePoint.routeIndex === index &&
          $store.state.activePoint.pointIndex === pointIndex"
      >
        <button
          v-if="pointIndex > 0"
          class="btn-small light-blue"
          @click.stop="deleteBeforePoint(pointIndex)"
        >Start Here</button>
        <button
          v-if="pointIndex < points.length - 1"
          class="btn-small indigo"
          @click.stop="deleteAfterPoint(pointIndex)"
        >End Here</button>
        <button
          v-if="points.length > 0 && pointIndex > 0"
          class="btn-small blue"
          @click.stop="split(pointIndex)"
        >Split Here</button>
        <button
          v-if="points.length > 0"
          class="btn-small red"
          @click.stop="deletePoint(pointIndex)"
        >Delete</button>
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  name: "List",
  props: {
    index: {
      type: Number,
      required: true
    },
    route: {
      type: Object,
      required: true
    }
  },
  computed: {
    points() {
      return this.route.gpx.trk[0].trkseg[0].trkpt;
    }
  },
  methods: {
    deletePoint(pointIndex) {
      this.$store.dispatch("delete-point", {
        pointIndex,
        routeIndex: this.index
      });
    },

    deleteAfterPoint(pointIndex) {
      this.$store.dispatch("delete-after-point", {
        pointIndex,
        routeIndex: this.index
      });
    },

    deleteBeforePoint(pointIndex) {
      this.$store.dispatch("delete-before-point", {
        pointIndex,
        routeIndex: this.index
      });
    },

    split(pointIndex) {
      this.$store.dispatch("split", { pointIndex, routeIndex: this.index });
    },

    setActivePoint(lat, lon, index) {
      this.$store.commit("set-active-point", {
        pointIndex: index,
        routeIndex: this.index,
        coordinates: [lat, lon]
      });
    }
  }
};
</script>

<style scoped lang="scss">
.collection {
  height: 0;
  border: 0;

  &.active {
    height: auto;
    border: 1px solid #e0e0e0;
  }
}

li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;

  &:focus {
    outline: 0;
  }

  > div {
    flex-shrink: 0;
  }

  button {
    margin-left: 0.5em;
    cursor: default;
  }
}
</style>
