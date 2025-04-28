using System.Net.Http.Headers;
using System.Text.Json;
using System.Net;

namespace RobotMAUI.Services
{
    public class DeepSeekService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;
        private readonly int _maxRetries;
        private readonly TimeSpan _timeout;
        private readonly TimeSpan _retryDelay;

        public DeepSeekService(string apiKey, int maxRetries = 3, int timeoutSeconds = 30, int retryDelaySeconds = 2)
        {
            _apiKey = apiKey;
            _maxRetries = maxRetries;
            _timeout = TimeSpan.FromSeconds(timeoutSeconds);
            _retryDelay = TimeSpan.FromSeconds(retryDelaySeconds);

            // 创建HttpClient并配置
            _httpClient = new HttpClient
            {
                Timeout = _timeout
            };

            _httpClient.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", _apiKey);

            // 添加用户代理以避免某些服务器拒绝请求
            _httpClient.DefaultRequestHeaders.Add("User-Agent", "RobotMAUI/1.0");
        }

        public async Task<string> GetResponseAsync(string message, CancellationToken cancellationToken = default)
        {
            int retryCount = 0;

            while (true)
            {
                try
                {
                    // 添加系统消息，设置默认使用中文
                    var request = new
                    {
                        messages = new[]
                        {
                            new { role = "system", content = "请使用中文回复用户的问题。保持回答简洁友好。" },
                            new { role = "user", content = message }
                        },
                        model = "deepseek-chat",
                        max_tokens = 1000
                    };

                    // 序列化请求内容
                    string jsonRequest = JsonSerializer.Serialize(request);
                    var content = new StringContent(jsonRequest, System.Text.Encoding.UTF8, "application/json");

                    // 发送请求，使用传入的取消令牌
                    var response = await _httpClient.PostAsync(
                        "https://api.deepseek.com/v1/chat/completions",
                        content,
                        cancellationToken);

                    // 检查响应状态
                    if (response.IsSuccessStatusCode)
                    {
                        // 使用带缓冲的读取方式，避免流读取错误
                        var jsonString = await response.Content.ReadAsStringAsync(cancellationToken);

                        // 解析JSON响应，只提取消息内容
                        try
                        {
                            using JsonDocument doc = JsonDocument.Parse(jsonString);
                            JsonElement root = doc.RootElement;

                            // 检查是否存在choices数组
                            if (root.TryGetProperty("choices", out JsonElement choices) &&
                                choices.ValueKind == JsonValueKind.Array &&
                                choices.GetArrayLength() > 0)
                            {
                                // 获取第一个选择
                                JsonElement firstChoice = choices[0];

                                // 获取消息内容
                                if (firstChoice.TryGetProperty("message", out JsonElement messageElement) &&
                                    messageElement.TryGetProperty("content", out JsonElement contentElement))
                                {
                                    return contentElement.GetString() ?? "无法获取回复内容";
                                }
                            }

                            // 如果无法找到预期的JSON结构，返回错误消息
                            return "无法解析API响应，响应格式可能已更改";
                        }
                        catch (JsonException ex)
                        {
                            // 如果JSON解析失败，返回更详细的错误信息
                            return $"JSON解析错误: {ex.Message}";
                        }
                    }
                    else if (response.StatusCode == HttpStatusCode.TooManyRequests)
                    {
                        // 如果遇到限流，等待后重试
                        if (retryCount < _maxRetries)
                        {
                            retryCount++;
                            await Task.Delay((int)(_retryDelay.TotalMilliseconds * retryCount), cancellationToken);
                            continue;
                        }
                        return "服务器繁忙，请稍后再试";
                    }
                    else
                    {
                        // 其他HTTP错误
                        return $"服务器返回错误: {(int)response.StatusCode} {response.ReasonPhrase}";
                    }
                }
                catch (TaskCanceledException ex)
                {
                    // 区分超时和用户取消
                    if (ex.CancellationToken == cancellationToken && cancellationToken.IsCancellationRequested)
                    {
                        return "请求已取消";
                    }

                    // 超时，尝试重试
                    if (retryCount < _maxRetries)
                    {
                        retryCount++;
                        await Task.Delay((int)(_retryDelay.TotalMilliseconds * retryCount), CancellationToken.None);
                        continue;
                    }
                    return "请求超时，请检查网络连接";
                }
                catch (OperationCanceledException)
                {
                    // 请求被取消（其他类型的取消）
                    return "请求已取消";
                }
                catch (HttpRequestException ex)
                {
                    // 网络错误，尝试重试
                    if (retryCount < _maxRetries)
                    {
                        retryCount++;
                        await Task.Delay((int)(_retryDelay.TotalMilliseconds * retryCount), CancellationToken.None);
                        continue;
                    }
                    return $"网络错误: {ex.Message}";
                }
                catch (Exception ex)
                {
                    // 其他未预期的错误
                    return $"错误: {ex.Message}";
                }
            }
        }
    }
}
