using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace DurandalAuth.Web.Filters
{
    public class CrawlableAttribute : ActionFilterAttribute
    {
        private const string Fragment = "_escaped_fragment_";

        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            var request = filterContext.RequestContext.HttpContext.Request;

            if (request.QueryString[Fragment] != null)
            {

                var url = request.Url.ToString().Replace("?_escaped_fragment_=", "#");

                filterContext.Result = new RedirectToRouteResult(
                    new RouteValueDictionary { { "controller", "HtmlSnapshot" }, { "action", "GetHTML" }, { "url", url } });
            }
            return;
        }
    }
}