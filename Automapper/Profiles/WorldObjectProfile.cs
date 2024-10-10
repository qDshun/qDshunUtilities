using AutoMapper;
using qDshunUtilities.EF.Entities;
using qDshunUtilities.Models.Inbound;
using qDshunUtilities.Models.Outbound;

namespace qDshunUtilities.Automapper.Profiles;

public class WorldObjectProfile : Profile
{
    public WorldObjectProfile()
    {
        CreateMap<WorldObjectEntity, WorldObject>()
            ;

        CreateMap<WorldObjectCreate, WorldObjectEntity>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.World, opt => opt.Ignore())
            .ForMember(dest => dest.WorldId, opt => opt.Ignore())
            .ForMember(dest => dest.Template, opt => opt.Ignore())
            .ForMember(dest => dest.ObjectFields, opt => opt.Ignore())
            .ForMember(dest => dest.WorldObjectPermissions, opt => opt.Ignore())
            ;

        CreateMap<WorldObjectUpdate, WorldObjectEntity>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.World, opt => opt.Ignore())
            .ForMember(dest => dest.WorldId, opt => opt.Ignore())
            .ForMember(dest => dest.Template, opt => opt.Ignore())
            .ForMember(dest => dest.TemplateId, opt => opt.Ignore())
            .ForMember(dest => dest.ObjectFields, opt => opt.Ignore())
            .ForMember(dest => dest.WorldObjectPermissions, opt => opt.Ignore())
            ;
    }
}
