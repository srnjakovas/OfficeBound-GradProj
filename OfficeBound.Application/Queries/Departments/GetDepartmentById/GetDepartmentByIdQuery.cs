using MediatR;
using OfficeBound.Contracts.Responses;

namespace OfficeBound.Application.Queries.Departments.GetDepartmentById;

public record GetDepartmentByIdQuery(int Id) : IRequest<GetDepartmentByIdResponse>;

