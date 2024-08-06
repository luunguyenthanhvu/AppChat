namespace AppChat.DTO.Response
{
    public class MessageResponseDTO
    {
        public string Message { get; set; }

        public MessageResponseDTO(string Message) { 
            this.Message = Message; 
        }
    }
}
