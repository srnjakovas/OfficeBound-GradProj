using FluentValidation;
using OfficeBound.Domain.Entities;

namespace OfficeBound.Application.Commands.Requests.UpdateRequest;

public class UpdateRequestCommandValidator : AbstractValidator<UpdateRequestCommand>
{
    public UpdateRequestCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty()
            .WithMessage($"{nameof(Request.Id)} cannot be empty");
        
        RuleFor(x => x.Description)
            .NotEmpty()
            .WithMessage($"{nameof(Request.Description)} cannot be empty")
            .MaximumLength(150)
            .WithMessage($"{nameof(Request.Description)} cannot be longer than 150 characters");

        RuleFor(x => x.RequestType)
            .IsInEnum()
            .WithMessage($"{nameof(Request.RequestType)} must be a valid request type");

        RuleFor(x => x.RequestDate)
            .Must(date => !date.HasValue || date.Value.Date >= DateTime.Today.AddDays(1))
            .WithMessage("Request Date must be at least tomorrow (cannot be today or in the past)");
    }
}