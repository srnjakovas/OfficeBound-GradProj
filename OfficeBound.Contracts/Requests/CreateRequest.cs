using OfficeBound.Domain.Enumerations;

namespace OfficeBound.Contracts.Requests;

public record CreateRequest(string Description, RequestType RequestType);