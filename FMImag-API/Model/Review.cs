namespace FMImag.Model
{
    public class Review
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public int UserId { get; set; }
        public string Body { get; set; }
        public DateTime Created { get; set; }
        public int Rating { get; set; }
    }
}
