using OfficeBound.Application.Interfaces;
using OfficeBound.Domain.Enumerations;
using OfficeBound.Domain.Repositories;

namespace OfficeBound.Presentation.Services;

public class MarkRequestsAsExpiredJob
{
    private readonly IRequestRepository _requestRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<MarkRequestsAsExpiredJob> _logger;

    public MarkRequestsAsExpiredJob(
        IRequestRepository requestRepository,
        IUnitOfWork unitOfWork,
        ILogger<MarkRequestsAsExpiredJob> logger)
    {
        _requestRepository = requestRepository;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task MarkRequestsAsExpiredAsync()
    {
        try
        {
            _logger.LogInformation("Starting mark requests as expired job at {Time}", DateTime.UtcNow);

            var today = DateTime.Today;
            var allRequests = await _requestRepository.GetAllAsync();

            var requestsToMarkAsExpired = allRequests
                .Where(r => r.RequestDate < today && r.RequestStatus == RequestStatus.Pending)
                .ToList();

            if (!requestsToMarkAsExpired.Any())
            {
                _logger.LogInformation("No requests found to mark as expired");
                return;
            }

            foreach (var request in requestsToMarkAsExpired)
            {
                request.RequestStatus = RequestStatus.Expired;
                await _requestRepository.UpdateAsync(request);
            }

            await _unitOfWork.SaveChangesAsync();

            _logger.LogInformation("Successfully marked {Count} request(s) as expired", requestsToMarkAsExpired.Count);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while marking requests as expired");
            throw;
        }
    }
}

