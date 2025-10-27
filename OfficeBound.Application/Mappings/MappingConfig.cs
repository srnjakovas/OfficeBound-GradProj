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
    }
}