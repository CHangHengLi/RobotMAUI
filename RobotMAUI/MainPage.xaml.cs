using Microsoft.Maui.Controls;
using System.Reflection;
using System.IO;
#if IOS || MACCATALYST
using Foundation;
#endif

namespace RobotMAUI
{
    public partial class MainPage : ContentPage
    {
        public MainPage()
        {
            InitializeComponent();
            // 设置页面属性，确保全屏显示
            NavigationPage.SetHasNavigationBar(this, false);
            LoadHtmlFile();
        }

        private async void LoadHtmlFile()
        {
            try
            {
                // 主要使用文件复制法，更简单可靠
                // HTML文件应该在编译时被复制到输出目录
#if WINDOWS
                // Windows平台使用本地文件路径
                string basePath = AppDomain.CurrentDomain.BaseDirectory;
                webView.Source = new UrlWebViewSource
                {
                    Url = new Uri(Path.Combine(basePath, "HTML", "robot.html")).AbsoluteUri
                };
#elif ANDROID
                // Android平台使用assets路径
                webView.Source = new UrlWebViewSource
                {
                    Url = "file:///android_asset/HTML/robot.html"
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
            }
            catch (Exception ex)
            {
                // 处理任何加载错误
                await DisplayAlert("错误", $"加载HTML文件时出错: {ex.Message}", "确定");
            }
        }
    }
}
