import { config } from "dotenv";
import { connectDB } from "../lib/db.js";
import User from "../models/user.model.js";

config();

const seedUsers = [
  // Female Users (12)
  {
    email: "emma.wilson@gmail.com",
    fullName: "Emma Wilson",
    password: "SafePass123!",
    profilePicture: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    email: "olivia.martinez@outlook.com",
    fullName: "Olivia Martinez",
    password: "SecurePwd456!",
    profilePicture: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    email: "sophia.lee@yahoo.com",
    fullName: "Sophia Lee",
    password: "P@ssword2023",
    profilePicture: "https://randomuser.me/api/portraits/women/3.jpg",
  },
  {
    email: "ava.rodriguez@protonmail.com",
    fullName: "Ava Rodriguez",
    password: "Av@123Secure",
    profilePicture: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  {
    email: "isabella.garcia@hotmail.com",
    fullName: "Isabella Garcia",
    password: "Bella#2024",
    profilePicture: "https://randomuser.me/api/portraits/women/5.jpg",
  },
  {
    email: "mia.thomas@icloud.com",
    fullName: "Mia Thomas",
    password: "MiaT!789",
    profilePicture: "https://randomuser.me/api/portraits/women/6.jpg",
  },
  {
    email: "charlotte.hernandez@gmail.com",
    fullName: "Charlotte Hernandez",
    password: "CharH@2024",
    profilePicture: "https://randomuser.me/api/portraits/women/7.jpg",
  },
  {
    email: "amelia.lopez@outlook.com",
    fullName: "Amelia Lopez",
    password: "Lopez@123",
    profilePicture: "https://randomuser.me/api/portraits/women/8.jpg",
  },
  {
    email: "harper.gonzalez@yahoo.com",
    fullName: "Harper Gonzalez",
    password: "G0nzalez!",
    profilePicture: "https://randomuser.me/api/portraits/women/9.jpg",
  },
  {
    email: "evelyn.perez@gmail.com",
    fullName: "Evelyn Perez",
    password: "Ev3lynP!",
    profilePicture: "https://randomuser.me/api/portraits/women/10.jpg",
  },
  {
    email: "abigail.torres@protonmail.com",
    fullName: "Abigail Torres",
    password: "Torres#2024",
    profilePicture: "https://randomuser.me/api/portraits/women/11.jpg",
  },
  {
    email: "emily.flores@hotmail.com",
    fullName: "Emily Flores",
    password: "Fl0wer$123",
    profilePicture: "https://randomuser.me/api/portraits/women/12.jpg",
  },

  // Male Users (12)
  {
    email: "liam.smith@gmail.com",
    fullName: "Liam Smith",
    password: "LiamS@2024",
    profilePicture: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    email: "noah.johnson@outlook.com",
    fullName: "Noah Johnson",
    password: "N0ahJ!",
    profilePicture: "https://randomuser.me/api/portraits/men/2.jpg",
  },
  {
    email: "oliver.williams@yahoo.com",
    fullName: "Oliver Williams",
    password: "0liverW!",
    profilePicture: "https://randomuser.me/api/portraits/men/3.jpg",
  },
  {
    email: "elijah.brown@icloud.com",
    fullName: "Elijah Brown",
    password: "Br0wnEli#",
    profilePicture: "https://randomuser.me/api/portraits/men/4.jpg",
  },
  {
    email: "lucas.jones@protonmail.com",
    fullName: "Lucas Jones",
    password: "JonesL@2024",
    profilePicture: "https://randomuser.me/api/portraits/men/5.jpg",
  },
  {
    email: "mason.garcia@hotmail.com",
    fullName: "Mason Garcia",
    password: "M@sonG123",
    profilePicture: "https://randomuser.me/api/portraits/men/6.jpg",
  },
  {
    email: "logan.miller@gmail.com",
    fullName: "Logan Miller",
    password: "LoganM!ller",
    profilePicture: "https://randomuser.me/api/portraits/men/7.jpg",
  },
  {
    email: "ethan.davis@outlook.com",
    fullName: "Ethan Davis",
    password: "DavisE#2024",
    profilePicture: "https://randomuser.me/api/portraits/men/8.jpg",
  },
  {
    email: "jacob.rodriguez@yahoo.com",
    fullName: "Jacob Rodriguez",
    password: "J@cobR123",
    profilePicture: "https://randomuser.me/api/portraits/men/9.jpg",
  },
  {
    email: "jack.martinez@icloud.com",
    fullName: "Jack Martinez",
    password: "MartinezJ!",
    profilePicture: "https://randomuser.me/api/portraits/men/10.jpg",
  },
  {
    email: "aiden.hernandez@gmail.com",
    fullName: "Aiden Hernandez",
    password: "A1denH@",
    profilePicture: "https://randomuser.me/api/portraits/men/11.jpg",
  },
  {
    email: "daniel.lopez@protonmail.com",
    fullName: "Daniel Lopez",
    password: "D@nielL0pez",
    profilePicture: "https://randomuser.me/api/portraits/men/12.jpg",
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();

    await User.insertMany(seedUsers);
    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};


seedDatabase();