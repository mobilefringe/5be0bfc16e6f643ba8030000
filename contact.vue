<template>
    <div> <!-- without an outer container div this component template will not render -->
        <loading-spinner v-if="!dataLoaded"></loading-spinner>
        <transition name="fade">
            <div v-if="dataLoaded" v-cloak>
                <inside-header-component pageName="Contact Us"></inside-header-component>
                <div class="main_container margin_30">
                    <div class="details_row contact_us_container">
                        <div class="details_col_3">
                            <img class="img_max" v-if="sideBanner" :src="sideBanner.image_url" alt="" />    
                        </div>
                        <div class="details_col_9">
                            <div class="row">
                                <div class="col-md-12">
                                    <p>We value your feedback. Send us your comments or questions by completing the contact form below.</p>    
                                </div>
                                <form class="form-horizontal clearfix" action="form-submit" v-on:submit.prevent="validateBeforeSubmit">
                                    <div class="col-xs-12 col-md-6" :class="{'has-error': errors.has('name')}">
                                        <label for="name">Name</label>
                                        <input id="name" v-model="form_data.name" v-validate="'required|true'" class="form-control" :class="{'input': true}" name="name" type="text" data-vv-delay="1000">
                                        <span v-show="errors.has('name')" class="form-control-feedback">{{ errors.first('name') }}</span>
                                    </div>
                                    <div class="col-xs-12 col-md-6" :class="{'has-error': errors.has('email')}">
                                        <label for="email">Email</label>
                                        <input id="email" v-model="form_data.email" v-validate="'required|email'" class="form-control" :class="{'input': true}" name="email" type="email" data-vv-delay="1000">
                                        <span v-show="errors.has('email')" class="form-control-feedback">{{ errors.first('email') }}</span>
                                    </div>
                                    <div class="col-xs-12" :class="{'has-error': errors.has('subject')}">
                                        <label for="subject">Subject</label>
                                        <input id="subject" v-model="form_data.subject" v-validate="'required:true'" class="form-control" :class="{'input': true}" name="subject" type="text" data-vv-delay="1000">
                                        <span v-show="errors.has('subject')" class="form-control-feedback">{{ errors.first('subject') }}</span>
                                    </div>
                                    <div class="col-xs-12" :class="{'has-error': errors.has('message')}">
                                        <label for="message">Message</label>
                                        <textarea id="message" v-model="form_data.message" v-validate="'required:true'" class="form-control" :class="{'input': true}" name="message" type="text" data-vv-delay="1000"></textarea>
                                        <span v-show="errors.has('message')" class="form-control-feedback">{{ errors.first('message') }}</span>
                                    </div>
                                    <div class="col-xs-12">
                                        <button class="submit animated_btn" type="submit" :disabled="formSuccess">
                                            Send <i class="fa fa-angle-right" aria-hidden="true"></i>
                                        </button>
                                    </div>
                                </form>
                                <br/>
                                <div id="send_contact_success" class="alert alert-success" role="alert" v-show="formSuccess">
                                    <span class="glyphicon glyphicon-ok" aria-hidden="true"></span>
                                    <span class="sr-only">Success</span>
                                    Thank you for contacting us. A member from our team will contact you shortly.
                                </div>
                                <div id="send_contact_error" class="alert alert-danger" role="alert" v-show="formError">
                                    <span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
                                    <span class="sr-only">Error:</span>
                                    There was an error when trying to submit your request. Please try again later.
                                </div>    
                            </div>
                            <div class="row">
                                <div class="col-md-12">
                                    <hr>
                                    <!--<div class="contact_page_body" v-html="currentPage.body"></div>-->
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
    define(["Vue", "vuex", "vue-meta", "vee-validate", "json!site.json"], function (Vue, Vuex, Meta, VeeValidate, Site) {
        Vue.use(Meta);
        Vue.use(VeeValidate);
        return Vue.component("contact-component", {
            template: template, // the variable template will be injected
            data: function data() {
                return {
                    dataLoaded: false,
                    form_data: {},
                    loginPending: null,
                    formSuccess: false,
                    formError: false,
                    time: new Date(),
                    sideBanner: null
                }
            },
            created() {
                console.log("Site", Site)
                this.loadData().then(response => {
                    // this.currentPage = response[0].data;
                    var temp_repo1 = this.findRepoByName('Contact Side Banner');
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
                    'findRepoByName'
                ])
            },
            methods: {
                loadData: async function () {
                    try {
                        this.property.mm_host = this.property.mm_host.replace("http:", "");
                        let results = await Promise.all([this.$store.dispatch('LOAD_PAGE_DATA', {url: this.property.mm_host + "/pages/milton-contact-us.json"}),this.$store.dispatch("getData","repos")]);
                        
                        return results;
                    } catch (e) {
                        console.log("Error loading data: " + e.message);
                    }
                },
                validateBeforeSubmit() {
                    this.$validator.validateAll().then((result) => {
                        if (result) {
                            let errors = this.errors;
                            send_data = {};
                            send_data.form_data = JSON.stringify(this.serializeObject(this.form_data));
                            this.$store.dispatch("CONTACT_US", send_data).then(res => {
                                this.formSuccess = true;
                            }).catch(error => {
                                try {
                                    if (error.response.status == 401) {
                                        console.log("Data load error: " + error.message);
                                        this.formError = true;
                                    } else {
                                        console.log("Data load error: " + error.message);
                                        this.formError = true;
                                    }
                                } catch (e) {
                                    console.log("Data load error: " + error.message);
                                    this.formError = true;
                                }
                            })
                        }
                    })
                },
                serializeObject(obj) {
                    var newObj = [];
                    _.forEach(obj, function (value, key) {
                        var tempVal = {};
                        tempVal.name = key;
                        tempVal.value = value;
                        newObj.push(tempVal);
                    });
                    return newObj;
                }
            }
        });
    });
</script>