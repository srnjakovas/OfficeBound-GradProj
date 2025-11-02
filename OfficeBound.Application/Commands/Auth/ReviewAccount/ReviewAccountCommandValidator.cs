using FluentValidation;

namespace OfficeBound.Application.Commands.Auth.ReviewAccount;

public class ReviewAccountCommandValidator : AbstractValidator<ReviewAccountCommand>
{
    public ReviewAccountCommandValidator()
    {
        RuleFor(x => x.UserId)
            .GreaterThan(0)
            .WithMessage("User ID is required");

        When(x => x.IsApproved, () =>
        {
            RuleFor(x => x.Position)
                .NotEmpty()
                .WithMessage("Position is required when approving an account");

            RuleFor(x => x.DepartmentId)
                .GreaterThan(0)
                .WithMessage("Department is required when approving an account");
        });
    }
}

