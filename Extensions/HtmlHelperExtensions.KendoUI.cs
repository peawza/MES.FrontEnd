using Kendo.Mvc.UI;
using Kendo.Mvc.UI.Fluent;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using WEB.APP.Resources;

namespace WEB.APP
{
    public enum MergeHtmlAttributeOptions
    {
        Concat = 1,
        KeepSource = 2,
        Replace = 3
    }
    public static class HtmlAttributeHelper
    {
        public static IDictionary<string, object> MergeHtmlAttributes(object source, object merge, MergeHtmlAttributeOptions options = MergeHtmlAttributeOptions.Concat)
        {
            return MergeHtmlAttributes(HtmlHelper.AnonymousObjectToHtmlAttributes(source), HtmlHelper.AnonymousObjectToHtmlAttributes(merge), options);
        }

        public static IDictionary<string, object> MergeHtmlAttributes(IDictionary<string, object> source, IDictionary<string, object> merge, MergeHtmlAttributeOptions options = MergeHtmlAttributeOptions.Concat)
        {
            foreach (var key in merge.Keys)
            {
                object value;
                if (source.TryGetValue(key, out value))
                {
                    switch (options)
                    {
                        case MergeHtmlAttributeOptions.Concat:
                            source[key] = $"{value} {merge[key]}";
                            break;
                        case MergeHtmlAttributeOptions.Replace:
                            source[key] = merge[key];
                            break;
                    }
                }
                else
                {
                    source.Add(key, merge[key]);
                }
            }
            return source;
        }

    }



    public static partial class HtmlHelperExtensions
    {
        public static GridTemplateColumnBuilder<TModel> RowNo<TModel>(this GridColumnFactory<TModel> column)
           where TModel : class
        {
            return column.Template("#=_rowNo#").Title("No.").Width(50).HtmlAttributes(new { @class = "text-right" });
        }
        #region Common Button


        public static ButtonBuilder ApplyButton<TModel>(this IHtmlHelper<TModel> helper, string name = "apply-button", object htmlAttributes = null)
        {
            return helper.CommandButton(name, UIResource.Apply, HtmlAttributeHelper.MergeHtmlAttributes(htmlAttributes, new { @class = "k-dark" })).Icon("check-outline");
        }

        public static ButtonBuilder SearchButton<TModel>(this IHtmlHelper<TModel> helper, string name = "search-button", object htmlAttributes = null)
        {
            return helper.CommandButton(name, UIResource.Search, HtmlAttributeHelper.MergeHtmlAttributes(htmlAttributes, new { @class = "k-primary" })).Icon("search");
        }

        public static ButtonBuilder SaveButton<TModel>(this IHtmlHelper<TModel> helper, string name = "save-button", object htmlAttributes = null)
        {
            return helper.CommandButton(name, UIResource.Save, HtmlAttributeHelper.MergeHtmlAttributes(htmlAttributes, new { @class = "k-success" })).Icon("save");
        }

        public static ButtonBuilder SaveFooterButton<TModel>(this IHtmlHelper<TModel> helper, string name = "save-button", object htmlAttributes = null)
        {
            return helper.CommandButton(name, UIResource.Save, HtmlAttributeHelper.MergeHtmlAttributes(htmlAttributes, new { @class = "k-success" })).Icon("save");
        }

        public static ButtonBuilder CloseButton<TModel>(this IHtmlHelper<TModel> helper, string name = "close-button", object htmlAttributes = null)
        {
            return helper.CommandButton(name, UIResource.Close, HtmlAttributeHelper.MergeHtmlAttributes(htmlAttributes, new { @class = "k-warning" })).Icon("cancel");
        }

        public static ButtonBuilder ExitFormButton<TModel>(this IHtmlHelper<TModel> helper, string name = "close-button", object htmlAttributes = null)
        {
            return helper.CommandButton(name, "Exit Form", HtmlAttributeHelper.MergeHtmlAttributes(htmlAttributes, new { @class = "k-warning" })).Icon("arrow-left");
        }

        public static ButtonBuilder DeleteButton<TModel>(this IHtmlHelper<TModel> helper, string name = "delete-button", object htmlAttributes = null)
        {
            return helper.CommandButton(name, UIResource.Delete, HtmlAttributeHelper.MergeHtmlAttributes(htmlAttributes, new { @class = "k-danger" })).Icon("trash");
        }

        public static ButtonBuilder RefreshButton<TModel>(this IHtmlHelper<TModel> helper, string name = "refresh-button", object htmlAttributes = null)
        {
            return helper.CommandButton(name, UIResource.Refresh, HtmlAttributeHelper.MergeHtmlAttributes(htmlAttributes, new { @class = "k-success" })).Icon("refresh");
        }

        public static ButtonBuilder ClearButton<TModel>(this IHtmlHelper<TModel> helper, string name = "clear-button", object htmlAttributes = null)
        {
            return helper.CommandButton(name, UIResource.Clear, HtmlAttributeHelper.MergeHtmlAttributes(htmlAttributes, new { @class = "k-warning" })).Icon("refresh");
        }



