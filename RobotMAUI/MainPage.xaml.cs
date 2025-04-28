using Microsoft.Maui.Controls;
using System.Reflection;
using System.IO;
#if IOS || MACCATALYST
using Foundation;
#endif
using RobotMAUI.Services;

namespace RobotMAUI
{
    public partial class MainPage : ContentPage
    {
        private readonly DeepSeekService _deepSeekService;
        private CancellationTokenSource? _cancellationTokenSource;
        private bool _isRequestInProgress = false;

        public MainPage()
        {
            InitializeComponent();
            // 设置页面属性，确保全屏显示
            NavigationPage.SetHasNavigationBar(this, false);

            // 从环境变量或安全存储中获取API密钥
            string apiKey = GetApiKey();

            // 创建DeepSeekService实例，设置超时为45秒，最大重试次数为2
            _deepSeekService = new DeepSeekService(apiKey, maxRetries: 2, timeoutSeconds: 45);

            LoadHtmlFile();
        }

        private static string GetApiKey()
        {
            // 在实际应用中，应该从安全的配置或加密存储中获取
            return Environment.GetEnvironmentVariable("DEEPSEEK_API_KEY") ??
                   "sk-43ee849d7e0a4d6883b3fce608d318b0";
        }

        private async void OnSendClicked(object sender, EventArgs e)
        {
            if (string.IsNullOrWhiteSpace(MessageEntry.Text))
                return;

            // 如果已经有请求在进行中，显示提示并返回
            if (_isRequestInProgress)
            {
                await DisplayAlert("提示", "正在处理上一个请求，请稍候...", "确定");
                return;
            }

            string message = MessageEntry.Text;
            MessageEntry.Text = string.Empty;

            // 创建取消令牌源
            _cancellationTokenSource = new CancellationTokenSource();
            _isRequestInProgress = true;

            // 显示取消按钮
            CancelButton.IsVisible = true;

            try
            {
                // 转义用户消息中的特殊字符，防止JavaScript注入
                string escapedMessage = EscapeJsString(message);

                // 调用JavaScript函数显示用户消息
                await webView.EvaluateJavaScriptAsync(
                    $"appendMessage('user', '{escapedMessage}')");

                // 显示"正在思考"的提示
                await webView.EvaluateJavaScriptAsync(
                    $"appendMessage('assistant', '思考中...')");

                // 获取AI响应，传入取消令牌
                string response = await _deepSeekService.GetResponseAsync(message, _cancellationTokenSource.Token);

                // 转义AI响应中的特殊字符
                string escapedResponse = EscapeJsString(response);

                // 移除"思考中"的消息，显示实际响应
                await webView.EvaluateJavaScriptAsync(
                    "document.querySelector('.message.assistant:last-child').remove()");

                // 调用JavaScript函数显示AI响应
                await webView.EvaluateJavaScriptAsync(
                    $"appendMessage('assistant', '{escapedResponse}')");
            }
            catch (Exception ex)
            {
                // 移除"思考中"的消息
                await webView.EvaluateJavaScriptAsync(
                    "const thinkingMsg = document.querySelector('.message.assistant:last-child'); if (thinkingMsg && thinkingMsg.textContent === '思考中...') thinkingMsg.remove()");

                await DisplayAlert("错误", ex.Message, "确定");

                // 显示错误消息
                string errorMsg = EscapeJsString($"发生错误: {ex.Message}");
                await webView.EvaluateJavaScriptAsync(
                    $"appendMessage('assistant', '{errorMsg}')");
            }
            finally
            {
                // 清理资源
                _isRequestInProgress = false;
                _cancellationTokenSource?.Dispose();
                _cancellationTokenSource = null;

                // 隐藏取消按钮
                CancelButton.IsVisible = false;
            }
        }

        // 处理取消按钮点击事件
        private async void OnCancelClicked(object sender, EventArgs e)
        {
            if (_isRequestInProgress && _cancellationTokenSource != null && !_cancellationTokenSource.IsCancellationRequested)
            {
                // 取消请求
                _cancellationTokenSource.Cancel();

                // 通知用户
                await webView.EvaluateJavaScriptAsync(
                    "const thinkingMsg = document.querySelector('.message.assistant:last-child'); " +
                    "if (thinkingMsg && thinkingMsg.textContent === '思考中...') " +
                    "thinkingMsg.textContent = '请求已取消'");
            }
        }

        // 转义JavaScript字符串中的特殊字符
        private static string EscapeJsString(string str)
        {
            if (string.IsNullOrEmpty(str))
                return string.Empty;

            return str
                .Replace("\\", "\\\\")  // 反斜杠
                .Replace("'", "\\'")    // 单引号
                .Replace("\"", "\\\"")  // 双引号
                .Replace("\r", "\\r")   // 回车
                .Replace("\n", "\\n")   // 换行
                .Replace("\t", "\\t")   // 制表符
                .Replace("\b", "\\b")   // 退格
                .Replace("\f", "\\f");  // 换页
        }

        private async void LoadHtmlFile()
        {
            try
            {
#if ANDROID
                // 添加调试信息
                var assets = Android.App.Application.Context?.Assets;
                if (assets != null)
                {
                    var files = assets.List("");
                    if (files != null)
                    {
                        foreach (var file in files)
                        {
                            System.Diagnostics.Debug.WriteLine($"Found asset: {file}");
                        }
                    }

                    var htmlFiles = assets.List("HTML");
                    if (htmlFiles != null)
                    {
                        foreach (var file in htmlFiles)
                        {
                            System.Diagnostics.Debug.WriteLine($"Found HTML file: {file}");
                        }
                    }
                }

                webView.Source = new UrlWebViewSource
                {
                    Url = "file:///android_asset/HTML/robot.html"
                };
#else
                // 其他平台的代码保持不变
#if WINDOWS
                // Windows平台使用本地文件路径
                string basePath = AppDomain.CurrentDomain.BaseDirectory;
                webView.Source = new UrlWebViewSource
                {
                    Url = new Uri(Path.Combine(basePath, "HTML", "robot.html")).AbsoluteUri
                };
#elif IOS || MACCATALYST
                // iOS平台使用包路径
                string docPath = Path.Combine(NSBundle.MainBundle.BundlePath, "HTML", "robot.html");
                webView.Source = new UrlWebViewSource
                {
                    Url = new Uri(docPath).AbsoluteUri
                };
#else
                // 后备方案：使用嵌入资源
                var assembly = GetType().Assembly;
                // 使用更新后的嵌入资源逻辑名称
                string resourcePath = "EmbeddedResource.HTML.robot.html";

                using var stream = assembly.GetManifestResourceStream(resourcePath);
                if (stream != null)
                {
                    using var reader = new StreamReader(stream);
                    var html = await reader.ReadToEndAsync();

                    webView.Source = new HtmlWebViewSource
                    {
                        Html = html,
                        BaseUrl = Microsoft.Maui.Storage.FileSystem.AppDataDirectory
                    };
                }
                else
                {
                    await DisplayAlert("错误", "找不到HTML资源文件", "确定");
                }
#endif
#endif
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error loading HTML: {ex}");
                await DisplayAlert("错误", $"加载HTML文件时出错: {ex.Message}", "确定");
            }
        }
    }
}
