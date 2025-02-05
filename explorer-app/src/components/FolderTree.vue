<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getFolders } from '../api';

interface Folder {
  id_folder: number;
  name_folder: string;
}

const emit = defineEmits(['folderSelected']);

const folders = ref<Folder[]>([]);

const fetchFolders = async () => {
  try {
    folders.value = await getFolders();
  } catch (error) {
    console.error('Failed to fetch folders:', error);
  }
};

const selectFolder = (folderId: number) => {
  emit('folderSelected', folderId);
};

onMounted(fetchFolders);
</script>

<template>
  <div class="folder-tree">
    <h2>Folders</h2>
    <ul>
      <li 
        v-for="folder in folders" 
        :key="folder.id_folder"
        @click="selectFolder(folder.id_folder)"
      >
        📁 {{ folder.name_folder }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
.folder-tree {
  width: 300px;
  border-right: 1px solid #ccc;
  overflow-y: auto;
  padding: 10px;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  cursor: pointer;
  padding: 5px;
  user-select: none;
}

li:hover {
  background-color: #f0f0f0;
}
</style>