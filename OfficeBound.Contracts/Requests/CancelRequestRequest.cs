namespace OfficeBound.Contracts.Requests;

public record CancelRequestRequest(string CancellationReason, int? UserId);

