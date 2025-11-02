using MediatR;
using Microsoft.AspNetCore.Mvc;
using OfficeBound.Application.Commands.Auth.Login;
using OfficeBound.Application.Commands.Auth.SignUp;
using OfficeBound.Contracts.Requests;
using OfficeBound.Contracts.Responses;

namespace OfficeBound.Presentation.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class AuthController : ControllerBase
{
    private readonly IMediator _mediator;

    public AuthController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Sign up for a new account
    /// </summary>
    [HttpPost("SignUp")]
    [ProducesResponseType(typeof(SignUpResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<SignUpResponse>> SignUp([FromBody] SignUpRequest signUpRequest, CancellationToken cancellationToken)
    {
        var command = new SignUpCommand(signUpRequest.Username, signUpRequest.Password, signUpRequest.ConfirmPassword);
        var userId = await _mediator.Send(command, cancellationToken);
        return Ok(new SignUpResponse(userId, "Account request submitted successfully. Please wait for administrator approval."));
    }

    /// <summary>
    /// Login to the system
    /// </summary>
    [HttpPost("Login")]
    [ProducesResponseType(typeof(LoginResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest loginRequest, CancellationToken cancellationToken)
    {
        var command = new LoginCommand(loginRequest.Username, loginRequest.Password);
        var response = await _mediator.Send(command, cancellationToken);
        return Ok(response);
    }
}

