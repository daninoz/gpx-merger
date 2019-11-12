<template>
  <div class="container">
    <button class="btn blue">
      <i class="material-icons">file_upload</i>
      Add a gpx file
    </button>
    <input
      id="upload"
      type="file"
      @change="onFileChange"
    >
  </div>
</template>

<script>
export default {
  name: 'FileUploader',
  data() {
    return {
      file: '',
      image: null
    }
  },
  methods: {
    onFileChange(e) {
      const files = e.target.files || e.dataTransfer.files;
      if (!files.length)
        return;
      this.createImage(files[0]);
    },
    createImage(file) {
      var reader = new FileReader();

      reader.onload = (e) => {
        this.$store.commit('set-force-fit-bounds', true)
        this.$store.commit('add-route', e.target.result)
        document.getElementById("upload").value = "";
      };
      reader.readAsText(file);
    }
  }
}
</script>

<style lang="scss" scoped>
  .container {
    width: auto;
    margin: 1em;
    position: relative;
    overflow: hidden;
    display: inline-block;

    .btn {
      display: flex;
      align-items: center;

      i {
        margin-right: 0.5em;
      }
    }

    input[type=file] {
      font-size: 100px;
      position: absolute;
      left: 0;
      top: 0;
      opacity: 0;
    }
  }
</style>