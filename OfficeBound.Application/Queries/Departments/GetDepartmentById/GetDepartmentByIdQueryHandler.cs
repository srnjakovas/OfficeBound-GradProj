using Mapster;
using MediatR;
using OfficeBound.Contracts.Exceptions;
using OfficeBound.Contracts.Responses;
using OfficeBound.Domain.Entities;
using OfficeBound.Domain.Repositories;

namespace OfficeBound.Application.Queries.Departments.GetDepartmentById;

public class GetDepartmentByIdQueryHandler : IRequestHandler<GetDepartmentByIdQuery, GetDepartmentByIdResponse>
{
    private readonly IDepartmentRepository _departmentRepository;
    
    public GetDepartmentByIdQueryHandler(IDepartmentRepository departmentRepository)
    {
        _departmentRepository = departmentRepository;
    }
    
    public async Task<GetDepartmentByIdResponse> Handle(GetDepartmentByIdQuery query, CancellationToken cancellationToken)
    {
        var department = await _departmentRepository.GetByIdAsync(query.Id, cancellationToken);

        if (department is null)
        {
            throw new NotFoundException($"{nameof(Department)} with Id: {query.Id} was not found in Database");
        }

        return department.Adapt<GetDepartmentByIdResponse>();
    }
}

