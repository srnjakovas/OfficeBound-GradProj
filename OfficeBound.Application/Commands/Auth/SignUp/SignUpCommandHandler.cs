using MediatR;
using OfficeBound.Application.Interfaces;
using OfficeBound.Contracts.Exceptions;
using OfficeBound.Domain.Entities;
using OfficeBound.Domain.Repositories;

namespace OfficeBound.Application.Commands.Auth.SignUp;

public class SignUpCommandHandler : IRequestHandler<SignUpCommand, int>
{
    private readonly IUserAccountRequestRepository _userAccountRequestRepository;
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IUnitOfWork _unitOfWork;

    public SignUpCommandHandler(
        IUserAccountRequestRepository userAccountRequestRepository,
        IUserRepository userRepository,
        IPasswordHasher passwordHasher,
        IUnitOfWork unitOfWork)
    {
        _userAccountRequestRepository = userAccountRequestRepository;
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
        _unitOfWork = unitOfWork;
    }

    public async Task<int> Handle(SignUpCommand request, CancellationToken cancellationToken)
    {
        // Check if username already exists in User table
        var existingUser = await _userRepository.GetByUsernameAsync(request.Username, cancellationToken);
        if (existingUser != null)
        {
            throw new CustomValidationException(new List<Contracts.Errors.ValidationError>
            {
                new() { Property = "Username", ErrorMessage = "Username already exists" }
            });
        }

        // Check if username already exists in pending requests
        var existingRequest = (await _userAccountRequestRepository.GetAllAsync(cancellationToken))
            .FirstOrDefault(uar => uar.Username == request.Username && !uar.IsReviewed);
        
        if (existingRequest != null)
        {
            throw new CustomValidationException(new List<Contracts.Errors.ValidationError>
            {
                new() { Property = "Username", ErrorMessage = "Account request already pending review" }
            });
        }

        // Create new account request
        var userAccountRequest = new UserAccountRequest
        {
            Username = request.Username,
            Password = _passwordHasher.HashPassword(request.Password),
            IsReviewed = false,
            IsApproved = false,
            CreatedDate = DateTime.UtcNow
        };

        await _userAccountRequestRepository.AddAsync(userAccountRequest, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return userAccountRequest.Id;
    }
}

