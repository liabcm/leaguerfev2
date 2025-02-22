using Azure;

namespace leaguerAPI.Models.DTOs
{
    public class Response<T>
    {
        public bool Success { get; set; }
        public T? Data { get; set; }
        public string? ErrorMessage { get; set; }

        // Helper methods for success/failure
        public static Response<T> SuccessResult(T data) => new() { Success = true, Data = data };
        public static Response<T> FailureResult(string error) => new() { Success = false, ErrorMessage = error };
    }
}
