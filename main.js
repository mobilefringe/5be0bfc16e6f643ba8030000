require.config({
    paths: {
        'Vue': 'https://cdnjs.cloudflare.com/ajax/libs/vue/2.5.13/vue',
        'vue_router': 'https://cdnjs.cloudflare.com/ajax/libs/vue-router/2.7.0/vue-router.min',
        'axios': 'https://cdnjs.cloudflare.com/ajax/libs/axios/0.16.1/axios.min',
        'jquery': 'https://code.jquery.com/jquery-3.2.1.min',
        'lodash': 'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.4/lodash.min',
        'moment': 'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment-with-locales.min',
        'moment-timezone': 'https://momentjs.com/downloads/moment-timezone-with-data-2012-2022.min',
        'vue-moment': 'https://mmvue.codecloudapp.com/vue-moment',
        'vue2-filters': 'https://cdn.jsdelivr.net/vue2-filters/0.1.8/vue2-filters.min',
        'vue': 'https://mmvue.codecloudapp.com/require-vuejs.min',
        'vuex': 'https://cdnjs.cloudflare.com/ajax/libs/vuex/2.3.1/vuex.min',
        'vue-i18n': 'https://cdnjs.cloudflare.com/ajax/libs/vue-i18n/6.1.1/vue-i18n.min',
        'text': 'https://cdnjs.cloudflare.com/ajax/libs/require-text/2.0.12/text.min',
        'json': 'https://unpkg.com/requirejs-plugins-current@1.0.3/src/json',
        'js-cookie': 'https://cdnjs.cloudflare.com/ajax/libs/js-cookie/2.1.4/js.cookie.min',
        'vue-meta': 'https://unpkg.com/vue-meta@1.0.4/lib/vue-meta.min',
        'Fuse': 'https://cdnjs.cloudflare.com/ajax/libs/fuse.js/3.0.4/fuse.min',
        'datastore_mutation_types': 'https://mmvue.codecloudapp.com/datastore_mutation_types',
        'datastore_getters': 'https://mmvue.codecloudapp.com/datastore_getters',
        'datastore_actions': 'https://mmvue.codecloudapp.com/datastore_actions',
        'datastore_mutations': 'https://mmvue.codecloudapp.com/datastore_mutations',
        'datastore': 'https://mmvue.codecloudapp.com/datastore',
        'vuex-router-sync': 'https://mmvue.codecloudapp.com/vuex-router-sync',
        //append a dummy query string so requireJS doesn't auto-append .js to the end of the url
        'vue-simple-spinner': 'https://cdn.jsdelivr.net/npm/vue-simple-spinner@1.2.8/dist/vue-simple-spinner.min',
        'today_hours': 'https://mmvue.codecloudapp.com/today_hours.vue?noext', 
        'search-component': 'https://mmvue.codecloudapp.com/search-component.vue?noext',
        'slick': 'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min',
        'vue-slick': 'https://mmvue.codecloudapp.com/slick.vue?noext',
        'vue-social-sharing': 'https://cdn.jsdelivr.net/npm/vue-social-sharing@2.3.3/dist/vue-social-sharing.min',
        'lightbox': 'https://5a1835f66e6f6422a6650000.codecloudapp.com/lightbox-mod',
        'vue-lazy-load': 'https://unpkg.com/vue-lazyload/vue-lazyload',
        'vee-validate' : 'https://cdn.jsdelivr.net/npm/vee-validate@latest/dist/vee-validate',
        'vue-select': 'https://cdn.jsdelivr.net/npm/vue-select@2.3.0/dist/vue-select.min',
        'bootstrap-vue' : 'https://unpkg.com/bootstrap-vue@latest/dist/bootstrap-vue',
        //mappplic-png--map dependencies
        'mousewheel' : 'https://cdnjs.cloudflare.com/ajax/libs/jquery-mousewheel/3.1.13/jquery.mousewheel.min',
        'mapplic' : 'https://mmvue.codecloudapp.com/mapplic',
        'hammer' : 'https://codecloud.cdn.speedyrails.net/sites/59bac7db6e6f644f22ba0000/text/javascript/1484859750000/hammer.min',
        'mapplic-png-map' : 'https://mmvue.codecloudapp.com/mapplic_png.vue?noext',
        'loader': 'https://mmvue.codecloudapp.com/loader.vue?noext',
        'lozad' :  'https://cdn.jsdelivr.net/npm/lozad/dist/lozad.min'
    }
});

