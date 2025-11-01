using OfficeBound.Contracts.Dtos;
using OfficeBound.Contracts.Responses;
using OfficeBound.Domain.Enumerations;

namespace OfficeBound.Application.Services;

public interface IRequestService
{
    Task<IEnumerable<RequestDto>> GetAllRequestsAsync(CancellationToken cancellationToken = default);
    Task<RequestDto> GetRequestByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<int> CreateRequestAsync(string description, RequestType requestType, CancellationToken cancellationToken = default);
    Task UpdateRequestAsync(int id, string description, RequestType requestType, CancellationToken cancellationToken = default);
    Task DeleteRequestAsync(int id, CancellationToken cancellationToken = default);
}

