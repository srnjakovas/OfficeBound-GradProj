using MediatR;
using OfficeBound.Application.Interfaces;
using OfficeBound.Contracts.Dtos;
using OfficeBound.Contracts.Exceptions;
using OfficeBound.Contracts.Responses;
using OfficeBound.Domain.Repositories;

namespace OfficeBound.Application.Commands.Auth.Login;

public class LoginCommandHandler : IRequestHandler<LoginCommand, LoginResponse>
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher _passwordHasher;

    public LoginCommandHandler(
        IUserRepository userRepository,
        IPasswordHasher passwordHasher)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
    }

    public async Task<LoginResponse> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByUsernameWithDepartmentAsync(request.Username, cancellationToken);

        if (user == null || !_passwordHasher.VerifyPassword(request.Password, user.Password))
        {
            throw new CustomValidationException(new List<Contracts.Errors.ValidationError>
            {
                new() { Property = "Login", ErrorMessage = "Invalid username or password" }
            });
        }

        if (!user.IsApproved)
        {
            throw new CustomValidationException(new List<OfficeBound.Contracts.Errors.ValidationError>
            {
                new() { Property = "Login", ErrorMessage = "Account is pending approval" }
            });
        }

        var userDto = new UserDto(
            user.Id,
            user.Username,
            user.Position,
            user.DepartmentId,
            user.Department?.DepartmentName,
            (int)user.Role,
            user.IsApproved,
            user.CreatedDate
        );

        var token = $"token_{user.Id}_{Guid.NewGuid()}";

        return new LoginResponse(userDto, token);
    }
}

