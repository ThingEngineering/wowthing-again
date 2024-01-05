namespace Wowthing.Tool.Data;

public partial class Hardcoded
{
    public static readonly Dictionary<int, int> ItemToRequiredAbility = new()
    {
        // Classic: Gnomish Engineering
        { 10545, 20219 }, // Gnomish Goggles
        { 10645, 20219 }, // Gnomish Death Ray
        { 10713, 20219 }, // Plans: Inlaid Mithril Cylinder
        { 10716, 20219 }, // Gnomish Shrink Ray
        { 10720, 20219 }, // Gnomish Net-o-Matic Projector
        { 10721, 20219 }, // Gnomish Harm Prevention Belt
        { 10724, 20219 }, // Gnomish Rocket Boots
        { 10725, 20219 }, // Gnomish Battle Chicken
        { 10726, 20219 }, // Gnomish Mind Control Cap
        { 18645, 20219 }, // Gnomish Alarm-o-Bot

        // Classic: Goblin Engineering
        { 7189, 20222 }, // Goblin Rocket Boots
        { 10542, 20222 }, // Goblin Mining Helmet
        { 10543, 20222 }, // Goblin Construction Helmet
        { 10577, 20222 }, // Goblin Mortar
        { 10586, 20222 }, // The Big One
        { 10587, 20222 }, // Goblin Bomb Dispenser
        { 10588, 20222 }, // Goblin Rocket Helmet
        { 10644, 20222 }, // Recipe: Goblin Rocket Fuel
        { 10646, 20222 }, // Goblin Sapper Charge
        { 10727, 20222 }, // Goblin Dragon Gun
        { 18587, 20222 }, // Goblin Jumper Cables XL

        // TBC: Gnomish Engineering
        { 23825, 20219 }, // Nigh-Invulnerability Belt
        { 23828, 20219 }, // Gnomish Power Goggles
        { 23829, 20219 }, // Gnomish Battle Goggles
        { 23841, 20219 }, // Gnomish Flame Turret

        // TBC: Goblin Engineering
        { 23826, 20222 }, // The Bigger One
        { 23827, 20222 }, // Super Sapper Charge
        { 23838, 20222 }, // Foreman's Enchanted Helmet
        { 23839, 20222 }, // Foreman's Reinforced Helmet
    };
}
