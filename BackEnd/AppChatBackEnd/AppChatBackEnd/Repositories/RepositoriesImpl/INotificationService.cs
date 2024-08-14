namespace AppChatBackEnd.Repositories.RepositoriesImpl
{
    public interface INotificationService
    {
        Task SendPushNotificationToAllUsers(string title, string message);
    }

}
