using MediatR;

namespace OfficeBound.Application.Commands.Departments.DeleteDepartment;

public record DeleteDepartmentCommand(int Id, string RejectionReason) : IRequest<Unit>;

