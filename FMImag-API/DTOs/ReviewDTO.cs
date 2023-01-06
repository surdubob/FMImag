using FMImag.Model;

namespace FMImag.DTOs
{
    public class ReviewDTO
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; }
        public int ProductId { get; set; }
        public string Body { get; set; }
        public DateTime Created { get; set; }
        public int Rating { get; set; }
    }
}
