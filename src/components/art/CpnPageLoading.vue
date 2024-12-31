<script setup lang="ts">
const props = withDefaults(defineProps<{
    tips: string;
    notMore: boolean | undefined;
    isLoading: boolean;
}>(), {
    tips: '',
    notMore: false,
    isLoading: false
});

</script>

<template>
    <div class="load-more">
        <div class="loading" v-show="props.isLoading">
            <i class="icon-load"></i>
        </div>

        <div class="tips" v-show="props.notMore">
            <span>{{tips}}</span>
        </div>
    </div>
</template>


