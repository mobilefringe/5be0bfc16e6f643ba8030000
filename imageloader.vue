<template>
    <div> <!-- for some reason if you do not put an outer container div this component template will not render -->
        <loading-spinner v-if="!dataLoaded"></loading-spinner>
       <transition name="fade">
            <div v-if="dataLoaded" v-cloak>
                <inside-header-component pageName="Location"></inside-header-component>
                <div class="main_container margin_30">
                    <div class="details_row">
                        <div class="details_col_3">
                            <h3 class="inside_page_title">Office Phone Number</h3>
                            <a class="inside_page_link" :href="'tel:' + property.contact_phone">{{ property.contact_phone }}</a>
                            <h3 class="inside_page_title">Address</h3>
                            <p class="inside_page_link">
                                {{ property.address1 }} <br>
                                {{ property.city }}, {{ property.province_state }} <br>
                                {{ property.postal_code }}
                            </p>
                            <a class="animated_btn" :href="siteInfo.googleMapsURL" target="_blank">Driving Direction</a>   
                        </div>
                        <div class="details_col_9">
                            <iframe title="Map" width="100%" height="400px" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"  :src="'http://maps.google.nl/maps?q=' + getPropertyAddress + '&amp;hl=en&amp;ie=UTF8&amp;t=v&amp;hnear=' + getPropertyAddress + '&amp;z=16&amp;output=embed'"></iframe>
                            <hr>
                            <!--<div class="page_content" v-if="currentPage" v-html="currentPage.body"></div>-->
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
	define(["Vue", "vuex", "json!site.json"], function(Vue, Vuex, site) {
		return Vue.component("image-loader-component", {
            template: template, // the variable template will be injected
            data: function () {
                return {
                    dataLoaded: false,
                    currentPage: null,
                    siteInfo: site
                }
            },
            created() {
                this.loadData().then(response => {
                    // this.currentPage = response[0].data;
                    this.dataLoaded = true;
                });
            },
            computed: {
                ...Vuex.mapGetters([
                    'property'
                ]),
                getPropertyAddress() {
                    return this.property.name + ' ' + this.property.address1 + ' ' + this.property.city + ' ' + this.property.country + ' ' +this.property.province_state + ' ' + this.property.province_state
                }
            },
            methods: {
                loadData: async function () {
                    try {
                        let results = await Promise.all([this.$store.dispatch('LOAD_PAGE_DATA', {url: this.property.mm_host + "/pages/milton-directions.json"})]);
                        return results;
                    } catch (e) {
                        console.log("Error loading data: " + e.message);
                    }
                }
            }
        });
	});
</script>