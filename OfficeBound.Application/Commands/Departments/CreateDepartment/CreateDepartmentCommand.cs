using MediatR;

namespace OfficeBound.Application.Commands.Departments.CreateDepartment;

public record CreateDepartmentCommand(string DepartmentName, string Manager, int NumberOfPeople) : IRequest<int>;

