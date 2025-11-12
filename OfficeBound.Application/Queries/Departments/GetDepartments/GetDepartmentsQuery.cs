using MediatR;
using OfficeBound.Contracts.Responses;
using OfficeBound.Domain.Enumerations;

namespace OfficeBound.Application.Queries.Departments.GetDepartments;

public record GetDepartmentsQuery(Role? UserRole = null) : IRequest<GetDepartmentsResponse>;

