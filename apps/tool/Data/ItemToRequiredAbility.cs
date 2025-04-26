namespace Wowthing.Tool.Data;

public partial class Hardcoded
{
    private const int GnomishEngineering = 20219;
    private const int GoblinEngineering = 20222;

    public static readonly Dictionary<int, int> ItemToRequiredAbility = new()
    {
        // Classic
        // { 18645, GnomishEngineering }, // Gnomish Alarm-o-Bot
        { 10725, GnomishEngineering }, // Gnomish Battle Chicken
        { 10645, GnomishEngineering }, // Gnomish Death Ray
        { 10545, GnomishEngineering }, // Gnomish Goggles
        { 10721, GnomishEngineering }, // Gnomish Harm Prevention Belt
        { 10726, GnomishEngineering }, // Gnomish Mind Control Cap
        { 10720, GnomishEngineering }, // Gnomish Net-o-Matic Projector
        { 10724, GnomishEngineering }, // Gnomish Rocket Boots
        { 10716, GnomishEngineering }, // Gnomish Shrink Ray
        { 10713, GnomishEngineering }, // Plans: Inlaid Mithril Cylinder
        { 18986, GnomishEngineering }, // Ultrasafe Transporter: Gadgetzan
        { 18660, GnomishEngineering }, // World Enlarger

        { 18984, GoblinEngineering }, // Dimensional Ripper - Everlook
        { 10587, GoblinEngineering }, // Goblin Bomb Dispenser
        { 10543, GoblinEngineering }, // Goblin Construction Helmet
        { 10727, GoblinEngineering }, // Goblin Dragon Gun
        // { 18587, GoblinEngineering }, // Goblin Jumper Cables XL
        { 10542, GoblinEngineering }, // Goblin Mining Helmet
        { 10577, GoblinEngineering }, // Goblin Mortar
        { 7189, GoblinEngineering }, // Goblin Rocket Boots
        { 10588, GoblinEngineering }, // Goblin Rocket Helmet
        { 10646, GoblinEngineering }, // Goblin Sapper Charge
        { 10644, GoblinEngineering }, // Recipe: Goblin Rocket Fuel
        { 10586, GoblinEngineering }, // The Big One

        // TBC
        { 23829, GnomishEngineering }, // Gnomish Battle Goggles
        { 23841, GnomishEngineering }, // Gnomish Flame Turret
        { 23835, GnomishEngineering }, // Gnomish Poultryizer
        { 23828, GnomishEngineering }, // Gnomish Power Goggles
        { 23825, GnomishEngineering }, // Nigh-Invulnerability Belt
        { 30544, GnomishEngineering }, // Ultrasafe Transporter: Toshley's Station

        { 30542, GoblinEngineering }, // Dimensional Ripper - Area 52
        { 23838, GoblinEngineering }, // Foreman's Enchanted Helmet
        { 23839, GoblinEngineering }, // Foreman's Reinforced Helmet
        { 30563, GoblinEngineering }, // Goblin Rocket Launcher
        { 23827, GoblinEngineering }, // Super Sapper Charge
        { 23826, GoblinEngineering }, // The Bigger One

        // WotLK
        { 40895, GnomishEngineering }, // Gnomish X-Ray Specs

        { 42641, GoblinEngineering }, // Global Thermal Sapper Charge

        // ??
        { 60216, GnomishEngineering }, // De-Weaponized Mechanical Companion
        { 87251, GnomishEngineering }, // Geosynchronous World Spinner
        { 40727, GnomishEngineering }, // Gnomish Gravity Well

        { 63396, GoblinEngineering }, // Big Daddy
        { 87250, GoblinEngineering }, // Depleted-Kyparium Rocket
        { 59597, GoblinEngineering }, // Personal World Destroyer
    };
}
