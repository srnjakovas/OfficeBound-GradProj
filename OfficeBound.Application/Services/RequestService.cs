using Mapster;
using OfficeBound.Application.Interfaces;
using OfficeBound.Contracts.Dtos;
using OfficeBound.Contracts.Exceptions;
using OfficeBound.Domain.Entities;
using OfficeBound.Domain.Enumerations;
using OfficeBound.Domain.Repositories;

namespace OfficeBound.Application.Services;

public class RequestService : IRequestService
{
    private readonly IRequestRepository _requestRepository;
    private readonly IUnitOfWork _unitOfWork;

    public RequestService(IRequestRepository requestRepository, IUnitOfWork unitOfWork)
    {
        _requestRepository = requestRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<IEnumerable<RequestDto>> GetAllRequestsAsync(CancellationToken cancellationToken = default)
    {
        var requests = await _requestRepository.GetAllAsync(cancellationToken);
        return requests.Adapt<IEnumerable<RequestDto>>();
    }

    public async Task<RequestDto> GetRequestByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var request = await _requestRepository.GetByIdAsync(id, cancellationToken);
        
        if (request is null)
        {
            throw new NotFoundException($"{nameof(Request)} with Id: {id} was not found in Database");
        }

        return request.Adapt<RequestDto>();
    }

    public async Task<int> CreateRequestAsync(string description, RequestType requestType, CancellationToken cancellationToken = default)
    {
        var request = new Request
        {
            Description = description,
            RequestType = requestType,
            RequestDate = DateTime.UtcNow,
            CreatedDate = DateTime.UtcNow,
            RequestStatus = RequestStatus.Pending
        };

        await _requestRepository.AddAsync(request, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return request.Id;
    }

    public async Task UpdateRequestAsync(int id, string description, RequestType requestType, CancellationToken cancellationToken = default)
    {
        var request = await _requestRepository.GetByIdAsync(id, cancellationToken);

        if (request is null)
        {
            throw new NotFoundException($"{nameof(Request)} with Id: {id} was not found in Database");
        }

        request.Description = description;
        request.RequestType = requestType;

        await _requestRepository.UpdateAsync(request, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteRequestAsync(int id, CancellationToken cancellationToken = default)
    {
        var request = await _requestRepository.GetByIdAsync(id, cancellationToken);

        if (request is null)
        {
            throw new NotFoundException($"{nameof(Request)} with Id: {id} was not found in Database");
        }

        await _requestRepository.DeleteAsync(request, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}

