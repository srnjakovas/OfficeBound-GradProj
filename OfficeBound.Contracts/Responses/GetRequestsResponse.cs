using OfficeBound.Contracts.Dtos;

namespace OfficeBound.Contracts.Responses;

public record GetRequestsResponse(List<RequestDto> RequestsDtos);