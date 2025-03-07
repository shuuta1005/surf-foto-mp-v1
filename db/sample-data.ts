import { hashSync } from "bcrypt-ts-edge";

export const sampleData = {
  users: [
    {
      name: "Kelly Slater",
      email: "user1@example.com",
      password: hashSync("123456", 10),
      role: "user",
    },
    {
      name: "Shuta",
      email: "admin1@example.com",
      password: hashSync("123456", 10),
      role: "admin",
    },
    {
      name: "Noah",
      email: "user2@example.com",
      password: hashSync("123456", 10),
      role: "user",
    },
    {
      name: "Goat",
      email: "admin2@example.com",
      password: hashSync("123456", 10),
      role: "admin",
    },
  ],
  galleries: [
    {
      name: "Ichinomiya",
      folder: "fake-gallery-1",
      location: "千葉北",
      coverImage: "/fake-gallery-1/photo-1.jpg", // ✅ Manually set cover image
    },
    {
      name: "Torami",
      folder: "fake-gallery-2",
      location: "千葉北",
      coverImage: "/fake-gallery-2/photo-1.jpg",
    },
    {
      name: "Kugenuma",
      folder: "fake-gallery-3",
      location: "湘南",
      coverImage: "/fake-gallery-3/photo-1.jpg",
    },
    {
      name: "Kamogawa",
      folder: "fake-gallery-4",
      location: "千葉南",
      coverImage: "/fake-gallery-4/photo-1.jpg",
    },
    {
      name: "Maroubra",
      folder: "fake-gallery-5",
      location: "Sydney",
      coverImage: "/fake-gallery-5/photo-1.jpg",
    },
  ],
};
