using MediatR;
using OfficeBound.Application.Commands.Requests.CreateRequest;
using OfficeBound.Application.Commands.Requests.DeleteRequest;
using OfficeBound.Application.Commands.Requests.UpdateRequest;
using OfficeBound.Application.Queries.Requests.GetRequestById;
using OfficeBound.Application.Queries.Requests.GetRequests;
using OfficeBound.Contracts.Requests;

namespace OfficeBound.Presentation.Modules;

public static class RequestModule
{
    public static void AddRequestsEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapGet("/api/requests", async (IMediator mediator, CancellationToken ct) =>
        {
            var requests = await mediator.Send(new GetRequestsQuery(), ct);
            return Results.Ok(requests);
        }).WithTags("Requests");
        
        app.MapGet("api/requests/{id}", async (IMediator mediator, int id, CancellationToken ct) =>
        {
            var request = await mediator.Send(new GetRequestByIdQuery(id), ct);
            return Results.Ok(request);
        }).WithTags("Requests");
        
        app.MapPost("/api/requests", async (IMediator mediator, CreateRequest createRequest, CancellationToken ct) =>
        {
            var command = new CreateRequestCommand(createRequest.Description, createRequest.RequestType);
            var result = await mediator.Send(command, ct);
            
            return Results.Ok(result);
        }).WithTags("Requests");
        
        app.MapPut("/api/requests/{id}", async (IMediator mediator, int id, UpdateRequest updateRequest, CancellationToken ct) =>
        {
            var command = new UpdateRequestCommand(id, updateRequest.Description, updateRequest.RequestType);
            var result = await mediator.Send(command, ct);
            
            return Results.Ok(result);
        }).WithTags("Requests");
        
        app.MapDelete("api/requests/{id}", async (IMediator mediator, int id, CancellationToken ct) =>
        {
            var command = new DeleteRequestCommand(id);
            var result = await mediator.Send(command, ct);
            
            return Results.Ok(result);
        }).WithTags("Requests");
    }
}