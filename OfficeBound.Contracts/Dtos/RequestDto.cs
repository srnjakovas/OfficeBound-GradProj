using OfficeBound.Domain.Enumerations;

namespace OfficeBound.Contracts.Dtos;

public record RequestDto(int Id, string Description, RequestType RequestType, DateTime CreatedDate);