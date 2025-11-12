using MediatR;
using Microsoft.AspNetCore.Mvc;
using OfficeBound.Application.Commands.Requests.ApproveRequest;
using OfficeBound.Application.Commands.Requests.CancelRequest;
using OfficeBound.Application.Commands.Requests.CreateRequest;
using OfficeBound.Application.Commands.Requests.DeleteRequest;
using OfficeBound.Application.Commands.Requests.RejectRequest;
using OfficeBound.Application.Commands.Requests.UpdateRequest;
using OfficeBound.Application.Queries.OfficeResources.GetOfficeResources;
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

    [HttpGet]
    [ProducesResponseType(typeof(GetRequestsResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<GetRequestsResponse>> GetRequests(CancellationToken cancellationToken)
    {
        var response = await _mediator.Send(new GetRequestsQuery(), cancellationToken);
        return Ok(response);
    }

    [HttpGet("{id}")]
    [ProducesResponseType(typeof(GetRequestByIdResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<GetRequestByIdResponse>> GetRequestById(int id, CancellationToken cancellationToken)
    {
        var response = await _mediator.Send(new GetRequestByIdQuery(id), cancellationToken);
        return Ok(response);
    }

    [HttpPost]
    [ProducesResponseType(typeof(int), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<int>> CreateRequest([FromBody] CreateRequest createRequest, CancellationToken cancellationToken)
    {
        var command = new CreateRequestCommand(createRequest.Description, createRequest.RequestType, createRequest.RequestDate, createRequest.DepartmentId, createRequest.UserId);
        var requestId = await _mediator.Send(command, cancellationToken);
        return Ok(requestId);
    }

    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult> UpdateRequest(int id, [FromBody] UpdateRequest updateRequest, CancellationToken cancellationToken)
    {
        var command = new UpdateRequestCommand(id, updateRequest.Description, updateRequest.RequestType, updateRequest.RequestDate, updateRequest.DepartmentId, updateRequest.UserId);
        await _mediator.Send(command, cancellationToken);
        return Ok();
    }

    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> DeleteRequest(int id, CancellationToken cancellationToken)
    {
        var command = new DeleteRequestCommand(id);
        await _mediator.Send(command, cancellationToken);
        return Ok();
    }

    [HttpPost("{id}/Approve")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult> ApproveRequest(int id, CancellationToken cancellationToken)
    {
        var command = new ApproveRequestCommand(id);
        await _mediator.Send(command, cancellationToken);
        return Ok();
    }

    [HttpPost("{id}/Reject")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult> RejectRequest(int id, [FromBody] RejectRequestRequest rejectRequest, CancellationToken cancellationToken)
    {
        var command = new RejectRequestCommand(id, rejectRequest.RejectionReason);
        await _mediator.Send(command, cancellationToken);
        return Ok();
    }

    [HttpPost("{id}/Cancel")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult> CancelRequest(int id, [FromBody] CancelRequestRequest cancelRequest, CancellationToken cancellationToken)
    {
        var command = new CancelRequestCommand(id, cancelRequest.CancellationReason, cancelRequest.UserId);
        await _mediator.Send(command, cancellationToken);
        return Ok();
    }

    [HttpGet("OfficeResources")]
    [ProducesResponseType(typeof(GetOfficeResourcesResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<GetOfficeResourcesResponse>> GetOfficeResources(CancellationToken cancellationToken)
    {
        var response = await _mediator.Send(new GetOfficeResourcesQuery(), cancellationToken);
        return Ok(response);
    }
}

