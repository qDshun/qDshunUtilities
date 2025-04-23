using AutoMapper;
using qDshunUtilities.EF.Entities;
using qDshunUtilities.Models.Inbound;

namespace qDshunUtilities.Automapper.Profiles;

public class ObjectFieldProfile : Profile
{
    public ObjectFieldProfile()
    {
        CreateMap<ObjectFieldEntity, ObjectField>()
            ;
        CreateMap<ObjectFieldCreate, ObjectFieldEntity>()
        ;
        CreateMap<ObjectFieldUpdate, ObjectFieldEntity>();
    }
}
