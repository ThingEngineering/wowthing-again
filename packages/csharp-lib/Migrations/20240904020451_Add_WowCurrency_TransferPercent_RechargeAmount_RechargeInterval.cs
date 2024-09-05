using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Wowthing.Lib.Migrations
{
    /// <inheritdoc />
    public partial class Add_WowCurrency_TransferPercent_RechargeAmount_RechargeInterval : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<short>(
                name: "recharge_amount",
                table: "wow_currency",
                type: "smallint",
                nullable: false,
                defaultValue: (short)0);

            migrationBuilder.AddColumn<long>(
                name: "recharge_interval",
                table: "wow_currency",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddColumn<short>(
                name: "transfer_percent",
                table: "wow_currency",
                type: "smallint",
                nullable: false,
                defaultValue: (short)0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "recharge_amount",
                table: "wow_currency");

            migrationBuilder.DropColumn(
                name: "recharge_interval",
                table: "wow_currency");

            migrationBuilder.DropColumn(
                name: "transfer_percent",
                table: "wow_currency");
        }
    }
}