        public static ButtonBuilder ResetButton<TModel>(this IHtmlHelper<TModel> helper, string name = "reset-button", object htmlAttributes = null)
        {
            return helper.CommandButton(name, UIResource.Clear, HtmlAttributeHelper.MergeHtmlAttributes(htmlAttributes, new { @class = "k-danger" })).Icon("reset");
        }

        public static ButtonBuilder ImportButton<TModel>(this IHtmlHelper<TModel> helper, string name = "import-button", object htmlAttributes = null)
        {
            return helper.CommandButton(name, UIResource.Import, HtmlAttributeHelper.MergeHtmlAttributes(htmlAttributes, new { @class = "k-dark d-none d-md-inline" })).Icon("upload");
        }

        public static ButtonBuilder ExportButton<TModel>(this IHtmlHelper<TModel> helper, string name = "export-button", object htmlAttributes = null)
        {
            return helper.CommandButton(name, UIResource.Export, HtmlAttributeHelper.MergeHtmlAttributes(htmlAttributes, new { @class = "k-success" })).Icon("download");
        }


        public static ButtonBuilder AddButton<TModel>(this IHtmlHelper<TModel> helper, string name = "add-button", object htmlAttributes = null)
        {
            return helper.CommandButton(name, UIResource.Add, HtmlAttributeHelper.MergeHtmlAttributes(htmlAttributes, new { @class = "k-success" })).Icon("plus-circle");
        }

        public static ButtonBuilder NewButton<TModel>(this IHtmlHelper<TModel> helper, string name = "new-button", object htmlAttributes = null)
        {
            return helper.CommandButton(name, UIResource.New, HtmlAttributeHelper.MergeHtmlAttributes(htmlAttributes, new { @class = "k-success view-mode-check-new", @style = "min-width:80px" })).Icon("plus-circle");
        }

        public static ButtonBuilder NewDocumentButton<TModel>(this IHtmlHelper<TModel> helper, string name = "new-button", object htmlAttributes = null)
        {
            return helper.CommandButton(name, UIResource.NewDocument, HtmlAttributeHelper.MergeHtmlAttributes(htmlAttributes, new { @class = "k-danger view-mode-check-new", @style = "min-width:80px" })).Icon("plus-circle");
        }

        public static ButtonBuilder NewTabButton<TModel>(this IHtmlHelper<TModel> helper, string name = "new-button", object htmlAttributes = null)
        {
            return helper.CommandButton(name, UIResource.New, HtmlAttributeHelper.MergeHtmlAttributes(htmlAttributes, new { @class = "k-success view-mode", @style = "min-width:80px" })).Icon("plus-circle");
        }

        public static ButtonBuilder CancelButton<TModel>(this IHtmlHelper<TModel> helper, string name = "cancel-button", object htmlAttributes = null)
        {
            return helper.CommandButton(name, UIResource.Cancel, HtmlAttributeHelper.MergeHtmlAttributes(htmlAttributes, new { @class = "k-danger" })).Icon("cancel");
        }

        public static ButtonBuilder DownloadButton<TModel>(this IHtmlHelper<TModel> helper, string name = "download-button", object htmlAttributes = null)
        {
            return helper.CommandButton(name, UIResource.Download, HtmlAttributeHelper.MergeHtmlAttributes(htmlAttributes, new { @class = "k-dark" })).Icon("download");
        }

        public static ButtonBuilder SubmitButton<TModel>(this IHtmlHelper<TModel> helper, string name = "submit-button", object htmlAttributes = null)
        {
            return helper.CommandButton(name, UIResource.Submit, HtmlAttributeHelper.MergeHtmlAttributes(htmlAttributes, new { @class = "k-primary d-none" })).Icon("button");
        }

        public static ButtonBuilder ApproveButton<TModel>(this IHtmlHelper<TModel> helper, string name = "approve-button", object htmlAttributes = null)
        {
            return helper.CommandButton(name, UIResource.Approve, HtmlAttributeHelper.MergeHtmlAttributes(htmlAttributes, new { @class = "k-success d-none w-100" })).Icon("check-circle");
        }

        public static ButtonBuilder ApproveAndSendK2Button<TModel>(this IHtmlHelper<TModel> helper, string name = "approve-sendk2-button", object htmlAttributes = null)
        {
            return helper.CommandButton(name, "Approve and Send To K2", HtmlAttributeHelper.MergeHtmlAttributes(htmlAttributes, new { @class = "k-danger d-none" })).Icon("button");
        }

        public static ButtonBuilder WorkFlowHisButton<TModel>(this IHtmlHelper<TModel> helper, string name = "workflow-button", object htmlAttributes = null)
        {
            return helper.CommandButton(name, UIResource.WorkFlowHistory, HtmlAttributeHelper.MergeHtmlAttributes(htmlAttributes, new { @class = "k-primary d-none" }));
        }

