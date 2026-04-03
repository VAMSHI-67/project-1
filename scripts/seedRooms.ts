import process from "node:process";
import { initializeApp } from "firebase/app";
import { collection, doc, setDoc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { demoRooms } from "../src/data/rooms";

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const run = async () => {
  const roomsRef = collection(db, "rooms");
  await Promise.all(
    demoRooms.map((room: (typeof demoRooms)[number]) =>
      setDoc(doc(roomsRef, room.id), {
        name: room.name,
        description: room.description,
        pricePerNight: room.pricePerNight,
        maxGuests: room.maxGuests,
        amenities: room.amenities,
        images: room.images
      })
    )
  );
  console.log("Seeded rooms successfully.");
};

run().catch((error) => {
  console.error("Failed to seed rooms", error);
  process.exit(1);
});
