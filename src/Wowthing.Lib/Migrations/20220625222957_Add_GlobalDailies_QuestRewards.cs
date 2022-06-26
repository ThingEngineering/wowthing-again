using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Wowthing.Lib.Models.Global;

#nullable disable

namespace Wowthing.Lib.Migrations
{
    public partial class Add_GlobalDailies_QuestRewards : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<List<GlobalDailiesReward>>(
                name: "quest_rewards",
                table: "global_dailies",
                type: "jsonb",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "quest_rewards",
                table: "global_dailies");
        }
    }
}
