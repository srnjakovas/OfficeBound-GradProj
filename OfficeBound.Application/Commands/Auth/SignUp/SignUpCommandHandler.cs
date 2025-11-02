using MediatR;
using OfficeBound.Application.Interfaces;
using OfficeBound.Contracts.Exceptions;
using OfficeBound.Domain.Entities;
using OfficeBound.Domain.Repositories;

namespace OfficeBound.Application.Commands.Auth.SignUp;

public class SignUpCommandHandler : IRequestHandler<SignUpCommand, int>
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IUnitOfWork _unitOfWork;

    public SignUpCommandHandler(
        IUserRepository userRepository,
        IPasswordHasher passwordHasher,
        IUnitOfWork unitOfWork)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
        _unitOfWork = unitOfWork;
    }

    public async Task<int> Handle(SignUpCommand request, CancellationToken cancellationToken)
    {
        // Check if username already exists (approved or pending)
        var existingUser = await _userRepository.GetByUsernameAsync(request.Username, cancellationToken);
        if (existingUser != null)
        {
            throw new CustomValidationException(new List<Contracts.Errors.ValidationError>
            {
                new() { Property = "Username", ErrorMessage = "Username already exists" }
            });
        }

        // Create new user with pending approval
        var user = new User
        {
            Username = request.Username,
            Password = _passwordHasher.HashPassword(request.Password),
            IsApproved = false,
            CreatedDate = DateTime.UtcNow
        };

        await _userRepository.AddAsync(user, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return user.Id;
    }
}

