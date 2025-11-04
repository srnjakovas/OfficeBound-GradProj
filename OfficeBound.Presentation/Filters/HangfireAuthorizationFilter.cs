using Hangfire.Dashboard;

namespace OfficeBound.Presentation;

public class HangfireAuthorizationFilter : IDashboardAuthorizationFilter
{
    public bool Authorize(DashboardContext context)
    {
        var httpContext = context.GetHttpContext();
        return httpContext.RequestServices.GetRequiredService<IHostEnvironment>().IsDevelopment();
    }
}

