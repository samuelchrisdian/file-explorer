<script setup lang="ts">
import { ref, watch } from 'vue';
import { getSubfolders, getFiles } from '../api';

interface Subfolder {
  id_subfolder: number;
  name_subfolder: string;
}

interface FileItem {
  id_file: number;
  name_file: string;
  file_extension?: string;
}

const props = defineProps<{
  selectedFolder: number | null;
}>();

const subfolders = ref<Subfolder[]>([]);
const files = ref<FileItem[]>([]);

watch(() => props.selectedFolder, async (folderId) => {
  if (folderId) {
    try {
      const [fetchedSubfolders, fetchedFiles] = await Promise.all([
        getSubfolders(folderId),
        getFiles(folderId)
      ]);
      
      subfolders.value = fetchedSubfolders;
      files.value = fetchedFiles;
    } catch (error) {
      console.error('Failed to fetch data:', error);
      subfolders.value = [];
      files.value = [];
    }
  } else {
    subfolders.value = [];
    files.value = [];
  }
}, { immediate: true });
</script>

<template>
  <div class="subfolder-list">
    <h2>Contents</h2>
    
    <div v-if="subfolders.length > 0">
      <h3>Subfolders</h3>
      <ul>
        <li 
          v-for="subfolder in subfolders" 
          :key="subfolder.id_subfolder"
        >
          📂 {{ subfolder.name_subfolder }}
        </li>
      </ul>
    </div>

    <div v-if="files.length > 0">
      <h3>Files</h3>
      <ul>
        <li 
          v-for="file in files" 
          :key="file.id_file"
        >
          📄 {{ file.name_file }}{{ file.file_extension ? `.${file.file_extension}` : '' }}
        </li>
      </ul>
    </div>

    <p v-if="subfolders.length === 0 && files.length === 0">
      No contents
    </p>
  </div>
</template>

<style scoped>
.subfolder-list {
  flex-grow: 1;
  overflow-y: auto;
  padding: 10px;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  padding: 5px;
}

h2, h3 {
  margin-bottom: 10px;
}
</style>