<template>
    <div> <!-- without an outer container div this component template will not render -->
        <loading-spinner v-if="!dataLoaded"></loading-spinner>
        <transition name="fade">
            <div v-if="dataLoaded" v-cloak>
                <div class="inside_header_background" :style="{ backgroundImage: 'url(' + pageBanner.image_url + ')' }">
                    <div class="main_container">
                        <h2>Leasing</h2>
                    </div>
                </div>
                <div class="main_container mobile_padding margin_30">
                    <div class="row margin_20">
                        <div class="col-sm-12" v-if="currentPage">
                            <div class="page_body" v-html="currentPage.body"></div>
                        </div>
                    </div>
                    <div class="row margin_20">
                        <div class="col-sm-12">
                            <div>
                                <router-link to="/leasing/permanent" class="hvr-icon-forward">
    	                            <i class="fa fa-caret-right hvr-icon"></i> <span class="read_more">Permanent Leasing Form</span>
                                </router-link>
                            </div>
                            <div>
                                <router-link to="/leasing/specialty" class="hvr-icon-forward">
    	                            <i class="fa fa-caret-right hvr-icon"></i> <span class="read_more">Specialty Leasing Form</span>
                                </router-link>
                            </div>
                        </div>
                    </div>
                    <div class="row margin_20">
                        <div class="col-sm-4">
                            <div v-if="leasingPlans">
                                <a :href="leasingPlans" target="_blank" class="animated_btn leasing">
                                    Download Leasing Plan
                                </a>    
                            </div>
                        </div>
                        <div class="col-sm-4"></div>
                        <div class="col-sm-4">
                            <div v-if="leasingDemos">
                                <a :href="leasingDemos" target="_blank" class="animated_btn leasing">
                                   Download Trade Area Demographics
                                </a>    
                            </div>
                        </div>
                        
                    </div>
                    <div v-if="leasingImages" class="row margin_20">
                        <div v-for="image in leasingImages" class="col-sm-4 leasing_photo_container">
                            <a :href="image.image_url" data-lightbox="leasing images">
                                <div class="leasing_photo" :style="{ backgroundImage: 'url(' +image.image_url+ ')' }"></div>
                                <p style="display:none;">{{image.id}}</p>
                            </a>
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
                        let results = await Promise.all([this.$store.dispatch('LOAD_PAGE_DATA', { url: this.property.mm_host + "/pages/"+Site.subdomain+"-leasing.json"})]);
                        return results;
                    } catch (e) {
                        console.log("Error loading data: " + e.message);
                    }
                }
            }
        });
    });
</script>