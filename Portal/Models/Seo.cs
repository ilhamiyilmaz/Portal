//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Portal.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class Seo
    {
        public int SeoID { get; set; }
        public string SeoAdi { get; set; }
        public Nullable<int> SeoRefDomainID { get; set; }
        public Nullable<int> SeoGoogleSiralamasi { get; set; }
        public Nullable<System.DateTime> SeoGoogleSiralamaTarihi { get; set; }
        public string SeoGoogleSearchAdres { get; set; }
    
        public virtual Domain Domain { get; set; }
    }
}