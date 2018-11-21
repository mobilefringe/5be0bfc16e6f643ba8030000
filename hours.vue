<template>
    <div> <!-- without an outer container div this component template will not render -->
        <loading-spinner v-if="!dataLoaded"></loading-spinner>
        <transition name="fade">
            <div v-if="dataLoaded" class="main_container margin_30" v-cloak> 
                <inside-header-component pageName="Hours"></inside-header-component>
                <div class="row">
                    <div class="col-md-12">
                        <h2 class="hours_heading caps">Hours</h2>
                        <div class="hours_container">
                            <div class="row hours_div" v-for="hour in hours">
                                <div class="col-xs-6 col-sm-4 col-md-3">
                                    {{hour.day_of_week | moment("dddd", timezone)}}
                                </div>
                                <div class="col-xs-6 col-md-3">
                                    <span class="">
                                        {{hour.open_time | moment("h:mm A", timezone)}} - {{hour.close_time | moment("h:mm A", timezone)}}    
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="padding_top_20"></div>
                        <h3 class="hours_heading caps">We will be open the following Holidays</h3>
                        <div class="hours_container">
                            <div class="row hours_div"  v-for="hour in reducedHolidays">
                                <div class="col-xs-6 col-sm-4 col-md-3">
                                    {{ hour.holiday_name }},<br class="hidden-lg hidden-md hidden-sm-block visible-xs-block"/> {{ hour.holiday_date | moment("MMM D", timezone) }}
                                </div>
                                <div class="col-xs-6 col-md-3">
                                    <span class="">
                                        {{ hour.open_time | moment("h:mm A", timezone) }} - {{ hour.close_time | moment("h:mm A", timezone) }}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="padding_top_20"></div>
                        <h3 class="hours_heading caps">We will be closed the following Statutory Holidays</h3>
                        <div class="hours_container">
                            <div class="row hours_div" v-for="hour in closeHolidays">
                                <div class="col-xs-6 col-sm-4 col-md-3">
                                    {{ hour.holiday_name }},<br class="hidden-lg hidden-md hidden-sm-block visible-xs-block"/> {{ hour.holiday_date | moment("MMM D", timezone) }}   
                                </div>
                                <div class="col-xs-6 col-md-3">
                                    <span class="">
                                        Closed
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    define(["Vue", "vuex", "moment", "moment-timezone", "vue-moment", "vue-meta"], function (Vue, Vuex, moment, tz, VueMoment, Meta) {
        Vue.use(Meta);
        return Vue.component("hours-component", {
            template: template, // the variable template will be injected
            data: function data() {
                return {
                    dataLoaded: false
                }
            },
            created() {
                this.loadData().then(response => {
                    this.dataLoaded = true;
                });
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'timezone',
                    'getPropertyHours',
                    'getPropertyHolidayHours'
                ]),
                hours () {
                    return this.getPropertyHours;
                },
                holidayHours () {
                    return this.getPropertyHolidayHours;
                },
                reducedHolidays () {
                    var holidayHours = this.holidayHours;
                    return _.filter(holidayHours, function(o) { return !o.is_closed; });
                },
                closeHolidays () {
                    var holidayHours = this.holidayHours;
                    return _.sortBy(_.filter(holidayHours, function(o) { return o.is_closed; }), [function(o) { return o.holiday_date; }]);
                }
            },
            methods: {
                loadData: async function () {
                    try {
                        let results = await Promise.all([this.$store.dispatch("getData", "categories")]);
                        return results;
                    } catch (e) {
                        console.log("Error loading data: " + e.message);
                    }
                }
            }
        });
    });
</script>