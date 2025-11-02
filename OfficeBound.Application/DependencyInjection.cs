using System.Reflection;
using FluentValidation;
using Mapster;
using Microsoft.Extensions.DependencyInjection;
using OfficeBound.Application.Behaviors;
using OfficeBound.Application.Mappings;
using OfficeBound.Application.Services;

namespace OfficeBound.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddMediatR(cf =>
        {
            cf.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly());
            cf.AddOpenBehavior(typeof(ValidationBehavior<,>));
        });

        services.AddScoped<IRequestService, RequestService>();
        
        MappingConfig.Configure();
        var config = TypeAdapterConfig.GlobalSettings;
        config.Scan(Assembly.GetExecutingAssembly());
        services.AddSingleton(config);

        services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());
        return services;
    }
}