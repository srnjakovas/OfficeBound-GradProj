using MediatR;

namespace OfficeBound.Application.Commands.Auth.SignUp;

public record SignUpCommand(string Username, string Password, string ConfirmPassword) : IRequest<int>;

