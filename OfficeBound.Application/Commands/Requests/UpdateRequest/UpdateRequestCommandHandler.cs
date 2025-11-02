using MediatR;
using OfficeBound.Application.Interfaces;
using OfficeBound.Contracts.Exceptions;
using OfficeBound.Domain.Entities;
using OfficeBound.Domain.Repositories;

namespace OfficeBound.Application.Commands.Requests.UpdateRequest;

public class UpdateRequestCommandHandler : IRequestHandler<UpdateRequestCommand, Unit>
{
    private readonly IRequestRepository _requestRepository;
    private readonly IUnitOfWork _unitOfWork;

    public UpdateRequestCommandHandler(IRequestRepository requestRepository, IUnitOfWork unitOfWork)
    {
        _requestRepository = requestRepository;
        _unitOfWork = unitOfWork;
    }
    
    public async Task<Unit> Handle(UpdateRequestCommand request, CancellationToken cancellationToken)
    {
        var requestToUpdate = await _requestRepository.GetByIdAsync(request.Id, cancellationToken);

        if (requestToUpdate is null)
        {
            throw new NotFoundException($"{nameof(Request)} with Id: {request.Id} was not found in Database");
        }

        requestToUpdate.Description = request.Description;
        requestToUpdate.RequestType = request.RequestType;
        requestToUpdate.DepartmentId = request.DepartmentId;
        
        if (request.RequestDate.HasValue)
        {
            requestToUpdate.RequestDate = request.RequestDate.Value.ToUniversalTime();
        }

        await _requestRepository.UpdateAsync(requestToUpdate, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        
        return Unit.Value;
    }
}