using MediatR;
using OfficeBound.Contracts.Responses;

namespace OfficeBound.Application.Queries.OfficeResources.GetOfficeResources;

public record GetOfficeResourcesQuery : IRequest<GetOfficeResourcesResponse>;

