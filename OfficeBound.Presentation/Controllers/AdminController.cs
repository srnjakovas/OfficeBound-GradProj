using MediatR;
using Microsoft.AspNetCore.Mvc;
using OfficeBound.Application.Commands.Auth.ReviewAccount;
using OfficeBound.Application.Queries.Auth.GetUserAccountRequests;
using OfficeBound.Contracts.Requests;
using OfficeBound.Contracts.Responses;

namespace OfficeBound.Presentation.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class AdminController : ControllerBase
{
    private readonly IMediator _mediator;

    public AdminController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Get all unreviewed user account requests
    /// </summary>
    [HttpGet("AccountRequests")]
    [ProducesResponseType(typeof(GetUserAccountRequestsResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<GetUserAccountRequestsResponse>> GetUserAccountRequests(CancellationToken cancellationToken)
    {
        var response = await _mediator.Send(new GetUserAccountRequestsQuery(), cancellationToken);
        return Ok(response);
    }

    /// <summary>
    /// Review and approve/reject a user account request
    /// </summary>
    [HttpPost("ReviewAccount")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> ReviewAccount([FromBody] ReviewAccountRequest reviewRequest, CancellationToken cancellationToken)
    {
        var command = new ReviewAccountCommand(
            reviewRequest.UserId,
            reviewRequest.IsApproved,
            reviewRequest.Position,
            reviewRequest.DepartmentId);
        
        await _mediator.Send(command, cancellationToken);
        return Ok();
    }
}

