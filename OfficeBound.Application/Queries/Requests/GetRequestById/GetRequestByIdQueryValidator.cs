using FluentValidation;
using OfficeBound.Domain.Entities;

namespace OfficeBound.Application.Queries.Requests.GetRequestById;

public class GetRequestByIdQueryValidator : AbstractValidator<GetRequestByIdQuery>
{
    public GetRequestByIdQueryValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty()
            .WithMessage($"{nameof(Request.Id)} cannot be empty");
    }
}