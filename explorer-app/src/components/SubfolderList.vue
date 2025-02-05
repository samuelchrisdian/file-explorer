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
  selectedSubfolder: number | null;
}>();

const subfolders = ref<Subfolder[]>([]);
const files = ref<FileItem[]>([]);

const fetchSubfolders = async (folderId: number) => {
  try {
    subfolders.value = await getSubfolders(folderId);
    files.value = [];
  } catch (error) {
    console.error('Failed to fetch subfolders:', error);
    subfolders.value = [];
  }
};

const fetchFiles = async (subfolderId: number) => {
  try {
    files.value = await getFiles(subfolderId);
    subfolders.value = [];
  } catch (error) {
    console.error('Failed to fetch files:', error);
    files.value = [];
  }
};

// Watch for changes in selectedFolder and fetch subfolders accordingly
watch(() => props.selectedFolder, async (folderId) => {
  if (folderId !== null) {
    await fetchSubfolders(folderId);
  } else {
    subfolders.value = [];
    files.value = [];
  }
}, { immediate: true });

// Watch for changes in selectedSubfolder and fetch files accordingly
watch(() => props.selectedSubfolder, async (subfolderId) => {
  if (subfolderId !== null) {
    await fetchFiles(subfolderId);
  } else {
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
