﻿namespace Wowthing.Web.ViewModels
{
    public class ErrorViewModel
    {
        public string RequestId;
        public bool ShowRequestId => !string.IsNullOrEmpty(RequestId);

        public string OriginalUrl { get; set; }
    }
}
