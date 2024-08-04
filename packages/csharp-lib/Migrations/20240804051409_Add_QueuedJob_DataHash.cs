using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Wowthing.Lib.Migrations
{
    /// <inheritdoc />
    public partial class Add_QueuedJob_DataHash : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "data_hash",
                table: "queued_job",
                type: "text",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "ix_queued_job_priority_type_data_hash",
                table: "queued_job",
                columns: new[] { "priority", "type", "data_hash" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "ix_queued_job_priority_type_data_hash",
                table: "queued_job");

            migrationBuilder.DropColumn(
                name: "data_hash",
                table: "queued_job");
        }
    }
}
