<template>
    <div> <!-- without an outer container div this component template will not render -->
        <loading-spinner v-if="!dataLoaded"></loading-spinner>
        <transition name="fade">
            <div v-if="dataLoaded" v-cloak>
                <inside-header-component v-if="currentPage" :pageName="currentPage.title"></inside-header-component>
                <div class="main_container mobile_padding margin_30">
                    <div class="row margin_20">
                        <div class="col-sm-12">
                        <p class="visuallyhidden">
                            <a :href="'https://maps.google.com/?q=' + property.name">View {{ property.name }} on Google Maps</a>.
                        </p>
                            <iframe aria-hidden="true" src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14323.849844137574!2d-80.1152237!3d26.165352!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x1c0885e20640af28!2sCoral+Ridge+Mall!5e0!3m2!1sen!2sca!4v1542824138490" width="100%" height="400" frameborder="0" style="border:0" allowfullscreen></iframe>
                        </div>
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