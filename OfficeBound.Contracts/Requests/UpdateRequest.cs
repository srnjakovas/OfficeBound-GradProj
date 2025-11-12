using OfficeBound.Domain.Enumerations;

namespace OfficeBound.Contracts.Requests;

public record UpdateRequest(string Description, RequestType RequestType, DateTime? RequestDate, int? DepartmentId, int? UserId);