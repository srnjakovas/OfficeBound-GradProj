using MediatR;

namespace OfficeBound.Application.Commands.Departments.CreateDepartment;

public record CreateDepartmentCommand(string DepartmentName, int? ManagerId, int NumberOfPeople) : IRequest<int>;

