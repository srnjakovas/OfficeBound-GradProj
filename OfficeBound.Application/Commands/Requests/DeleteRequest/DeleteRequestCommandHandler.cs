using MediatR;
using OfficeBound.Application.Interfaces;
using OfficeBound.Contracts.Exceptions;
using OfficeBound.Domain.Entities;
using OfficeBound.Domain.Repositories;

namespace OfficeBound.Application.Commands.Requests.DeleteRequest;

public class DeleteRequestCommandHandler : IRequestHandler<DeleteRequestCommand, Unit>
{
    private readonly IRequestRepository _requestRepository;
    private readonly IUnitOfWork _unitOfWork;

    public DeleteRequestCommandHandler(IRequestRepository requestRepository, IUnitOfWork unitOfWork)
    {
        _requestRepository = requestRepository;
        _unitOfWork = unitOfWork;
    }
    
    public async Task<Unit> Handle(DeleteRequestCommand request, CancellationToken cancellationToken)
    {
        var requestToDelete = await _requestRepository.GetByIdAsync(request.Id, cancellationToken);

        if (requestToDelete is null)
        {
            throw new NotFoundException($"{nameof(Request)} with Id: {request.Id} was not found in Database");
        }

        await _requestRepository.DeleteAsync(requestToDelete, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        
        return Unit.Value;
    }
}