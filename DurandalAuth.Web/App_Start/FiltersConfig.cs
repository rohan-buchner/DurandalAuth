using DurandalAuth.Web.Filters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace DurandalAuth.Web.App_Start
{
    public static class FiltersConfig
    {
        public static void RegisterMVCGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new CrawlableAttribute());
        }
    }
}