using MediatR;

namespace OfficeBound.Application.Commands.Requests.RejectRequest;

public record RejectRequestCommand(int RequestId, string RejectionReason) : IRequest<Unit>;

