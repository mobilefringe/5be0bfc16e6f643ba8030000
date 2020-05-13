<template>
    <div><!-- without an outer container div this component template will not render -->
        <loading-spinner v-if="!dataLoaded"></loading-spinner>
        <transition name="fade">
            <div v-if="dataLoaded" v-cloak>
                <div class="home_banner_container">
                    <slick ref="slick" :options="slickOptions">
                        <div v-if="homeBanners" v-for="banner in homeBanners">
                            <a v-if="banner.url" :href="banner.url" class="">
                                <div class="banner_image" v-bind:style="{ backgroundImage: 'url(' + banner.image_url + ')' }"></div>
                                <!--<div class="banner_image" v-bind:style="{ backgroundImage: 'url(http://placehold.it/1920x500)' }"></div>-->
                            </a>
                            <div v-else class="banner_image" v-bind:style="{ backgroundImage: 'url(' + banner.image_url + ')' }"></div>
                            <!--<div v-else class="banner_image" v-bind:style="{ backgroundImage: 'url(http://placehold.it/1920x500)' }"></div>-->
                        </div>
                    </slick>
                </div>
                <div class="main_container">
                    <div v-if="featureItems" class="row">
                        <div v-for="item in featureItems" class="col-sm-4 feature_item">
                            <a aria-label="item.name" v-if="item.url" :href="item.url"><img :src="item.image_url" :alt="item.name" /></a>
                            <img v-else :src="item.image_url" :alt="item.name" />
                            <!--<img src="//codecloud.cdn.speedyrails.net/sites/5af1d01b6e6f64457d110000/image/png/1518461604000/Stores Directory.png" />-->
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>
<script>
    define(["Vue", "vuex", "vue-meta", "vue!vue-slick"], function (Vue, Vuex, Meta, slick) {
        return Vue.component("home-component", {
            template: template, // the variable template will be injected
            head: {
                // To use "this" in the component, it is necessary to return the object through a function
                title: function () {
                  return {
                    inner: this.meta.meta_title,
                    separator: ' ', // Leave empty separator
                    complement: ' ' // Leave empty complement
                  }
                },
                meta: function () {
                  return [
                     { name: 'description', id: 'description', content: this.meta.meta_description },
                     { name: 'keywords',  id: 'keywords', content: this.meta.meta_keywords },
                     { property: 'og:title', id: 'og:title', content: this.meta.meta_title },
                     { property: 'og:description', id: 'og:description', content: this.meta.meta_description }
                  ]
                }
            },
            data: function() {
                return {
                    dataLoaded: false,
                    meta: {
                        meta_title: "",
                        meta_description: "",
                        meta_keywords: "",
                        meta_image: ""
                    },
                    slickOptions: {
                        arrows: false,
                        autoplay: true,
                        autoplaySpeed: 6000,
                        cssEase: 'linear',
                        dots: true,
                        fade: false,
                        infinite: true,
                        slidesToShow: 1,
                        speed: 1000
                    }
                }
            },
            created(){
                this.loadData().then(response => {
                    this.meta = this.findMetaDataByPath(this.$route.path);
                    this.dataLoaded = true;  
                    this.$emit('updateHead');
                });
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'timezone',
                    'findMetaDataByPath',
                    'getPropertyHours'
                ]),
                homeBanners() {
                    var banners = [];
                    _.forEach(this.$store.state.banners, function (value, key) {
                        var today = new Date();
                        var start = new Date (value.start_date);
                        if (start <= today){
                            if (value.end_date){
                                var end = new Date (value.end_date);
                                if (end >= today){
                                    banners.push(value);  
                                }
                            } else {
                                banners.push(value);
                            }
                        }
                    });
                    return banners
                },
                featureItems() {
                    return _.slice(this.$store.state.feature_items, 0, 3);
                }
            },
            methods: {
                loadData: async function() {
                    try {
                        let results = await Promise.all([this.$store.dispatch("getData", "banners"), this.$store.dispatch("getData", "feature_items")]);
                        return results;
                    } catch(e) {
                        console.log("Error loading data: " + e.message);    
                    }
                }
            },
            metaInfo () {
                return {
                    title: this.meta.meta_title,
                    meta: [
                        { name: 'description', vmid: 'description', content: this.meta.meta_description },
                        { name: 'keywords',  vmid: 'keywords', content: this.meta.meta_keywords },
                        { property: 'og:title', vmid: 'og:title', content: this.meta.meta_title },
                        { property: 'og:description', vmid: 'og:description', content: this.meta.meta_description },
                        { property: 'og:image', vmid: 'og:image', content: this.meta.meta_image }
                    ]
                }
            }
        })
    })
</script>