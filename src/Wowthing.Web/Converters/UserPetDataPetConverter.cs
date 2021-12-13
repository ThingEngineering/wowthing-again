using System;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Wowthing.Web.Models;

namespace Wowthing.Web.Converters
{
    public class UserPetDataPetConverter: JsonConverter
    {
        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            var pet = (UserPetDataPet) value;
            var arr = new JArray();
            arr.Add(pet.Level);
            arr.Add(pet.Quality);
            arr.Add(pet.BreedId);
            arr.WriteTo(writer);
        }

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            throw new NotImplementedException();
        }

        public override bool CanConvert(Type objectType)
        {
            return typeof(UserPetDataPet) == objectType;
        }

        public override bool CanRead => false;

    }
}
