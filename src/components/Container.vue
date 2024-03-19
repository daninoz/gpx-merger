<template>
  <div class="list-container">
    <ul>
      <li v-for="(route, index) in routes" :key="index">
        <div class="header">
          <h5 :style="{ color: route.color }" @click="$store.commit('set-active-route', index)">
            <span v-if="route.gpx && route.gpx.metadata && route.gpx.metadata[0].name">{{ route.gpx.metadata[0].name[0]
              }}</span>
            <span v-else>Unnamed</span>
          </h5>
          <div>
            <button v-if="index < routes.length - 1" class="btn-small cyan" @click="$store.dispatch('join', index)" title="Merge with Track Below">
              <iconify-icon icon="ic:call-merge" width="22" height="22" rotate="180deg"></iconify-icon>
            </button>
            <button v-if="index > 0" class="btn-small amber lighten-2" @click="$store.dispatch('move-up', index)" title="Move Up">
              <iconify-icon icon="ic:arrow-upward" width="22" height="22"></iconify-icon>
            </button>
            <button v-if="index < routes.length - 1" class="btn-small amber darken-2" @click="$store.dispatch('move-down', index)" title="Move Down">
              <iconify-icon icon="ic:arrow-downward" width="22" height="22"></iconify-icon>
            </button>
            <button class="btn-small purple" @click="$store.dispatch('reverse', index)" title="Reverse Track">
              <iconify-icon icon="ic:loop" width="22" height="22"></iconify-icon>
            </button>
            <button class="btn-small lime" @click="$store.commit('duplicate', index)" title="Duplicate Track">
              <iconify-icon icon="ic:content-copy" width="22" height="22"></iconify-icon>
            </button>
            <button class="btn-small red darken-1" @click="$store.dispatch('remove', index)" title="Delete">
              <iconify-icon icon="ic:delete" width="22" height="22"></iconify-icon>
            </button>
            <button class="btn-small green" @click="exportRoute(index)" title="Export GPX">
              <iconify-icon icon="ic:file-download" width="22" height="22"></iconify-icon>
            </button>
          </div>
        </div>
        <list :index="index" :route="route" class="list" />
      </li>
    </ul>
    <file-uploader />
  </div>
</template>

<script>
import FileSaver from "file-saver";

import List from "@/components/List";
import FileUploader from "@/components/FileUploader";

export default {
  name: "Container",
  components: {
    List,
    FileUploader
  },
  props: {
    routes: {
      type: Array,
      required: true
    }
  },
  methods: {
    exportRoute(index) {
      let metadata;
      let routeName = "untitled";

      if (this.$store.state.routes[index].gpx.metadata) {
        metadata = this.$store.state.routes[index].gpx.metadata[0];
        routeName = metadata.name ? metadata.name[0] : "untitled";
      }

      const blob = new Blob([this.$store.getters.routeStrings[index]], {
        type: "text/plain;charset=utf-8"
      });

      FileSaver.saveAs(blob, `${routeName}.gpx`);
    }
  }
};
</script>

<style scoped lang='scss'>
.list-container {
  margin: 1em;
  flex-shrink: 0;
  overflow-y: auto;
  scrollbar-gutter: stable;

  li:last-of-type .collection {
    border-bottom: 1px solid #e0e0e0;
  }
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1em;
  border-left: 1px solid #e0e0e0;
  border-right: 1px solid #e0e0e0;
  border-top: 1px solid #e0e0e0;
  width: 29vw;

  h5 {
    cursor: pointer;
    margin-right: 1em;
    width: 12vw;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  > div {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5em;
  }

  button {
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: none;
  }
}

.list {
  width: 100%;
  padding: 0;
  margin: 0;
}
</style>