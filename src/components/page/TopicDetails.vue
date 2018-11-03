<template>
    <div>{{topic_id}}</div>
</template>

<script>
    export default {
        name: "TopicDetails",
        data() {
            return {
                topic_id: this.$router.params.topic_id
            }
        }
    }
</script>

<style scoped>

</style>
