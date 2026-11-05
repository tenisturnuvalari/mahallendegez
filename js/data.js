// Mahallende Gez - örnek yer verileri
// API hazır olduğunda bu dosya fetch ile değiştirilebilir.

const CATEGORIES = [
  { id: "kahve", label: "Kahve", icon: "☕" },
  { id: "yemek", label: "Yemek", icon: "🍽️" },
  { id: "park", label: "Park", icon: "🌳" },
  { id: "tarih", label: "Tarihi", icon: "🏛️" },
  { id: "kultur", label: "Kültür", icon: "🎨" },
  { id: "spor", label: "Spor", icon: "⚽" },
];

const PLACES = [
  {
    id: 1,
    name: "Köşe Kahvecisi",
    category: "kahve",
    neighborhood: "Yeni Mahalle",
    description: "Ev yapımı kekleri ve filtre kahvesiyle mahallenin sessiz köşesi.",
    rating: 4.6,
  },
  {
    id: 2,
    name: "Çınaraltı Parkı",
    category: "park",
    neighborhood: "Merkez",
    description: "Asırlık çınarların altında gölgelik ve çocuk oyun alanı.",
    rating: 4.8,
  },
  {
    id: 3,
    name: "Eski Hamam",
    category: "tarih",
    neighborhood: "Tarihi Mahalle",
    description: "Osmanlı döneminden kalma, restore edilmiş tarihi hamam.",
    rating: 4.5,
  },
  {
    id: 4,
    name: "Sofra Anne Mutfağı",
    category: "yemek",
    neighborhood: "Yeni Mahalle",
    description: "Günlük ev yemekleri, taze pişmiş börekler ve çorbalar.",
    rating: 4.7,
  },
  {
    id: 5,
    name: "Mahalle Kültür Merkezi",
    category: "kultur",
    neighborhood: "Merkez",
    description: "Sergiler, atölyeler ve haftalık kitap kulübü buluşmaları.",
    rating: 4.3,
  },
  {
    id: 6,
    name: "Koşu Parkuru",
    category: "spor",
    neighborhood: "Bahçelievler",
    description: "2 km'lik düz parkur, sabah koşuları için ideal.",
    rating: 4.4,
  },
  {
    id: 7,
    name: "Fırın Sokak Fırını",
    category: "yemek",
    neighborhood: "Tarihi Mahalle",
    description: "Taş fırında sabahları taze ekmek ve simit kokusu.",
    rating: 4.9,
  },
  {
    id: 8,
    name: "Mini Kütüphane",
    category: "kultur",
    neighborhood: "Bahçelievler",
    description: "Sokak başındaki ücretsiz kitap paylaşım noktası.",
    rating: 4.2,
  },
  {
    id: 9,
    name: "Göl Kafe",
    category: "kahve",
    neighborhood: "Bahçelievler",
    description: "Göl manzaralı terasında latte ve kitap molası.",
    rating: 4.5,
  },
  {
    id: 10,
    name: "Mahalle Bahçesi",
    category: "park",
    neighborhood: "Merkez",
    description: "Komşuların birlikte yetiştirdiği sebze ve çiçek bahçesi.",
    rating: 4.6,
  },
];
