<template>
    <div> <!-- Without an outer container div this component template will not render -->
        <loading-spinner v-if="!dataLoaded"></loading-spinner>
        <transition name="fade">
            <div v-if="dataLoaded" v-cloak>
                <inside-header-component pageName="Events"></inside-header-component>
                <div class="main_container mobile_padding margin_30">
                    <div class="details_row">
                        <div class="details_col_3 hidden_phone">
                            <img v-if="sideBanner" class="img_max" :src="sideBanner.image_url" alt="" />    
                        </div>
                        <div class="details_col_9" v-if="currentEvent">
                            <router-link to="/events-and-promotions">
                                <div class="inside_page_header"><i class="fa fa-caret-left"></i> Back to List</div>
                            </router-link>
                            <img v-lazy="currentEvent.image_url" :alt="'Event: ' + currentEvent.name" class="margin_20 img_max"/>
                            <h3 class="promo_name">{{ currentEvent.name }}</h3>
                            <p class="promo_store_name">
                                <router-link v-if="currentEvent.eventable_type == 'Store'" :to="'/stores/'+ currentEvent.store.slug">
                                    {{ currentEvent.store.name }}
                                </router-link>
                                <span v-else>{{ property.name }}</span>
                                <span>| </span>
                                <span v-if="isMultiDay(currentEvent)" class="promo_date">{{ currentEvent.start_date | moment("MMMM D", timezone)}} to {{ currentEvent.end_date | moment("MMMM D", timezone)}}</span>
                                <span v-else class="promo_date">{{ currentEvent.start_date | moment("MMMM D", timezone)}}</span>
                            </p>
                            <div class="promo_desc" v-html="currentEvent.rich_description"></div>
                            <social-sharing v-if="currentEvent" :url="shareURL(currentEvent.slug)" :title="currentEvent.title" :description="currentEvent.body" :quote="truncate(currentEvent.body)" :twitter-user="siteInfo.twitterHandle" :media="currentEvent.image_url" inline-template>
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
		return Vue.component("event-details-component", {
			template: template, // the variable template will be injected,
			props: ['id'],
			data: function() {
				return {
					dataLoaded: false,
					currentEvent: null,
				    siteInfo: site,
				}
			},
// 			created() {
// 				this.$store.dispatch("getData", "events").then(response => {
// 					this.currentEvent = this.findEventBySlug(this.id);
// 					if (this.currentEvent === null || this.currentEvent === undefined) {
// 						this.$router.replace({ name: '404' });
// 					}
// 					this.dataLoaded = true;
// 				}, error => {
// 					console.error("Could not retrieve data from server. Please check internet connection and try again.");
// 				});
// 			},
created (){
                this.loadData().then(response => {
                    this.currentPromo = this.findPromoBySlug(this.id);
					if (this.currentPromo === null || this.currentPromo === undefined) {
						this.$router.replace({ name: 'promotions' });
					}
					
					var temp_repo1 = this.findRepoByName('Sales & Events Side Banner');
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
			computed: {
				...Vuex.mapGetters([
					'property',
					'timezone',
					'processedEvents',
					'findEventBySlug',
				])
			},
			methods: {
				isMultiDay(currentEvent) {
					var timezone = this.timezone
					var start_date = moment(currentEvent.start_date).tz(timezone).format("MM-DD-YYYY")
					var end_date = moment(currentEvent.end_date).tz(timezone).format("MM-DD-YYYY")
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
                },
			}
		});
	});
</script>