import heroImageSrc from "../assets/images/k1.jpg";
import galleryImage2 from "../assets/images/k2.jpg";
import galleryImage3 from "../assets/images/k3.jpg";
import galleryImage4 from "../assets/images/k4.jpg";
import galleryImage5 from "../assets/images/k5.jpg";
import galleryImage6 from "../assets/images/k6.jpg";

export const siteConfig = {
  brand: {
    name: "Kanvera Resort & Convention",
    localName: "Celebrate Amidst Nature's Luxury",
    tagline: "Luxury stays, celebrations, and convention experiences in the heart of Telangana"
  },
  contact: {
    phoneDisplay: "+91 89092 39999",
    phoneRaw: "918909239999",
    email: "kanverafarms@gmail.com",
    instagramUrl: "https://www.instagram.com/kanvera_resort?igsh=Y201cGVwdHl4Yzlw",
    instagramHandle: "@kanvera_resort",
    address:
      "SH1, beside Janatha Hotel, near Gouraram Police Station, Gowraram, Wargal, Telangana 502279",
    plusCode: "QM65+X6 Gowraram, Telangana",
    mapLink:
      "https://www.google.com/maps/place/Kanvera+Farms/@17.7624693,78.6555395,17z/data=!3m1!4b1!4m6!3m5!1s0x3bcc8119fcccc93d:0x645e5af378ea8180!8m2!3d17.7624642!4d78.6581144!16s%2Fg%2F11fw4rwths"
  }
};

export const whatsappBookingLink = `https://wa.me/${siteConfig.contact.phoneRaw}`;

export const heroImage = {
  src: heroImageSrc,
  alt: "Kanvera Resort and Convention courtyard and stay wing"
};

export const galleryImages = [
  {
    src: galleryImage2,
    alt: "Kanvera Resort and Convention garden walkway"
  },
  {
    src: galleryImage3,
    alt: "Kanvera Resort and Convention stay wing"
  },
  {
    src: galleryImage4,
    alt: "Kanvera Resort and Convention seating area"
  },
  {
    src: galleryImage5,
    alt: "Kanvera Resort and Convention outdoor lounge"
  },
  {
    src: galleryImage6,
    alt: "Kanvera Resort and Convention property view"
  }
];
