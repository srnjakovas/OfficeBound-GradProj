using Mapster;
using MediatR;
using OfficeBound.Contracts.Responses;
using OfficeBound.Domain.Repositories;

namespace OfficeBound.Application.Queries.Departments.GetDepartments;

public class GetDepartmentsQueryHandler : IRequestHandler<GetDepartmentsQuery, GetDepartmentsResponse>
{
    private readonly IDepartmentRepository _departmentRepository;

    public GetDepartmentsQueryHandler(IDepartmentRepository departmentRepository)
    {
        _departmentRepository = departmentRepository;
    }
    
    public async Task<GetDepartmentsResponse> Handle(GetDepartmentsQuery query, CancellationToken cancellationToken)
    {
        var departments = await _departmentRepository.GetAllWithManagerAsync(cancellationToken);
        var departmentsList = departments.ToList();

        return departmentsList.Adapt<GetDepartmentsResponse>();
    }
}

