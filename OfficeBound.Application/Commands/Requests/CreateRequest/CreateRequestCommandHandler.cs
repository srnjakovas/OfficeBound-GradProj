using MediatR;
using OfficeBound.Application.Interfaces;
using OfficeBound.Domain.Entities;
using OfficeBound.Domain.Enumerations;
using OfficeBound.Domain.Repositories;

namespace OfficeBound.Application.Commands.Requests.CreateRequest;

public class CreateRequestCommandHandler : IRequestHandler<CreateRequestCommand, int>
{
    private readonly IRequestRepository _requestRepository;
    private readonly IUnitOfWork _unitOfWork;
    
    public CreateRequestCommandHandler(IRequestRepository requestRepository, IUnitOfWork unitOfWork)
    {
        _requestRepository = requestRepository;
        _unitOfWork = unitOfWork;
    }
    
    public async Task<int> Handle(CreateRequestCommand requestCommand, CancellationToken cancellationToken)
    {
        var defaultRequestDate = DateTime.Today.AddDays(1).ToUniversalTime();
        
        var request = new Request
        {
            Description = requestCommand.Description,
            RequestType = requestCommand.RequestType,
            RequestDate = requestCommand.RequestDate?.ToUniversalTime() ?? defaultRequestDate,
            CreatedDate = DateTime.UtcNow,
            RequestStatus = RequestStatus.Pending,
            DepartmentId = requestCommand.DepartmentId
        };

        await _requestRepository.AddAsync(request, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return request.Id;
    }
}