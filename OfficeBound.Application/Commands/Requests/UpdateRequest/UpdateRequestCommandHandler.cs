using MediatR;
using Microsoft.EntityFrameworkCore;
using OfficeBound.Contracts.Exceptions;
using OfficeBound.Domain.Entities;
using OfficeBound.Infrastructure;

namespace OfficeBound.Application.Commands.Requests.UpdateRequest;

public class UpdateRequestCommandHandler : IRequestHandler<UpdateRequestCommand, Unit>
{
    private readonly OfficeBoundDbContext _officeBoundDbContext;

    public UpdateRequestCommandHandler(OfficeBoundDbContext officeBoundDbContext)
    {
        _officeBoundDbContext = officeBoundDbContext;
    }
    
    public async Task<Unit> Handle(UpdateRequestCommand request, CancellationToken cancellationToken)
    {
        var requestToUpdate = await _officeBoundDbContext.Requests.FirstOrDefaultAsync(r => r.Id == request.Id, cancellationToken);

        if (requestToUpdate is null)
        {
            throw new NotFoundException($"{nameof(Request)} with Id: {request.Id} was not found to Database)");
        }

        requestToUpdate.Description = request.Description;
        requestToUpdate.RequestType = request.RequestType;

        _officeBoundDbContext.Requests.Update(requestToUpdate);
        await _officeBoundDbContext.SaveChangesAsync(cancellationToken);
        
        return Unit.Value;
    }
}