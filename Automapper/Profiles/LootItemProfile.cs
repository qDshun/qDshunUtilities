using AutoMapper;
using qDshunUtilities.EF.Entities;
using qDshunUtilities.Models.Inbound;
using qDshunUtilities.Models.Outbound;

namespace qDshunUtilities.Automapper.Profiles;

public class LootItemProfile : Profile
{
    public LootItemProfile()
    {
        CreateMap<LootItemCreate, LootItemEntity>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.LootSource, opt => opt.Ignore())
            .ForMember(dest => dest.LootSourceId, opt => opt.Ignore())
            ;

        CreateMap<LootItemUpdate, LootItemEntity>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.LootSource, opt => opt.Ignore())
            .ForMember(dest => dest.LootSourceId, opt => opt.Ignore())
            ;
    }
}
