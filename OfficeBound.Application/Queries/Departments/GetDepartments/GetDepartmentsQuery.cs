using MediatR;
using OfficeBound.Contracts.Responses;

namespace OfficeBound.Application.Queries.Departments.GetDepartments;

public record GetDepartmentsQuery() : IRequest<GetDepartmentsResponse>;

