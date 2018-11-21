<template>
    <div> <!-- without an outer container div this component template will not render -->
        <loading-spinner v-if="!dataLoaded"></loading-spinner>
        <transition name="fade">
            <div v-if="dataLoaded" v-cloak>
                <inside-header-component :pageName="currentPage.title"></inside-header-component>
                <div class="main_container mobile_padding margin_30">
                    <div class="details_row">
                        <div class="details_col_3 hidden_phone">
                            <img class="img_max" v-if="sideBanner" :src="sideBanner.image_url" alt="" />    
                        </div>
                        <div class="details_col_9">
                            <div class="page_body" v-html="currentPage.body"></div>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    define(["Vue", "vuex"], function (Vue, Vuex) {
        return Vue.component("page-details-component", {
            template: template, // the variable template will be injected,
            props: ['id'],
            data: function data() {
                return {
                    dataLoaded: false,
                    currentPage: null,
                    sideBanner: null
                }
            },
            created() {
                this.updateCurrentPage(this.id);
                
            },
            watch: {
                $route: function () {
                    this.updateCurrentPage(this.$route.params.id);
                }
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'findRepoByName'
                ])
            },
            methods: {
                updateCurrentPage(id) {
                    var _this = this;
                    this.property.mm_host = this.property.mm_host.replace("http:", "");
                    this.$store.dispatch('LOAD_PAGE_DATA', { url: this.property.mm_host + "/pages/" + this.id + ".json" }).then(function (response) {
                        _this.currentPage = response.data;
                        _this.dataLoaded = true;
                    }, function (error) {
                        console.error( "Could not retrieve data from server. Please check internet connection and try again.");
                        _this.$router.replace({ name: '404' });
                    });
                    this.loadData().then(response => {
                        var temp_repo1 = this.findRepoByName('Sales & Events Side Banner');
                        if(temp_repo1 && temp_repo1.images) {
                            this.sideBanner = temp_repo1.images[0];
                        } else {
                            this.sideBanner = {
                                "image_url": ""
                            }
                        } 
                    });
                    
               
                },
                loadData: async function () {
                    try {
                        let results = await Promise.all([this.$store.dispatch("getData","repos")]);
                    } catch (e) {
                        console.log("Error loading data: " + e.message);
                    }
                },
            }
        });
    });
</script>