require(['Vue', 'vuex', 'vue2-filters', 'vue_router', 'routes', 'vuex-router-sync', 'datastore', 'vue-i18n', 'locales', 'moment', 'vue-meta', 'vue!loading.vue', 'vue!messages.vue', 'vue!header.vue', 'vue!footer.vue', 'vue!inside_header.vue', "json!site.json", 'vue!app_image'], function (Vue, Vuex, Vue2Filters, VueRouter, appRoutes, VuexRouterSync, store, VueI18n, messages, moment, Meta, LoadingComponent, MessagesComponent, HeaderComponent, FooterComponent, insideHeaderComponent, Site, AppImage) {

    Vue.use(Meta);
    Vue.use(VueRouter);
    Vue.use(Vue2Filters);
    Vue.use(VueI18n);
    
    // const observer = lozad(); // lazy loads elements with default selector as '.lozad'
    // observer.observe();
    
    /* initialize router */
    const router = new VueRouter({
        mode: 'history',
        routes: appRoutes,
        scrollBehavior(to, from, savedPosition) {
            return {
                x: 0,
                y: 0
            }
        }
    });

    /* initialize i18n */
    const i18n = new VueI18n({
        locale: 'en-ca',
        fallbackLocale: 'en-ca',
        messages: messages,
    });
  
    VuexRouterSync.sync(store, router)

    /* bootstrap app */
    const vm = new Vue({
        el: '#app',
        data: function () {
            return {
                menu_items: [
                    {
                        name: "Store Directory",
                        href: "/stores"
                    },
                    {
                        name: "Promotions & Events",
                        href: "/promotions-and-events"
                    },
                    {
                        name: "About",
                        id: "menu1",
                        href: "",
                        sub_menu: [
                            {
                                name: "Services",
                                href: "/pages/"
                            },
                            {
                                name: "Newsletter",
                                href: "/newsletter"
                            }
                        ]
                    },
                    {
                        name: "Contact",
                        id: "menu2",
                        href: "",
                        sub_menu: [
                            {
                                name: "Jobs",
                                href: "/jobs"
                            },
                            {
                                name: "Location",
                                href: "/location"
                            },
                            {
                                name: "Management",
                                href: "/pages/"
                            },
                            {
                                name: "Leasing",
                                href: "/pages/"
                            }
                        ]
                    }
                ],
                social_media: [
                    {
                        name: "Facebook",
                        url: "https://www.facebook.com",
                        iconClass: "fab fa-facebook-f"
                    },
                    {
                        name: "Twitter",
                        url: "https://twitter.com",
                        iconClass: "fab fa-twitter"
                    },
                    {
                        name: "Instagram",
                        url: "https://www.instagram.com",
                        iconClass: "fab fa-instagram"
                    },
                    {
                        name: "SnapChat",
                        url: "",
                        iconClass: "fab fa-snapchat-ghost"
                    },
                    {
                        name: "YouTube",
                        url: "https://www.youtube.com/",
                        iconClass: "fab fa-youtube"
                    }
                ],
            }
        },
        created: function ()  {
            this.loadData().then(response => {
                this.$store.dispatch("setDataLoaded", true);      
            });
        },
        watch: {
            // watcher to update vue-i18n when the locale has been changed by the user
            locale: function (val, oldVal) {
                this.$i18n.locale = val;
                moment.locale(val);
            }
        },
        computed: {
            // computed property for locale which returns locale value from data store and also updates the data store with new locale information
            locale: {
                get () {
                    return this.$store.state.locale
                },
                set (value) {
                    this.$store.commit('SET_LOCALE', { lang: value })
                }
            },
            ...Vuex.mapGetters([
                'dataLoaded'
            ])
        },
        methods: {
            loadData: async function() {
                try{
                    await this.$store.dispatch('initializeApi', { site: "coralridge", version: "v4" });
                    // avoid making LOAD_META_DATA call for now as it will cause the entire Promise.all to fail since no meta data is set up.
                    let results = await Promise.all([this.$store.dispatch("INITIALIZE_LOCALE"), this.$store.dispatch("getData", "property"), this.$store.dispatch("getData", "hours"), this.$store.dispatch("getData", "stores")]);
                } catch (e) {
                    console.log("Error loading data: " + e.message);    
                }
            },
            // utility method to allow user to change locale value
            changeLocale: function(val) {
                this.locale = val; // this will update the data store, which in turn will trigger the watcher to update the locale in the system
            }
        },
        router: router,
        store,
        i18n
    });
});