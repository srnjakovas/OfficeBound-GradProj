using FluentValidation;

namespace OfficeBound.Application.Commands.Departments.CreateDepartment;

public class CreateDepartmentCommandValidator : AbstractValidator<CreateDepartmentCommand>
{
    public CreateDepartmentCommandValidator()
    {
        RuleFor(x => x.DepartmentName)
            .NotEmpty()
            .WithMessage("Department Name cannot be empty")
            .MaximumLength(100)
            .WithMessage("Department Name cannot be longer than 100 characters");

        RuleFor(x => x.NumberOfPeople)
            .GreaterThan(0)
            .WithMessage("Number of People must be greater than 0");
    }
}

