using Mapster;
using OfficeBound.Contracts.Dtos;
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

        TypeAdapterConfig<Department, DepartmentDto>.NewConfig()
            .Map(dest => dest.ManagerId, src => src.ManagerId)
            .Map(dest => dest.ManagerName, src => src.Manager != null ? src.Manager.Username : null);

        TypeAdapterConfig<List<User>, GetUsersResponse>.NewConfig()
            .Map(dest => dest.UsersDtos, src => src);
    }
}