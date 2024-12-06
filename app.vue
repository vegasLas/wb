<template>
    <Meta
        name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
    />
    <ClientOnly>
        <VuePreloader
            background-color="color(srgb 0.1294 0.1294 0.1294)"
            color="#ffffff"
            transition-type="fade-up"
            :loading-speed="25"
            @loading-is-over="showMainAfterPreloader"
        ></VuePreloader>
        <TriggersMain :show-main="showMain" />
    </ClientOnly>
</template>
<script setup lang="ts">
import { VuePreloader } from "vue-preloader";
const showMain = ref(false);

function showMainAfterPreloader() {
    showMain.value = true;
}
</script>
