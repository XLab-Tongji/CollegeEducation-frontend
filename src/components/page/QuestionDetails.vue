<template>
    <div>
        {{question.question_title}}
    </div>
</template>

<script>
    import server from '../../../config/index';

    export default {
        name: "QuestionDetails",
        mounted: function() {
            this.getParams();
        },
        data() {
            return {
                question: {}
            }
        },
        methods: {
            getParams: function () {
                this.question = this.$route.query.index
            },
            goBack: function() {
                this.$router.go(-1);
            }
        }
    }
</script>

<style scoped>

</style>
