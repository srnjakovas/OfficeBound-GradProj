namespace OfficeBound.Contracts.Requests;

public record ReviewAccountRequest(int UserId, bool IsApproved, string? Position, int? DepartmentId, bool SetAsBranchManager = false);

