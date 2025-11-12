using MediatR;
using OfficeBound.Application.Interfaces;
using OfficeBound.Contracts.Exceptions;
using OfficeBound.Domain.Enumerations;
using OfficeBound.Domain.Repositories;

namespace OfficeBound.Application.Commands.Requests.CancelRequest;

public class CancelRequestCommandHandler : IRequestHandler<CancelRequestCommand, Unit>
{
    private readonly IRequestRepository _requestRepository;
    private readonly IUnitOfWork _unitOfWork;

    public CancelRequestCommandHandler(IRequestRepository requestRepository, IUnitOfWork unitOfWork)
    {
        _requestRepository = requestRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Unit> Handle(CancelRequestCommand request, CancellationToken cancellationToken)
    {
        var requestToCancel = await _requestRepository.GetByIdAsync(request.RequestId, cancellationToken);

        if (requestToCancel is null)
        {
            throw new NotFoundException($"Request with Id: {request.RequestId} was not found in Database");
        }

        if (!request.UserId.HasValue)
        {
            throw new CustomValidationException(new List<OfficeBound.Contracts.Errors.ValidationError>
            {
                new() { Property = "UserId", ErrorMessage = "User information is required to cancel a request" }
            });
        }

        var isOwner = requestToCancel.Users.Any(u => u.Id == request.UserId.Value);
        if (!isOwner)
        {
            throw new CustomValidationException(new List<OfficeBound.Contracts.Errors.ValidationError>
            {
                new() { Property = "RequestId", ErrorMessage = "You can only cancel your own requests" }
            });
        }

        if (requestToCancel.RequestStatus != RequestStatus.Pending && requestToCancel.RequestStatus != RequestStatus.Approved)
        {
            throw new CustomValidationException(new List<OfficeBound.Contracts.Errors.ValidationError>
            {
                new() { Property = "RequestStatus", ErrorMessage = "Only pending or approved requests can be cancelled" }
            });
        }

        if (string.IsNullOrWhiteSpace(request.CancellationReason))
        {
            throw new CustomValidationException(new List<OfficeBound.Contracts.Errors.ValidationError>
            {
                new() { Property = "CancellationReason", ErrorMessage = "Cancellation reason is required" }
            });
        }

        requestToCancel.RequestStatus = RequestStatus.CancelledByUser;
        requestToCancel.RejectionReason = request.CancellationReason;

        await _requestRepository.UpdateAsync(requestToCancel, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}

