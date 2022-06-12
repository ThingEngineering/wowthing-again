namespace Wowthing.Backend.Data;

public static partial class Hardcoded
{
    public static readonly Dictionary<int, int> CallingQuestLookup = new()
    {
        { 60419, 60391 }, // Night Fae Troubles at Home -> Aiding Ardenweald
        { 60425, 60393 }, // Kyrian Troubles at Home -> Aiding Bastion
        { 60429, 60395 }, // Necrolord Troubles at Home -> Aiding Maldraxxus
        { 60432, 60400 }, // Venthyr Troubles at Home -> Aiding Revendreth
    };
}
