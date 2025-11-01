using MediatR;
using Microsoft.AspNetCore.Mvc;
using OfficeBound.Application.Commands.Requests.CreateRequest;
using OfficeBound.Application.Commands.Requests.DeleteRequest;
using OfficeBound.Application.Commands.Requests.UpdateRequest;
using OfficeBound.Application.Queries.Requests.GetRequestById;
using OfficeBound.Application.Queries.Requests.GetRequests;
using OfficeBound.Contracts.Requests;
using OfficeBound.Contracts.Responses;

namespace OfficeBound.Presentation.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class RequestsController : ControllerBase
{
    private readonly IMediator _mediator;

    public RequestsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Get all requests
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(GetRequestsResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<GetRequestsResponse>> GetRequests(CancellationToken cancellationToken)
    {
        var response = await _mediator.Send(new GetRequestsQuery(), cancellationToken);
        return Ok(response);
    }

    /// <summary>
    /// Get request by ID
    /// </summary>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(GetRequestByIdResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<GetRequestByIdResponse>> GetRequestById(int id, CancellationToken cancellationToken)
    {
        var response = await _mediator.Send(new GetRequestByIdQuery(id), cancellationToken);
        return Ok(response);
    }

    /// <summary>
    /// Create a new request
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(int), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<int>> CreateRequest([FromBody] CreateRequest createRequest, CancellationToken cancellationToken)
    {
        var command = new CreateRequestCommand(createRequest.Description, createRequest.RequestType);
        var requestId = await _mediator.Send(command, cancellationToken);
        return Ok(requestId);
    }

    /// <summary>
    /// Update an existing request
    /// </summary>
    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult> UpdateRequest(int id, [FromBody] UpdateRequest updateRequest, CancellationToken cancellationToken)
    {
        var command = new UpdateRequestCommand(id, updateRequest.Description, updateRequest.RequestType);
        await _mediator.Send(command, cancellationToken);
        return Ok();
    }

    /// <summary>
    /// Delete a request
    /// </summary>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> DeleteRequest(int id, CancellationToken cancellationToken)
    {
        var command = new DeleteRequestCommand(id);
        await _mediator.Send(command, cancellationToken);
        return Ok();
    }
}

