<template>
    <div class="inside_header_background">
        <div class="main_container">
            <div class="page_container">
                <h2>{{pageName}}</h2>
            </div>
        </div>
    </div>
</template>

<script>
    define(["Vue", "vuex"], function (Vue, Vuex) {
        return Vue.component("page-details-component", {
            template: template, // the variable template will be injected,
            props: ['pageName'],
            data: function data() {
                return {
                    dataLoaded: false
                }
            },
        });
    });
</script>