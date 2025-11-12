using MediatR;
using OfficeBound.Contracts.Exceptions;
using OfficeBound.Contracts.Responses;
using OfficeBound.Domain.Entities;
using OfficeBound.Domain.Repositories;

namespace OfficeBound.Application.Queries.Requests.GetRequestById;

public class GetRequestByIdQueryHandler : IRequestHandler<GetRequestByIdQuery, GetRequestByIdResponse>
{
    private readonly IRequestRepository _requestRepository;
    public GetRequestByIdQueryHandler(IRequestRepository requestRepository)
    {
        _requestRepository = requestRepository;
    }

    public async Task<GetRequestByIdResponse> Handle(GetRequestByIdQuery request, CancellationToken cancellationToken)
    {
        var requestById = await _requestRepository.GetByIdAsync(request.Id, cancellationToken);

        if (requestById is null)
        {
            throw new NotFoundException($"{nameof(Request)} with Id: {request.Id} was not found in Database");
        }

        var createdByUsername = requestById.Users?.FirstOrDefault()?.Username;

        var requestDto = new Contracts.Dtos.RequestDto(
            requestById.Id,
            requestById.Description,
            requestById.RequestType,
            requestById.CreatedDate,
            requestById.RequestDate,
            requestById.RequestStatus,
            requestById.RejectionReason,
            requestById.DepartmentId,
            requestById.Department?.DepartmentName,
            createdByUsername
        );

        return new GetRequestByIdResponse(requestDto);
    }
}