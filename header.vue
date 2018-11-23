<template>
    <header>
        <section id="header" class="header main_container">
            <div class="row logo_container">
                <div class="col-md-3">
                    <div class="site_logo center-block">
                        <a href="/">
                            <img :alt="siteInfo.siteName" src="//codecloud.cdn.speedyrails.net/sites/5be0bfc16e6f643ba8030000/image/png/1542734272332/New Coral Ridge Mall Logo_2012.png">
                        </a>
                    </div>
                    <div @click="showMenu = !showMenu" :class="{ open: showMenu }" id="menu-icon">
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
                <div class="col-md-9">
                    <div class="header_social_container hidden-sm hidden-xs">
                        <div id="search_component_wrapper" class="hidden_phone">
                            <div class="search_component_container">
                                <search-component v-if="headerReady" :list="searchList" placeholder="Search" :suggestion-attribute="suggestionAttribute" :keys="keys" v-model="search_result" @select="onOptionSelect" :autocomplete="false" :minMatchCharLength="3" :tokenize="true" class="text-left">
                                    <template slot="item" scope="option" class="manual">
                                        <article class="media">
                                        <p>
                                            {{ option.data.name }}
                                        </p>
                                        </article>
                                    </template>
                                </search-component>
                            </div>
                        </div>
                        <div class="header_social">
                            <span class="social_icon" v-for="item in social_media">
                                <a :href="item.url" target="_blank">
                                    <div>
                                        <p class="accessibility">{{item.name}}</p>
                                        <i :class="item.iconClass" aria-hidden="true"></i>
                                    </div>
                                </a>
                            </span>
                        </div>
                    </div>
                    <nav id="primary_nav">
						<ul>
						    <li class="menu_item" v-for="item in menu_items" :id="item.id">
						        <router-link :to="item.href">{{ item.name }}</router-link>
						        <ul v-if="item.sub_menu">
						            <li v-for="sub_menu in item.sub_menu" class="dropdown_item">
						                <router-link :to="sub_menu.href">{{ sub_menu.name }}</router-link>
						            </li>
								</ul>
						    </li>
						</ul>
					</nav>
					<div class="nav_container visible_phone">
					    <transition name="custom-classes-transition" enter-active-class="animated slideInDown" leave-active-class="animated slideOutUp">
    					    <nav id="mobile_nav" v-show="showMenu" class="">
    					        <ul>
    					            <li v-for="(item,key) in menu_items" class="menu_item">
    							        <router-link :to="item.href" v-if="item.sub_menu == undefined">{{$t(item.name)}}</router-link>
    							        <div v-else>
    							            <b-card no-body class="mb-1">
                                                <b-card-header header-tag="header" class="p-1" role="tab">
                                                    <b-btn block @click="item.show_sub_menu = !item.show_sub_menu" :class="item.show_sub_menu ? 'collapsed' : null" :aria-controls="$t(item.name)" :aria-expanded="item.show_sub_menu ? 'true' : 'false'">
                                                        {{$t(item.name)}}
                                                        <i v-if="item.show_sub_menu"  class="fa fa-minus"></i>
                                                        <i v-else  class="fa fa-plus"></i>
                                                    </b-btn>
                                                </b-card-header>
                                                <b-collapse v-model="item.show_sub_menu" :id="$t(item.name)" :visible="item.show_sub_menu" :accordion="$t(item.name)" role="tabpanel" class="accordion_body">
                                                    <b-card-body v-for="sub_menu in item.sub_menu">
                                                        <p class="card-text">
                                                            <router-link :to="sub_menu.href">{{$t(sub_menu.name)}}</router-link>
                                                        </p>
                                                    </b-card-body>
                                                </b-collapse>
                                            </b-card>
    							        </div>
    							    </li>
    					        </ul>
    						    <div class="mobile_nav_content">
    						        <div class="header_social">
        							    <span class="social_icon" v-for="item in social_media">
                                            <a :href="item.url" target="_blank">
                                                <div>
                                                    <p class="accessibility">{{item.name}}</p>
                                                    <i :class="item.iconClass" aria-hidden="true"></i>
                                                </div>
                                            </a>
                                        </span>
                                    </div>
                                    <div class="mobile_property_address center">
                                        <p>{{ property.name }}<br>
                                            <a :href="siteInfo.googleMapsURL" target="_blank">{{ getPropertyAddress }}</a>
                                        </p>
                                    </div>
    							</div>
    						</nav>
    				    </transition>
    				</div>
                </div>
            </div>
        </section>
    </header>
