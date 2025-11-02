using MediatR;
using OfficeBound.Application.Interfaces;
using OfficeBound.Contracts.Exceptions;
using OfficeBound.Domain.Repositories;

namespace OfficeBound.Application.Commands.Auth.ReviewAccount;

public class ReviewAccountCommandHandler : IRequestHandler<ReviewAccountCommand>
{
    private readonly IUserRepository _userRepository;
    private readonly IUnitOfWork _unitOfWork;

    public ReviewAccountCommandHandler(
        IUserRepository userRepository,
        IUnitOfWork unitOfWork)
    {
        _userRepository = userRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task Handle(ReviewAccountCommand request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByIdAsync(request.UserId);
        
        if (user == null)
        {
            throw new NotFoundException($"User with ID {request.UserId} not found");
        }

        if (user.IsApproved || user.ReviewedDate.HasValue)
        {
            throw new CustomValidationException(new List<OfficeBound.Contracts.Errors.ValidationError>
            {
                new() { Property = "Review", ErrorMessage = "Account has already been reviewed" }
            });
        }

        // Update user with review information
        user.IsApproved = request.IsApproved;
        user.ReviewedDate = DateTime.UtcNow;

        if (request.IsApproved)
        {
            user.Position = request.Position;
            user.DepartmentId = request.DepartmentId;
        }

        await _userRepository.UpdateAsync(user, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}

