using MediatR;
using OfficeBound.Domain.Enumerations;

namespace OfficeBound.Application.Commands.Requests.CreateRequest;

public record CreateRequestCommand(string Description, RequestType RequestType) : IRequest<int>;