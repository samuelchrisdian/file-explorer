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

const emit = defineEmits(['fileSelected', 'subfolderSelected']);

const props = defineProps<{
  selectedFolder: number | null;
  selectedSubfolder: number | null;
}>();

const subfolders = ref<Subfolder[]>([]);
const files = ref<FileItem[]>([]);
const selectedSubfolderId = ref<number | null>(null);
const selectedFileId = ref<number | null>(null);

const fetchSubfolders = async (folderId: number) => {
  try {
    subfolders.value = await getSubfolders(folderId);
    files.value = [];
    selectedSubfolderId.value = null;
    selectedFileId.value = null;
  } catch (error) {
    console.error('Failed to fetch subfolders:', error);
    subfolders.value = [];
  }
};

const fetchFiles = async (subfolderId: number) => {
  try {
    files.value = await getFiles(subfolderId);
    subfolders.value = [];
    selectedSubfolderId.value = subfolderId;
    selectedFileId.value = null;
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
    selectedSubfolderId.value = null;
    selectedFileId.value = null;
  }
}, { immediate: true });

// Watch for changes in selectedSubfolder and fetch files accordingly
watch(() => props.selectedSubfolder, async (subfolderId) => {
  if (subfolderId !== null) {
    await fetchFiles(subfolderId);
  } else {
    files.value = [];
    selectedSubfolderId.value = null;
    selectedFileId.value = null;
  }
}, { immediate: true });

const selectSubfolder = (subfolder: Subfolder) => {
  fetchFiles(subfolder.id_subfolder);
  emit('subfolderSelected', subfolder);
};

const selectFile = (file: FileItem) => {
  selectedFileId.value = file.id_file;
  emit('fileSelected', file);
};
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
          @click="selectSubfolder(subfolder)"
          :class="{ 'selected': selectedSubfolderId === subfolder.id_subfolder }"
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
          @click="selectFile(file)"
          :class="{ 'selected': selectedFileId === file.id_file }"
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
  cursor: pointer;
}

li:hover {
  background-color: #f0f0f0;
}

.selected {
  background-color: #e0e0e0;
  font-weight: bold;
}

h2, h3 {
  margin-bottom: 10px;
}
</style>