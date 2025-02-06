<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getFolders, getSubfolders } from '../api';

interface Folder {
  id_folder: number;
  name_folder: string;
  subfolders?: Subfolder[];
  isOpen?: boolean;
}

interface Subfolder {
  id_subfolder: number;
  name_subfolder: string;
}

const emit = defineEmits(['folderSelected', 'subfolderSelected']);

const folders = ref<Folder[]>([]);
const selectedFolderId = ref<number | null>(null);
const selectedSubfolderId = ref<number | null>(null);

const fetchFolders = async () => {
  try {
    folders.value = await getFolders();
  } catch (error) {
    console.error('Failed to fetch folders:', error);
  }
};

const selectFolder = async (folder: Folder) => {
  // Close all other folders
  folders.value.forEach(f => {
    if (f.id_folder !== folder.id_folder) f.isOpen = false;
  });
  
  const wasOpen = folder.isOpen;
  
  // If the folder is not open, load its subfolders
  if (!folder.isOpen) {
    try {
      folder.subfolders = await getSubfolders(folder.id_folder);
      folder.isOpen = true;
    } catch (error) {
      console.error('Failed to fetch subfolders:', error);
      return;
    }
  } else {
    // If already open, toggle closed
    folder.isOpen = false;
  }

  // Only update selection and emit event if we're opening the folder
  // or if we're selecting a different folder
  if (!wasOpen || selectedFolderId.value !== folder.id_folder) {
    selectedFolderId.value = folder.id_folder;
    selectedSubfolderId.value = null;
    emit('folderSelected', folder);
  }
};

const selectSubfolder = (subfolder: Subfolder, folderId: number) => {
  selectedFolderId.value = folderId;
  selectedSubfolderId.value = subfolder.id_subfolder;
  emit('folderSelected', { id_folder: folderId });
  emit('subfolderSelected', subfolder);
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
        class="folder-item"
      >
        <div 
          @click="selectFolder(folder)"
          :class="{ 
            'folder-header': true, 
            'selected': selectedFolderId === folder.id_folder 
          }"
        >
          📁 {{ folder.name_folder }}
          <span v-if="folder.isOpen">▼</span>
          <span v-else>▶</span>
        </div>
        <ul v-if="folder.isOpen && folder.subfolders?.length">
          <li 
            v-for="subfolder in folder.subfolders" 
            :key="subfolder.id_subfolder"
            class="subfolder-item"
            @click.stop="() => selectSubfolder(subfolder, folder.id_folder)"
          >
            <div 
              :class="{ 
                'subfolder-header': true, 
                'selected': selectedSubfolderId === subfolder.id_subfolder 
              }"
            >
              📂 {{ subfolder.name_subfolder }}
            </div>
          </li>
        </ul>
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

.folder-item, .subfolder-item {
  cursor: pointer;
  user-select: none;
}

.folder-header, .subfolder-header {
  padding: 5px;
}

.folder-header:hover, .subfolder-header:hover {
  background-color: #f0f0f0;
}

.selected {
  background-color: #e0e0e0;
  font-weight: bold;
}

li ul {
  padding-left: 20px;
}
</style>