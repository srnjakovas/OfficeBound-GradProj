using MediatR;
using OfficeBound.Application.Interfaces;
using OfficeBound.Contracts.Exceptions;
using OfficeBound.Domain.Entities;
using OfficeBound.Domain.Enumerations;
using OfficeBound.Domain.Repositories;

namespace OfficeBound.Application.Commands.Requests.RejectRequest;

public class RejectRequestCommandHandler : IRequestHandler<RejectRequestCommand, Unit>
{
    private readonly IRequestRepository _requestRepository;
    private readonly IUnitOfWork _unitOfWork;

    public RejectRequestCommandHandler(IRequestRepository requestRepository, IUnitOfWork unitOfWork)
    {
        _requestRepository = requestRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Unit> Handle(RejectRequestCommand request, CancellationToken cancellationToken)
    {
        var requestToReject = await _requestRepository.GetByIdAsync(request.RequestId, cancellationToken);

        if (requestToReject is null)
        {
            throw new NotFoundException($"Request with Id: {request.RequestId} was not found in Database");
        }

        if (requestToReject.RequestStatus != RequestStatus.Pending)
        {
            throw new CustomValidationException(new List<OfficeBound.Contracts.Errors.ValidationError>
            {
                new() { Property = "RequestStatus", ErrorMessage = "Only pending requests can be rejected" }
            });
        }

        if (string.IsNullOrWhiteSpace(request.RejectionReason))
        {
            throw new CustomValidationException(new List<OfficeBound.Contracts.Errors.ValidationError>
            {
                new() { Property = "RejectionReason", ErrorMessage = "Rejection reason is required" }
            });
        }

        requestToReject.RequestStatus = RequestStatus.Rejected;
        requestToReject.RejectionReason = request.RejectionReason;

        await _requestRepository.UpdateAsync(requestToReject, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}

