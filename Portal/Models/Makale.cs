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
    
    public partial class Makale
    {
        public int MakaleID { get; set; }
        public string MakaleAdi { get; set; }
        public string MakaleDetay { get; set; }
        public Nullable<System.DateTime> MakaleTarih { get; set; }
        public string MakaleYazanKullaniciID { get; set; }
        public Nullable<int> MakaleRefKategoriID { get; set; }
    
        public virtual AspNetUser AspNetUser { get; set; }
        public virtual MakaleKategori MakaleKategori { get; set; }
    }
}
