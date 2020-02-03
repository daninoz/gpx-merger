<template>
  <div class="list-container">
    <ul>
      <li v-for="(route, index) in routes" :key="index">
        <div class="header">
          <h5 :style="{ color: route.color }" @click="$store.commit('set-active-route', index)">
            <span v-if="route.gpx.metadata[0].name">{{ route.gpx.metadata[0].name[0] }}</span>
            <span v-else>Unnamed</span>
          </h5>
          <div>
            <button class="btn-small purple" @click="$store.dispatch('reverse', index)">Reverse</button>
            <button class="btn-small lime" @click="$store.commit('duplicate', index)">Duplicate</button>
            <button class="btn-small cyan" @click="$store.dispatch('join', index)">Join Down</button>
            <button class="btn-small red darken-1" @click="$store.dispatch('remove', index)">Delete</button>
            <button
              v-if="index > 0"
              class="btn-small amber lighten-2"
              @click="$store.dispatch('move-up', index)"
            >Move Up</button>
            <button
              v-if="index < routes.length - 1"
              class="btn-small amber darken-2"
              @click="$store.dispatch('move-down', index)"
            >Move Down</button>
            <button class="btn-small green" @click="exportRoute(index)">Export</button>
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
      const metadata = this.$store.state.routes[index].gpx.metadata[0];
      const routeName = metadata.name ? metadata.name[0] : "untitled";

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
  overflow-x: scroll;
  margin: 1em;
  flex-shrink: 0;

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

  h5 {
    cursor: pointer;
    margin-right: 1em;
  }

  button {
    margin-left: 0.5em;
  }
}

.list {
  width: 100%;
  padding: 0;
  margin: 0;
}
</style>