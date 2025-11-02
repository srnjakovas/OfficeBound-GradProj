using MediatR;
using OfficeBound.Application.Interfaces;
using OfficeBound.Contracts.Exceptions;
using OfficeBound.Domain.Entities;
using OfficeBound.Domain.Enumerations;
using OfficeBound.Domain.Repositories;

namespace OfficeBound.Application.Commands.Requests.ApproveRequest;

public class ApproveRequestCommandHandler : IRequestHandler<ApproveRequestCommand, Unit>
{
    private readonly IRequestRepository _requestRepository;
    private readonly IUnitOfWork _unitOfWork;

    public ApproveRequestCommandHandler(IRequestRepository requestRepository, IUnitOfWork unitOfWork)
    {
        _requestRepository = requestRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Unit> Handle(ApproveRequestCommand request, CancellationToken cancellationToken)
    {
        var requestToApprove = await _requestRepository.GetByIdAsync(request.RequestId, cancellationToken);

        if (requestToApprove is null)
        {
            throw new NotFoundException($"Request with Id: {request.RequestId} was not found in Database");
        }

        if (requestToApprove.RequestStatus != RequestStatus.Pending)
        {
            throw new CustomValidationException(new List<OfficeBound.Contracts.Errors.ValidationError>
            {
                new() { Property = "RequestStatus", ErrorMessage = "Only pending requests can be approved" }
            });
        }

        requestToApprove.RequestStatus = RequestStatus.Approved;

        await _requestRepository.UpdateAsync(requestToApprove, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}

