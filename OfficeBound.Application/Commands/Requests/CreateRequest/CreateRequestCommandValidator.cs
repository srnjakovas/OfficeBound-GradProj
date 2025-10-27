using FluentValidation;
using OfficeBound.Domain.Entities;

namespace OfficeBound.Application.Commands.Requests.CreateRequest;

public class CreateRequestCommandValidator : AbstractValidator<CreateRequestCommand>
{
    public CreateRequestCommandValidator()
    {
        RuleFor(x => x.Description)
            .NotEmpty()
            .WithMessage($"{nameof(Request.Description)} cannot be empty")
            .MaximumLength(150)
            .WithMessage($"{nameof(Request.Description)} cannot be longer than 150 characters");
        
        RuleFor(x => x.RequestType)
            .NotEmpty()
            .WithMessage($"{nameof(Request.RequestType)} cannot be empty");
    }
}