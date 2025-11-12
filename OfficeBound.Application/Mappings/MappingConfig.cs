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

        TypeAdapterConfig<Request, RequestDto>.NewConfig()
            .Map(dest => dest.DepartmentName, src => src.Department != null ? src.Department.DepartmentName : null)
            .Map(dest => dest.CreatedByUsername, src => src.Users != null && src.Users.Any() ? src.Users.First().Username : null);

        TypeAdapterConfig<List<Department>, GetDepartmentsResponse>.NewConfig()
            .Map(dest => dest.DepartmentsDtos, src => src);
        
        TypeAdapterConfig<Department, GetDepartmentByIdResponse>.NewConfig()
            .Map(dest => dest.DepartmentDto, src => src);

        TypeAdapterConfig<Department, DepartmentDto>.NewConfig()
            .Map(dest => dest.ManagerId, src => src.ManagerId)
            .Map(dest => dest.ManagerName, src => src.Manager != null ? src.Manager.Username : null)
            .Map(dest => dest.IsActive, src => src.IsActive)
            .Map(dest => dest.RejectionReason, src => src.RejectionReason);

        TypeAdapterConfig<List<User>, GetUsersResponse>.NewConfig()
            .Map(dest => dest.UsersDtos, src => src);
    }
}