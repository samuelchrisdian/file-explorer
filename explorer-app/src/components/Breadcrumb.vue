<script setup lang="ts">
import { ref, watch } from 'vue';

interface BreadcrumbItem {
  id: number;
  name: string;
  type: 'folder' | 'subfolder' | 'file';
}

const emit = defineEmits([
  'folderSelected', 
  'subfolderSelected', 
  'fileSelected'
]);

const props = defineProps<{
  selectedFolder: number | null;
  selectedSubfolder: number | null;
  selectedFile: number | null;
}>();

const breadcrumbs = ref<BreadcrumbItem[]>([]);

watch([
  () => props.selectedFolder, 
  () => props.selectedSubfolder, 
  () => props.selectedFile
], ([folderId, subfolderId, fileId]) => {
  breadcrumbs.value = [];

  // If a folder is selected, add it to breadcrumbs
  if (folderId) {
    breadcrumbs.value.push({
      id: folderId,
      name: `Folder ${folderId}`, // Replace with actual folder name
      type: 'folder'
    });
  }

  // If a subfolder is selected, add it to breadcrumbs
  if (subfolderId) {
    breadcrumbs.value.push({
      id: subfolderId,
      name: `Subfolder ${subfolderId}`, // Replace with actual subfolder name
      type: 'subfolder'
    });
  }

  // If a file is selected, add it to breadcrumbs
  if (fileId) {
    breadcrumbs.value.push({
      id: fileId,
      name: `File ${fileId}`, // Replace with actual file name
      type: 'file'
    });
  }
}, { immediate: true });

const navigateTo = (item: BreadcrumbItem, index: number) => {
  // Remove any items after the clicked item
  breadcrumbs.value = breadcrumbs.value.slice(0, index + 1);

  // Emit the appropriate event based on the item type
  switch (item.type) {
    case 'folder':
      emit('folderSelected', { id_folder: item.id, name_folder: item.name });
      break;
    case 'subfolder':
      emit('subfolderSelected', { id_subfolder: item.id, name_subfolder: item.name });
      break;
    case 'file':
      emit('fileSelected', { id_file: item.id, name_file: item.name });
      break;
  }
};
</script>

<template>
  <div class="breadcrumb">
    <span 
      v-for="(item, index) in breadcrumbs" 
      :key="item.id"
      class="breadcrumb-item"
      @click="navigateTo(item, index)"
    >
      {{ item.name }}
      <span v-if="index < breadcrumbs.length - 1" class="separator">/</span>
    </span>
  </div>
</template>

<style scoped>
.breadcrumb {
  padding: 10px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
}

.breadcrumb-item {
  margin-right: 5px;
  cursor: pointer;
  user-select: none;
}

.breadcrumb-item:hover {
  text-decoration: underline;
  color: #0066cc;
}

.separator {
  margin: 0 5px;
  color: #888;
  cursor: default;
}

.separator:hover {
  text-decoration: none;
  color: #888;
}
</style>