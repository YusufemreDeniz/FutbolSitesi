using System;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace FutbolSitesi // Namespace ile Global.asax içindeki adın aynı olmalı!
{
    public class Global : HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            RouteConfig.RegisterRoutes(RouteTable.Routes);
        }
    }
}
