<template>
    <div style="font-size: 50px;">{{topicID}}</div>
</template>

<script>
    export default {
        name: "TopicDetails",
        mounted: function() {
            this.getParams();
        },
        data() {
            return {
                topicID: 0
            }
        },
        methods: {
            getParams: function () {
                console.log(this.$router.query);
                //alert(this.$router.params);
                this.topicID = this.$router.query.topicID;
            }
        },
        watch: {
            '$route': 'getParams'
        }
    }
</script>

<style scoped>

</style>