</template>

<script>
    define(["Vue", "vuex", "vue!today_hours.vue", "bootstrap-vue", "json!site.json", 'vue!search-component'], function (Vue, Vuex, TodayHoursComponent, BootstrapVue, site, SearchComponent) {
        Vue.use(BootstrapVue);
        return Vue.component("header-component", {
            template: template, // the variable template will be injected,
            data: function () {
                return {
                    showMenu: false,
                    showMobileMenu: false,
                    noScroll: false,
                    windowWidth: 0,
                    siteInfo: site,
                    search_result: null,
                    suggestionAttribute: "name",
                    keys: ["name", "description", "tags", "keywords", "store.name"],
                    headerReady: false
                }
            },
            props:['menu_items', 'social_media'],
            watch: {
                $route: function() {
                    if (this.windowWidth <= 768) {
                        this.showMenu = false;
                    }  
                    _.forEach(this.menu_items, function(value, key) {
                        value.show_sub_menu = false;
                    });
                },
                showMenu: function() {
                    if(this.showMenu == true){
                        document.body.classList.add("no_scroll");
                    } else if (this.showMenu == false) {
                        document.body.classList.remove("no_scroll");
                    }
                }
            },
            created() {
                this.$nextTick(function() {
                    window.addEventListener('resize', this.getWindowWidth);
                    this.getWindowWidth();
                });
                this.loadData().then(response => {
                    this.headerReady = true;
                });
            },
            mounted() {
                this.$nextTick(function() {
                    window.addEventListener('resize', this.getWindowWidth);
                    //Init
                    this.getWindowWidth();
                });
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'timezone',
                    'hours',
                    'getTodayHours',,
                    'processedStores',
                    'processedEvents',
                    'processedPromos',
                    'processedJobs'
                ]),
                searchList() {
                    console.log("seo", this.$store.state.seo)
                    var events = this.processedEvents;
                    _.forEach(events, function (value, key) {
                        if (_.includes(value.eventable_type, 'Property')) {
                            value.is_store = false;
                        } else {
                            value.is_store = true;    
                        }
                    });
                    var promos = this.processedPromos;
                    _.forEach(promos, function (value, key) {
                        if (_.includes(value.promotionable_type, 'Property')) {
                            value.is_store = false;
                        } else {
                            value.is_store = true;    
                        }
                    });
                    var jobs = this.processedJobs;
                    _.forEach(jobs, function (value, key) {
                        if (_.includes(value.jobable_type, 'Property')) {
                            value.is_store = false;
                        } else {
                            value.is_store = true;    
                        }
                    });
                    var stores = this.processedStores;
                    _.forEach(stores, function (value, key) {
                        value.is_store = true;    
                    });
                    
                    var list = _.union( stores, events, promos, jobs );
                    return this.$store.state.seo; //list;
                },
                locale: {
                    get () {
                        return this.$store.state.locale
                    },
                    set (value) {
                        this.$store.commit('SET_LOCALE', { lang: value })
                    }
                },
                todays_hours() {
                    return this.getTodayHours;
                },
                getPropertyAddress() {
                    return this.property.address1 + ' ' + this.property.city + ' ' + this.property.country + ' ' + this.property.province_state
                }
            },
            methods: {
                changeLocale: function(val) {
                    // this will update the data store, which in turn will trigger the watcher to update the locale in the system
                    this.locale = val; 
                },
                getWindowWidth(event) {
                    this.windowWidth = window.innerWidth;
                },
                onOptionSelect(option) {
                    console.log("option", option)
                  this.$router.push({
                    name: "search-results",
                    query: { searchQuery: this.search_result },
                    params: { results: option }
                  });
                  this.$nextTick(function() {
                    this.search_result = "";
                  });
                },
                loadData: async function() {
                    try{
                        
                        let results = await Promise.all([this.$store.dispatch("getData", "stores"), this.$store.dispatch("getData", "events"),this.$store.dispatch("getData", "promotions"),this.$store.dispatch("getData", "jobs"),this.$store.dispatch("getData", "seo")]);
                    } catch (e) {
                        console.log("Error loading data: " + e.message);    
                    }
                },
            },
            beforeDestroy: function() {
                window.removeEventListener('resize', this.getWindowWidth);
            }
        });
    });
</script>