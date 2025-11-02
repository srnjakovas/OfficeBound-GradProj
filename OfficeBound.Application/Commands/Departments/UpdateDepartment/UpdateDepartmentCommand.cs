using MediatR;

namespace OfficeBound.Application.Commands.Departments.UpdateDepartment;

public record UpdateDepartmentCommand(int Id, string DepartmentName, string Manager, int NumberOfPeople) : IRequest<Unit>;

