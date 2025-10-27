using MediatR;

namespace OfficeBound.Application.Commands.Requests.DeleteRequest;

public record DeleteRequestCommand(int Id) : IRequest<Unit>;