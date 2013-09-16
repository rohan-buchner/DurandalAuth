﻿using DurandalAuth.Domain.UnitOfWork;
using DurandalAuth.Web.App_Start;
using StructureMap;
using System;
using System.Collections.Generic;
using System.IdentityModel.Services;
using System.Linq;
using System.Security.Claims;
using System.Threading;
using System.Web;
using System.Web.Helpers;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using WebMatrix.WebData;

namespace DurandalAuth.Web
{
    // Note: For instructions on enabling IIS6 or IIS7 classic mode, 
    // visit http://go.microsoft.com/?LinkId=9394801

    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();

            RouteConfig.RegisterWebApiRoutes(GlobalConfiguration.Configuration);
            RouteConfig.RegisterMVCRoutes(RouteTable.Routes);
            AuthConfig.RegisterMVCAuth(GlobalFilters.Filters);
            AuthConfig.RegisterWebApiAuth(GlobalConfiguration.Configuration);
            AuthConfig.RegisterOAuth();
            FiltersConfig.RegisterMVCGlobalFilters(GlobalFilters.Filters);
            BundleConfig.RegisterBundles(BundleTable.Bundles);            

            if (!WebSecurity.Initialized)
            {                
                IUnitOfWork uow = ObjectFactory.GetInstance<IUnitOfWork>();
                if (!uow.DatabaseExists())
                {
                    uow.DatabaseInitialize();
                }
                else
                {
                    WebSecurity.InitializeDatabaseConnection("DurandalAuthConnection", "DurandalAuth_UserProfiles", "UserProfileId", "UserName", autoCreateTables: true);
                }
            }
        }
    }
}