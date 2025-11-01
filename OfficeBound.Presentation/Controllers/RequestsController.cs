using Microsoft.AspNetCore.Mvc;
using OfficeBound.Application.Services;
using OfficeBound.Contracts.Requests;
using OfficeBound.Contracts.Responses;

namespace OfficeBound.Presentation.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class RequestsController : ControllerBase
{
    private readonly IRequestService _requestService;

    public RequestsController(IRequestService requestService)
    {
        _requestService = requestService;
    }

    /// <summary>
    /// Get all requests
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(GetRequestsResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<GetRequestsResponse>> GetRequests(CancellationToken cancellationToken)
    {
        var requests = await _requestService.GetAllRequestsAsync(cancellationToken);
        var response = new GetRequestsResponse(requests.ToList());
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
        var request = await _requestService.GetRequestByIdAsync(id, cancellationToken);
        var response = new GetRequestByIdResponse(request);
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
        var requestId = await _requestService.CreateRequestAsync(
            createRequest.Description, 
            createRequest.RequestType, 
            cancellationToken);
        
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
        await _requestService.UpdateRequestAsync(id, updateRequest.Description, updateRequest.RequestType, cancellationToken);
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
        await _requestService.DeleteRequestAsync(id, cancellationToken);
        return Ok();
    }
}

