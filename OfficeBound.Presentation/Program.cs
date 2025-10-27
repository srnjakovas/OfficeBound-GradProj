using Microsoft.EntityFrameworkCore;
using OfficeBound.Infrastructure;
using OfficeBound.Application;
using OfficeBound.Presentation.Handlers;
using OfficeBound.Presentation.Modules;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var connection = builder.Configuration.GetConnectionString("DbConnectionString");
builder.Services.AddDbContext<OfficeBoundDbContext>(opt =>
    opt.UseSqlServer(connection));


builder.Services.AddCors(opt =>
{
    opt.AddPolicy("CorsPolicy", policyBuilder =>
        {
            policyBuilder.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://localhost:5173");
        }
    );
});

builder.Services.AddApplication();
builder.Services.AddExceptionHandler<ExceptionHandler>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseExceptionHandler(_ => { });
app.UseCors("CorsPolicy");
app.UseHttpsRedirection();
app.AddRequestsEndpoints();
app.Run();