using qDshunUtilities.EF.Entities.WorldObjects;

namespace qDshunUtilities.EF.Entities
{
    public class TemplateEntity : BaseEntity
    {
        public string HTMLTemplate { get; set; }
        public List<TemplatedWorldObjectEntity> TemplatedWorldObjects { get; set; } = [];
    }
}
