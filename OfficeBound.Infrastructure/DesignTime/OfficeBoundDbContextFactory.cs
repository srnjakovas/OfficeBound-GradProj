using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace OfficeBound.Infrastructure.DesignTime;

public class OfficeBoundDbContextFactory
    : IDesignTimeDbContextFactory<OfficeBoundDbContext>
{
    public OfficeBoundDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<OfficeBoundDbContext>();
        
        var connectionString = "Data Source=.\\SQLSERVER2017;Initial Catalog=OfficeBound;Integrated Security=True;Connect Timeout=60;TrustServerCertificate=True;ApplicationIntent=ReadWrite;MultiSubnetFailover=False";
        

        optionsBuilder.UseSqlServer(connectionString);

        return new OfficeBoundDbContext(optionsBuilder.Options);
    }
}