using OfficeBound.Contracts.Dtos;

namespace OfficeBound.Contracts.Responses;

public record GetUsersResponse(List<UserDto> UsersDtos);

