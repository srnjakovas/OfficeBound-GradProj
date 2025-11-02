using MediatR;

namespace OfficeBound.Application.Commands.Requests.ApproveRequest;

public record ApproveRequestCommand(int RequestId) : IRequest<Unit>;

