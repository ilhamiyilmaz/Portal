﻿var ff;
String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10);
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours < 10) { hours = "0" + hours; }
    if (minutes < 10) { minutes = "0" + minutes; }
    if (seconds < 10) { seconds = "0" + seconds; }
    return hours + ':' + minutes + ':' + seconds;
}
String.prototype.toplamZamanFormat = function () {
    var sec_num = parseInt(this, 10);
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours < 10) { hours = "0" + hours; }
    if (minutes < 10) { minutes = "0" + minutes; }
    if (seconds < 10) { seconds = "0" + seconds; }
    return hours + 'sa ' + minutes + 'dk ' + seconds+'s';
}
angModule.controller("domainIslerCtrl", function ($scope, domainIslerService) {
    var self = $scope;
    self.guncelDomainId = 0;//287 karayeltasarim.com
    self.domainIsler = [], self.guncelKullanici, self.toplamZaman, self.toplamZamanStr;
    self.filterdResults = [], self.domainNotlari=[];
    self.filterIsDurum = 0;
    self.filterUserId= "Hepsi";
    let IsinDurumuEnum={
        Yapilacak : 1, YapilacakDeadline:2, Yapiliyor:3,
        OnayBekleyen:4, Biten:5
    }
    self.isDurum = {
        1: { ad: "Yapilacak", timelineIconClass: "font-blue", arrowClass: "arrow-yapilacak", bodyClass: "bg-blue" },
        2: { ad: "YapilacakDeadline", timelineIconClass: "font-blue", arrowClass: "arrow-yapilacak", bodyClass: "bg-blue" },
        3: { ad: "Yapiliyor", timelineIconClass: "font-green-jungle", arrowClass: "arrow-yapiliyor", bodyClass: "bg-green-jungle" },
        4: { ad: "OnayBekleyen", timelineIconClass: "font-yellow", arrowClass: "arrow-onay", bodyClass: "bg-yellow" },
        5: { ad: "Biten", timelineIconClass: "", arrowClass: "", bodyClass: "body-biten" }
    }
    angular.element(document).ready(function () {
        console.log(self.guncelDomainId);
        self.getirDomainIsler();
    });
    self.init = function (domainId,guncelKullanici,toplamZaman) {
        console.log(toplamZaman);
        self.guncelDomainId = domainId;
        self.guncelKullanici = guncelKullanici;
        self.toplamZaman = toplamZaman;
    }
    self.getirDomainIsler = function () {
        domainIslerService.getirDomaineAitIsleri(self.guncelDomainId)
        .then(function (res) {
            ff = res;
            extendArray(res);
            self.domainIsler = res;
            self.toplamZamanStr = String(self.toplamZaman).toplamZamanFormat();
            arrayZamanHesapla();
        })
    }
    self.filterByIsinDurumu = function (domainIs) {
        if (self.filterIsDurum == 0 || self.filterIsDurum === domainIs.IsDurum) {
            if (self.filterUserId === 'Hepsi') {
                return true;
            }
            else
            {
                if (filterKullanici(domainIs)) {
                    return true;
                } else {
                    return false;
                }
            }
        }
        else {
            return false;
        }
    }
    function filterKullanici(domainIs) {
        let ary = domainIs.IsiYapacakKullanicilar.filter((e)=> { return self.filterUserId == e.Id })
        if (ary.length > 0) {
            return true;
        } else {
            return false;
        }
    }
    self.degistirFilterIsDurum = function (isDurum) {
        self.filterIsDurum = isDurum;
    }
    self.degistirFilterUser = function (userId) {
        self.filterUserId = userId;
    }
    self.gosterCariBilgi = function () {
        $("#modalCari").modal("show");
    }
    self.gosterDomainNotlari=function(){
        domainIslerService.getirDomainNotlari(self.guncelDomainId)
        .then((res)=>{
          self.domainNotlari=res;
          $("#modalDomainNotlari").modal("show");
        })
    }
    self.tarihFormatStr = function (tarih) {
        if (tarih) {
            let date = new Date(parseInt(tarih.replace("/Date(", "").replace(")/", ""), 10));
            let formattedDate = moment(date).format('DD.MM.YYYY');
            return formattedDate;
        }else
        {
            return "";
        }
    }
    self.timelineIconClassBelirleDurumaGore = function (durumId) {
        return self.isDurum[durumId].timelineIconClass;
    }
    self.timelineArrowClassBelirleDurumaGore = function (durumId) {
        return self.isDurum[durumId].arrowClass;
    }
    self.timelineBodyClassBelirleDurumaGore = function (durumId) {
        return self.isDurum[durumId].bodyClass;
    }
    self.iseBaslaDurdur = function (domainIs) {
        let yeniDurum = 0, iBtnClass="fa fa-play";
        if (domainIs.IsDurum === IsinDurumuEnum.Yapilacak || domainIs.IsDurum === IsinDurumuEnum.YapilacakDeadline) {
            yeniDurum = IsinDurumuEnum.Yapiliyor;
            iBtnClass = "fa fa-pause";
            domainIs.GosterTamamlaBtn = true;
        }
        else {
            domainIs.GosterTamamlaBtn = false;
            if (domainIs.BitisTarihiVarmi) {
                yeniDurum = IsinDurumuEnum.YapilacakDeadline;
            } else {
                yeniDurum = IsinDurumuEnum.Yapilacak;
            }
        }
        durumDegistir(domainIs,yeniDurum,iBtnClass);


    }
    self.clickTamamlaBtn = function (domainIs) {
        domainIs.GosterTamamlaBtn = false;
        domainIs.GosterIseBaslaBtn = false;
        domainIs.GosterOnaylaBtn = true;
        let yeniDurum = IsinDurumuEnum.OnayBekleyen;
        durumDegistir(domainIs, yeniDurum, "");
    }
    self.clickOnayla = function (domainIs) {
        domainIs.GosterTamamlaBtn = false;
        domainIs.GosterIseBaslaBtn = false;
        domainIs.GosterOnaylaBtn = false;
        let yeniDurum = IsinDurumuEnum.Biten;
        durumDegistir(domainIs, yeniDurum, "");
    }
    function durumDegistir(domainIs, yeniDurum, iBtnClass) {
        domainIslerService.IsDurumuDegistir(domainIs, yeniDurum)
       .then(function (res) {
           if (res.Basarilimi) {
               domainIs.IsDurum = yeniDurum;
               domainIs.iBtnClass = iBtnClass;
               domainIs.IsGecenZaman = res.Data.IsGecenZaman;
               self.timelineBodyClassBelirleDurumaGore(domainIs.IsDurum);
               self.timelineArrowClassBelirleDurumaGore(domainIs.IsDurum)
               zamanAyarla(domainIs);
               //angular.copy(res.Data, domainIs);
               //self.$apply();
           }
       })
    }
    function getDate(jsnDate) {
        let date = new Date(parseInt(jsnDate.replace("/Date(", "").replace(")/", ""), 10));

        return date;
    }
    function arrayZamanHesapla() {
        self.domainIsler.forEach(function (e) {
            zamanAyarla(e);
        })
    }
    function zamanAyarla (domainIs) {
        if (domainIs.IsDurum === IsinDurumuEnum.Yapiliyor) {
            if (domainIs.IsGecenZaman.ZamanBasTarih) {
                var now = moment(new Date());

                var end = moment(getDate(domainIs.IsGecenZaman.ZamanBasTarih));
                var duration = moment.duration(now.diff(end));
                domainIs.sec = now.diff(end,"seconds") + domainIs.IsGecenZaman.GecenZamanSaniye;
                domainIs.timer = setInterval(function () {
                    domainIs.sec++;
                    domainIs.gecenZaman = String(domainIs.sec).toHHMMSS();
                    self.$apply();
                }, 1000);
            }

        } else {
            clearInterval(domainIs.timer);
            if (domainIs.IsGecenZaman.GecenZamanSaniye) {
                domainIs.gecenZaman = String(domainIs.IsGecenZaman.GecenZamanSaniye).toHHMMSS();
            } else {
                domainIs.gecenZaman = "00:00:00";
            }

        }
    }
    function extendArray (ary) {
        ary.forEach(function (e) {
            e.iBtnClass = "";
            e.GosterTamamlaBtn = false;
            e.GosterOnaylaBtn = false;
            e.GosterIseBaslaBtn = false;
            if (e.IsDurum === IsinDurumuEnum.Yapilacak || e.IsDurum === IsinDurumuEnum.YapilacakDeadline
                || e.IsDurum===IsinDurumuEnum.Yapiliyor)
            {
                e.GosterIseBaslaBtn = true;

                e.iBtnClass = "fa fa-play";
                if (e.IsDurum === IsinDurumuEnum.Yapiliyor) {
                    e.iBtnClass = "fa fa-pause";
                    e.GosterTamamlaBtn = true;
                }
            }
            else if(e.IsDurum===IsinDurumuEnum.OnayBekleyen)
            {
                e.GosterOnaylaBtn = true;
            }

        })
    }
});
