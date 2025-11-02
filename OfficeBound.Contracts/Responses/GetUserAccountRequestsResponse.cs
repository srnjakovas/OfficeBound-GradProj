using OfficeBound.Contracts.Dtos;

namespace OfficeBound.Contracts.Responses;

public record GetUserAccountRequestsResponse(List<UserAccountRequestDto> UserAccountRequests);

