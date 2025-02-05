<script setup lang="ts">
import { ref } from 'vue';
import FolderTree from './components/FolderTree.vue';
import SubfolderList from './components/SubfolderList.vue';
import Breadcrumb from './components/Breadcrumb.vue';

const selectedFolder = ref<number | null>(null);
const selectedSubfolder = ref<number | null>(null);
const selectedFile = ref<number | null>(null);

const updateSelectedFolder = (folder: { id_folder: number; name_folder: string }) => {
  selectedFolder.value = folder.id_folder;
  selectedSubfolder.value = null;
  selectedFile.value = null;
};

const updateSelectedSubfolder = (subfolder: { id_subfolder: number; name_subfolder: string }) => {
  selectedSubfolder.value = subfolder.id_subfolder;
  selectedFile.value = null;
};

const updateSelectedFile = (file: { id_file: number; name_file: string }) => {
  selectedFile.value = file.id_file;
};
</script>

<template>
  <div class="container">
    <Breadcrumb 
      :selectedFolder="selectedFolder"
      :selectedSubfolder="selectedSubfolder"
      :selectedFile="selectedFile"
      @folderSelected="updateSelectedFolder"
      @subfolderSelected="updateSelectedSubfolder"
      @fileSelected="updateSelectedFile"
    />
    <div class="main-panel">
      <FolderTree 
        @folderSelected="updateSelectedFolder" 
        @subfolderSelected="updateSelectedSubfolder"
      />
      <SubfolderList 
        :selectedFolder="selectedFolder" 
        :selectedSubfolder="selectedSubfolder"
        @fileSelected="updateSelectedFile"
        @subfolderSelected="updateSelectedSubfolder"
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