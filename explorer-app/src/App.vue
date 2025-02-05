<script setup lang="ts">
import { ref } from "vue";
import FolderTree from "./components/FolderTree.vue";
import SubfolderList from "./components/SubfolderList.vue";

const selectedFolder = ref<number | null>(null);
</script>

<template>
    <div class="container">
        <FolderTree @folderSelected="(id) => (selectedFolder = id)" />
        <SubfolderList :selectedFolder="selectedFolder" />
    </div>
</template>

<style scoped>
.container {
    display: flex;
    height: 100vh;
}
</style>
