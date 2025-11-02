using MediatR;

namespace OfficeBound.Application.Commands.Auth.ReviewAccount;

public record ReviewAccountCommand(int UserAccountRequestId, bool IsApproved, string? Position, int? DepartmentId) : IRequest;

