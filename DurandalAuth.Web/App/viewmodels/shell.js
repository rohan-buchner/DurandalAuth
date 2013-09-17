﻿define(['plugins/router', 'services/appsecurity', 'services/errorhandler', 'services/entitymanagerprovider', 'model/modelBuilder'],
    function (router, appsecurity, errorhandler, entitymanagerprovider, modelBuilder) {

    entitymanagerprovider.modelBuilder = modelBuilder.extendMetadata;

    var viewmodel = {

        attached : function() {
            $(document).find("footer").show();
        },
        
        activate: function () {
            var self = this;            

            return entitymanagerprovider
                    .prepare()
                    .then(function() {
                       
                        //configure routing
                        router.makeRelative({ moduleId: 'viewmodels' });

                        // If the route has the authorize flag and the user is not logged in => navigate to login view                                
                        router.guardRoute = function (instance, instruction) {
                            if (instruction.config.authorize) {
                                if (appsecurity.user().IsAuthenticated && appsecurity.isUserInRole(instruction.config.authorize)) {
                                    return true
                                } else {
                                    return "/account/login?redirectto=" + instruction.fragment;
                                }
                            }
                            return true;
                        }

                        // Config Routes
                        // Routes with authorize flag will be forbidden and will redirect to login page
                        // As this is javascript and is controlled by the user and his browser, the flag is only a UI guidance. You should always check again on 
                        // server in order to ensure the resources travelling back on the wire are really allowed

                        return router.map([
                            // Nav urls
                            { route: '',                                      moduleId: 'home/index',                        title: 'Home',                        nav: true, hash : "#/"    },
                            { route: 'home/articles',                         moduleId: 'home/articles',                     title: 'Articles',                    nav: true, hash : "#home/articles" },
                            { route: 'home/about',                            moduleId: 'home/about',                        title: 'About',                       nav: true, hash : "#home/about"    },
                            { route: 'notfound',                              moduleId: 'notfound',                          title: 'Not found',                   nav: false },
                                
                            // Admin panel url
                            { route: 'admin/panel',                           moduleId: 'admin/panel',                       title: 'Admin Panel',                 nav: false, hash : "#admin/panel",  authorize: ["Administrator"] } ,

                            // Account Controller urls
                            { route: 'account/login',                         moduleId: 'account/login',                     title: 'Login',                       nav: false, hash : "#account/login" },
                            { route: 'account/externalloginconfirmation',     moduleId: 'account/externalloginconfirmation', title: 'External login confirmation', nav: false, hash : "#account/externalloginconfirmation" },
                            { route: 'account/externalloginfailure',          moduleId: 'account/externalloginfailure',      title: 'External login failure',      nav: false, hash : "#account/externalloginfailure" },
                            { route: 'account/register',                      moduleId: 'account/register',                  title: 'Register',                    nav: false, hash : "#account/register" },
                            { route: 'account/manage',                        moduleId: 'account/manage',                    title: 'Manage account',              nav: false, hash : "#account/manage",  authorize: ["User", "Administrator"] },

                            // User articles urls
                            { route: 'user/dashboard',                        moduleId: 'user/dashboard',                    title: 'Dashboard',                   nav: false, hash : "#user/dashboard",  authorize: ["User"]  },
                            { route: ':createdby/:categorycode/:articlecode', moduleId: 'user/article',                      title: 'Article',                     nav: false },
                        ])
                        .buildNavigationModel()
                        .mapUnknownRoutes("notfound","notfound")
                        .activate({ pushState : true });
                    })
                    .fail(self.handlevalidationerrors);
        }
    };

    errorhandler.includeIn(viewmodel);

    return viewmodel;
});