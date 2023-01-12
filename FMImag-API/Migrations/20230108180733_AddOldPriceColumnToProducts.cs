using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FMImag.Migrations
{
    public partial class AddOldPriceColumnToProducts : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<float>(
                name: "OldPrice",
                table: "Products",
                type: "float",
                nullable: false,
                defaultValue: 0f);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OldPrice",
                table: "Products");
        }
    }
}
