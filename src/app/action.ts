// lib/db.ts
import { db } from "@/utils/FirebaseConfig";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { hash } from "bcryptjs";
interface userData {
  id: string;
  email: string;
  name: string;
  password: string;
}

type SignupData = {
  email: string;
  password: string;
  name: string;
};

export async function createUser(data: SignupData) {
  try {
    // Check if user already exists
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", data.email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return { success: false, error: "User with this email already exists" };
    }

    // Hash the password
    const hashedPassword = await hash(data.password, 10);

    // Create user document
    const newUser = {
      email: data.email,
      name: data.name,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, "users"), newUser);

    return {
      success: true,
      user: {
        id: docRef.id,
        email: data.email,
        name: data.name
      }
    };
  } catch (error) {
    console.error("Error creating user:", error);
    return {
      success: false,
      error: "Failed to create user account"
    };
  }
}

export async function getUserByEmail(email: string) {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const userDoc = querySnapshot.docs[0].data() as userData;
    return {
      ...userDoc
    };
  } catch (error) {
    console.error("Error fetching user by email:", error);
    return null;
  }
}
