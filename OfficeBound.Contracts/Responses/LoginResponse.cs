using OfficeBound.Contracts.Dtos;

namespace OfficeBound.Contracts.Responses;

public record LoginResponse(UserDto User, string Token);

