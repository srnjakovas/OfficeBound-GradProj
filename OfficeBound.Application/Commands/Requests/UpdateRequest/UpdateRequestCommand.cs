using MediatR;
using OfficeBound.Domain.Enumerations;

namespace OfficeBound.Application.Commands.Requests.UpdateRequest;

public record UpdateRequestCommand(int Id, string Description, RequestType RequestType, DateTime? RequestDate, int? DepartmentId, int? UserId) : IRequest<Unit>;