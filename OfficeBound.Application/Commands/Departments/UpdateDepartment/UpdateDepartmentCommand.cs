using MediatR;

namespace OfficeBound.Application.Commands.Departments.UpdateDepartment;

public record UpdateDepartmentCommand(int Id, string DepartmentName, int? ManagerId, int NumberOfPeople, int? UserId) : IRequest<Unit>;