        public static ButtonBuilder RejectButton<TModel>(this IHtmlHelper<TModel> helper, string name = "reject-button", object htmlAttributes = null)
        {
            return helper.CommandButton(name, UIResource.Reject, HtmlAttributeHelper.MergeHtmlAttributes(htmlAttributes, new { @class = "k-danger d-none w-100" }));
        }

        public static ButtonBuilder PrintButton<TModel>(this IHtmlHelper<TModel> helper, string name = "print-button", object htmlAttributes = null)
        {
            return helper.CommandButton(name, UIResource.Print, HtmlAttributeHelper.MergeHtmlAttributes(htmlAttributes, new { @class = "k-danger" })).Icon("print");
        }

        public static ButtonBuilder CommandButton<TModel>(this IHtmlHelper<TModel> helper, string name, string content, object htmlAttributes = null)
        {
            var attrs = HtmlHelper.AnonymousObjectToHtmlAttributes(htmlAttributes ?? new { });
            return helper.Kendo().Button().Name(name).Content(content).HtmlAttributes(attrs);
        }
        public static ButtonBuilder ScanButton<TModel>(this IHtmlHelper<TModel> helper, string name = "scan-button", object htmlAttributes = null)
        {
            return helper.CommandButton(name, "Scan", HtmlAttributeHelper.MergeHtmlAttributes(htmlAttributes, new { @class = "k-success" })).Icon("barcode-scanner");
        }

        //public static ButtonBuilder WorkFlowHisButton <TModel>(this IHtmlHelper<TModel> helper, string name = "work-flow-his-button", object htmlAttributes = null)
        //{
        //    return helper.CommandButton(name, "work flow his.", HtmlAttributeHelper.MergeHtmlAttributes(htmlAttributes, new { @class = "k-success" }));
        //}



        public static ButtonBuilder PreviewDataButton<TModel>(this IHtmlHelper<TModel> helper, string name = "preview-data", object htmlAttributes = null)
        {
            return helper.CommandButton(name, "Preview Data", HtmlAttributeHelper.MergeHtmlAttributes(htmlAttributes, new { @class = "k-primary" })).ImageUrl("data:image/png;base64,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");
        }


        public static ButtonBuilder DeleteTabButton<TModel>(this IHtmlHelper<TModel> helper, string name = "delete-tab", object htmlAttributes = null)
        {
            return helper.CommandButton(name, "Delete Tab", HtmlAttributeHelper.MergeHtmlAttributes(htmlAttributes, new { @class = "k-danger" })).Icon("trash");
        }


        public static ButtonBuilder LoadDataButton<TModel>(this IHtmlHelper<TModel> helper, string name = "load-data", object htmlAttributes = null)
        {
            return helper.CommandButton(name, "Load Data", HtmlAttributeHelper.MergeHtmlAttributes(htmlAttributes, new { @class = "k-primary view-mode" })).Icon("search");
        }

        public static ButtonBuilder UploadButton<TModel>(this IHtmlHelper<TModel> helper, string name = "upload-button", string content = "", object htmlAttributes = null)
        {
            return helper.CommandButton(name, content == "" ? UIResource.Upload : content, HtmlAttributeHelper.MergeHtmlAttributes(htmlAttributes, new { @class = "k-warning" })).Icon("upload");
        }

        public static ButtonBuilder ReturnApplicantButton<TModel>(this IHtmlHelper<TModel> helper, string name = "return-applicant-button", object htmlAttributes = null)
        {
            return helper.CommandButton(name, UIResource.Approve, HtmlAttributeHelper.MergeHtmlAttributes(htmlAttributes, new { @class = "k-success d-none w-100" })).Icon("check-circle");
        }

        #endregion

        public static GridActionColumnBuilder CommandButtons<TModel>(this GridColumnFactory<TModel> column, bool includeEditAction = true, bool includeDestroyAction = true, string deleteConfirmMessage = "Are you sure you would like to delete?", Action<GridActionCommandFactory<TModel>, int> commandAction = null) where TModel : class
        {
            var width = 0;
            return column.Command(cmd =>
            {
                commandAction?.Invoke(cmd, width);
                if (includeEditAction)
                {
                    width += 60;
                    cmd.Edit().Text(" ").IconClass("k-icon k-i-edit ")
                        .CancelText(" ").CancelIconClass("k-icon k-i-cancel")
                        .UpdateText(" ").UpdateIconClass("k-icon k-i-save")
                        .HtmlAttributes(new { @class = "k-dark", title = "Edit" });
                }

                if (includeDestroyAction)
                {
                    width += 60;
                    cmd.Custom("delete").Template("<button class='k-button k-danger k-button k-button-md k-rounded-md k-button-solid k-button-solid-base k-icon-button' onclick='app.ui.rowDeleteConfirmDialog(this,{ \"content\": \"" + deleteConfirmMessage + "\"})'><span class='k-icon k-i-trash m-0 k-button-icon'></span></button>");
                }
            }).Width(width);
        }



    }
}