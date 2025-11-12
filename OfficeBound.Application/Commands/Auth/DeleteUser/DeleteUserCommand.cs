using MediatR;

namespace OfficeBound.Application.Commands.Auth.DeleteUser;

public record DeleteUserCommand(int Id, string RejectionReason) : IRequest<Unit>;

