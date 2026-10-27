/*
  ETKİNLİK İÇERİKLERİ
  Gerçekleşen / duyurulan etkinlikleri bu listeye ekleyin. Liste boşsa sitede yalnızca
  etkinlik kategorileri gösterilir; uydurma tarih veya mekân gösterilmez.

  Örnek kayıt (yorumdan çıkarıp doldurun):
  {
    title: "Etkinlik adı",
    category: "Kampüs Buluşmaları",   // aşağıdaki kategorilerden biri
    date: "2026-11-14",               // YYYY-MM-DD (isteğe bağlı). Bugünden sonrası "Yaklaşan", öncesi "Geçmiş" olur
    time: "18:30",                    // isteğe bağlı
    link: "https://...",              // isteğe bağlı (kayıt / detay bağlantısı)
    place: "Mekân",                   // isteğe bağlı
    text: "Kısa açıklama",            // isteğe bağlı
    image: "etkinlik-1.webp" // isteğe bağlı
  }
*/
window.NEV_CATEGORIES = [
  { name: "Kampüs Buluşmaları", image: "cat-1.webp", note: "Elçilerin kampüste bir araya geldiği buluşmalar." },
  { name: "Kültür ve Sanat", image: "cat-2.webp", note: "Kültür ve sanat odaklı programlar." },
  { name: "Sosyal Organizasyonlar", image: "cat-3.webp", note: "Topluluğu güçlendiren sosyal buluşmalar." },
  { name: "Şehir Dışı Programlar", image: "cat-4.webp", note: "Şehir dışına uzanan ortak deneyimler." },
  { name: "NevClub Özel Etkinlikleri", image: "cat-5.webp", note: "Yalnızca NevClub'a özel organizasyonlar." }
];

window.NEV_EVENTS = [];
