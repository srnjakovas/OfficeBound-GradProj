using MediatR;

namespace OfficeBound.Application.Commands.Auth.ReviewAccount;

public record ReviewAccountCommand(int UserId, bool IsApproved, string? Position, int? DepartmentId, bool SetAsBranchManager = false) : IRequest;

