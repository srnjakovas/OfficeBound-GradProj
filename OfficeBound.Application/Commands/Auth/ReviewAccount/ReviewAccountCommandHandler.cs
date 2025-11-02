using MediatR;
using OfficeBound.Application.Interfaces;
using OfficeBound.Contracts.Exceptions;
using OfficeBound.Domain.Entities;
using OfficeBound.Domain.Enumerations;
using OfficeBound.Domain.Repositories;

namespace OfficeBound.Application.Commands.Auth.ReviewAccount;

public class ReviewAccountCommandHandler : IRequestHandler<ReviewAccountCommand>
{
    private readonly IUserAccountRequestRepository _userAccountRequestRepository;
    private readonly IUserRepository _userRepository;
    private readonly IUnitOfWork _unitOfWork;

    public ReviewAccountCommandHandler(
        IUserAccountRequestRepository userAccountRequestRepository,
        IUserRepository userRepository,
        IUnitOfWork unitOfWork)
    {
        _userAccountRequestRepository = userAccountRequestRepository;
        _userRepository = userRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task Handle(ReviewAccountCommand request, CancellationToken cancellationToken)
    {
        var accountRequest = await _userAccountRequestRepository.GetByIdAsync(request.UserAccountRequestId);
        
        if (accountRequest == null)
        {
            throw new NotFoundException($"User account request with ID {request.UserAccountRequestId} not found");
        }

        if (accountRequest.IsReviewed)
        {
            throw new CustomValidationException(new List<OfficeBound.Contracts.Errors.ValidationError>
            {
                new() { Property = "Review", ErrorMessage = "Account request has already been reviewed" }
            });
        }

        accountRequest.IsReviewed = true;
        accountRequest.IsApproved = request.IsApproved;
        accountRequest.ReviewedDate = DateTime.UtcNow;

        if (request.IsApproved)
        {
            var user = new User
            {
                Username = accountRequest.Username,
                Password = accountRequest.Password,
                Role = Role.User,
                Position = request.Position,
                DepartmentId = request.DepartmentId,
                IsApproved = true,
                CreatedDate = DateTime.UtcNow
            };

            await _userRepository.AddAsync(user, cancellationToken);
        }

        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}

