<template>
    <div> <!-- without an outer container div this component template will not render -->
        <loading-spinner v-if="!dataLoaded"></loading-spinner>
        <transition name="fade">
            <div v-if="dataLoaded" v-cloak>
                <inside-header-component pageName="currentPage.title"></inside-header-component>
                <div class="main_container mobile_padding margin_30">
                    <div class="row margin_20">
                        <div class="col-sm-12" v-if="currentPage">
                            <div class="page_body" v-html="currentPage.body"></div>
                        </div>
                    </div>
    			</div>           
            </div>
        </transition>
    </div>
</template>

<style>
    .animated_btn {
        font-size: 1rem;
    }
</style>

<script>
    define(["Vue", "vuex", "json!site.json"], function(Vue, Vuex, Site) {
        return Vue.component("leasing-component", {
            template: template, // the variable template will be injected
            data: function() {
                return {
                    dataLoaded: false,
                    currentPage: null
                }
            },
            created() {
                this.loadData().then(response => {
                    if(response && response[0]) {
                        this.currentPage = response[0].data;
                    }

                    this.dataLoaded = true;
                });
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'timezone',
                    'findRepoByName'
                ]),
            },
            methods: {
                loadData: async function () {
                    this.property.mm_host = this.property.mm_host.replace("http:", "");
                    try {
                        let results = await Promise.all([this.$store.dispatch('LOAD_PAGE_DATA', { url: this.property.mm_host + "/pages/"+Site.subdomain+"-directions.json"})]);
                        return results;
                    } catch (e) {
                        console.log("Error loading data: " + e.message);
                    }
                }
            }
        });
    });
</script>