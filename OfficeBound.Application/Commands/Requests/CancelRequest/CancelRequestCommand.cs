using MediatR;

namespace OfficeBound.Application.Commands.Requests.CancelRequest;

public record CancelRequestCommand(int RequestId, string CancellationReason, int? UserId) : IRequest<Unit>;

