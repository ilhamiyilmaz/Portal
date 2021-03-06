﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;
using Portal.Models;
using System.Collections;
using System.Web.Mvc;
using System.Net;
using System.IO;
using System.Text;
using System.Net.Mail;

namespace Portal.Models
{
    public partial class Fonksiyonlar
    {
        public static int DomainUzatmaSuresineKalanGun(DateTime uzatmaTarihi)
        {

            TimeSpan fark = uzatmaTarihi - new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day);

            return Convert.ToInt32(fark.TotalDays);

        }
        public static string MailGonder(string gidecekMailAdresleri, string baslik, string mesaj)
        {

            // KarayelEntities db = new KarayelEntities();

            //db.Database.ExecuteSqlCommand("insert into Mail.dbo.MailGonder values ('info@antalyawebtasarim.com','Awt@1234',1,'smtp.live.com',587,'" + gidecekMailAdresleri + "','" + baslik + "','" + mesaj + "')");

            string MailAdresi = "satis@karayeltasarim.com";

            string MailSifresi = "Kwt112107";
            bool MailSsl = true;
            string SMTPAdresi = "smtp.live.com";
            string Port = "587";
            string[] MailAdresleri = gidecekMailAdresleri.Split(',');

            string ilkMailAdresi = MailAdresleri[0];

            if (String.IsNullOrEmpty(ilkMailAdresi))
            {
                ilkMailAdresi = MailAdresi;
            }

            MailMessage message = new MailMessage();
            message.From = new MailAddress(MailAdresi);
            try
            {

                foreach (string mailim in MailAdresleri)
                {
                    if (String.IsNullOrEmpty(mailim))
                    {
                        continue;
                    }
                    message.To.Add(mailim); // <-- this one
                }

                message.Subject = baslik;
                //message.CC.Add("info@antalyacarhire.com");
                message.Body = mesaj;

                message.IsBodyHtml = true;

                SmtpClient client = new SmtpClient(SMTPAdresi, Convert.ToInt32(Port));
                client.UseDefaultCredentials = false;
                client.Credentials = new System.Net.NetworkCredential(MailAdresi, MailSifresi);
                client.DeliveryMethod = SmtpDeliveryMethod.Network;
                client.EnableSsl = MailSsl;

                client.Send(message);
            }
            catch (Exception ex)
            {
                return ex.Message;
            }

            if (message != null)
            {
                message.Dispose();
            }
            return "";
        }
        public static string KarakterDuzenle(string metin)
        {
            string Duzenlenmis = metin;

            if (String.IsNullOrEmpty(Duzenlenmis))
                return "";

            Duzenlenmis = Duzenlenmis.Replace("&#304;", "I");
            Duzenlenmis = Duzenlenmis.Replace("&#305;", "i");
            Duzenlenmis = Duzenlenmis.Replace("&#214;", "Ö");
            Duzenlenmis = Duzenlenmis.Replace("&#246;", "ö");
            Duzenlenmis = Duzenlenmis.Replace("&Ouml;", "Ö");
            Duzenlenmis = Duzenlenmis.Replace("&ouml;", "ö");
            Duzenlenmis = Duzenlenmis.Replace("&#220;", "Ü");
            Duzenlenmis = Duzenlenmis.Replace("&#252;", "ü");
            Duzenlenmis = Duzenlenmis.Replace("&Uuml;", "Ü");
            Duzenlenmis = Duzenlenmis.Replace("&uuml;", "ü");
            Duzenlenmis = Duzenlenmis.Replace("&#199;", "Ç");
            Duzenlenmis = Duzenlenmis.Replace("&#231;", "ç");
            Duzenlenmis = Duzenlenmis.Replace("&Ccedil;", "Ç");
            Duzenlenmis = Duzenlenmis.Replace("&ccedil;", "ç");
            Duzenlenmis = Duzenlenmis.Replace("&#286;", "G");
            Duzenlenmis = Duzenlenmis.Replace("&#287;", "g");
            Duzenlenmis = Duzenlenmis.Replace("&#350;", "S");
            Duzenlenmis = Duzenlenmis.Replace("&#351;", "s");
            Duzenlenmis = Duzenlenmis.Replace("&hellip;", "...");
            Duzenlenmis = Duzenlenmis.Replace("&rsquo;", "'");
            Duzenlenmis = Duzenlenmis.Replace("&ldquo;", "“");
            Duzenlenmis = Duzenlenmis.Replace("&rdquo;", "”");
            Duzenlenmis = Duzenlenmis.Replace("&#39;", "'");


            return Duzenlenmis;
        }
    }
}