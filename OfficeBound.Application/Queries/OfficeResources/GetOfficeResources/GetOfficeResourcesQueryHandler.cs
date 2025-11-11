using MediatR;
using Microsoft.Extensions.Options;
using OfficeBound.Application.Configuration;
using OfficeBound.Contracts.Responses;

namespace OfficeBound.Application.Queries.OfficeResources.GetOfficeResources;

public class GetOfficeResourcesQueryHandler : IRequestHandler<GetOfficeResourcesQuery, GetOfficeResourcesResponse>
{
    private readonly OfficeResourcesConfiguration _officeResources;

    public GetOfficeResourcesQueryHandler(IOptions<OfficeResourcesConfiguration> officeResources)
    {
        _officeResources = officeResources.Value;
    }

    public Task<GetOfficeResourcesResponse> Handle(GetOfficeResourcesQuery request, CancellationToken cancellationToken)
    {
        return Task.FromResult(new GetOfficeResourcesResponse(
            _officeResources.NumberOfConferenceRooms,
            _officeResources.NumberOfDesks,
            _officeResources.NumberOfParkingSpaces
        ));
    }
}

