using MediatR;
using Microsoft.AspNetCore.Mvc;
using OfficeBound.Application.Commands.Departments.CreateDepartment;
using OfficeBound.Application.Commands.Departments.DeleteDepartment;
using OfficeBound.Application.Commands.Departments.UpdateDepartment;
using OfficeBound.Application.Queries.Departments.GetDepartmentById;
using OfficeBound.Application.Queries.Departments.GetDepartments;
using OfficeBound.Contracts.Requests;
using OfficeBound.Contracts.Responses;

namespace OfficeBound.Presentation.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class DepartmentsController : ControllerBase
{
    private readonly IMediator _mediator;

    public DepartmentsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    [ProducesResponseType(typeof(GetDepartmentsResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<GetDepartmentsResponse>> GetDepartments(CancellationToken cancellationToken)
    {
        var response = await _mediator.Send(new GetDepartmentsQuery(), cancellationToken);
        return Ok(response);
    }

    [HttpGet("{id}")]
    [ProducesResponseType(typeof(GetDepartmentByIdResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<GetDepartmentByIdResponse>> GetDepartmentById(int id, CancellationToken cancellationToken)
    {
        var response = await _mediator.Send(new GetDepartmentByIdQuery(id), cancellationToken);
        return Ok(response);
    }

    [HttpPost]
    [ProducesResponseType(typeof(int), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<int>> CreateDepartment([FromBody] CreateDepartment createDepartment, CancellationToken cancellationToken)
    {
        var command = new CreateDepartmentCommand(createDepartment.DepartmentName, createDepartment.Manager, createDepartment.NumberOfPeople);
        var departmentId = await _mediator.Send(command, cancellationToken);
        return Ok(departmentId);
    }

    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult> UpdateDepartment(int id, [FromBody] UpdateDepartment updateDepartment, CancellationToken cancellationToken)
    {
        var command = new UpdateDepartmentCommand(id, updateDepartment.DepartmentName, updateDepartment.Manager, updateDepartment.NumberOfPeople);
        await _mediator.Send(command, cancellationToken);
        return Ok();
    }

    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> DeleteDepartment(int id, CancellationToken cancellationToken)
    {
        var command = new DeleteDepartmentCommand(id);
        await _mediator.Send(command, cancellationToken);
        return Ok();
    }
}

