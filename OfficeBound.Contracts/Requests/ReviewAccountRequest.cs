namespace OfficeBound.Contracts.Requests;

public record ReviewAccountRequest(int UserAccountRequestId, bool IsApproved, string? Position, int? DepartmentId);

