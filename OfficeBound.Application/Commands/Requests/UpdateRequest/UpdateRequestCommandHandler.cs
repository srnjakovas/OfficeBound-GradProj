using MediatR;
using Microsoft.Extensions.Options;
using OfficeBound.Application.Configuration;
using OfficeBound.Application.Interfaces;
using OfficeBound.Contracts.Exceptions;
using OfficeBound.Domain.Entities;
using OfficeBound.Domain.Enumerations;
using OfficeBound.Domain.Repositories;

namespace OfficeBound.Application.Commands.Requests.UpdateRequest;

public class UpdateRequestCommandHandler : IRequestHandler<UpdateRequestCommand, Unit>
{
    private readonly IRequestRepository _requestRepository;
    private readonly IUserRepository _userRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly OfficeResourcesConfiguration _officeResources;

    public UpdateRequestCommandHandler(
        IRequestRepository requestRepository,
        IUserRepository userRepository,
        IUnitOfWork unitOfWork,
        IOptions<OfficeResourcesConfiguration> officeResources)
    {
        _requestRepository = requestRepository;
        _userRepository = userRepository;
        _unitOfWork = unitOfWork;
        _officeResources = officeResources.Value;
    }
    
    public async Task<Unit> Handle(UpdateRequestCommand request, CancellationToken cancellationToken)
    {
        var requestToUpdate = await _requestRepository.GetByIdAsync(request.Id, cancellationToken);

        if (requestToUpdate is null)
        {
            throw new NotFoundException($"{nameof(Request)} with Id: {request.Id} was not found in Database");
        }

        // Validate user can select Conference Room types
        if (request.RequestType == RequestType.ConferenceRoom || request.RequestType == RequestType.ConferenceRoomWithParking)
        {
            if (!request.UserId.HasValue)
            {
                throw new CustomValidationException(new List<Contracts.Errors.ValidationError>
                {
                    new() { Property = nameof(UpdateRequestCommand.RequestType), ErrorMessage = "User information is required for Conference Room requests" }
                });
            }

            var user = await _userRepository.GetByIdAsync(request.UserId.Value, cancellationToken);
            if (user == null)
            {
                throw new CustomValidationException(new List<Contracts.Errors.ValidationError>
                {
                    new() { Property = nameof(UpdateRequestCommand.RequestType), ErrorMessage = "User not found" }
                });
            }

            if (user.Role != Role.Manager && user.Role != Role.BranchManager && user.Role != Role.Administrator)
            {
                throw new CustomValidationException(new List<Contracts.Errors.ValidationError>
                {
                    new() { Property = nameof(UpdateRequestCommand.RequestType), ErrorMessage = "Only Managers, Branch Managers, and Administrators can request Conference Rooms" }
                });
            }
        }

        var requestDate = request.RequestDate?.ToUniversalTime() ?? requestToUpdate.RequestDate;
        
        await ValidateAvailabilityAsync(request.RequestType, requestDate, request.Id, cancellationToken);

        requestToUpdate.Description = request.Description;
        requestToUpdate.RequestType = request.RequestType;
        requestToUpdate.DepartmentId = request.DepartmentId;
        
        if (request.RequestDate.HasValue)
        {
            requestToUpdate.RequestDate = request.RequestDate.Value.ToUniversalTime();
        }

        await _requestRepository.UpdateAsync(requestToUpdate, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        
        return Unit.Value;
    }

    private async Task ValidateAvailabilityAsync(
        RequestType requestType, 
        DateTime requestDate, 
        int excludeRequestId, 
        CancellationToken cancellationToken)
    {
        var errors = new List<Contracts.Errors.ValidationError>();

        switch (requestType)
        {
            case RequestType.Desk:
                var deskCount = await _requestRepository.CountByTypeAndDateExcludingIdAsync(
                    RequestType.Desk, requestDate, excludeRequestId, cancellationToken);
                
                var deskWithParkingCount = await _requestRepository.CountByTypeAndDateExcludingIdAsync(
                    RequestType.DeskWithParking, requestDate, excludeRequestId, cancellationToken);
                
                var totalDesksUsed = deskCount + deskWithParkingCount;
                if (totalDesksUsed >= _officeResources.NumberOfDesks)
                {
                    errors.Add(new Contracts.Errors.ValidationError
                    {
                        Property = nameof(UpdateRequestCommand.RequestType),
                        ErrorMessage = $"No desks available for {requestDate:yyyy-MM-dd}. Available: {_officeResources.NumberOfDesks - totalDesksUsed}, Required: 1"
                    });
                }
                break;

            case RequestType.DeskWithParking:
                var deskCount2 = await _requestRepository.CountByTypeAndDateExcludingIdAsync(
                    RequestType.Desk, requestDate, excludeRequestId, cancellationToken);
                
                var deskWithParkingCount2 = await _requestRepository.CountByTypeAndDateExcludingIdAsync(
                    RequestType.DeskWithParking, requestDate, excludeRequestId, cancellationToken);
                
                var totalDesksUsed2 = deskCount2 + deskWithParkingCount2;
                if (totalDesksUsed2 >= _officeResources.NumberOfDesks)
                {
                    errors.Add(new Contracts.Errors.ValidationError
                    {
                        Property = nameof(UpdateRequestCommand.RequestType),
                        ErrorMessage = $"No desks available for {requestDate:yyyy-MM-dd}. Available: {_officeResources.NumberOfDesks - totalDesksUsed2}, Required: 1"
                    });
                }

                var conferenceRoomWithParkingCount2 = await _requestRepository.CountByTypeAndDateExcludingIdAsync(
                    RequestType.ConferenceRoomWithParking, requestDate, excludeRequestId, cancellationToken);
                
                var totalParkingUsed2 = deskWithParkingCount2 + conferenceRoomWithParkingCount2;
                if (totalParkingUsed2 >= _officeResources.NumberOfParkingSpaces)
                {
                    errors.Add(new Contracts.Errors.ValidationError
                    {
                        Property = nameof(UpdateRequestCommand.RequestType),
                        ErrorMessage = $"No parking spaces available for {requestDate:yyyy-MM-dd}. Available: {_officeResources.NumberOfParkingSpaces - totalParkingUsed2}, Required: 1"
                    });
                }
                break;

            case RequestType.ConferenceRoom:
                var conferenceRoomCount = await _requestRepository.CountByTypeAndDateExcludingIdAsync(
                    RequestType.ConferenceRoom, requestDate, excludeRequestId, cancellationToken);
                
                var conferenceRoomWithParkingCount = await _requestRepository.CountByTypeAndDateExcludingIdAsync(
                    RequestType.ConferenceRoomWithParking, requestDate, excludeRequestId, cancellationToken);
                
                var totalConferenceRoomsUsed = conferenceRoomCount + conferenceRoomWithParkingCount;
                if (totalConferenceRoomsUsed >= _officeResources.NumberOfConferenceRooms)
                {
                    errors.Add(new Contracts.Errors.ValidationError
                    {
                        Property = nameof(UpdateRequestCommand.RequestType),
                        ErrorMessage = $"No conference rooms available for {requestDate:yyyy-MM-dd}. Available: {_officeResources.NumberOfConferenceRooms - totalConferenceRoomsUsed}, Required: 1"
                    });
                }
                break;

            case RequestType.ConferenceRoomWithParking:
                var conferenceRoomCount3 = await _requestRepository.CountByTypeAndDateExcludingIdAsync(
                    RequestType.ConferenceRoom, requestDate, excludeRequestId, cancellationToken);
                
                var conferenceRoomWithParkingCount3 = await _requestRepository.CountByTypeAndDateExcludingIdAsync(
                    RequestType.ConferenceRoomWithParking, requestDate, excludeRequestId, cancellationToken);
                
                var totalConferenceRoomsUsed3 = conferenceRoomCount3 + conferenceRoomWithParkingCount3;
                if (totalConferenceRoomsUsed3 >= _officeResources.NumberOfConferenceRooms)
                {
                    errors.Add(new Contracts.Errors.ValidationError
                    {
                        Property = nameof(UpdateRequestCommand.RequestType),
                        ErrorMessage = $"No conference rooms available for {requestDate:yyyy-MM-dd}. Available: {_officeResources.NumberOfConferenceRooms - totalConferenceRoomsUsed3}, Required: 1"
                    });
                }

                var deskWithParkingCount3 = await _requestRepository.CountByTypeAndDateExcludingIdAsync(
                    RequestType.DeskWithParking, requestDate, excludeRequestId, cancellationToken);
                
                var totalParkingUsed3 = deskWithParkingCount3 + conferenceRoomWithParkingCount3;
                if (totalParkingUsed3 >= _officeResources.NumberOfParkingSpaces)
                {
                    errors.Add(new Contracts.Errors.ValidationError
                    {
                        Property = nameof(UpdateRequestCommand.RequestType),
                        ErrorMessage = $"No parking spaces available for {requestDate:yyyy-MM-dd}. Available: {_officeResources.NumberOfParkingSpaces - totalParkingUsed3}, Required: 1"
                    });
                }
                break;
        }

        if (errors.Any())
        {
            throw new CustomValidationException(errors);
        }
    }
}