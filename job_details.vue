<template>
    <div> <!-- Without an outer container div this component template will not render -->
        <loading-spinner v-if="!dataLoaded"></loading-spinner>
        <transition name="fade">
            <div v-if="dataLoaded" v-cloak>
                <inside-header-component pageName="Jobs"></inside-header-component>
                <div class="main_container mobile_padding margin_30">
                    <div class="details_row">
                        <div class="details_col_3 hidden_phone">
                            <img class="img_max" src="http://placehold.it/440x1200" alt="" />    
                        </div>
                        <div class="details_col_9" v-if="currentJob">
                            <router-link to="/jobs">
                                <div class="inside_page_header"><i class="fa fa-caret-left"></i> Back to List</div>
                            </router-link>
                            <h3 class="promo_name">{{ currentJob.name }}</h3>
                            <p class="promo_store_name">
                                <router-link v-if="currentJob.jobable_type == 'Store'" :to="'/stores/'+ currentJob.store.slug">
                                    {{ currentJob.store.name }}
                                </router-link>
                                <span v-else>{{ property.name }}</span>
                                <span>| </span>
                                <span v-if="isMultiDay(currentJob)" class="promo_date">{{ currentJob.start_date | moment("MMMM D", timezone)}} to {{ currentJob.end_date | moment("MMMM D", timezone)}}</span>
                                <span v-else class="promo_date">{{ currentJob.start_date | moment("MMMM D", timezone)}}</span>
                            </p>
                            <div class="promo_desc" v-html="currentJob.rich_description"></div>
                            <social-sharing v-if="currentJob" :url="shareURL(currentJob.slug)" :title="currentJob.title" :description="currentJob.body" :quote="truncate(currentJob.body)" :twitter-user="siteInfo.twitterHandle" :media="currentJob.image_url" inline-template>
                                <div class="social_share">
                                    <p>Share</p>
                                    <network network="facebook">
                                        <i class="fab fa-facebook"></i>
                                    </network>
                                    <network network="twitter">
                                        <i class="fab fa-twitter"></i>
                                    </network>
                                </div>
                            </social-sharing>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    define(["Vue", "vuex", "moment", "moment-timezone", "vue-moment", "vue-lazy-load",  "vue-social-sharing", "json!site.json"], function(Vue, Vuex, moment, tz, VueMoment, VueLazyload, SocialSharing, site) {
        Vue.use(VueLazyload);
        Vue.component('social-sharing', SocialSharing);
        return Vue.component("job-details-component", {
            template: template, // the variable template will be injected,
            props: ['id'],
            data: function() {
                return {
                    dataLoaded: false,
                    currentJob: null,
                    siteInfo: site,
                }
            },
//             created() {
                
// 				this.$store.dispatch("getData", "jobs").then(response => {
// 					this.currentJob = this.findJobBySlug(this.id);
// 					if (this.currentJob === null || this.currentJob === undefined) {
// 						this.$router.replace({ path: '/jobs' });
// 					}
// 					this.dataLoaded = true;
// 				}, error => {
// 					console.error("Could not retrieve data from server. Please check internet connection and try again.");
// 				});
				
// 			},
 created() {
                this.loadData().then(response => {
                    var temp_repo1 = this.findRepoByName('Jobs Side Banner');
                    if(temp_repo1 && temp_repo1.images) {
                        this.sideBanner = temp_repo1.images[0];
                    } else {
                        this.sideBanner = {
                            "image_url": ""
                        }
                    } 
                    
                    this.dataLoaded = true;
                    
                });
            },
			watch: {
                currentJob : function (){
                    if(this.currentJob != null) {
                        if (this.currentJob.store != null && this.currentJob.store != undefined && _.includes(this.currentJob.store.store_front_url_abs, 'missing')) {
                            this.currentJob.store.store_front_url_abs = "http://placehold.it/400x400";
                        } else if (this.currentJob.store == null || this.currentJob.store == undefined) {
                            this.currentJob.store = {};
                            this.currentJob.store.store_front_url_abs =  "http://placehold.it/400x400";
                        }
                    }
                }
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'timezone',
                    'findJobBySlug'
                ])
            },
            methods: {
				isMultiDay(currentJob) {
					var timezone = this.timezone
					var start_date = moment(currentJob.start_date).tz(timezone).format("MM-DD-YYYY")
					var end_date = moment(currentJob.end_date).tz(timezone).format("MM-DD-YYYY")
					if (start_date === end_date) {
						return false
					} else {
						return true
					}
				},
				truncate(val_body) {
                    var truncate = _.truncate(val_body, { 'length': 99, 'separator': ' ' });
                    return truncate;
                },
				shareURL(slug) {
                    var share_url = window.location.href
                    return share_url
                }
			}
        });
    });
</script>
