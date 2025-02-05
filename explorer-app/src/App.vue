<script setup lang="ts">
import { ref } from 'vue';
import FolderTree from './components/FolderTree.vue';
import SubfolderList from './components/SubfolderList.vue';

const selectedFolder = ref<number | null>(null);
const selectedSubfolder = ref<number | null>(null);

const updateSelectedFolder = (folder: { id_folder: number; name_folder: string }) => {
  selectedFolder.value = folder.id_folder;
  selectedSubfolder.value = null; // Reset the selected subfolder when a new folder is selected
};

const updateSelectedSubfolder = (subfolder: { id_subfolder: number; name_subfolder: string }) => {
  selectedSubfolder.value = subfolder.id_subfolder;
};
</script>

<template>
  <div class="container">
    <div class="main-panel">
      <FolderTree 
        @folderSelected="updateSelectedFolder" 
        @subfolderSelected="updateSelectedSubfolder"
      />
      <SubfolderList 
        :selectedFolder="selectedFolder" 
        :selectedSubfolder="selectedSubfolder" 
      />
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.main-panel {
  display: flex;
  flex-grow: 1;
}
</style>
