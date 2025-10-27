using FluentValidation;
using OfficeBound.Domain.Entities;

namespace OfficeBound.Application.Commands.Requests.DeleteRequest;

public class DeleteRequestCommandValidator : AbstractValidator<DeleteRequestCommand>
{
    public DeleteRequestCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty()
            .WithMessage($"{nameof(Request.Id)} cannot be empty");
    }
}