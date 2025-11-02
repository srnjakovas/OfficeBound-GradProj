using MediatR;
using OfficeBound.Contracts.Responses;

namespace OfficeBound.Application.Commands.Auth.Login;

public record LoginCommand(string Username, string Password) : IRequest<LoginResponse>;

