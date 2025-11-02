using Mapster;
using OfficeBound.Contracts.Responses;
using OfficeBound.Domain.Entities;

namespace OfficeBound.Application.Mappings;

public class MappingConfig
{
    public static void Configure()
    {
        TypeAdapterConfig<List<Request>, GetRequestsResponse>.NewConfig()
            .Map(dest => dest.RequestsDtos, src => src);
        
        TypeAdapterConfig<Request, GetRequestByIdResponse>.NewConfig()
            .Map(dest => dest.RequestDto, src => src);

        TypeAdapterConfig<List<Department>, GetDepartmentsResponse>.NewConfig()
            .Map(dest => dest.DepartmentsDtos, src => src);
        
        TypeAdapterConfig<Department, GetDepartmentByIdResponse>.NewConfig()
            .Map(dest => dest.DepartmentDto, src => src);
    }
}