<template>
    <div> <!-- without an outer container div this component template will not render -->
        <loading-spinner v-if="!dataLoaded"></loading-spinner>
        <transition name="fade">
            <div v-if="dataLoaded" v-cloak>
                <inside-header-component pageName="Jobs"></inside-header-component>
                <div class="main_container mobile_padding margin_30">
                    <div class="details_row">
                        <div class="details_col_3 hidden_phone">
                            <img class="img_max" src="http://placehold.it/440x1200" alt="" />    
                        </div>
                        <div class="details_col_9">
                            <!-- JOB -->
                            <b-card no-body class="mb-1 inside_page_toggle">
                                <b-card-header header-tag="header" class="p-1" role="tab">
                                    <b-btn block @click="toggleJobs = !toggleJobs" :aria-expanded="toggleJobs ? 'true' : 'false'" aria-controls="toggleJobs">
                                        Jobs
                                        <i v-if="toggleJobs"  class="fa fa-minus f"></i>
                                        <i v-else  class="fa fa-plus"></i>
                                    </b-btn>
                                </b-card-header>
                                <b-collapse v-if="jobList.length >= 1" v-for="job in jobList" v-model="toggleJobs" role="tabpanel" id="toggleJobs" class="accordion_body">
                                    <b-card-body>
                                        <div class="row">
                                            <div class="col-md-12">
                                                <h3 class="promo_name">{{job.name}}</h3>
                                                <p class="promo_store_name">
                                                    <router-link v-if="job.jobable_type == 'Store'" :to="'/stores/'+ job.store.slug">
                                                        {{ job.store.name }}
                                                    </router-link>
                                                    <span v-else>{{ property.name }}</span>
                                                    <span>| </span>
                                                    <span v-if="isMultiDay(job)" class="promo_date">{{ job.start_date | moment("MMMM D", timezone)}} to {{ job.end_date | moment("MMMM D", timezone)}}</span>
                                                    <span v-else class="promo_date">{{ job.start_date | moment("MMMM D", timezone)}}</span>
                                                </p>
                                                <div class="promo_desc" v-html="job.description_short"></div>
                                                <router-link :to="'/jobs/'+ job.slug" >
						                            <i class="fa fa-caret-right"></i> <a class="read_more">View Job Details</a>
				                                </router-link>
                                            </div>
                                        </div>
                                        <hr class="promo_separator" />
                                    </b-card-body>
                                </b-collapse>
                                <b-collapse v-if="jobList.length == 0" v-model="toggleJobs" role="tabpanel" id="toggleJobs" class="accordion_body">
                                    <b-card-body>
                                        <div class="row">
                                            <div class="col-md-12">
                                                <p>Sorry, there are no Jobs posted at this time. Please check back soon!</p>
                                            </div>
                                        </div>
                                        <hr class="promo_separator" />
                                    </b-card-body>
                                </b-collapse>
                            </b-card>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
define(["Vue", "vuex", "moment", "moment-timezone", "vue-moment", "bootstrap-vue"], function (Vue, Vuex, moment, tz, VueMoment, BootstrapVue) {
        Vue.use(BootstrapVue);
        return Vue.component("jobs-component", {
            template: template, // the variable template will be injected
            data: function () {
                return {
                    dataLoaded: false,
                    toggleJobs: false,
                }
            },
            created() {
                this.loadData().then(response => {
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
                    'processedJobs'
                ]),
                jobList: function jobs() {
                    var jobs = this.processedJobs;
                    var showJobs = [];
                    _.forEach(jobs, function (value, key) {
                        var today = moment.tz(this.timezone).format();
                        var showOnWebDate = moment.tz(value.show_on_web_date, this.timezone).format();
                        if (today >= showOnWebDate) {

                            value.description_short = _.truncate(value.description, { 'length': 100, 'separator': ' ' });
                            
                            showJobs.push(value);
                        }
                    });
                    var sortedJobs = _.orderBy(showJobs, function (o) { return o.end_date });
                    if (sortedJobs.length > 0) {
                        this.toggleJobs = true;
                    }
                    return sortedJobs
                },
            },
            methods: {
                loadData: async function () {
                    try {
                        let results = await Promise.all([this.$store.dispatch("getData", "jobs"), this.$store.dispatch("getData", "repos")]);
                        return results;
                    } catch (e) {
                        console.log("Error loading data: " + e.message);
                    }
                },
                isMultiDay(promo) {
                    var timezone = this.timezone
                    var start_date = moment(promo.start_date).tz(timezone).format("MM-DD-YYYY")
                    var end_date = moment(promo.end_date).tz(timezone).format("MM-DD-YYYY")
                    if (start_date === end_date) {
                        return false
                    } else {
                        return true
                    }
                }
            }
        });
    });
</script>