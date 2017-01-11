﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Portal.Models
{
    public enum IslerOncelikSira:byte
    {
        Birinci=1,Ikinci=2,Ucuncu=3
    }
    public enum IsinDurumu:byte
    {
        Yapilacak=1,YapilacakDeadline,Yapiliyor,
        OnayBekliyor,Tamamlandi
    }
    public enum DomainDurum : byte
    {
        BeklemeyeAl=1,YayinaAl,YayiniDurdur
    }
}