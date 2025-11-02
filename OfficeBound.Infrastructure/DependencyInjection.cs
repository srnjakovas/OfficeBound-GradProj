using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using OfficeBound.Application.Interfaces;
using OfficeBound.Domain.Repositories;
using OfficeBound.Infrastructure.Repositories;

namespace OfficeBound.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DbConnectionString");
        
        services.AddDbContext<OfficeBoundDbContext>(options =>
            options.UseSqlServer(connectionString));

        services.AddScoped<IRequestRepository, RequestRepository>();
        services.AddScoped<IDepartmentRepository, DepartmentRepository>();
        
        services.AddScoped<IUnitOfWork, UnitOfWork>();

        return services;
    }
}

