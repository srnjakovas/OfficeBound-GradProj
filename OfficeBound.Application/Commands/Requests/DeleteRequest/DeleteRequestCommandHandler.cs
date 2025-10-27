using MediatR;
using Microsoft.EntityFrameworkCore;
using OfficeBound.Contracts.Exceptions;
using OfficeBound.Domain.Entities;
using OfficeBound.Infrastructure;

namespace OfficeBound.Application.Commands.Requests.DeleteRequest;

public class DeleteRequestCommandHandler : IRequestHandler<DeleteRequestCommand, Unit>
{
    private readonly OfficeBoundDbContext _officeBoundDbContext;

    public DeleteRequestCommandHandler(OfficeBoundDbContext officeBoundDbContext)
    {
        _officeBoundDbContext = officeBoundDbContext;
    }
    
    public async Task<Unit> Handle(DeleteRequestCommand request, CancellationToken cancellationToken)
    {
        var requestToDelete = await _officeBoundDbContext.Requests.FirstOrDefaultAsync(r => r.Id == request.Id, cancellationToken);

        if (requestToDelete is null)
        {
            throw new NotFoundException($"{nameof(Request)} with Id: {request.Id} was not found to Database)");
        }

        _officeBoundDbContext.Requests.Remove(requestToDelete);
        await _officeBoundDbContext.SaveChangesAsync(cancellationToken);
        
        return Unit.Value;
    }
}